/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

// Compiles the generated typings (lib/dist/types/ts-utils.d.ts) and a consumer (lib/test/types/consumer.ts) which
// imports and uses them, with each TypeScript version, to check that the exported types can still be used by the
// oldest supported compiler (v3.4) through to the latest release. Run "npm run build" first to generate the typings.
//
// By default the published versions are read from the npm registry and the latest patch of every major.minor release
// from v3.4 onwards is checked (plus the repo's own version), so each new TypeScript release is checked automatically.
//
// Usage:
//   npm run ts-versions-check                              Check every major.minor release from v3.4 and the repo's version
//   npm run ts-versions-check -- 3.4.5 4.9 7               Check specific versions, a major or major.minor is its latest release
//   npm run ts-versions-check -- latest beta next          Check an npm dist-tag of the typescript package
//   npm run ts-versions-check -- --min 5.0                 Check every major.minor release from v5.0
//   npm run ts-versions-check -- --lib es2015,dom 3.4      Check with specific lib settings (may be repeated)
//
// Each version is installed once into node_modules/.cache/ts-versions-check/<version> and reused after that.

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const childProcess = require("child_process");

const repoRoot = path.resolve(__dirname, "../..");
const typesFile = path.join(repoRoot, "lib", "dist", "types", "ts-utils.d.ts");
const consumerFile = path.join(__dirname, "types", "consumer.ts");
const cacheDir = path.join(repoRoot, "node_modules", ".cache", "ts-versions-check");

// The oldest supported TypeScript version
const defaultMinVersion = "3.4";

// "all" is every major.minor release from the minimum version, "local" is the repo's own version
const defaultVersions = ["local", "all"];

// The typings reference the DOM types (eg. Document and Window), so "dom" is always included
const defaultLibs = [["es2015", "dom"], ["esnext", "dom"]];

// The number of lines of the compiler output to show for a failure
const maxErrorLines = 25;

// Installs are mostly network bound and compiles are CPU bound
const installConcurrency = 4;
const compileConcurrency = Math.max(1, Math.min(4, os.cpus().length));

const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

function _showHelp() {
    console.log("Usage: node lib/test/typescript-versions-check.js [--min <version>] [--lib <lib,lib>]... [version]...");
    console.log("  version  A version (eg. 3.4.5), the latest release of a major or major.minor (eg. 7 or 4.9), an npm dist-tag");
    console.log("           (eg. latest, beta or next), \"all\" for every major.minor release from the minimum version or \"local\"");
    console.log("           for the repo's version, default: " + defaultVersions.join(" "));
    console.log("  --min    The minimum version used by \"all\", default: " + defaultMinVersion);
    console.log("  --lib    The lib setting to compile with (may be repeated), default: " + defaultLibs.map((libs) => libs.join(",")).join(" "));
}

function _parseArgs(args) {
    const specs = [];
    const libs = [];
    let minVersion = defaultMinVersion;

    for (let idx = 0; idx < args.length; idx++) {
        const arg = args[idx];
        if (arg === "--help" || arg === "-h") {
            _showHelp();
            process.exit(0);
        } else if (arg === "--lib" || arg === "--min") {
            const value = String(args[++idx] || "");
            arg === "--lib" ? libs.push(value.split(",")) : (minVersion = value);
        } else if (arg.indexOf("--lib=") === 0) {
            libs.push(arg.substring(6).split(","));
        } else if (arg.indexOf("--min=") === 0) {
            minVersion = arg.substring(6);
        } else if (arg.indexOf("-") === 0) {
            console.error(RED + "Unknown option: " + arg + RESET);
            _showHelp();
            process.exit(1);
        } else {
            arg.split(",").forEach((spec) => spec && specs.push(spec));
        }
    }

    return {
        specs: specs.length ? specs : defaultVersions,
        libs: libs.length ? libs : defaultLibs,
        minVersion: minVersion
    };
}

/**
 * Returns the numeric [major, minor, patch] of the version, ignoring any pre-release suffix
 */
function _parseVersion(version) {
    const parts = String(version).split("-")[0].split(".");
    return [0, 1, 2].map((idx) => parseInt(parts[idx], 10) || 0);
}

function _compareVersions(value1, value2) {
    const ver1 = Array.isArray(value1) ? value1 : _parseVersion(value1);
    const ver2 = Array.isArray(value2) ? value2 : _parseVersion(value2);
    for (let idx = 0; idx < 3; idx++) {
        if (ver1[idx] !== ver2[idx]) {
            return ver1[idx] - ver2[idx];
        }
    }

    return 0;
}

function _isStable(version) {
    return /^\d+\.\d+\.\d+$/.test(version);
}

/**
 * Runs the command, resolving with its exit status and output (it never rejects)
 */
function _spawn(command, args, options) {
    return new Promise((resolve) => {
        let stdout = "";
        let stderr = "";
        let child;

        try {
            child = childProcess.spawn(command, args, options);
        } catch (e) {
            resolve({ status: -1, stdout: stdout, stderr: stderr, error: e });
            return;
        }

        child.stdout && child.stdout.on("data", (data) => stdout += data);
        child.stderr && child.stderr.on("data", (data) => stderr += data);
        child.on("error", (e) => resolve({ status: -1, stdout: stdout, stderr: stderr, error: e }));
        child.on("close", (status) => resolve({ status: status, stdout: stdout, stderr: stderr }));
    });
}

function _runNpm(args, cwd) {
    // When run as an npm script use the same npm, otherwise use npm from the path (which needs a shell on Windows)
    const npmCli = process.env.npm_execpath;
    if (npmCli && /npm-cli\.c?js$/.test(npmCli)) {
        return _spawn(process.execPath, [npmCli].concat(args), { cwd: cwd });
    }

    return _spawn("npm", args, { cwd: cwd, shell: process.platform === "win32" });
}

/**
 * Runs the async callback for each item, with at most concurrency callbacks running at the same time
 */
async function _runAll(items, concurrency, callback) {
    const results = new Array(items.length);
    let next = 0;

    async function _worker() {
        while (next < items.length) {
            const idx = next++;
            results[idx] = await callback(items[idx], idx);
        }
    }

    const workers = [];
    for (let idx = 0; idx < Math.min(concurrency, items.length); idx++) {
        workers.push(_worker());
    }

    await Promise.all(workers);

    return results;
}

/**
 * Returns the published versions and dist-tags of the typescript package from the npm registry
 */
async function _getRegistryInfo() {
    const result = await _runNpm(["view", "typescript", "versions", "dist-tags", "--json"], repoRoot);
    let info;
    try {
        info = result.status === 0 ? JSON.parse(result.stdout) : null;
    } catch (e) {
        info = null;
    }

    if (!info || !Array.isArray(info.versions)) {
        throw new Error("Unable to read the typescript versions from the npm registry\n" + (result.error || "") + result.stdout + result.stderr);
    }

    return { versions: info.versions, tags: info["dist-tags"] || {} };
}

/**
 * Resolves the version specs into the list of versions to check (without duplicates), only reading the versions from
 * the npm registry when a spec needs them
 */
async function _resolveVersions(specs, minVersion) {
    const localDir = path.dirname(require.resolve("typescript/package.json", { paths: [repoRoot] }));
    const localVersion = JSON.parse(fs.readFileSync(path.join(localDir, "package.json"), "utf8")).version;
    const resolved = [];
    let registry = null;

    function _add(version, tsDir) {
        if (!resolved.some((entry) => entry.version === version)) {
            resolved.push({ version: version, tsDir: tsDir, isLocal: !!tsDir });
        }
    }

    // The latest stable release of each major.minor
    function _getMinors() {
        const minors = {};
        registry.versions.filter(_isStable).forEach((version) => {
            const key = _parseVersion(version).slice(0, 2).join(".");
            if (!minors[key] || _compareVersions(version, minors[key]) > 0) {
                minors[key] = version;
            }
        });

        return Object.keys(minors).map((key) => minors[key]);
    }

    for (let idx = 0; idx < specs.length; idx++) {
        const spec = specs[idx];
        if (spec === "local") {
            _add(localVersion, localDir);
        } else if (/^\d+\.\d+\.\d+(-.+)?$/.test(spec)) {
            _add(spec);
        } else {
            registry = registry || await _getRegistryInfo();
            if (spec === "all") {
                _getMinors().filter((version) => _compareVersions(version, minVersion) >= 0).forEach((version) => _add(version));
            } else if (registry.tags[spec]) {
                _add(registry.tags[spec]);
            } else if (/^\d+(\.\d+)?$/.test(spec)) {
                // The latest stable release of the major or major.minor
                const prefix = spec + ".";
                const matches = registry.versions.filter((version) => _isStable(version) && version.indexOf(prefix) === 0);
                if (!matches.length) {
                    throw new Error("No typescript release found for " + spec);
                }

                _add(matches.sort(_compareVersions)[matches.length - 1]);
            } else {
                throw new Error("Unknown typescript version or dist-tag: " + spec);
            }
        }
    }

    return resolved.sort((entry1, entry2) => _compareVersions(entry1.version, entry2.version) || (entry1.isLocal ? -1 : 1));
}

/**
 * Sets the tsDir of the entry to the installed TypeScript package for its version, installing it when it isn't already
 */
async function _install(entry) {
    if (entry.tsDir) {
        return null;
    }

    const versionDir = path.join(cacheDir, entry.version.replace(/[^a-zA-Z0-9.-]/g, "_"));
    const tsDir = path.join(versionDir, "node_modules", "typescript");
    if (!fs.existsSync(path.join(tsDir, "package.json"))) {
        console.log("Installing typescript@" + entry.version + "...");
        fs.mkdirSync(versionDir, { recursive: true });

        // The folder has its own package.json so npm installs into it, rather than the parent (repo) project
        fs.writeFileSync(path.join(versionDir, "package.json"), JSON.stringify({ name: "ts-versions-check", private: true }, null, 2));
        const result = await _runNpm(["install", "--no-save", "--no-package-lock", "--no-audit", "--no-fund", "--loglevel=error", "typescript@" + entry.version], versionDir);
        if (result.status !== 0 || !fs.existsSync(path.join(tsDir, "package.json"))) {
            return "Failed to install typescript@" + entry.version + "\n" + (result.error || "") + result.stdout + result.stderr;
        }
    }

    entry.tsDir = tsDir;

    return null;
}

/**
 * Returns the compiler options for the TypeScript version, using the options which that version supports
 */
function _getCompilerOptions(tsVersion, configDir, libs) {
    const toPath = (value) => value.split(path.sep).join("/");
    const typesPath = typesFile.replace(/\.d\.ts$/, "");
    const major = _parseVersion(tsVersion)[0];
    const options = {
        noEmit: true,
        strict: true,
        // TypeScript v6.0 deprecated (and v7.0 removed) the ES5 target and the node10 (node) module resolution
        target: major >= 6 ? "es2015" : "es5",
        module: major >= 6 ? "esnext" : "commonjs",
        moduleResolution: major >= 6 ? "bundler" : "node",
        lib: libs,
        // Don't include the repo's @types packages (eg. @types/node), which don't support older versions
        types: []
    };

    if (_compareVersions(tsVersion, "4.1.0") < 0) {
        // Before TypeScript v4.1 paths requires a baseUrl (which v6.0 deprecated and v7.0 removed)
        options.baseUrl = toPath(repoRoot);
        options.paths = { "@nevware21/ts-utils": [toPath(path.relative(repoRoot, typesPath))] };
    } else {
        // Relative to the tsconfig, TypeScript v7.0 requires a relative path to start with "./" or "../"
        const relPath = toPath(path.relative(configDir, typesPath));
        options.paths = { "@nevware21/ts-utils": [relPath.indexOf("../") === 0 ? relPath : "./" + relPath] };
    }

    return options;
}

/**
 * Compiles the typings and the consumer with the TypeScript version and lib setting, returning the compiler result
 */
function _compile(entry, libs) {
    const configDir = path.join(cacheDir, "config", entry.isLocal ? "local" : entry.version);
    const configFile = path.join(configDir, "tsconfig." + libs.join("_") + ".json");
    const toPath = (value) => value.split(path.sep).join("/");

    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(configFile, JSON.stringify({
        compilerOptions: _getCompilerOptions(entry.version, configDir, libs),
        files: [toPath(typesFile), toPath(consumerFile)]
    }, null, 2));

    return _spawn(process.execPath, [path.join(entry.tsDir, "bin", "tsc"), "-p", configFile], { cwd: configDir });
}

async function _run() {
    const options = _parseArgs(process.argv.slice(2));

    if (!fs.existsSync(typesFile)) {
        console.error(RED + "The typings were not found, run \"npm run build\" first: " + typesFile + RESET);
        return 1;
    }

    let entries;
    try {
        entries = await _resolveVersions(options.specs, options.minVersion);
    } catch (e) {
        console.error(RED + e.message + RESET);
        return 1;
    }

    const labelOf = (entry) => entry.isLocal ? entry.version + " (local)" : entry.version;
    console.log("\nChecking " + path.relative(repoRoot, typesFile) + " with " + entries.length + " TypeScript versions: " + entries.map(labelOf).join(" "));
    console.log("=============================================================================\n");

    const installErrors = await _runAll(entries, installConcurrency, _install);

    // Every version and lib combination of the installed versions
    const checks = [];
    entries.forEach((entry, idx) => {
        if (!installErrors[idx]) {
            options.libs.forEach((libs) => checks.push({ entry: entry, libs: libs }));
        }
    });

    const results = await _runAll(checks, compileConcurrency, (check) => _compile(check.entry, check.libs));

    let failed = 0;
    let passed = 0;
    console.log("");
    entries.forEach((entry, idx) => {
        const label = CYAN + labelOf(entry) + RESET;
        if (installErrors[idx]) {
            console.log(label + " [" + RED + "FAIL" + RESET + "] " + installErrors[idx]);
            failed++;
            return;
        }

        checks.forEach((check, checkIdx) => {
            if (check.entry !== entry) {
                return;
            }

            const result = results[checkIdx];
            const checkLabel = label + " lib: " + check.libs.join(",");
            if (result.status === 0) {
                console.log(checkLabel + " [" + GREEN + "PASS" + RESET + "]");
                passed++;
            } else {
                console.log(checkLabel + " [" + RED + "FAIL" + RESET + "]");
                const lines = (result.stdout + result.stderr + (result.error ? result.error.message : "")).split(/\r?\n/).filter((line) => line);
                lines.slice(0, maxErrorLines).forEach((line) => console.log("    " + line));
                if (lines.length > maxErrorLines) {
                    console.log("    ... and " + (lines.length - maxErrorLines) + " more lines");
                }

                failed++;
            }
        });
    });

    console.log("\n" + (failed ? RED + failed + " of " + (passed + failed) + " TypeScript version checks failed." + RESET : "All " + passed + " TypeScript version checks passed!"));

    return failed ? 1 : 0;
}

_run().then((exitCode) => process.exit(exitCode), (e) => {
    console.error(RED + (e && e.stack || e) + RESET);
    process.exit(1);
});
