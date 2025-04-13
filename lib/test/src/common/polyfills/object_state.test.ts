/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { polyObjPreventExtensions } from "../../../../src/polyfills/object/objPreventExtensions";
import { polyObjIsExtensible } from "../../../../src/polyfills/object/objIsExtensible";
import { polyObjIsFrozen } from "../../../../src/polyfills/object/objIsFrozen";
import { polyObjIsSealed } from "../../../../src/polyfills/object/objIsSealed";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { hasSymbol } from "../../../../src/symbol/symbol";
import { polyNewSymbol, polySymbolFor } from "../../../../src/polyfills/symbol";
import { polyObjGetOwnPropertySymbols } from "../../../../src/polyfills/object/objGetOwnPropertyDescriptors";

describe("object state polyfills", () => {
    describe("polyObjPreventExtensions", () => {
        it("should throw for null and undefined", () => {
            assert.throws(() => {
                polyObjPreventExtensions(null);
            }, TypeError);
            
            assert.throws(() => {
                polyObjPreventExtensions(undefined);
            }, TypeError);
        });

        it("should return the object passed to it", () => {
            const obj = { a: 1 };
            const result = polyObjPreventExtensions(obj);
            
            assert.strictEqual(result, obj, "polyObjPreventExtensions should return the object passed to it");
        });

        // We cannot reliably test actual prevention of extensions in the polyfill
        // because it might just return the original object without modifying it
    });

    describe("polyObjIsExtensible", () => {
        it("should return true for normal objects", () => {
            const obj = { a: 1 };
            assert.isTrue(polyObjIsExtensible(obj), "Normal objects should be extensible");
            
            const arr = [1, 2, 3];
            assert.isTrue(polyObjIsExtensible(arr), "Arrays should be extensible");
            
            const fn = function() {
                return 42;
            };
            assert.isTrue(polyObjIsExtensible(fn), "Functions should be extensible");
        });

        it("should return false for primitive values", () => {
            assert.isFalse(polyObjIsExtensible(null), "null should not be extensible");
            assert.isFalse(polyObjIsExtensible(undefined), "undefined should not be extensible");
            assert.isFalse(polyObjIsExtensible(1), "Numbers should not be extensible");
            assert.isFalse(polyObjIsExtensible("string"), "Strings should not be extensible");
            assert.isFalse(polyObjIsExtensible(true), "Booleans should not be extensible");
            assert.isFalse(polyObjIsExtensible(Symbol("sym")), "Symbols should not be extensible");
        });

        it("should be compatible with native implementation if available", function() {
            // Skip if native method isn't available
            if (typeof Object.isExtensible !== "function") {
                this.skip();
                return;
            }
            
            const testValues = [
                { a: 1 },
                [1, 2, 3],
                function() {
                    return 42;
                },
                new Date(),
                null,
                undefined,
                1,
                "string",
                true,
                Symbol("test")
            ];
            
            for (const value of testValues) {
                // For primitives, both native and polyfill should return false
                if (value === null || value === undefined ||
                    typeof value === "number" || typeof value === "string" ||
                    typeof value === "boolean" || typeof value === "symbol") {
                    assert.isFalse(polyObjIsExtensible(value), `Polyfill should return false for ${dumpObj(value)}`);
                    try {
                        // Native might throw for primitives
                        const nativeResult = Object.isExtensible(value);
                        assert.isFalse(nativeResult, `Native should return false for ${dumpObj(value)}`);
                    } catch (e) {
                        // This is acceptable - some environments throw for primitives
                    }
                } else {
                    // For objects, the results should match
                    try {
                        const nativeResult = Object.isExtensible(value);
                        const polyResult = polyObjIsExtensible(value);
                        assert.equal(polyResult, nativeResult,
                            `Results should match for ${dumpObj(value)}: native=${nativeResult}, poly=${polyResult}`);
                    } catch (e) {
                        // Handle unexpected errors
                        assert.fail(`Unexpected error testing ${dumpObj(value)}: ${e.message}`);
                    }
                }
            }
        });
    });

    describe("polyObjIsFrozen", () => {
        it("should return true for primitive values", () => {
            assert.isTrue(polyObjIsFrozen(null), "null should be considered frozen");
            assert.isTrue(polyObjIsFrozen(undefined), "undefined should be considered frozen");
            assert.isTrue(polyObjIsFrozen(1), "Numbers should be considered frozen");
            assert.isTrue(polyObjIsFrozen("string"), "Strings should be considered frozen");
            assert.isTrue(polyObjIsFrozen(true), "Booleans should be considered frozen");
            assert.isTrue(polyObjIsFrozen(Symbol("sym")), "Symbols should be considered frozen");
        });

        it("should return false for normal objects", () => {
            const obj = { a: 1 };
            assert.isFalse(polyObjIsFrozen(obj), "Normal objects should not be frozen");
            
            const arr = [1, 2, 3];
            assert.isFalse(polyObjIsFrozen(arr), "Arrays should not be frozen by default");
        });
        
        it("should be compatible with native implementation if available", function() {
            // Skip if native method isn't available
            if (typeof Object.isFrozen !== "function") {
                this.skip();
                return;
            }
            
            const testValues = [
                { a: 1 },
                [1, 2, 3],
                function() {
                    return 42;
                },
                null,
                undefined,
                1,
                "string",
                true
            ];
            
            for (const value of testValues) {
                // For primitives, both native and polyfill should return true
                if (value === null || value === undefined ||
                    typeof value === "number" || typeof value === "string" ||
                    typeof value === "boolean" || typeof value === "symbol") {
                    assert.isTrue(polyObjIsFrozen(value), `Polyfill should return true for ${dumpObj(value)}`);
                    try {
                        // Native might throw for primitives
                        const nativeResult = Object.isFrozen(value);
                        assert.isTrue(nativeResult, `Native should return true for ${dumpObj(value)}`);
                    } catch (e) {
                        // This is acceptable - some environments throw for primitives
                    }
                } else {
                    // For objects, the results should match for normal unfrozen objects
                    try {
                        const nativeResult = Object.isFrozen(value);
                        const polyResult = polyObjIsFrozen(value);
                        assert.equal(polyResult, nativeResult,
                            `Results should match for ${dumpObj(value)}: native=${nativeResult}, poly=${polyResult}`);
                    } catch (e) {
                        // Handle unexpected errors
                        assert.fail(`Unexpected error testing ${dumpObj(value)}: ${e.message}`);
                    }
                }
            }
        });
    });

    describe("polyObjIsSealed", () => {
        it("should return true for primitive values", () => {
            assert.isTrue(polyObjIsSealed(null), "null should be considered sealed");
            assert.isTrue(polyObjIsSealed(undefined), "undefined should be considered sealed");
            assert.isTrue(polyObjIsSealed(1), "Numbers should be considered sealed");
            assert.isTrue(polyObjIsSealed("string"), "Strings should be considered sealed");
            assert.isTrue(polyObjIsSealed(true), "Booleans should be considered sealed");
            assert.isTrue(polyObjIsSealed(Symbol("sym")), "Symbols should be considered sealed");
        });

        it("should return false for normal objects", () => {
            const obj = { a: 1 };
            assert.isFalse(polyObjIsSealed(obj), "Normal objects should not be sealed");
            
            const arr = [1, 2, 3];
            assert.isFalse(polyObjIsSealed(arr), "Arrays should not be sealed by default");
        });
        
        it("should be compatible with native implementation if available", function() {
            // Skip if native method isn't available
            if (typeof Object.isSealed !== "function") {
                this.skip();
                return;
            }
            
            const testValues = [
                { a: 1 },
                [1, 2, 3],
                function() {
                    return 42;
                },
                null,
                undefined,
                1,
                "string",
                true
            ];
            
            for (const value of testValues) {
                // For primitives, both native and polyfill should return true
                if (value === null || value === undefined ||
                    typeof value === "number" || typeof value === "string" ||
                    typeof value === "boolean" || typeof value === "symbol") {
                    assert.isTrue(polyObjIsSealed(value), `Polyfill should return true for ${dumpObj(value)}`);
                    try {
                        // Native might throw for primitives
                        const nativeResult = Object.isSealed(value);
                        assert.isTrue(nativeResult, `Native should return true for ${dumpObj(value)}`);
                    } catch (e) {
                        // This is acceptable - some environments throw for primitives
                    }
                } else {
                    // For objects, the results should match for normal unsealed objects
                    try {
                        const nativeResult = Object.isSealed(value);
                        const polyResult = polyObjIsSealed(value);
                        assert.equal(polyResult, nativeResult,
                            `Results should match for ${dumpObj(value)}: native=${nativeResult}, poly=${polyResult}`);
                    } catch (e) {
                        // Handle unexpected errors
                        assert.fail(`Unexpected error testing ${dumpObj(value)}: ${e.message}`);
                    }
                }
            }
        });
    });

    describe("polyObjGetOwnPropertySymbols", () => {
        it("should return an empty array for objects without symbol properties", () => {
            const obj = { a: 1, b: 2 };
            const result = polyObjGetOwnPropertySymbols(obj);
            
            assert.isArray(result);
            assert.equal(result.length, 0);
        });
        
        it("should return symbols if they exist on an object and symbols are supported", function() {
            // Using polyfill for Symbol to ensure compatibility
            const sym1 = polyNewSymbol("test1");
            const sym2 = polySymbolFor("test2");
            
            const obj = {
                regularProp: "value",
                [sym1]: "symbol1 value",
                [sym2]: "symbol2 value"
            };
            
            const result = polyObjGetOwnPropertySymbols(obj);
            const nativeResult = Object.getOwnPropertySymbols(obj);
            // If native can get symbols, verify that our polyfill can also get symbols
            // when the native implementation is used
            if (nativeResult && nativeResult.length > 0) {
                assert.equal(result.length, nativeResult.length,
                    "Polyfill should return same number of symbols as native implementation");
                
                // Check that all symbols from native implementation are in our result
                for (let i = 0; i < nativeResult.length; i++) {
                    assert.include(result, nativeResult[i],
                        `Result should include the symbol ${String(nativeResult[i])}`);
                }
            }
        });
        
        it("should handle primitive values", () => {
            // These should return empty arrays
            assert.throws(() => polyObjGetOwnPropertySymbols(null));
            assert.throws(() => polyObjGetOwnPropertySymbols(undefined));
            assert.isArray(polyObjGetOwnPropertySymbols(1));
            assert.isArray(polyObjGetOwnPropertySymbols("string"));
            assert.isArray(polyObjGetOwnPropertySymbols(true));
            
            assert.equal(polyObjGetOwnPropertySymbols(1).length, 0);
            assert.equal(polyObjGetOwnPropertySymbols("string").length, 0);
            assert.equal(polyObjGetOwnPropertySymbols(true).length, 0);
        });

        it("should match native Object.getOwnPropertySymbols behavior for all inputs", function() {
            // Skip if native method or symbols aren't available
            if (typeof Object.getOwnPropertySymbols !== "function" || !hasSymbol()) {
                this.skip();
                return;
            }
            
            const sym1 = polyNewSymbol("test1");
            const sym2 = polySymbolFor("test2");

            const testCases = [
                // Regular objects with symbol properties
                {
                    name: "Object with symbols",
                    value: { regularProp: "value", [sym1]: "symbol1", [sym2]: "symbol2" }
                },
                // Objects with inherited symbol properties (should not appear)
                {
                    name: "Object with inherited symbols",
                    value: Object.create({ [sym1]: "inherited" })
                },
                // Arrays with symbol properties
                {
                    name: "Array with symbols",
                    value: (() => {
                        const arr: any = [1, 2, 3];
                        arr[sym1] = "symbol on array";
                        return arr;
                    })()
                },
                // Function with symbol properties
                {
                    name: "Function with symbols",
                    value: (() => {
                        const fn = function() {
                            return 42;
                        };
                        (fn as any)[sym1] = "symbol on function";
                        return fn;
                    })()
                },
                // Empty objects
                { name: "Empty object", value: {} },
                // Primitive values
                { name: "null", value: null },
                { name: "undefined", value: undefined },
                { name: "number", value: 123 },
                { name: "string", value: "test string" },
                { name: "boolean", value: true },
                { name: "symbol", value: Symbol("test symbol") }
            ];

            testCases.forEach(testCase => {
                let nativeResult;
                let nativeThrown: any;
                try {
                    nativeResult = Object.getOwnPropertySymbols(testCase.value);
                } catch (e) {
                    nativeThrown = e;
                }


                let polyResult;
                let polyThrown: any;
                try {
                    polyResult = polyObjGetOwnPropertySymbols(testCase.value);
                } catch (e) {
                    polyThrown = e;
                }

                assert.equal(!!polyThrown, !!nativeThrown, "Polyfill and native should either both throw or both succeed");

                // If native threw an error, polyfill should also throw the same error
                if (nativeThrown) {
                    assert.equal(polyThrown.name, nativeThrown.name,
                        `Polyfill should throw the same error for ${testCase.name} - ${dumpObj(nativeThrown)}`);
                    return;
                }

                assert.equal(polyResult.length, nativeResult.length,
                    `Symbol count should match for ${testCase.name}`);
                
                // Check that every symbol in the native result is also in our result
                for (let i = 0; i < nativeResult.length; i++) {
                    assert.include(polyResult, nativeResult[i],
                        `Result for ${testCase.name} should include symbol ${String(nativeResult[i])}`);
                }
                
                // Check that every symbol in our result is also in the native result
                for (let i = 0; i < polyResult.length; i++) {
                    assert.include(nativeResult, polyResult[i],
                        `Native result for ${testCase.name} should include symbol ${String(polyResult[i])}`);
                }
            });
        });
    });
});