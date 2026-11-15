/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { readFileSync } from "fs";
import { resolve } from "path";
import { Context, createContext, runInContext } from "vm";

function loadPolyfills(file: string, setup: string): Context {
    const context = createContext({});
    runInContext(setup, context);
    runInContext(readFileSync(resolve(__dirname, "../../../bundle/es5/", file), "utf8"), context);
    return context;
}

for (const file of ["ts-polyfills-utils.js", "ts-polyfills-utils.min.js"]) {
    describe("Array class polyfill installer: " + file, () => {
        it("keeps empty Array.from inputs working", () => {
            const context = loadPolyfills(file, "Array.from = undefined;");
            assert.equal(runInContext("JSON.stringify([Array.from([]), Array.from({ length: 0 })])", context), "[[],[]]");
        });

        it("passes indexed and sparse values without prepending the Array receiver", () => {
            const context = loadPolyfills(file, "Array.from = undefined;");
            const result = runInContext(`JSON.stringify({
                indexed: Array.from({ length: 2, 0: "x", 1: "y" }),
                sparse: Array.from([1, , 3]),
                keys: Object.keys(Array.from([1, , 3]))
            })`, context);
            assert.deepEqual(JSON.parse(result), { indexed: ["x", "y"], sparse: [1, null, 3], keys: ["0", "1", "2"] });
        });

        it("passes the actual mapper and its receiver", () => {
            const context = loadPolyfills(file, "Array.from = undefined;");
            const result = runInContext(`JSON.stringify(Array.from({ length: 2, 0: 1, 1: 2 }, function(value, index) {
                return value * this.factor + index;
            }, { factor: 10 }))`, context);
            assert.equal(result, "[10,21]");
        });

        it("installs Array.isArray with static argument semantics too", () => {
            const context = loadPolyfills(file, "Array.isArray = undefined;");
            assert.equal(runInContext("Array.isArray([]) && !Array.isArray({}) && !Array.isArray(null)", context), true);
        });

        it("preserves existing native methods and receiver-based prototype polyfills", () => {
            const context = loadPolyfills(file, `
                var savedFrom = Array.from;
                var savedIsArray = Array.isArray;
                Array.prototype.find = undefined;
            `);
            assert.equal(runInContext("Array.from === savedFrom && Array.isArray === savedIsArray", context), true);
            assert.equal(runInContext("[1, 2, 3].find(function(value) { return value > 1; })", context), 2);
        });
    });
}
