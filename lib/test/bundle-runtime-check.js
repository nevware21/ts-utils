/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

// Runs the built bundles and dist modules (run "npm run build" first) to check what the unit tests can't, as they use
// the source: a minifier or bundler removing a call (eg. one which only updates module variables) or changing the
// behaviour (eg. dropping "use strict") has been missed by the unit tests before. It checks that:
// - the polyfills bundles (ts-polyfills-utils.js and .min.js) install working, non-enumerable polyfills in a runtime
//   without the native functions
// - each main bundle (es5 / es6, umd / iife, min / not min) only adds the expected globals, keeps "use strict" and
//   that isUnsafeTarget, objExtend and the timeout overrides work
// - no dist or bundle code contains non-ASCII characters
// - a consumer bundled from the dist modules with esbuild (minified) and Rollup works, and esbuild keeps an import of
//   the polyfills bundle (the package.json "sideEffects") while still tree-shaking the main bundle
//
// Each check runs in a new VM realm (context), so the native functions can be removed without affecting this script.
//
// Usage:
//   npm run bundle-check

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const esbuild = require("esbuild");
const { rollup } = require("rollup");

const repoRoot = path.resolve(__dirname, "../..");
const libRoot = path.join(repoRoot, "lib");

const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

// The polyfills bundles
const polyfillBundles = [
    "bundle/es5/ts-polyfills-utils.js",
    "bundle/es5/ts-polyfills-utils.min.js"
];

// The main bundles, which add the "nevware21" global
const mainBundles = [
    "bundle/es5/umd/ts-utils.js",
    "bundle/es5/umd/ts-utils.min.js",
    "bundle/es5/iife/ts-utils.js",
    "bundle/es5/iife/ts-utils.min.js",
    "bundle/es6/umd/ts-utils.js",
    "bundle/es6/umd/ts-utils.min.js",
    "bundle/es6/iife/ts-utils.js",
    "bundle/es6/iife/ts-utils.min.js"
];

// The dist modules used by the consumer builds
const distModules = {
    es5: "dist/es5/mod/ts-utils.js",
    es6: "dist/es6/mod/ts-utils.js"
};

// The files which must not contain non-ASCII characters (outside of comments)
const asciiOnlyFiles = [
    "dist/es5/main/ts-utils.js",
    "dist/es5/mod/ts-utils.js",
    "dist/es6/main/ts-utils.js",
    "dist/es6/mod/ts-utils.js"
].concat(mainBundles, polyfillBundles);

// The globals a main bundle may add
const allowedGlobals = ["nevware21", "__tsUtils$gblCfg"];

// The native functions removed from the realm before a polyfills bundle is loaded, like a runtime (eg. ES5) without them
const removedNatives = {
    "Object": ["entries", "values", "fromEntries", "is", "hasOwn"],
    "Array": ["from"],
    "Array.prototype": ["includes", "at", "fill", "find", "findIndex", "findLast", "findLastIndex", "flatMap", "with"],
    "String.prototype": ["startsWith", "endsWith", "padStart", "padEnd", "includes", "trimStart", "trimEnd", "replaceAll", "at"]
};

// The expressions run (and their expected results) after a polyfills bundle is loaded
const polyfillChecks = [
    // Static functions are called with their arguments as-is
    ["Object.entries({ a: 1 })", [["a", 1]]],
    ["Object.values({ a: 1 })", [1]],
    ["Object.fromEntries([['a', 1]])", { a: 1 }],
    ["Object.is(NaN, NaN)", true],
    ["Object.hasOwn({ a: 1 }, 'a')", true],
    ["Array.from({ length: 2, 0: 'a', 1: 'b' })", ["a", "b"]],
    ["Array.from('ab', function (value, idx) { return value + idx; })", ["a0", "b1"]],

    // Prototype functions are called with the instance as the first argument
    ["[1, NaN].includes(NaN)", true],
    ["[1, 2, 3].at(-1)", 3],
    ["[1, 2, 3].fill(0, 1)", [1, 0, 0]],
    ["[1, 2, 3].find(function (value) { return value > 1; })", 2],
    ["[1, 2, 3].findIndex(function (value) { return value > 1; })", 1],
    ["[1, 2, 3].findLast(function (value) { return value < 3; })", 2],
    ["[1, 2, 3].findLastIndex(function (value) { return value < 3; })", 1],
    ["[1, [2], 3].flatMap(function (value) { return value; })", [1, 2, 3]],
    ["[1, 2, 3].with(1, 5)", [1, 5, 3]],
    ["'abc'.startsWith('ab')", true],
    ["'abc'.endsWith('bc')", true],
    ["'abc'.padStart(5, '-')", "--abc"],
    ["'abc'.padEnd(5, '-')", "abc--"],
    ["'abc'.includes('b')", true],
    ["'  abc  '.trimStart()", "abc  "],
    ["'  abc  '.trimEnd()", "  abc"],
    ["'a.b.c'.replaceAll('.', '-')", "a-b-c"],
    ["'abc'.at(-1)", "c"],

    // The string polyfills work with a String object and convert a value which is not a string, like the native
    // functions (this is a String object when a function is called from a String object, or in sloppy mode)
    ["new String('abc').startsWith('ab')", true],
    ["new String('abc').endsWith('bc')", true],
    ["new String('abc').padStart(5, '-')", "--abc"],
    ["new String('abc').padEnd(5, '-')", "abc--"],
    ["new String('abc').includes('b')", true],
    ["new String('  abc  ').trimStart()", "abc  "],
    ["new String('  abc  ').trimEnd()", "  abc"],
    ["new String('a.b.c').replaceAll('.', '-')", "a-b-c"],
    ["new String('abc').at(-1)", "c"],
    ["String.prototype.startsWith.call(123, '12')", true],
    ["String.prototype.endsWith.call(123, '23')", true],

    // A null or undefined this throws a TypeError, like the native functions (in sloppy mode it would be the global)
    ["(function () { try { String.prototype.startsWith.call(null, 'a'); return 'no error'; } catch (e) { return e.name; } })()", "TypeError"],
    ["(function () { try { Array.prototype.includes.call(undefined, 1); return 'no error'; } catch (e) { return e.name; } })()", "TypeError"],

    // A RegExp searchString throws a TypeError, like the native functions
    ["(function () { try { 'abc'.startsWith(/a/); return 'no error'; } catch (e) { return e.name; } })()", "TypeError"],
    ["(function () { try { 'abc'.endsWith(/c/); return 'no error'; } catch (e) { return e.name; } })()", "TypeError"],

    // Like the native functions the polyfills are not enumerable, so for...in doesn't include them
    ["(function () { var keys = []; for (var key in [1]) { keys.push(key); } return keys; })()", ["0"]],
    ["(function () { var keys = []; for (var key in new String('a')) { keys.push(key); } return keys; })()", ["0"]],
    ["(function (desc) { return [desc.writable, desc.enumerable, desc.configurable]; })(Object.getOwnPropertyDescriptor(Object, 'entries'))", [true, false, true]],
    ["(function (desc) { return [desc.writable, desc.enumerable, desc.configurable]; })(Object.getOwnPropertyDescriptor(Array.prototype, 'includes'))", [true, false, true]]
];

// The expressions run (and their expected results) after a main bundle is loaded, where u is the ts-utils namespace
const mainBundleChecks = [
    // The built-in prototypes, including those from the class names list and the %TypedArray% prototype
    ["u.isUnsafeTarget(Object.prototype)", true],
    ["u.isUnsafeTarget(TypeError.prototype)", true],
    ["u.isUnsafeTarget(Map.prototype)", true],
    ["u.isUnsafeTarget(Promise.prototype)", true],
    ["u.isUnsafeTarget(Uint8Array.prototype)", true],
    ["u.isUnsafeTarget(Object.getPrototypeOf(Uint8Array.prototype))", true],
    ["u.isUnsafeTarget({})", false],
    ["(u.objExtend(Map.prototype, { polluted: 1 }), Map.prototype.polluted)", undefined]
];

let failures = 0;

/**
 * Reports the result of a check
 * @param {string} label - What was checked
 * @param {boolean} passed - Whether the check passed
 * @param {string} [details] - The details to report when it failed
 */
function check(label, passed, details) {
    if (passed) {
        console.log("  " + GREEN + "ok" + RESET + "    " + label);
    } else {
        failures++;
        console.log("  " + RED + "FAIL" + RESET + "  " + label + (details ? " - " + details : ""));
    }
}

/**
 * Runs the code in the realm, returning the result (as JSON so it can be compared outside of the realm) or the error
 * @param {object} realm - The VM context to run the code in
 * @param {string} code - The expression to run
 * @returns {{ json?: string, error?: string }}
 */
function runInRealm(realm, code) {
    try {
        return { json: vm.runInContext("JSON.stringify(" + code + ")", realm) };
    } catch (e) {
        return { error: e.name + ": " + e.message };
    }
}

/**
 * Runs the function in the realm, the function is converted to its source, so it can't use any of the variables of
 * this script and is called with the realm's global as this
 * @param {object} realm - The VM context to run the function in
 * @param {Function} fn - The function to run
 * @returns {{ json?: string, error?: string }}
 */
function runFnInRealm(realm, fn) {
    return runInRealm(realm, "(" + fn.toString() + ").call(this)");
}

/**
 * Runs each [expression, expected] check in the realm
 * @param {object} realm - The VM context to run the expressions in
 * @param {Array} checks - The [expression, expected] checks
 * @param {(expr: string) => string} [wrap] - Returns the code to run for the expression
 */
function runChecks(realm, checks, wrap) {
    checks.forEach(([expr, expected]) => {
        const result = runInRealm(realm, wrap ? wrap(expr) : expr);
        const expectedJson = JSON.stringify(expected);
        check(expr + " is " + expectedJson, !result.error && result.json === expectedJson, result.error || "returned " + result.json);
    });
}

/**
 * Removes the native functions (removedNatives) from the realm
 * @param {object} realm - The VM context to remove the functions from
 */
function removeNatives(realm) {
    Object.keys(removedNatives).forEach((target) => {
        removedNatives[target].forEach((name) => {
            vm.runInContext("delete " + target + "." + name + ";", realm);
        });
    });
}

/**
 * Returns the names of the realm's global properties
 * @param {object} realm - The VM context
 * @returns {string[]}
 */
function getGlobalNames(realm) {
    return JSON.parse(vm.runInContext("JSON.stringify(Object.getOwnPropertyNames(this))", realm));
}

/**
 * Checks that a class which is defined after the first isUnsafeTarget() call (eg. by a polyfill) is identified, run
 * in a realm where WeakRef was removed before the bundle was loaded
 */
function lateClassCheck() {
    var u = this.nevware21["ts-utils"];
    var first = u.isUnsafeTarget({});

    // Like a WeakRef polyfill
    var LateClass = function () {};
    this.WeakRef = LateClass;

    return [first, u.isUnsafeTarget(LateClass.prototype)];
}

/**
 * Checks that the timeout overrides are used without a global setTimeout and clearTimeout
 */
function timeoutOverridesCheck() {
    var u = this.nevware21["ts-utils"];
    var calls = [];
    var timer = u.scheduleTimeoutWith([
        function (callback, timeout) {
            calls.push("set " + timeout);
            return 42;
        },
        function (id) {
            calls.push("clear " + id);
        }
    ], function () {}, 10);

    timer.cancel();

    return calls;
}

/**
 * The checks run by a consumer bundled (with esbuild and Rollup) from the dist modules, where WeakRef was removed
 * from the realm before it is loaded
 * @param {Function} isUnsafeTarget - The bundled isUnsafeTarget function
 * @param {Function} objExtend - The bundled objExtend function
 */
function consumerChecks(isUnsafeTarget, objExtend) {
    var results = {
        "TypeError.prototype is unsafe": isUnsafeTarget(TypeError.prototype),
        "Map.prototype is unsafe": isUnsafeTarget(Map.prototype),
        "%TypedArray%.prototype is unsafe": isUnsafeTarget(Object.getPrototypeOf(Uint8Array.prototype)),
        "{} is not unsafe": !isUnsafeTarget({})
    };

    objExtend(Map.prototype, { polluted: 1 });
    results["objExtend doesn't change Map.prototype"] = Map.prototype.polluted === undefined;

    // Like a WeakRef polyfill, defined after the first isUnsafeTarget() call
    var LateClass = function () {};
    globalThis.WeakRef = LateClass;
    results["a class defined later is unsafe"] = isUnsafeTarget(LateClass.prototype);

    globalThis.__consumerResults = results;
}

/**
 * Checks the polyfills bundles in a realm without the native functions
 */
function checkPolyfillBundles() {
    polyfillBundles.forEach((file) => {
        console.log(CYAN + file + RESET);
        const code = fs.readFileSync(path.join(libRoot, file), "utf8");
        check("keeps \"use strict\"", /["']use strict["']/.test(code));

        const realm = vm.createContext({});
        removeNatives(realm);
        vm.runInContext(code, realm);

        Object.keys(removedNatives).forEach((target) => {
            const missing = removedNatives[target].filter((name) => runInRealm(realm, "typeof " + target + "." + name).json !== "\"function\"");
            check("installs " + target + " " + removedNatives[target].join(", "), missing.length === 0, "missing " + missing.join(", "));
        });

        runChecks(realm, polyfillChecks);
    });
}

/**
 * Checks the main bundles
 */
function checkMainBundles() {
    mainBundles.forEach((file) => {
        console.log(CYAN + file + RESET);
        const code = fs.readFileSync(path.join(libRoot, file), "utf8");
        check("keeps \"use strict\"", /["']use strict["']/.test(code));

        const realm = vm.createContext({});
        const before = getGlobalNames(realm);
        vm.runInContext(code, realm);
        const added = getGlobalNames(realm).filter((name) => before.indexOf(name) === -1);
        check("only adds the expected globals " + JSON.stringify(added), added.every((name) => allowedGlobals.indexOf(name) !== -1));

        runChecks(realm, mainBundleChecks, (expr) => "(function (u) { return " + expr + "; })(nevware21['ts-utils'])");

        // A class defined after the first check
        const lateRealm = vm.createContext({});
        vm.runInContext("delete this.WeakRef;", lateRealm);
        vm.runInContext(code, lateRealm);
        const late = runFnInRealm(lateRealm, lateClassCheck);
        check("a class defined after the first isUnsafeTarget() call is identified", late.json === "[false,true]", late.error || "returned " + late.json);

        // The timeout overrides without the global timers (a VM realm doesn't have them, they are removed in case it does)
        const timerRealm = vm.createContext({});
        vm.runInContext("delete this.setTimeout; delete this.clearTimeout;", timerRealm);
        vm.runInContext(code, timerRealm);
        const timers = runFnInRealm(timerRealm, timeoutOverridesCheck);
        check("scheduleTimeoutWith uses the overrides without a global setTimeout", timers.json === "[\"set 10\",\"clear 42\"]", timers.error || "returned " + timers.json);
    });
}

/**
 * Checks that the dist and bundle code (outside of comments) is ASCII only
 */
function checkAsciiOnly() {
    console.log(CYAN + "ASCII only code" + RESET);
    asciiOnlyFiles.forEach((file) => {
        const lines = fs.readFileSync(path.join(libRoot, file), "utf8").split("\n");
        const nonAscii = lines.filter((line) => /[^\x00-\x7F]/.test(line) && !/^\s*(\*|\/\/|\/\*)/.test(line));
        check(file, nonAscii.length === 0, nonAscii.length ? nonAscii[0].trim().substring(0, 80) : "");
    });
}

/**
 * Returns the path with forward slashes, for an import
 * @param {string} value - The path
 * @returns {string}
 */
function toImportPath(value) {
    return value.split(path.sep).join("/");
}

/**
 * Bundles the source (an entry module) with esbuild
 * @param {string} source - The entry module source
 * @param {string} format - The output format
 * @returns {string} The bundled code
 */
function esbuildBundle(source, format) {
    return esbuild.buildSync({
        stdin: { contents: source, resolveDir: repoRoot },
        bundle: true,
        minify: true,
        format: format,
        write: false,
        logLevel: "silent"
    }).outputFiles[0].text;
}

/**
 * Bundles the source (an entry module) with Rollup
 * @param {string} source - The entry module source
 * @returns {Promise<string>} The bundled code
 */
async function rollupBundle(source) {
    const bundle = await rollup({
        input: "entry",
        plugins: [{
            name: "entry",
            resolveId: (id) => id === "entry" ? id : null,
            load: (id) => id === "entry" ? source : null
        }],
        onwarn: () => {}
    });

    return (await bundle.generate({ format: "iife" })).output[0].code;
}

/**
 * Checks that esbuild keeps an import of the polyfills bundles (package.json "sideEffects") and still tree-shakes the
 * main bundle
 */
function checkSideEffects() {
    console.log(CYAN + "package.json sideEffects (esbuild)" + RESET);
    polyfillBundles.forEach((file) => {
        const code = esbuildBundle("import \"" + toImportPath(path.join(libRoot, file)) + "\";", "esm");
        check("an import of " + file + " is kept (" + code.length + " bytes)", code.length > 5000);
    });

    const mainModule = toImportPath(path.join(libRoot, distModules.es5));
    const used = esbuildBundle("import { isString } from \"" + mainModule + "\"; console.log(isString(1));", "esm");
    check("the main module is tree-shaken (" + used.length + " bytes)", used.length < 1000);

    const unused = esbuildBundle("import \"" + mainModule + "\";", "esm");
    check("an unused import of the main module is removed (" + unused.length + " bytes)", unused.length < 100);
}

/**
 * Checks a consumer of isUnsafeTarget and objExtend bundled from each dist module with esbuild (minified) and Rollup
 */
async function checkConsumers() {
    for (const build of Object.keys(distModules)) {
        console.log(CYAN + "consumer of " + distModules[build] + RESET);
        const source = "import { isUnsafeTarget, objExtend } from \"" + toImportPath(path.join(libRoot, distModules[build])) + "\";\n" +
            "(" + consumerChecks.toString() + ")(isUnsafeTarget, objExtend);";

        const bundles = [
            ["esbuild --minify", esbuildBundle(source, "iife")],
            ["rollup", await rollupBundle(source)]
        ];

        bundles.forEach(([name, code]) => {
            const realm = vm.createContext({});
            vm.runInContext("delete this.WeakRef;", realm);
            let results;
            try {
                vm.runInContext(code, realm);
                results = JSON.parse(vm.runInContext("JSON.stringify(__consumerResults)", realm));
            } catch (e) {
                check(name + " bundle runs", false, e.name + ": " + e.message);
                return;
            }

            Object.keys(results).forEach((key) => {
                check(name + ": " + key, results[key] === true);
            });
        });
    }
}

async function main() {
    checkPolyfillBundles();
    checkMainBundles();
    checkAsciiOnly();
    checkSideEffects();
    await checkConsumers();

    console.log("");
    if (failures) {
        console.log(RED + failures + " bundle check(s) failed" + RESET);
        process.exit(1);
    }

    console.log(GREEN + "All bundle checks passed" + RESET);
}

main().catch((e) => {
    console.error(RED + "Bundle checks failed: " + (e && e.stack || e) + RESET);
    process.exit(1);
});
