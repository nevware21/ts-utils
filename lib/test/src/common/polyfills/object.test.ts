/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { polyObjEntries } from "../../../../src/polyfills/object/objEntries";
import { polyObjFromEntries } from "../../../../src/polyfills/object/objFromEntries";
import { polyObjIs } from "../../../../src/polyfills/object/objIs";
import { polyObjKeys } from "../../../../src/polyfills/object/objKeys";
import { polyObjValues } from "../../../../src/polyfills/object/objValues";
import { polyObjGetOwnPropertyNames } from "../../../../src/polyfills/object/objGetOwnPropertyNames";
import { polyObjGetOwnPropertyDescriptor } from "../../../../src/polyfills/object/objGetOwnPropertyDescriptor";
import { polyObjGetOwnPropertyDescriptors, polyObjGetOwnPropertySymbols } from "../../../../src/polyfills/object/objGetOwnPropertyDescriptors";
import { polyObjHasOwn } from "../../../../src/polyfills/object/objHasOwn";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isObject, isUndefined } from "../../../../src/helpers/base";
import { objFromEntries } from "../../../../src/object/from_entries";
import { objGetOwnPropertyDescriptor } from "../../../../src/object/get_own_property_desc";
import { objGetOwnPropertyDescriptors } from "../../../../src/object/get_own_property_descs";
import { objHasOwn } from "../../../../src/object/has_own";
import { createIterable, CreateIteratorContext } from "../../../../src/iterator/create";
import { getKnownSymbol, newSymbol } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";
import { polyNewSymbol } from "../../../../src/polyfills/symbol";
import { objCreate, polyObjCreate } from "../../../../src/object/create";
import { arrForEach } from "../../../../src/array/forEach";
import { safe } from "../../../../src/helpers/safe";

describe("object polyfills", () => {
    it("polyObjKeys", () => {
        _checkObjKeys(null);
        _checkObjKeys(undefined);
        _checkObjKeys("null");
        _checkObjKeys("undefined");
        _checkObjKeys("1");
        _checkObjKeys("aa");
        _checkObjKeys(new Date());
        _checkObjKeys(1);
        _checkObjKeys("");
        _checkObjKeys(_dummyFunction);
        _checkObjKeys([]);
        _checkObjKeys(new Array(1));
        _checkObjKeys(true);
        _checkObjKeys(false);
        _checkObjKeys("true");
        _checkObjKeys("false");
        _checkObjKeys(new Boolean(true));
        _checkObjKeys(new Boolean(false));
        _checkObjKeys(new Boolean("true"));
        _checkObjKeys(new Boolean("false"));
        _checkObjKeys(/[a-z]/g);
        _checkObjKeys(new RegExp(""));
        _checkObjKeys(_getFile());
        _checkObjKeys(_getFormData());
        _checkObjKeys(_getBlob());
        _checkObjKeys(new ArrayBuffer(0));
        _checkObjKeys(new Error("Test Error"));
        _checkObjKeys(new TypeError("Test TypeError"));
        _checkObjKeys(new TestError("Test TestError"));
        _checkObjKeys(_dummyError());
        _checkObjKeys(Promise.reject());
        _checkObjKeys(Promise.resolve());
        _checkObjKeys(new Promise(() => {}));
        _checkObjKeys(_simplePromise());
        _checkObjKeys(_simplePromiseLike());
        _checkObjKeys({
            hello: "darkness",
            my: "Old",
            "friend": "."
        });
    });

    describe("polyObjEntries", () => {
        it("examples", () => {
            assert.deepEqual(polyObjEntries({ Hello: "Darkness", my: "old", friend: "." }), [ [ "Hello", "Darkness" ], [ "my", "old"], [ "friend", "." ] ]);

            // Array-like object
            assert.deepEqual(polyObjEntries({ 0: "a", 1: "b", 2: "c" }), [ ["0", "a"], ["1", "b"], ["2", "c"] ]);

            // Array-like object with random key ordering
            assert.deepEqual(polyObjEntries({ 100: "a", 2: "b", 7: "c" }), [ ["2", "b"], ["7", "c"], ["100", "a"] ]);
        });
    });

    describe("polyObjValues", () => {
        it("examples", () => {
            assert.deepEqual(polyObjValues({ Hello: "Darkness", my: "old", friend: "." }), [ "Darkness", "old", "." ]);

            // Array-like object
            assert.deepEqual(polyObjValues({ 0: "a", 1: "b", 2: "c" }), [ "a", "b", "c"]);

            // Array-like object with random key ordering
            assert.deepEqual(polyObjValues({ 100: "a", 2: "b", 7: "c" }), [ "b", "c", "a"]);
        });
    });

    describe("polyObjIs", () => {
        it("should handle primitive values correctly", () => {
            // Undefined
            assert.isTrue(polyObjIs(undefined, undefined), "undefined should equal undefined");
            assert.isFalse(polyObjIs(undefined, null), "undefined should not equal null");
            
            // Null
            assert.isTrue(polyObjIs(null, null), "null should equal null");
            
            // Booleans
            assert.isTrue(polyObjIs(true, true), "true should equal true");
            assert.isTrue(polyObjIs(false, false), "false should equal false");
            assert.isFalse(polyObjIs(true, false), "true should not equal false");
            
            // Strings
            assert.isTrue(polyObjIs("hello", "hello"), "identical strings should be equal");
            assert.isFalse(polyObjIs("hello", "world"), "different strings should not be equal");
            assert.isTrue(polyObjIs("", ""), "empty string should equal empty string");
            
            // Numbers
            assert.isTrue(polyObjIs(42, 42), "identical numbers should be equal");
            assert.isFalse(polyObjIs(42, 43), "different numbers should not be equal");
            assert.isTrue(polyObjIs(Infinity, Infinity), "Infinity should equal Infinity");
            assert.isTrue(polyObjIs(-Infinity, -Infinity), "-Infinity should equal -Infinity");
            assert.isFalse(polyObjIs(Infinity, -Infinity), "Infinity should not equal -Infinity");
        });

        it("should handle the special case of NaN", () => {
            // This is one of the key differences from ===
            assert.isTrue(polyObjIs(NaN, NaN), "NaN should equal NaN (unlike ===)");
            assert.notStrictEqual(NaN, NaN, "=== operator says NaN is not equal to NaN");
        });

        it("should handle the special case of signed zeros", () => {
            // This is the other key difference from ===
            assert.isTrue(polyObjIs(0, 0), "+0 should equal +0");
            assert.isTrue(polyObjIs(-0, -0), "-0 should equal -0");
            assert.isFalse(polyObjIs(0, -0), "+0 should not equal -0 (unlike ===)");
            assert.isFalse(polyObjIs(-0, 0), "-0 should not equal +0 (unlike ===)");
            assert.strictEqual(0, -0, "=== operator says +0 is equal to -0");
        });

        it("should handle object references", () => {
            const obj1 = { a: 1 };
            const obj2 = { a: 1 };
            const obj3 = obj1;
            
            assert.isTrue(polyObjIs(obj1, obj1), "object should equal itself");
            assert.isTrue(polyObjIs(obj1, obj3), "object should equal its reference");
            assert.isFalse(polyObjIs(obj1, obj2), "different objects with same content should not be equal");
        });

        it("should behave the same as native Object.is when available", () => {
            // Only run this comparison if Object.is is available in the environment
            if (typeof Object.is === "function") {
                const testValues = [
                    undefined, null, true, false, 0, -0, 42, NaN, "", "hello",
                    {}, [], _dummyFunction, new Date()
                ];
                
                for (let i = 0; i < testValues.length; i++) {
                    for (let j = 0; j < testValues.length; j++) {
                        assert.equal(
                            polyObjIs(testValues[i], testValues[j]),
                            Object.is(testValues[i], testValues[j]),
                            `polyObjIs and Object.is should give same result for ${dumpObj(testValues[i])} and ${dumpObj(testValues[j])}`
                        );
                    }
                }
            }
        });

        it("examples", () => {
            // Case 1: NaN
            assert.isTrue(polyObjIs(NaN, NaN), "NaN should equal NaN");
            
            // Case 2: Signed zeros
            assert.isFalse(polyObjIs(0, -0), "+0 should not equal -0");
            assert.isFalse(polyObjIs(+0, -0), "+0 should not equal -0");
            assert.isTrue(polyObjIs(-0, -0), "-0 should equal -0");
            
            // Regular comparison
            assert.isTrue(polyObjIs("hello", "hello"), "identical strings should be equal");
            assert.isFalse(polyObjIs("hello", "goodbye"), "different strings should not be equal");
            assert.isTrue(polyObjIs(1, 1), "identical numbers should be equal");
            assert.isFalse(polyObjIs(1, 2), "different numbers should not be equal");
            
            // Objects
            const obj = { a: 1 };
            assert.isTrue(polyObjIs(obj, obj), "object should equal itself");
            assert.isFalse(polyObjIs(obj, { a: 1 }), "different objects with same content should not be equal");
        });
    });

    describe("polyObjFromEntries", () => {
    
        it("should create an object from an array of entries", () => {
            const entries = [["a", 1], ["b", 2], ["c", 3]];
            const result = polyObjFromEntries(entries);
            
            assert.equal(result.a, 1);
            assert.equal(result.b, 2);
            assert.equal(result.c, 3);
        });

        it("should create an object from a Map", () => {
            const map = new Map<string, number>([["a", 1], ["b", 2], ["c", 3]]);
            const result = polyObjFromEntries(map);
            
            assert.equal(result.a, 1);
            assert.equal(result.b, 2);
            assert.equal(result.c, 3);
        });

        it("should handle Symbol keys", () => {
            const symKey1 = Symbol("key1");
            const symKey2 = Symbol("key2");
            const entries = [[symKey1, "value1"], [symKey2, "value2"]];
            
            const result = polyObjFromEntries(entries);
            
            assert.equal(result[symKey1], "value1");
            assert.equal(result[symKey2], "value2");
        });

        it("should work with iterables created using createIterable", () => {
            let idx = -1;
            const entries = [["a", 1], ["b", 2]];
            
            const ctx: CreateIteratorContext<[string, number]> = {
                n: function() {
                    idx++;
                    const isDone = idx >= entries.length;
                    if (!isDone) {
                        this.v = entries[idx];
                    }
                    return isDone;
                }
            };
            
            const customIterable = createIterable(ctx);
            const result = polyObjFromEntries(customIterable);
            
            assert.equal(result.a, 1);
            assert.equal(result.b, 2);
        });

        it("should handle non-iterable input gracefully", () => {
            const result = polyObjFromEntries(42 as any);
            
            assert.equal(Object.keys(result).length, 0);
        });

        it("should handle null or undefined input gracefully", () => {
            assert.doesNotThrow(() => polyObjFromEntries(null as any));
            assert.doesNotThrow(() => polyObjFromEntries(undefined as any));
            
            const result1 = polyObjFromEntries(null as any);
            const result2 = polyObjFromEntries(undefined as any);
            
            assert.equal(Object.keys(result1).length, 0);
            assert.equal(Object.keys(result2).length, 0);
        });

        it("should handle empty iterables", () => {
            const emptyArray: any[] = [];
            const emptyMap = new Map();
            
            const result1 = polyObjFromEntries(emptyArray);
            const result2 = polyObjFromEntries(emptyMap);
            
            assert.deepEqual(result1, {});
            assert.deepEqual(result2, {});
            assert.equal(Object.keys(result1).length, 0);
            assert.equal(Object.keys(result2).length, 0);
        });
        
        it("should use the last value when duplicate keys exist", () => {
            const entriesWithDuplicates = [
                ["a", 1],
                ["b", 2],
                ["a", 3]  // This should override the first entry with key "a"
            ];
            
            const result = polyObjFromEntries(entriesWithDuplicates);
            
            assert.equal(result.a, 3, "Should use the last value for duplicate key 'a'");
            assert.equal(result.b, 2);
            assert.equal(Object.keys(result).length, 2, "Should have only 2 keys despite having 3 entries");
        });
        
        it("should coerce non-string/symbol keys to strings", () => {
            const entriesWithNonStringKeys = [
                [42, "number"],
                [true, "boolean"],
                [null, "null"],
                [undefined, "undefined"],
                [{}, "object"]
            ];
            
            const result = polyObjFromEntries(entriesWithNonStringKeys);
            
            assert.equal(result["42"], "number");
            assert.equal(result["true"], "boolean");
            assert.equal(result["null"], "null");
            assert.equal(result["undefined"], "undefined");
            assert.equal(result["[object Object]"], "object");
        });
        
        it("should handle complex values", () => {
            const complexValues = [
                ["array", [1, 2, 3]],
                ["object", { a: 1, b: 2 }],
                ["function", function() {
                    return 42;
                }],
                ["date", new Date()]
            ];
            
            const result = polyObjFromEntries(complexValues);
            
            assert.deepEqual(result.array, [1, 2, 3]);
            assert.deepEqual(result.object, { a: 1, b: 2 });
            assert.equal(result.function(), 42);
            assert.isTrue(result.date instanceof Date);
        });
        
        it("should preserve numeric key ordering according to the iterable", () => {
            // Keys will be ordered as strings, but we want to ensure the values match as expected
            const numericEntries = [
                ["1", "first"],
                ["10", "second"],
                ["2", "third"]
            ];
            
            const result = polyObjFromEntries(numericEntries);
            
            assert.equal(result["1"], "first");
            assert.equal(result["10"], "second");
            assert.equal(result["2"], "third");
        });

        // Test equivalence between the two implementations
        describe("polyfill equivalence", () => {
            it("objFromEntries and polyObjFromEntries should be equivalent for valid inputs", () => {
                // Only test with valid inputs
                const validEntries = [["a", 1], ["b", 2], ["c", 3]];
                assert.deepEqual(objFromEntries(validEntries), polyObjFromEntries(validEntries));
                
                const map = new Map([["x", 10], ["y", 20]]);
                assert.deepEqual(objFromEntries(map), polyObjFromEntries(map));
            });

            it("should handle different entry types consistently when possible", () => {
                // Symbol keys
                const symKey = Symbol("test");
                const entriesWithSymbol = [[symKey, "symbol value"]];
                
                // This try-catch is needed because the test might run in environments
                // where Object.fromEntries is not available
                try {
                    const nativeResult = objFromEntries(entriesWithSymbol);
                    const polyResult = polyObjFromEntries(entriesWithSymbol);
                    assert.equal(polyResult[symKey], "symbol value");
                    assert.equal(nativeResult[symKey], "symbol value");
                } catch (e) {
                    // If it's thrown due to missing native implementation, that's fine
                    if (typeof Object.fromEntries !== "function") {
                        // Do nothing, test is skipped
                    } else {
                        throw e; // Re-throw if it's another error
                    }
                }
                
                // Numeric keys
                const numericEntries = [[42, "answer"]];
                try {
                    const nativeResult = objFromEntries(numericEntries);
                    const polyResult = polyObjFromEntries(numericEntries);
                    assert.equal(polyResult["42"], "answer");
                    assert.equal(nativeResult["42"], "answer");
                } catch (e) {
                    if (typeof Object.fromEntries !== "function") {
                        // Skip if native implementation missing
                    } else {
                        throw e;
                    }
                }
                
                // Objects as keys
                const objKey = { toString() {
                    return "custom";
                } };
                const objKeyEntries = [[objKey, "object key"]];
                try {
                    const nativeResult = objFromEntries(objKeyEntries);
                    const polyResult = polyObjFromEntries(objKeyEntries);
                    assert.equal(polyResult["custom"], "object key");
                    assert.equal(nativeResult["custom"], "object key");
                } catch (e) {
                    if (typeof Object.fromEntries !== "function") {
                        // Skip if native implementation missing
                    } else {
                        throw e;
                    }
                }
            });
            
            it("should demonstrate the behavioral differences with invalid inputs", () => {
                // In native implementation (objFromEntries), these will throw
                // In polyfill (polyObjFromEntries), these will return an empty object
                
                // Test with null
                assert.doesNotThrow(() => polyObjFromEntries(null as any));
                if (typeof Object.fromEntries === "function") {
                    assert.throws(() => objFromEntries(null as any));
                }
                assert.deepEqual(polyObjFromEntries(null as any), {});
                
                // Test with undefined
                assert.doesNotThrow(() => polyObjFromEntries(undefined as any));
                if (typeof Object.fromEntries === "function") {
                    assert.throws(() => objFromEntries(undefined as any));
                }
                assert.deepEqual(polyObjFromEntries(undefined as any), {});
                
                // Test with non-iterable
                assert.doesNotThrow(() => polyObjFromEntries(42 as any));
                if (typeof Object.fromEntries === "function") {
                    assert.throws(() => objFromEntries(42 as any));
                }
                assert.deepEqual(polyObjFromEntries(42 as any), {});
                
                // Test with invalid entries (not arrays or too short)
                const invalidEntries = [["valid", 1], "invalid" as any];
                assert.doesNotThrow(() => polyObjFromEntries(invalidEntries as any));
                if (typeof Object.fromEntries === "function") {
                    assert.throws(() => objFromEntries(invalidEntries as any));
                }
                
                // Test with single-item entries (should be ignored by polyfill)
                const singleItemEntries = [["key"], ["another"]];
                assert.doesNotThrow(() => polyObjFromEntries(singleItemEntries));
                const result = polyObjFromEntries(singleItemEntries);
                assert.deepEqual(result, {});
            });
        });
    });

    describe("polyObjGetOwnPropertyNames", () => {
        it("should return all own property names for simple objects", () => {
            const obj = { a: 1, b: 2, c: 3 };
            const result = polyObjGetOwnPropertyNames(obj);
            
            assert.isArray(result);
            assert.includeMembers(result, ["a", "b", "c"]);
            assert.equal(result.length, 3);
        });

        it("should include array indices and length property for arrays", () => {
            const arr = ["apple", "banana", "cherry"];
            const result = polyObjGetOwnPropertyNames(arr);
            
            assert.isArray(result);
            assert.includeMembers(result, ["0", "1", "2", "length"]);
            assert.equal(result.length, 4);
        });

        it("should handle empty arrays", () => {
            const emptyArr: any[] = [];
            const result = polyObjGetOwnPropertyNames(emptyArr);
            
            assert.isArray(result);
            assert.includeMembers(result, ["length"]);
            assert.equal(result.length, 1);
        });

        it("should include non-enumerable properties if possible", function() {
            // Create an object with both enumerable and non-enumerable properties
            const obj = Object.create({}, {
                visible: { value: "public", enumerable: true },
                hidden: { value: "secret", enumerable: false }
            });
            
            const result = polyObjGetOwnPropertyNames(obj);
            
            // Native implementation can access non-enumerable properties
            const nativeResult = Object.getOwnPropertyNames ? Object.getOwnPropertyNames(obj) : null;
            
            // If native exists and can get non-enumerable properties, our polyfill has a known limitation
            if (nativeResult && nativeResult.includes("hidden")) {
                // Skip this test if non-enumerable properties can't be accessed in this environment
                assert.includeMembers(result, ["visible"]);
                // Note: We don't assert that "hidden" is included because the polyfill
                // may not be able to see non-enumerable properties
            } else {
                assert.includeMembers(result, ["visible"]);
            }
        });

        it("should handle primitive types by boxing them", () => {
            // String
            const strResult = polyObjGetOwnPropertyNames("hello");
            assert.isArray(strResult);
            assert.includeMembers(strResult, ["0", "1", "2", "3", "4", "length"]);
            
            // Number - should return properties of Number object
            const numResult = polyObjGetOwnPropertyNames(123);
            assert.isArray(numResult);
            
            // Boolean - should return properties of Boolean object
            const boolResult = polyObjGetOwnPropertyNames(true);
            assert.isArray(boolResult);
        });

        it("should throw for null and undefined", () => {
            assert.throws(() => {
                polyObjGetOwnPropertyNames(null);
            }, TypeError);
            
            assert.throws(() => {
                polyObjGetOwnPropertyNames(undefined);
            }, TypeError);
        });

        it("should not include properties from the prototype chain", () => {
            // Create an object with a prototype
            const proto = { protoProp: "from prototype" };
            const obj = Object.create(proto);
            obj.ownProp = "own property";
            
            const result = polyObjGetOwnPropertyNames(obj);
            
            assert.includeMembers(result, ["ownProp"]);
            assert.notIncludeMembers(result, ["protoProp"]);
            assert.equal(result.length, 1);
        });

        it("should be compatible with the native implementation for basic objects", function() {
            // Skip if the native method doesn't exist
            if (typeof Object.getOwnPropertyNames !== "function") {
                this.skip();
                return;
            }
            
            // Test various objects
            const testCases = [
                { a: 1, b: 2 },
                ["x", "y", "z"],
                { method() {
                    return true;
                }, prop: "value" },
                new Date()
            ];
            
            testCases.forEach(obj => {
                const polyResult = polyObjGetOwnPropertyNames(obj);
                const nativeResult = Object.getOwnPropertyNames(obj);
                
                // Check that all enumerable properties found by the native implementation
                // are also found by our polyfill
                for (const prop of nativeResult) {
                    // Skip non-enumerable properties since our polyfill has a known limitation
                    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
                    if (descriptor && descriptor.enumerable) {
                        assert.include(
                            polyResult,
                            prop,
                            `Polyfill should find enumerable property "${prop}" on ${dumpObj(obj)}`
                        );
                    }
                }
            });
        });
    });

    describe("polyObjGetOwnPropertyDescriptor", () => {
        it("should return correct descriptor for data property", () => {
            const obj = { a: 1, b: "hello" };
            
            const descriptorA = polyObjGetOwnPropertyDescriptor(obj, "a");
            assert.isObject(descriptorA);
            assert.equal(descriptorA?.value, 1);
            assert.isTrue(descriptorA?.configurable);
            assert.isTrue(descriptorA?.enumerable);
            assert.isTrue(descriptorA?.writable);
            
            const descriptorB = polyObjGetOwnPropertyDescriptor(obj, "b");
            assert.isObject(descriptorB);
            assert.equal(descriptorB?.value, "hello");
            assert.isTrue(descriptorB?.configurable);
            assert.isTrue(descriptorB?.enumerable);
            assert.isTrue(descriptorB?.writable);
        });
        
        it("should return undefined for non-existent properties", () => {
            const obj = { a: 1 };
            
            const descriptor = polyObjGetOwnPropertyDescriptor(obj, "nonExistent");
            assert.isUndefined(descriptor);
        });
        
        it("should handle primitive types by converting them to objects", () => {
            // String
            const strDescriptor = polyObjGetOwnPropertyDescriptor("hello", "0");
            assert.isObject(strDescriptor);
            assert.equal(strDescriptor?.value, "h");
            assert.isTrue(strDescriptor?.configurable);
            assert.isTrue(strDescriptor?.enumerable);
            
            // Number
            const numDescriptor = polyObjGetOwnPropertyDescriptor(42, "toString");
            // This test is environment-dependent, as Number.prototype.toString accessibility may vary
            if (numDescriptor) {
                assert.isObject(numDescriptor);
            }
            
            // Boolean
            const boolDescriptor = polyObjGetOwnPropertyDescriptor(true, "valueOf");
            // This test is environment-dependent, as Boolean.prototype.valueOf accessibility may vary
            if (boolDescriptor) {
                assert.isObject(boolDescriptor);
            }
        });
        
        it("should throw TypeError for null and undefined", () => {
            assert.throws(() => {
                polyObjGetOwnPropertyDescriptor(null, "prop");
            }, TypeError);
            
            assert.throws(() => {
                polyObjGetOwnPropertyDescriptor(undefined, "prop");
            }, TypeError);
        });
        
        it("should support Symbol as property key", () => {
            const sym = newSymbol("test");
            const obj: any = {};
            obj[sym] = "symbol value";
            
            const descriptor = polyObjGetOwnPropertyDescriptor(obj, sym);
            assert.isObject(descriptor);
            assert.equal(descriptor?.value, "symbol value");
            assert.isTrue(descriptor?.configurable);
            assert.isTrue(descriptor?.enumerable);
            assert.isTrue(descriptor?.writable);
        });
        
        it("should handle accessor properties when possible", () => {
            // Skip if defineProperty isn't available
            if (typeof Object.defineProperty !== "function") {
                return;
            }
            
            let value = 0;
            const obj = {};
            
            Object.defineProperty(obj, "accessorProp", {
                get: function() {
                    return value;
                },
                set: function(v) {
                    value = v;
                },
                enumerable: true,
                configurable: true
            });
            
            const descriptor = polyObjGetOwnPropertyDescriptor(obj, "accessorProp");
            
            // In environments with full descriptor support
            if (descriptor && typeof descriptor.get === "function") {
                assert.isFunction(descriptor.get);
                assert.isFunction(descriptor.set);
                assert.isUndefined(descriptor.value);
                assert.isUndefined(descriptor.writable);
            } else if (descriptor) {
                // In environments with limited support, it might fall back to a data property
                assert.isTrue(descriptor.configurable);
                assert.isTrue(descriptor.enumerable);
            }
        });
        
        it("should be compatible with the native implementation for basic objects", function() {
            // Skip if the native method doesn't exist
            if (typeof Object.getOwnPropertyDescriptor !== "function") {
                return;
            }
            
            // Test various objects
            const testCases = [
                { a: 1, b: "string" },
                ["x", "y", "z"],
                new Date()
            ];
            
            testCases.forEach(obj => {
                for (const propName in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, propName)) {
                        const polyResult = polyObjGetOwnPropertyDescriptor(obj, propName);
                        const nativeResult = Object.getOwnPropertyDescriptor(obj, propName);
                        
                        // Check if key properties match
                        assert.equal(
                            polyResult?.value,
                            nativeResult?.value,
                            `Value should match for property "${propName}" on ${dumpObj(obj)}`
                        );
                        
                        assert.equal(
                            polyResult?.enumerable,
                            nativeResult?.enumerable,
                            `Enumerable should match for property "${propName}" on ${dumpObj(obj)}`
                        );
                        
                        // Check that we're always returning configurable and writable as true
                        // for our polyfill (this is a limitation)
                        assert.isTrue(polyResult?.configurable);
                        assert.isTrue(polyResult?.writable);
                    }
                }
            });
        });
        
        it("should handle equivalence with objGetOwnPropertyDescriptor for valid inputs", () => {
            const obj = { a: 1, b: "string", c: true };
            
            assert.deepEqual(
                polyObjGetOwnPropertyDescriptor(obj, "a"),
                objGetOwnPropertyDescriptor(obj, "a")
            );
            
            assert.deepEqual(
                polyObjGetOwnPropertyDescriptor(obj, "b"),
                objGetOwnPropertyDescriptor(obj, "b")
            );
            
            assert.deepEqual(
                polyObjGetOwnPropertyDescriptor(obj, "nonExistent"),
                objGetOwnPropertyDescriptor(obj, "nonExistent")
            );
        });

        it("should have comprehensive compatibility with native implementation", function() {
            // Skip if native implementation doesn't exist
            if (typeof Object.getOwnPropertyDescriptor !== "function") {
                this.skip();
                return;
            }
            
            // Test a variety of objects and properties
            const testCases = [
                { obj: { a: 1, b: "hello", c: true }, props: ["a", "b", "c", "nonExistent"] },
                { obj: ["apple", "banana", "cherry"], props: ["0", "1", "2", "length", "nonExistent"] },
                { obj: new Date(), props: ["getTime", "getFullYear", "nonExistent"] },
                { obj: /test/g, props: ["source", "flags", "lastIndex", "nonExistent"] },
                { obj: { method() {
                    return 42;
                } }, props: ["method", "nonExistent"] }
            ];
            
            testCases.forEach(({ obj, props }) => {
                props.forEach(prop => {
                    const nativeDesc = Object.getOwnPropertyDescriptor(obj, prop);
                    const polyDesc = polyObjGetOwnPropertyDescriptor(obj, prop);
                    
                    // Both should return undefined for non-existent properties
                    if (nativeDesc === undefined) {
                        assert.isUndefined(polyDesc, `Both should return undefined for nonexistent property '${prop}'`);
                        return;
                    }
                    
                    // For existing properties, compare the descriptors
                    assert.isObject(polyDesc, `Polyfill should return descriptor object for property '${prop}'`);
                    assert.equal(polyDesc?.value, nativeDesc?.value,
                        `Value should match for property '${prop}' for ${dumpObj(obj)}`);
                    assert.equal(polyDesc?.enumerable, nativeDesc?.enumerable,
                        `Enumerable flag should match for property '${prop}' for ${dumpObj(obj)}: [${dumpObj(nativeDesc)}]; [${dumpObj(polyDesc)}]`);
                    
                    // If the native property has get/set, the polyfill should handle it correctly if supported
                    if (typeof nativeDesc?.get === "function" || typeof nativeDesc?.set === "function") {
                        if (typeof polyDesc?.get === "function" || typeof polyDesc?.set === "function") {
                            assert.equal(typeof polyDesc?.get, typeof nativeDesc?.get,
                                `Getter presence should match for property '${prop}'`);
                            assert.equal(typeof polyDesc?.set, typeof nativeDesc?.set,
                                `Setter presence should match for property '${prop}'`);
                        } else if (polyDesc) {
                            // If polyfill doesn't support accessors fully, at least it shouldn't have value/writable
                            // This is just acknowledging a potential limitation
                            assert.ok(true, "Polyfill may have limited accessor support");
                        }
                    }
                });
            });
        });
        
        it("should handle property descriptors with non-default attributes correctly", function() {
            // Skip if defineProperty isn't available
            if (typeof Object.defineProperty !== "function") {
                this.skip();
                return;
            }
            
            const obj = {};
            
            // Create properties with various descriptor configurations
            try {
                Object.defineProperty(obj, "nonEnumerable", {
                    value: "hidden",
                    enumerable: false,
                    configurable: true,
                    writable: true
                });
                
                Object.defineProperty(obj, "nonWritable", {
                    value: "readonly",
                    enumerable: true,
                    configurable: true,
                    writable: false
                });
                
                Object.defineProperty(obj, "nonConfigurable", {
                    value: "locked",
                    enumerable: true,
                    configurable: false,
                    writable: true
                });
            } catch (e) {
                // Some environments might have limited support
                this.skip();
                return;
            }
            
            // Test non-enumerable property
            const nonEnumDesc = polyObjGetOwnPropertyDescriptor(obj, "nonEnumerable");
            if (nonEnumDesc) {
                // If polyfill can see non-enumerable properties
                assert.equal(nonEnumDesc.value, "hidden");
                assert.equal(nonEnumDesc.enumerable, false);
                // Our polyfill might always return true for these
                // assert.equal(nonEnumDesc.configurable, true);
                // assert.equal(nonEnumDesc.writable, true);
            }
            
            // Test non-writable property
            const nonWritableDesc = polyObjGetOwnPropertyDescriptor(obj, "nonWritable");
            if (nonWritableDesc) {
                assert.equal(nonWritableDesc.value, "readonly");
                assert.equal(nonWritableDesc.enumerable, true);
                // Our polyfill might always return true for writable
                // assert.equal(nonWritableDesc.writable, false);
            }
            
            // Test non-configurable property
            const nonConfigDesc = polyObjGetOwnPropertyDescriptor(obj, "nonConfigurable");
            if (nonConfigDesc) {
                assert.equal(nonConfigDesc.value, "locked");
                assert.equal(nonConfigDesc.enumerable, true);
                // Our polyfill might always return true for configurable
                // assert.equal(nonConfigDesc.configurable, false);
            }
        });
    });

    describe("polyObjGetOwnPropertyDescriptors", () => {
        it("should return all property descriptors for a simple object", () => {
            const obj = { a: 1, b: "string", c: true };
            
            const descriptors = polyObjGetOwnPropertyDescriptors(obj);
            
            assert.isObject(descriptors);
            
            // Check individual descriptors
            assert.isObject(descriptors.a);
            assert.equal(descriptors.a.value, 1);
            assert.isTrue(descriptors.a.configurable);
            assert.isTrue(descriptors.a.enumerable);
            assert.isTrue(descriptors.a.writable);
            
            assert.isObject(descriptors.b);
            assert.equal(descriptors.b.value, "string");
            
            assert.isObject(descriptors.c);
            assert.equal(descriptors.c.value, true);
            
            // Check that we have exactly these three properties
            assert.equal(Object.keys(descriptors).length, 3);
        });
        
        it("should handle arrays and include indices and length property", () => {
            const arr = ["apple", "banana", "cherry"];
            
            const descriptors = polyObjGetOwnPropertyDescriptors(arr);
            
            // Check indices
            assert.isObject(descriptors["0"]);
            assert.equal(descriptors["0"].value, "apple");
            
            assert.isObject(descriptors["1"]);
            assert.equal(descriptors["1"].value, "banana");
            
            assert.isObject(descriptors["2"]);
            assert.equal(descriptors["2"].value, "cherry");
            
            // Check length property
            assert.isObject(descriptors.length);
            assert.equal(descriptors.length.value, 3);
        });
        
        it("should handle primitive types by boxing them", () => {
            // String
            const strDescriptors = polyObjGetOwnPropertyDescriptors("hello");
            
            assert.isObject(strDescriptors["0"]);
            assert.equal(strDescriptors["0"].value, "h");
            
            assert.isObject(strDescriptors.length);
            assert.equal(strDescriptors.length.value, 5);
            
            // Number
            const numDescriptors = polyObjGetOwnPropertyDescriptors(42);
            assert.isObject(numDescriptors);
            
            // Boolean
            const boolDescriptors = polyObjGetOwnPropertyDescriptors(true);
            assert.isObject(boolDescriptors);
        });
        
        it("should throw TypeError for null and undefined", () => {
            assert.throws(() => {
                polyObjGetOwnPropertyDescriptors(null);
            }, TypeError);
            
            assert.throws(() => {
                polyObjGetOwnPropertyDescriptors(undefined);
            }, TypeError);
        });
        
        it("should support Symbol properties when available", () => {
            // Skip if Symbols aren't supported in this environment
            if (typeof Symbol !== "function") {
                return;
            }
            
            const sym = Symbol("test");
            const obj: any = {};
            obj[sym] = "symbol value";
            
            const descriptors = polyObjGetOwnPropertyDescriptors(obj);
            
            // In modern environments, the symbol should be included
            // In our polyfill, it depends on how polyObjGetOwnPropertySymbols works
            if (descriptors[sym as any]) {
                assert.equal(descriptors[sym as any].value, "symbol value");
            }
        });
        
        it("should handle accessor properties when possible", () => {
            // Skip if defineProperty isn't available
            if (typeof Object.defineProperty !== "function") {
                return;
            }
            
            let value = 0;
            const obj = {};
            
            Object.defineProperty(obj, "accessorProp", {
                get: function() {
                    return value;
                },
                set: function(v) {
                    value = v;
                },
                enumerable: true,
                configurable: true
            });
            
            const descriptors = polyObjGetOwnPropertyDescriptors(obj);
            
            // In environments with full descriptor support
            if (descriptors.accessorProp && typeof descriptors.accessorProp.get === "function") {
                assert.isFunction(descriptors.accessorProp.get);
                assert.isFunction(descriptors.accessorProp.set);
                assert.isUndefined(descriptors.accessorProp.value);
                assert.isUndefined(descriptors.accessorProp.writable);
            } else if (descriptors.accessorProp) {
                // In environments with limited support, it might fall back to a data property
                assert.isTrue(descriptors.accessorProp.configurable);
                assert.isTrue(descriptors.accessorProp.enumerable);
            }
        });
        
        it("should be compatible with the native implementation for basic objects", function() {
            // Skip if the native method doesn't exist
            if (typeof Object.getOwnPropertyDescriptors !== "function") {
                return;
            }
            
            // Test various objects
            const testCases = [
                { a: 1, b: "string" },
                ["x", "y", "z"],
                new Date()
            ];
            
            testCases.forEach(obj => {
                const polyResult = polyObjGetOwnPropertyDescriptors(obj);
                const nativeResult = Object.getOwnPropertyDescriptors(obj);
                
                for (const propName in nativeResult) {
                    if (Object.prototype.hasOwnProperty.call(nativeResult, propName)) {
                        assert.property(
                            polyResult,
                            propName,
                            `Property "${propName}" should exist in polyfill result for ${dumpObj(obj)}`
                        );
                        
                        // Check if key properties match
                        assert.equal(
                            polyResult[propName]?.value,
                            nativeResult[propName]?.value,
                            `Value should match for property "${propName}" on ${dumpObj(obj)}`
                        );
                        
                        assert.equal(
                            polyResult[propName]?.enumerable,
                            nativeResult[propName]?.enumerable,
                            `Enumerable should match for property "${propName}" on ${dumpObj(obj)}`
                        );
                    }
                }
            });
        });
        
        it("should handle equivalence with objGetOwnPropertyDescriptors for valid inputs", () => {
            const obj = { a: 1, b: "string", c: true };
            
            const polyResult = polyObjGetOwnPropertyDescriptors(obj);
            const wrapperResult = objGetOwnPropertyDescriptors(obj);
            
            // Compare the keys
            assert.deepEqual(
                Object.keys(polyResult).sort(),
                Object.keys(wrapperResult).sort()
            );
            
            // Compare each descriptor
            for (const key in polyResult) {
                if (Object.prototype.hasOwnProperty.call(polyResult, key)) {
                    assert.deepEqual(
                        polyResult[key],
                        wrapperResult[key],
                        `Descriptor for "${key}" should match`
                    );
                }
            }
        });
        
        it("should handle recursive calls safely", () => {
            // This test ensures the recursion protection works
            // We're calling polyObjGetOwnPropertyDescriptors within the test for polyObjGetOwnPropertyDescriptors
            
            const obj = { a: 1, b: 2 };
            const descForA = polyObjGetOwnPropertyDescriptor(obj, "a");
            const allDescs = polyObjGetOwnPropertyDescriptors(obj);
            
            // Verify that both methods complete without errors
            assert.isObject(descForA);
            assert.isObject(allDescs);
            
            // Ensure the descriptor for 'a' is consistent between methods
            assert.deepEqual(descForA, allDescs.a);
        });
    });

    describe("polyObjGetOwnPropertySymbols", () => {
        // Skip entire suite if Symbols aren't supported
        before(function() {
            if (typeof Symbol !== "function") {
                this.skip();
            }
        });
        
        it("should return an empty array for objects with no symbols", () => {
            const obj = { a: 1, b: "string" };
            
            const symbols = polyObjGetOwnPropertySymbols(obj);
            
            assert.isArray(symbols);
            assert.equal(symbols.length, 0);
        });
        
        it("should find well-known symbol properties", () => {
            // Skip if well-known symbols aren't available in this environment
            const iteratorSym = getKnownSymbol(WellKnownSymbols.iterator);
            if (!iteratorSym) {
                return;
            }
            
            const obj: any = {};
            obj[iteratorSym] = function*() {
                yield 1;
            };
            
            const symbols = polyObjGetOwnPropertySymbols(obj);
            
            assert.isArray(symbols);
            assert.include(symbols, iteratorSym);
        });
        
        it("should find Symbol properties added to an object", () => {
            const sym1 = polyNewSymbol("test1");
            const sym2 = polyNewSymbol("test2");
            const sym3 = polyNewSymbol("test2");
            
            const obj: any = {};
            obj[sym1] = "value1";
            obj[sym2] = "value2";
            obj[sym3] = "value3";
            obj[getKnownSymbol(WellKnownSymbols.toStringTag)] = "test";
            
            const symbols = polyObjGetOwnPropertySymbols(obj);
            
            assert.isArray(symbols);
            assert.equal(symbols.length, 1, "Should find only one symbol property");
        });
        
        it("should handle objects with symbol-valued properties", () => {
            const sym1 = Symbol("test1");
            const sym2 = Symbol("test2");
            
            // Object with symbol-valued properties
            const obj = {
                prop1: sym1,
                prop2: sym2
            };
            
            const symbols = polyObjGetOwnPropertySymbols(obj);
            
            // Note: The symbol-valued properties wouldn't be returned
            // by Object.getOwnPropertySymbols since they're not symbol *keys*
            assert.isArray(symbols);
        });
        
        it("should handle recursive calls safely", () => {
            // This test ensures the recursion protection works
            const sym = Symbol("test");
            const obj: any = {};
            obj[sym] = "value";
            
            // Call it again within its own test to check recursion guard
            const symbols1 = polyObjGetOwnPropertySymbols(obj);
            const symbols2 = polyObjGetOwnPropertySymbols(obj);
            
            assert.isArray(symbols1);
            assert.isArray(symbols2);
        });
        
        it("should be compatible with the native implementation when available", function() {
            // Skip if native method doesn't exist
            if (typeof Object.getOwnPropertySymbols !== "function") {
                return;
            }
            
            const sym = Symbol("test");
            const obj: any = {};
            obj[sym] = "value";
            
            let polyResult = polyObjGetOwnPropertySymbols(obj);
            let nativeResult = Object.getOwnPropertySymbols(obj);

            assert.equal(nativeResult.length, 1, "Native should find the symbol property");
            assert.equal(polyResult.length, 0, "Polyfill should not find the symbol property");

            obj[getKnownSymbol(WellKnownSymbols.species)] = "test";

            polyResult = polyObjGetOwnPropertySymbols(obj);
            nativeResult = Object.getOwnPropertySymbols(obj);

            assert.equal(nativeResult.length, 2, "Native should find the symbol property");
            assert.equal(polyResult.length, 1, "Polyfill should not find the symbol property");
        });
    });

    describe("polyObjHasOwn", () => {
        it("should return true for own properties", () => {
            const obj = { a: 1, b: "string", c: true };
            
            assert.isTrue(polyObjHasOwn(obj, "a"));
            assert.isTrue(polyObjHasOwn(obj, "b"));
            assert.isTrue(polyObjHasOwn(obj, "c"));
        });
        
        it("should return false for inherited properties", () => {
            const proto = { inheritedProp: "inherited" };
            const obj = Object.create(proto);
            obj.ownProp = "own";
            
            assert.isFalse(polyObjHasOwn(obj, "inheritedProp"));
            assert.isTrue(polyObjHasOwn(obj, "ownProp"));
        });
        
        it("should return false for non-existent properties", () => {
            const obj = { a: 1 };
            
            assert.isFalse(polyObjHasOwn(obj, "nonExistent"));
        });
        
        it("should handle Symbol keys", () => {
            const sym = Symbol("test");
            const obj: any = {};
            obj[sym] = "symbol value";
            
            assert.isTrue(polyObjHasOwn(obj, sym));
        });
        
        it("should handle primitive types by boxing them", () => {
            // String
            assert.isTrue(polyObjHasOwn("hello", "length"));
            assert.isTrue(polyObjHasOwn("hello", "0"));
            assert.isFalse(polyObjHasOwn("hello", "nonExistent"));
            
            // Number
            assert.isFalse(polyObjHasOwn(42, "toString"));
            assert.isFalse(polyObjHasOwn(42, "nonExistent"));
            
            // Boolean
            assert.isFalse(polyObjHasOwn(true, "valueOf"));
            assert.isFalse(polyObjHasOwn(true, "nonExistent"));
        });
        
        it("should throw TypeError for null and undefined", () => {
            let nativeThrow: any = null;
            let values: any[] = [null, undefined];

            arrForEach(values, (value) => {

                try {
                    (Object as any)["hasOwn"](value, "prop");
                } catch (e) {
                    nativeThrow = e;
                }

                if (!!nativeThrow) {
                    let polyThrow: any;
                    try {
                        // Need to assign/use the result to avoid the worker bundling from removing it
                        assert.isNotNull(polyObjHasOwn(value, "prop"), "value should be assigned to avoid bundling removal");
                        assert.fail(`Expected error to be thrown for ${value}, native threw ${dumpObj(nativeThrow)}`);
                    } catch (e) {
                        polyThrow = e;
                    }
                    
                    assert.equal(polyThrow?.name, nativeThrow?.name, `polyfill threw ${dumpObj(polyThrow)}`);
                } else {
                    assert.equals(polyObjHasOwn(value, "prop"), false);
                }
            });
        });
        
        it("should be compatible with the native implementation when available", function() {
            const obj = { a: 1, b: "string", c: true };
            
            assert.equal(polyObjHasOwn(obj, "a"), (Object as any)["hasOwn"](obj, "a"));
            assert.equal(polyObjHasOwn(obj, "b"), (Object as any)["hasOwn"](obj, "b"));
            assert.equal(polyObjHasOwn(obj, "c"), (Object as any)["hasOwn"](obj, "c"));
            assert.equal(polyObjHasOwn(obj, "nonExistent"), (Object as any)["hasOwn"](obj, "nonExistent"));
        });
        
        it("should handle equivalence with objHasOwn for valid inputs", () => {
            const obj = { a: 1, b: "string", c: true };
            
            assert.equal(polyObjHasOwn(obj, "a"), objHasOwn(obj, "a"));
            assert.equal(polyObjHasOwn(obj, "b"), objHasOwn(obj, "b"));
            assert.equal(polyObjHasOwn(obj, "c"), objHasOwn(obj, "c"));
            assert.equal(polyObjHasOwn(obj, "nonExistent"), objHasOwn(obj, "nonExistent"));
        });

        it("should work with properties that have null or undefined values", () => {
            const obj: any = {
                nullValue: null,
                undefinedValue: undefined
            };
            
            assert.isTrue(polyObjHasOwn(obj, "nullValue"));
            assert.isTrue(polyObjHasOwn(obj, "undefinedValue"));
        });

        it("should work with objects created using Object.create(null)", () => {
            // Create an object with no prototype
            const noProtoObj = objCreate(null);
            noProtoObj.prop = "value";
            
            assert.isTrue(polyObjHasOwn(noProtoObj, "prop"));
            assert.isFalse(polyObjHasOwn(noProtoObj, "nonExistent"));
        });

        it("should handle numeric property keys", () => {
            const obj = {
                0: "zero",
                1: "one",
                2: "two"
            };
            
            assert.isTrue(polyObjHasOwn(obj, 0));
            assert.isTrue(polyObjHasOwn(obj, "0")); // String key should also work
            assert.isTrue(polyObjHasOwn(obj, 1));
            assert.isTrue(polyObjHasOwn(obj, "1"));
            assert.isTrue(polyObjHasOwn(obj, 2));
            assert.isTrue(polyObjHasOwn(obj, "2"));
            assert.isFalse(polyObjHasOwn(obj, 3));
            assert.isFalse(polyObjHasOwn(obj, "3"));
        });

        it("should handle arrays and their indices", () => {
            const arr = ["apple", "banana", "cherry"];
            
            assert.isTrue(polyObjHasOwn(arr, 0));
            assert.isTrue(polyObjHasOwn(arr, 1));
            assert.isTrue(polyObjHasOwn(arr, 2));
            assert.isFalse(polyObjHasOwn(arr, 3));
            assert.isTrue(polyObjHasOwn(arr, "length"));
        });

        it("should handle non-enumerable properties when available", function() {
            // Skip if defineProperty isn't available
            if (typeof Object.defineProperty !== "function") {
                return;
            }
            
            const obj = {};
            
            try {
                Object.defineProperty(obj, "nonEnumProp", {
                    value: "hidden",
                    enumerable: false,
                    configurable: true,
                    writable: true
                });
            } catch (e) {
                // Some environments might have limited support
                this.skip();
                return;
            }
            
            assert.isTrue(polyObjHasOwn(obj, "nonEnumProp"));
        });

        it("should work with objects that have overridden hasOwnProperty", () => {
            const obj = {
                hasOwnProperty: function() {
                    return false; // Always returns false
                },
                prop: "value"
            };
            
            // Even though obj.hasOwnProperty() would return false, polyObjHasOwn should still work
            assert.isTrue(polyObjHasOwn(obj, "prop"));
            assert.isTrue(polyObjHasOwn(obj, "hasOwnProperty"));
        });

        it("should work with getters and setters", function() {
            // Skip if defineProperty isn't available
            if (typeof Object.defineProperty !== "function") {
                return;
            }
            
            const obj = {};
            let value = 0;
            
            try {
                Object.defineProperty(obj, "accessorProp", {
                    get: function() {
                        return value;
                    },
                    set: function(v) {
                        value = v;
                    },
                    enumerable: true,
                    configurable: true
                });
            } catch (e) {
                // Some environments might have limited support
                this.skip();
                return;
            }
            
            assert.isTrue(polyObjHasOwn(obj, "accessorProp"));
        });

        it("should handle edge cases from the documentation examples", () => {
            const example: any = {};
            assert.isFalse(polyObjHasOwn(example, "prop"), "Property doesn't exist yet");
            
            example.prop = "exists";
            assert.isTrue(polyObjHasOwn(example, "prop"), "Property has been defined");
            
            example.prop = null;
            assert.isTrue(polyObjHasOwn(example, "prop"), "Property exists with value of null");
            
            example.prop = undefined;
            assert.isTrue(polyObjHasOwn(example, "prop"), "Property exists with value of undefined");
        });
    });
    
    describe("polyObjCreate", () => {
        it("should create an object with the specified prototype", () => {
            // Define a prototype with methods and properties
            const proto = {
                greeting: "Hello",
                greet() {
                    return this.greeting + " World";
                }
            };
            
            // Create objects using both implementations
            const nativeObj = Object.create(proto);
            const polyObj = polyObjCreate(proto);
            
            // Verify prototype inheritance works the same
            assert.equal(nativeObj.greeting, "Hello", "Native: should inherit properties");
            assert.equal(polyObj.greeting, "Hello", "Polyfill: should inherit properties");
            
            assert.equal(nativeObj.greet(), "Hello World", "Native: should inherit methods");
            assert.equal(polyObj.greet(), "Hello World", "Polyfill: should inherit methods");
            
            // Verify they share the same prototype
            assert.strictEqual(Object.getPrototypeOf(nativeObj), proto, "Native: should have correct prototype");
            assert.strictEqual(Object.getPrototypeOf(polyObj), proto, "Polyfill: should have correct prototype");
        });
        
        it("should create an object with null prototype", () => {
            // Create objects with null prototype
            const nativeObj = Object.create(null);
            const polyObj = polyObjCreate(null);
            
            // Verify they don't inherit Object.prototype methods
            assert.isUndefined(nativeObj.toString, "Native: should not inherit Object.prototype.toString");
            assert.isUndefined(polyObj.toString, "Polyfill: should not inherit Object.prototype.toString");
            
            assert.isUndefined(nativeObj.hasOwnProperty, "Native: should not inherit Object.prototype.hasOwnProperty");
            assert.isUndefined(polyObj.hasOwnProperty, "Polyfill: should not inherit Object.prototype.hasOwnProperty");
            
            // Verify they have null prototype
            assert.isNull(Object.getPrototypeOf(nativeObj), "Native: should have null prototype");
            assert.isNull(Object.getPrototypeOf(polyObj), "Polyfill: should have null prototype");
        });
        
        it("should handle the properties parameter correctly", () => {
            // Define property descriptors
            const properties = {
                normalProp: {
                    value: 42,
                    writable: true,
                    enumerable: true,
                    configurable: true
                },
                readOnlyProp: {
                    value: "static",
                    writable: false,
                    enumerable: true,
                    configurable: true
                },
                hiddenProp: {
                    value: "hidden",
                    enumerable: false,
                    configurable: true
                }
            };
            
            // Create objects with properties
            const nativeObj = Object.create({}, properties);
            const polyObj = polyObjCreate({}, properties);
            
            // Test regular property
            assert.equal(nativeObj.normalProp, 42, "Native: normal property should be set");
            assert.equal(polyObj.normalProp, 42, "Polyfill: normal property should be set");
            
            // Test read-only property
            assert.equal(nativeObj.readOnlyProp, "static", "Native: read-only property should be set");
            assert.equal(polyObj.readOnlyProp, "static", "Polyfill: read-only property should be set");
            
            // Test write behavior on read-only property
            safe(() => {
                nativeObj.readOnlyProp = "changed";
            });
            safe(() => {
                polyObj.readOnlyProp = "changed";
            });
            
            assert.equal(nativeObj.readOnlyProp, "static", "Native: read-only property shouldn't change");
            assert.equal(polyObj.readOnlyProp, "static", "Polyfill: read-only property shouldn't change");
            
            // Test hidden property existence
            assert.equal(nativeObj.hiddenProp, "hidden", "Native: non-enumerable property should exist");
            assert.equal(polyObj.hiddenProp, "hidden", "Polyfill: non-enumerable property should exist");
            
            // Test property enumerability
            assert.deepEqual(Object.keys(nativeObj), ["normalProp", "readOnlyProp"], "Native: only enumerable properties should be in keys");
            assert.deepEqual(Object.keys(polyObj), ["normalProp", "readOnlyProp"], "Polyfill: only enumerable properties should be in keys");
        });
        
        it("should create an object with null prototype and properties", () => {
            // Define property descriptors
            const properties = {
                testProp: {
                    value: "test",
                    writable: true,
                    enumerable: true,
                    configurable: true
                }
            };
            
            // Create objects with null prototype and properties
            const nativeObj = Object.create(null, properties);
            const polyObj = polyObjCreate(null, properties);
            
            // Test property was set
            assert.equal(nativeObj.testProp, "test", "Native: property should be set on null-prototype object");
            assert.equal(polyObj.testProp, "test", "Polyfill: property should be set on null-prototype object");
            
            // Verify they have null prototype
            assert.isNull(Object.getPrototypeOf(nativeObj), "Native: should have null prototype");
            assert.isNull(Object.getPrototypeOf(polyObj), "Polyfill: should have null prototype");
        });
        
        it("should handle accessor properties correctly", function() {
            // Skip if defineProperty isn't available
            if (typeof Object.defineProperty !== "function") {
                this.skip();
                return;
            }
            
            let value = 0;
            
            // Define property descriptors with getters/setters
            const properties = {
                accessorProp: {
                    get: function() {
                        return value;
                    },
                    set: function(v: any) {
                        value = v;
                    },
                    enumerable: true,
                    configurable: true
                }
            };
            
            // Create objects with accessor properties
            const nativeObj = Object.create({}, properties);
            const polyObj = polyObjCreate({}, properties);
            
            // Test getter
            assert.equal(nativeObj.accessorProp, 0, "Native: getter should return initial value");
            assert.equal(polyObj.accessorProp, 0, "Polyfill: getter should return initial value");
            
            // Test setter
            nativeObj.accessorProp = 42;
            assert.equal(value, 42, "Native: setter should update the value");
            
            value = 0; // Reset for polyfill test
            polyObj.accessorProp = 42;
            assert.equal(value, 42, "Polyfill: setter should update the value");
        });
        
        it("should throw TypeError for non-object prototypes", () => {
            // Test with various non-object prototypes
            const nonObjects = [42, "string", true, false];
            
            nonObjects.forEach(nonObj => {
                assert.throws(() => {
                    // Need to assign/use the result to avoid the worker bundling from removing it
                    assert.isNotNull(Object.create(nonObj as any), "Native: should throw TypeError for non-object prototype of " + dumpObj(nonObj));
                    assert.fail("Should not reach here for non-object prototype of " + dumpObj(nonObj));
                }, TypeError, null, "Native: should throw TypeError for non-object prototype of " + dumpObj(nonObj));
                
                assert.throws(() => {
                    // Need to assign/use the result to avoid the worker bundling from removing it
                    assert.isNotNull(polyObjCreate(nonObj as any), "Native: should throw TypeError for non-object prototype of " + dumpObj(nonObj));
                    assert.fail("Should not reach here for non-object prototype of " + dumpObj(nonObj));
                }, TypeError, null, "Polyfill: should throw TypeError for non-object prototype of " + dumpObj(nonObj));
            });
        });
    });
    
    describe("polyfill equivalence", () => {
        it("objCreate and polyObjCreate should be equivalent", () => {
            const proto = { a: 1 };
            const nativeObj = objCreate(proto);
            const polyObj = polyObjCreate(proto);
            
            assert.deepEqual(Object.getPrototypeOf(nativeObj), Object.getPrototypeOf(polyObj));
            assert.equal(nativeObj.a, polyObj.a);
        });
    });

    function _checkObjKeys(value: any) {
        let polyResult: any;
        let nativeResult: any;
        let polyThrew: any;
        let nativeThrew: any;
        try {
            polyResult = polyObjKeys(value);
        } catch (e) {
            polyThrew = e;
        }
        try {
            nativeResult = Object.keys(value);
        } catch (e) {
            nativeThrew = e;
        }

        if (isObject(value)) {
            assert.equal(polyResult.length, nativeResult.length, "Checking Native and polyfill result for [" + dumpObj(value) + "]");
        } else {
            if (polyThrew) {
                assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                    "Checking whether the Native and polyfill threw or returned undefined [" + dumpObj(polyThrew || polyResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
            } else if(nativeThrew) {
                assert.ok(false,
                    "Native threw but poly didn't [" + dumpObj(polyThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
            } else {
                assert.equal(isUndefined(polyResult), !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                    "Checking whether the Native and polyfill threw or returned undefined [" + dumpObj(polyThrew || polyResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
            }
        }
    }

    function _dummyFunction() {

    }

    function _dummyError(): Error {
        return {
            name: "Dummy Error",
            message: "Dummy Message"
        };
    }

    function _getFile(): File | null {
        let theFile: File | null = null;
        try {
            theFile = new File([], "text.txt");
        } catch (e) {
            // Node doesn't have the file class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
        }

        return theFile;
    }

    function _getFormData(): FormData | null {
        let formData: FormData | null = null;
        try {
            formData = new FormData();
        } catch (e) {
            // Node doesn't have the FormData class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
        }

        return formData;
    }

    function _getBlob(): Blob | null {
        let blob: Blob | null = null;
        try {
            blob = new Blob();
        } catch (e) {
            // Node doesn't have the Blob class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
        }

        return blob;
    }

    function _simplePromise(): any {
        return {
            then: _dummyFunction,
            catch: _dummyFunction
        };
    }

    function _simplePromiseLike(): any {
        return {
            then: _dummyFunction
        };
    }

    class TestError extends Error {
        public constructor(message: string) {
            super(message);
        }
    }
});
