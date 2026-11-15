/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { _installPolyfills } from "../../../../src/internal/poly_install";

describe("polyfills entry installs the polyfills", () => {
    const targets: any[] = [Object, Array, Array.prototype, String.prototype];

    /**
     * Removes the native functions, calls the callback and then restores them (and removes anything else that was
     * added). The callback must capture any results, as other code (including the assertions) can't be run while the
     * native functions are removed.
     */
    function _withoutNatives(removes: Array<[any, string]>, cb: () => void) {
        const before = targets.map((target) => Object.getOwnPropertyNames(target));
        const saved = removes.map((remove) => ({ target: remove[0], name: remove[1], desc: Object.getOwnPropertyDescriptor(remove[0], remove[1]) }));

        try {
            saved.forEach((item) => {
                delete item.target[item.name];
            });

            cb();
        } finally {
            targets.forEach((target, idx) => {
                Object.getOwnPropertyNames(target).forEach((name) => {
                    if (before[idx].indexOf(name) === -1) {
                        delete target[name];
                    }
                });
            });

            saved.forEach((item) => {
                if (item.desc) {
                    Object.defineProperty(item.target, item.name, item.desc);
                }
            });
        }
    }

    it("static Object and Array polyfills are called with their arguments as-is", () => {
        const results: any = {};
        const nativeEntries = (Object as any).entries;

        _withoutNatives([[Object, "entries"], [Object, "values"], [Object, "fromEntries"], [Object, "is"], [Object, "hasOwn"], [Object, "isFrozen"], [Object, "isSealed"], [Array, "from"]], () => {
            _installPolyfills();
            results.isFrozen = (Object as any).isFrozen({ a: 1 });
            results.isSealed = (Object as any).isSealed({ a: 1 });
            results.isFrozenPrimitive = (Object as any).isFrozen(null) && (Object as any).isFrozen(1) && (Object as any).isFrozen("a");
            results.isSealedPrimitive = (Object as any).isSealed(undefined) && (Object as any).isSealed(true);
            results.installed = (Object as any).entries !== nativeEntries;
            results.entries = (Object as any).entries({ a: 1 });
            results.values = (Object as any).values({ a: 1 });
            results.fromEntries = (Object as any).fromEntries([["a", 1]]);
            results.isNaN = (Object as any).is(NaN, NaN);
            results.isZero = (Object as any).is(0, -0);
            results.hasOwn = (Object as any).hasOwn({ a: 1 }, "a");
            results.from = (Array as any).from([1, 2]);
            results.fromArrayLike = (Array as any).from({ length: 2, 0: "a", 1: "b" });
        });

        assert.isTrue(results.installed, "The polyfill was installed");
        assert.deepEqual(results.entries, [["a", 1]]);
        assert.deepEqual(results.values, [1]);
        assert.deepEqual(results.fromEntries, { a: 1 });
        assert.isTrue(results.isNaN);
        assert.isFalse(results.isZero);
        assert.isTrue(results.hasOwn);
        assert.deepEqual(results.from, [1, 2]);
        assert.deepEqual(results.fromArrayLike, ["a", "b"]);
        assert.isFalse(results.isFrozen, "Object.isFrozen reports an object as not frozen");
        assert.isFalse(results.isSealed, "Object.isSealed reports an object as not sealed");
        assert.isTrue(results.isFrozenPrimitive, "Object.isFrozen reports a primitive (including null) as frozen");
        assert.isTrue(results.isSealedPrimitive, "Object.isSealed reports a primitive (including undefined) as sealed");
        assert.strictEqual((Object as any).entries, nativeEntries, "The native function was restored");
    });

    it("getOwnPropertyNames and getOwnPropertySymbols are installed by name", () => {
        const results: any = {};

        _withoutNatives([[Object, "getOwnPropertySymbols"]], () => {
            _installPolyfills();
            results.type = typeof (Object as any).getOwnPropertySymbols;
            results.symbols = (Object as any).getOwnPropertySymbols({ a: 1 });
            results.hasNamesKey = "GET_OWN_PROPERTY_NAMES" in Object;
            results.hasSymbolsKey = "GET_OWN_PROPERTY_SYMBOLS" in Object;
        });

        assert.equal(results.type, "function");
        assert.deepEqual(results.symbols, []);
        assert.isFalse(results.hasNamesKey, "The constant name is not used as the key");
        assert.isFalse(results.hasSymbolsKey, "The constant name is not used as the key");
    });

    it("prototype polyfills are called with the instance as the first argument", () => {
        const results: any = {};

        _withoutNatives([[Array.prototype, "includes"], [Array.prototype, "at"], [String.prototype, "padStart"], [String.prototype, "startsWith"]], () => {
            _installPolyfills();
            results.includes = ([1, NaN] as any).includes(NaN);
            results.notIncludes = ([1, 2] as any).includes(3);
            results.at = ([1, 2, 3] as any).at(-1);
            results.padStart = ("abc" as any).padStart(5, "-");
            results.startsWith = ("abc" as any).startsWith("ab");
        });

        assert.isTrue(results.includes);
        assert.isFalse(results.notIncludes);
        assert.equal(results.at, 3);
        assert.equal(results.padStart, "--abc");
        assert.isTrue(results.startsWith);
    });

    it("does not replace an existing function", () => {
        const nativeIs = (Object as any).is;
        const nativeFrom = (Array as any).from;
        const nativeIncludes = (Array.prototype as any).includes;

        _installPolyfills();

        assert.strictEqual((Object as any).is, nativeIs);
        assert.strictEqual((Array as any).from, nativeFrom);
        assert.strictEqual((Array.prototype as any).includes, nativeIncludes);
    });
});
