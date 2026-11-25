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

    // The native functions used to restore the removed functions, kept as they may be one of the removed functions
    const getOwnPropertyNames = Object.getOwnPropertyNames;
    const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    const defineProperty = Object.defineProperty;

    /**
     * Removes the native functions, calls the callback and then restores them (and removes anything else that was
     * added, including any polyfill installed because the runtime doesn't have the native function, eg. Array
     * `with` on Node 18). The callback must capture any results, as other code (including the assertions) can't
     * be run while the native functions are removed.
     */
    function _withoutNatives(removes: Array<[any, string]>, cb: () => void) {
        const before = targets.map((target) => getOwnPropertyNames(target));
        const saved = removes.map((remove) => ({ target: remove[0], name: remove[1], desc: getOwnPropertyDescriptor(remove[0], remove[1]) }));

        try {
            saved.forEach((item) => {
                delete item.target[item.name];
            });

            cb();
        } finally {
            targets.forEach((target, idx) => {
                getOwnPropertyNames(target).forEach((name) => {
                    if (before[idx].indexOf(name) === -1) {
                        delete target[name];
                    }
                });
            });

            saved.forEach((item) => {
                if (item.desc) {
                    defineProperty(item.target, item.name, item.desc);
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
            results.entries = (Object as any).entries({ a: 1 });
            results.values = (Object as any).values({ a: 1 });
            results.fromEntries = (Object as any).fromEntries([["a", 1]]);
            results.isNaN = (Object as any).is(NaN, NaN);
            results.isZero = (Object as any).is(0, -0);
            results.hasOwn = (Object as any).hasOwn({ a: 1 }, "a");
            results.from = (Array as any).from([1, 2]);
            results.fromArrayLike = (Array as any).from({ length: 2, 0: "a", 1: "b" });
        });

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

    it("getOwnPropertyNames and getOwnPropertySymbols are not installed under their constant names", () => {
        const results: any = {};

        _withoutNatives([[Object, "getOwnPropertySymbols"]], () => {
            _installPolyfills();
            results.type = typeof (Object as any).getOwnPropertySymbols;
            results.hasNamesKey = "GET_OWN_PROPERTY_NAMES" in Object;
            results.hasSymbolsKey = "GET_OWN_PROPERTY_SYMBOLS" in Object;
        });

        assert.equal(results.type, "undefined", "getOwnPropertySymbols is not installed");
        assert.isFalse(results.hasNamesKey, "The constant name is not used as the key");
        assert.isFalse(results.hasSymbolsKey, "The constant name is not used as the key");
    });

    it("getOwnPropertyNames is installed under its name", () => {
        const results: any = {};

        _withoutNatives([[Object, "getOwnPropertyNames"]], () => {
            _installPolyfills();
            results.type = typeof (Object as any).getOwnPropertyNames;
            results.names = (Object as any).getOwnPropertyNames({ a: 1, b: 2 });
            results.arrayNames = (Object as any).getOwnPropertyNames(["x"]);
            results.hasNamesKey = "GET_OWN_PROPERTY_NAMES" in Object;
        });

        assert.equal(results.type, "function");
        assert.deepEqual(results.names, ["a", "b"]);
        assert.deepEqual(results.arrayNames, ["0", "length"], "The length of an array is included");
        assert.isFalse(results.hasNamesKey, "The constant name is not used as the key");
        assert.strictEqual(Object.getOwnPropertyNames, getOwnPropertyNames, "The native function was restored");
    });

    it("getOwnPropertySymbols is not installed, as a polyfill symbol key is also a string key", () => {
        const results: any = {};

        _withoutNatives([[Object, "getOwnPropertySymbols"]], () => {
            _installPolyfills();
            results.type = typeof (Object as any).getOwnPropertySymbols;
            results.hasSymbolsKey = "GET_OWN_PROPERTY_SYMBOLS" in Object;
        });

        assert.equal(results.type, "undefined", "getOwnPropertySymbols is not installed");
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

    it("string polyfills work with a String object and convert their arguments, like the native functions", () => {
        const results: any = {};

        _withoutNatives([[String.prototype, "startsWith"], [String.prototype, "endsWith"], [String.prototype, "padStart"], [String.prototype, "substr"]], () => {
            _installPolyfills();
            const theString: any = new String("abc");
            results.startsWith = theString.startsWith("ab");
            results.endsWith = theString.endsWith("bc");
            results.padStart = theString.padStart(5, "-");
            results.substr = theString.substr(1, 1);
            results.numberStartsWith = (String.prototype as any).startsWith.call(123, "12");
            results.numberEndsWith = (String.prototype as any).endsWith.call(123, "23");
            results.startsWithPosition = ("abc" as any).startsWith("c", "2.5");
            results.endsWithNaN = ("abc" as any).endsWith("c", NaN);
            try {
                (String.prototype as any).startsWith.call(null, "a");
            } catch (e) {
                results.nullError = e;
            }
        });

        assert.isTrue(results.startsWith, "startsWith of a String object");
        assert.isTrue(results.endsWith, "endsWith of a String object");
        assert.equal(results.padStart, "--abc", "padStart of a String object");
        assert.equal(results.substr, "b", "substr of a String object");
        assert.isTrue(results.numberStartsWith, "startsWith of a number");
        assert.isTrue(results.numberEndsWith, "endsWith of a number");
        assert.isTrue(results.startsWithPosition, "startsWith with a string position");
        assert.isFalse(results.endsWithNaN, "endsWith with a NaN length");
        assert.ok(results.nullError instanceof TypeError, "startsWith of null throws a TypeError");
    });

    it("does not replace an existing function", () => {
        const results: any = {};
        const nativeIs = (Object as any).is;
        const nativeFrom = (Array as any).from;
        const nativeIncludes = (Array.prototype as any).includes;

        // Nothing is removed, but anything the runtime doesn't have (eg. Array with on Node 18) is still installed, so
        // it must be removed afterwards rather than left installed for the other tests
        _withoutNatives([], () => {
            _installPolyfills();
            results.is = (Object as any).is;
            results.from = (Array as any).from;
            results.includes = (Array.prototype as any).includes;
        });

        assert.strictEqual(results.is, nativeIs);
        assert.strictEqual(results.from, nativeFrom);
        assert.strictEqual(results.includes, nativeIncludes);
    });

    it("installs the polyfills as non-enumerable properties, like the native functions", () => {
        const results: any = {};

        _withoutNatives([[Object, "entries"], [Array, "from"], [Array.prototype, "includes"], [String.prototype, "padStart"]], () => {
            _installPolyfills();
            results.entries = getOwnPropertyDescriptor(Object, "entries");
            results.from = getOwnPropertyDescriptor(Array, "from");
            results.includes = getOwnPropertyDescriptor(Array.prototype, "includes");
            results.padStart = getOwnPropertyDescriptor(String.prototype, "padStart");

            results.arrayKeys = [];
            const theArray = [1];
            for (const key in theArray) {
                results.arrayKeys.push(key);
            }

            results.stringKeys = [];
            const theString = new String("a");
            for (const key in theString) {
                results.stringKeys.push(key);
            }
        });

        assert.isFalse(results.entries.enumerable, "Object.entries is not enumerable");
        assert.isTrue(results.entries.writable, "Object.entries is writable");
        assert.isTrue(results.entries.configurable, "Object.entries is configurable");
        assert.isFalse(results.from.enumerable, "Array.from is not enumerable");
        assert.isFalse(results.includes.enumerable, "Array.prototype.includes is not enumerable");
        assert.isTrue(results.includes.writable, "Array.prototype.includes is writable");
        assert.isTrue(results.includes.configurable, "Array.prototype.includes is configurable");
        assert.isFalse(results.padStart.enumerable, "String.prototype.padStart is not enumerable");
        assert.deepEqual(results.arrayKeys, ["0"], "for-in over an array only returns its indexes");
        assert.deepEqual(results.stringKeys, ["0"], "for-in over a String only returns its indexes");
    });
    it("installs the polyfills with the native function's name and length, and an alias is the same function", () => {
        const results: any = {};

        _withoutNatives([[String.prototype, "trimStart"], [String.prototype, "trimLeft"], [String.prototype, "padStart"], [String.prototype, "substr"], [Array.prototype, "with"], [Object, "hasOwn"], [Array, "from"]], () => {
            _installPolyfills();
            results.trimStart = (String.prototype as any).trimStart;
            results.trimLeft = (String.prototype as any).trimLeft;
            results.padStart = (String.prototype as any).padStart;
            results.substr = (String.prototype as any).substr;
            results.with = (Array.prototype as any).with;
            results.hasOwn = (Object as any).hasOwn;
            results.from = (Array as any).from;
        });

        // Whether a function's name and length can be changed (ES2015+, they can't on IE)
        const fnNameDesc = getOwnPropertyDescriptor(function testName() {
            // Not called
        }, "name");
        const nameDesc = getOwnPropertyDescriptor(results.padStart, "name");
        if (fnNameDesc && fnNameDesc.configurable) {
            assert.equal(results.trimStart.name, "trimStart");
            assert.equal(results.trimStart.length, 0);
            assert.equal(results.padStart.length, 1);
            assert.equal(results.substr.length, 2);
            assert.equal(results.with.name, "with");
            assert.equal(results.with.length, 2);
            assert.equal(results.hasOwn.name, "hasOwn");
            assert.equal(results.hasOwn.length, 2);
            assert.equal(results.from.name, "from");
            assert.equal(results.from.length, 1);
            assert.deepEqual(nameDesc, { value: "padStart", writable: false, enumerable: false, configurable: true }, "Like a native function's name");
        }

        assert.strictEqual(results.trimLeft, results.trimStart, "trimLeft is the same function as trimStart (like the native functions)");
        if (String.prototype.trimLeft && String.prototype.trimStart) {
            // Only a runtime with both has the alias (eg. not one with only trimLeft, or IE with neither)
            assert.strictEqual(String.prototype.trimLeft, String.prototype.trimStart, "The native trimLeft is trimStart");
        }
    });

    it("installs the native function for a missing alias, when the runtime only has the other name", () => {
        const results: any = {};
        const nativeTrimLeft = String.prototype.trimLeft;
        const nativeTrimRight = String.prototype.trimRight;

        _withoutNatives([[String.prototype, "trimStart"], [String.prototype, "trimEnd"]], () => {
            _installPolyfills();
            results.trimStart = (String.prototype as any).trimStart;
            results.trimEnd = (String.prototype as any).trimEnd;
            results.trimLeft = (String.prototype as any).trimLeft;
            results.trimRight = (String.prototype as any).trimRight;
        });

        // Without the native trimLeft / trimRight (eg. IE) the polyfill is installed for both names
        assert.isFunction(results.trimStart, "trimStart is installed");
        assert.isFunction(results.trimEnd, "trimEnd is installed");
        assert.strictEqual(results.trimStart, results.trimLeft, "trimStart is the same function as trimLeft");
        assert.strictEqual(results.trimEnd, results.trimRight, "trimEnd is the same function as trimRight");
        if (nativeTrimLeft) {
            assert.strictEqual(results.trimStart, nativeTrimLeft, "trimStart is the native trimLeft");
            assert.strictEqual(results.trimLeft, nativeTrimLeft, "trimLeft wasn't replaced");
        }

        if (nativeTrimRight) {
            assert.strictEqual(results.trimEnd, nativeTrimRight, "trimEnd is the native trimRight");
            assert.strictEqual(results.trimRight, nativeTrimRight, "trimRight wasn't replaced");
        }
    });

    it("installs the polyfills (and uses a native function for a missing alias) when Array.prototype has an index setter", () => {
        const results: any = {};

        _withoutNatives([[String.prototype, "trimStart"], [String.prototype, "trimEnd"]], () => {
            // Like a changed Array.prototype, an index 0 setter which doesn't add the value to the array (so the value
            // of index 0 is the inherited undefined)
            defineProperty(Array.prototype, "0", {
                get: () => undefined,
                set: () => {
                    // The value is ignored
                },
                configurable: true
            });

            try {
                _installPolyfills();
            } catch (e) {
                results.error = e;
            } finally {
                delete (Array.prototype as any)[0];
            }

            results.trimStart = (String.prototype as any).trimStart;
            results.trimLeft = (String.prototype as any).trimLeft;
            results.trimEnd = (String.prototype as any).trimEnd;
            results.trimRight = (String.prototype as any).trimRight;
        });

        assert.isUndefined(results.error, "The polyfills were installed without an error");
        assert.isFunction(results.trimStart, "trimStart is installed");
        assert.strictEqual(results.trimStart, results.trimLeft, "trimStart is the same function as trimLeft");
        assert.strictEqual(results.trimEnd, results.trimRight, "trimEnd is the same function as trimRight");
    });

    it("installs a polyfill (not the other native function) for isFrozen or isSealed, which share a polyfill but aren't aliases", () => {
        const results: any = {};
        const nativeIsFrozen = Object.isFrozen;
        const nativeIsSealed = Object.isSealed;
        const sealed = Object.seal({ a: 1 });

        _withoutNatives([[Object, "isFrozen"]], () => {
            _installPolyfills();
            results.isFrozen = (Object as any).isFrozen;
            results.isFrozenSealed = (Object as any).isFrozen(sealed);
        });

        _withoutNatives([[Object, "isSealed"]], () => {
            _installPolyfills();
            results.isSealed = (Object as any).isSealed;
        });

        _withoutNatives([[Object, "isFrozen"], [Object, "isSealed"]], () => {
            _installPolyfills();
            results.bothIsFrozen = (Object as any).isFrozen;
            results.bothIsSealed = (Object as any).isSealed;
        });

        assert.notStrictEqual(results.isFrozen, nativeIsSealed, "isFrozen isn't the native isSealed");
        assert.isFalse(results.isFrozenSealed, "A sealed object with a property isn't frozen");
        assert.equal(results.isFrozenSealed, nativeIsFrozen(sealed), "Like the native isFrozen");
        assert.notStrictEqual(results.isSealed, nativeIsFrozen, "isSealed isn't the native isFrozen");
        assert.notStrictEqual(results.bothIsFrozen, results.bothIsSealed, "Like the native functions, isFrozen and isSealed are different functions");
        assert.notStrictEqual(nativeIsFrozen, nativeIsSealed, "The native isFrozen isn't isSealed");
    });
});
