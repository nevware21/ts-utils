/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";

// Only run with Node, where the modules can be loaded again (using require) while some native functions are removed
// (like a runtime without them), as they are captured when the modules are loaded
const srcRoot = require.resolve("../../../src/index").replace(/index\.[jt]s$/, "");

/**
 * Loads the module again while the functions are removed. TypeScript (ts-node) needs some of them (eg. Array.isArray)
 * to compile a module, so the modules are first compiled (and loaded) with every function, and are then loaded again
 * from their compiled code. The functions, the module loader and the cached modules are restored before it returns.
 * @param load - Loads the module (it is called twice)
 * @param removed - The [target, name] of each function to remove
 * @returns The exports of the module
 */
function _loadWithout(load: () => any, removed: Array<[any, string]>): any {
    // The module loader's handlers (Module._extensions) and the Module.prototype (of this module)
    const extensions: any = require.extensions;
    const moduleProto: any = Object.getPrototypeOf(module);
    const tsHandler = extensions[".ts"];
    const moduleCompile = moduleProto._compile;
    const descs = removed.map((item) => Object.getOwnPropertyDescriptor(item[0], item[1]));
    const compiled: { [file: string]: string } = {};
    const cachedModules: { [key: string]: any } = {};
    let result: any;

    function _removeSrcModules(keep?: boolean) {
        Object.keys(require.cache).forEach((key) => {
            if (key.indexOf(srcRoot) === 0) {
                if (keep) {
                    cachedModules[key] = require.cache[key];
                }

                delete require.cache[key];
            }
        });
    }

    _removeSrcModules(true);
    try {
        // The first load records the compiled code of each module
        moduleProto._compile = function(code: string, filename: string) {
            if (filename.indexOf(srcRoot) === 0) {
                compiled[filename] = code;
            }

            return moduleCompile.call(this, code, filename);
        };
        load();
        moduleProto._compile = moduleCompile;
        _removeSrcModules();

        // Then the modules are loaded from their compiled code (without TypeScript) while the functions are removed
        extensions[".ts"] = function(theModule: any, filename: string) {
            return compiled[filename] ? moduleCompile.call(theModule, compiled[filename], filename) : tsHandler(theModule, filename);
        };
        removed.forEach((item) => {
            delete item[0][item[1]];
        });
        result = load();
    } finally {
        // Restored before any assertion
        removed.forEach((item, idx) => {
            Object.defineProperty(item[0], item[1], descs[idx]);
        });
        moduleProto._compile = moduleCompile;
        extensions[".ts"] = tsHandler;
        _removeSrcModules();
        Object.keys(cachedModules).forEach((key) => {
            require.cache[key] = cachedModules[key];
        });
    }

    return result;
}

// Like an ES3 runtime (eg. IE 8 with a shim for Function.prototype.bind), without the ES5 Object.getOwnPropertyNames,
// Object.getPrototypeOf, Array.isArray and Array.prototype.indexOf
describe("polyObjKeys, polyObjEntries and polyObjValues on a runtime without Object.getOwnPropertyNames", () => {
    let es3Keys: any;

    before(function() {
        this.timeout(10000);

        es3Keys = _loadWithout(() => require("../../../src/polyfills/object/objKeys"), [
            [Object, "getOwnPropertyNames"], [Object, "getPrototypeOf"], [Array, "isArray"], [Array.prototype, "indexOf"]
        ]);
    });

    it("returns the own enumerable keys, entries and values (as in v0.16.0)", () => {
        assert.isFunction(Object.getOwnPropertyNames, "Object.getOwnPropertyNames was restored");
        assert.isFunction(Array.isArray, "Array.isArray was restored");
        assert.isFunction(Array.prototype.indexOf, "Array.prototype.indexOf was restored");

        const value: any = Object.create({ inherited: 1 });
        value.a = 1;
        value.b = "two";
        Object.defineProperty(value, "hidden", { value: 3, enumerable: false });

        assert.deepEqual(es3Keys.polyObjKeys(value), ["a", "b"]);
        assert.deepEqual(es3Keys.polyObjEntries(value), [["a", 1], ["b", "two"]]);
        assert.deepEqual(es3Keys.polyObjValues(value), [1, "two"]);
        assert.deepEqual(es3Keys.polyObjKeys([1, 2]), ["0", "1"], "An array's length isn't a key");
    });

    it("still throws a TypeError for null or undefined", () => {
        assert.throws(() => es3Keys.polyObjKeys(null), TypeError);
        assert.throws(() => es3Keys.polyObjEntries(undefined), TypeError);
    });
});

// Without Reflect.ownKeys (eg. an ES5 runtime) the names and then the symbols are read
describe("polyObjGetOwnPropertyDescriptors on a runtime without Reflect.ownKeys", () => {
    let noOwnKeys: any;

    before(function() {
        this.timeout(10000);

        noOwnKeys = _loadWithout(() => require("../../../src/polyfills/object/objGetOwnProperty"), [[Reflect, "ownKeys"]]);
    });

    it("doesn't join the names and symbols with Array.prototype.concat, like the native function", () => {
        assert.isFunction(Reflect.ownKeys, "Reflect.ownKeys was restored");

        const sym = Symbol("s");
        const value: any = { a: 1, b: 2 };
        value[sym] = 3;
        const expected = Reflect.ownKeys((Object as any).getOwnPropertyDescriptors(value));
        const arrProto: any = Array.prototype;
        const concat = arrProto.concat;
        let replaced: any;
        let notSpreadable: any;
        try {
            // A replaced concat, and an array which concat doesn't spread
            arrProto.concat = function() {
                return ["a"];
            };
            replaced = noOwnKeys.polyObjGetOwnPropertyDescriptors(value);
            arrProto.concat = concat;
            arrProto[Symbol.isConcatSpreadable] = false;
            notSpreadable = noOwnKeys.polyObjGetOwnPropertyDescriptors(value);
        } finally {
            arrProto.concat = concat;
            delete arrProto[Symbol.isConcatSpreadable];
        }

        assert.deepEqual(Reflect.ownKeys(replaced), expected, "A replaced concat isn't used");
        assert.deepEqual(Reflect.ownKeys(notSpreadable), expected, "Symbol.isConcatSpreadable isn't used");
        assert.deepEqual(notSpreadable[sym], Object.getOwnPropertyDescriptor(value, sym));
    });
});
