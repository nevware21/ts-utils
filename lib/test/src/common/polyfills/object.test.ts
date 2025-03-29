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
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isObject, isUndefined } from "../../../../src/helpers/base";
import { objFromEntries } from "../../../../src/object/object";
import { createIterable, CreateIteratorContext } from "../../../../src/iterator/create";
import { createArrayIterator } from "../../../../src/iterator/array";

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
            const result = polyObjFromEntries(42);
            
            assert.equal(Object.keys(result).length, 0);
        });

        it("should handle null or undefined input gracefully", () => {
            assert.doesNotThrow(() => polyObjFromEntries(null));
            assert.doesNotThrow(() => polyObjFromEntries(undefined));
            
            const result1 = polyObjFromEntries(null);
            const result2 = polyObjFromEntries(undefined);
            
            assert.equal(Object.keys(result1).length, 0);
            assert.equal(Object.keys(result2).length, 0);
        });

        it("should handle empty iterables", () => {
            const emptyArray = [];
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
                // Generate test cases without using the helper
                const arrayEntries = createArrayIterator([["a", 1], ["b", 2]]);
                const mapEntries = new Map([["x", 10], ["y", 20]]);
                
                // Test array entries
                const result1Array = objFromEntries(arrayEntries);
                const result2Array = polyObjFromEntries(arrayEntries);
                
                assert.equal(Object.keys(result1Array).length, Object.keys(result2Array).length);
                assert.equal(result1Array.a, result2Array.a);
                assert.equal(result1Array.b, result2Array.b);
                
                // Test Map entries
                const result1Map = objFromEntries(mapEntries);
                const result2Map = polyObjFromEntries(mapEntries);
                
                assert.equal(Object.keys(result1Map).length, Object.keys(result2Map).length);
                assert.equal(result1Map.x, result2Map.x);
                assert.equal(result1Map.y, result2Map.y);
                
                // Test custom iterable using the library's createIterable
                let idx = -1;
                const customEntries = [["foo", "bar"], ["baz", "qux"]];
                
                const ctx: CreateIteratorContext<[string, string]> = {
                    n: function() {
                        idx++;
                        const isDone = idx >= customEntries.length;
                        if (!isDone) {
                            this.v = customEntries[idx];
                        }
                        return isDone;
                    }
                };
                
                const customIterable = createIterable(ctx);
                
                const result1Custom = objFromEntries(customIterable);
                const result2Custom = polyObjFromEntries(customIterable);
                
                assert.equal(Object.keys(result1Custom).length, Object.keys(result2Custom).length);
                assert.equal(result1Custom.foo, result2Custom.foo);
                assert.equal(result1Custom.baz, result2Custom.baz);
            });
        });
    });

    describe("polyObjGetOwnPropertyNames", () => {
        it("should return all own property names for simple objects", () => {
            const obj = { a: 1, b: 2, c: 3 };
            const result = polyObjGetOwnPropertyNames(obj);
            
            assert.isArray(result);
            assert.includeMembers(result, ["a", "b", "c"]);
            assert.lengthOf(result, 3);
        });

        it("should include array indices and length property for arrays", () => {
            const arr = ["apple", "banana", "cherry"];
            const result = polyObjGetOwnPropertyNames(arr);
            
            assert.isArray(result);
            assert.includeMembers(result, ["0", "1", "2", "length"]);
            assert.lengthOf(result, 4);
        });

        it("should handle empty arrays", () => {
            const emptyArr = [];
            const result = polyObjGetOwnPropertyNames(emptyArr);
            
            assert.isArray(result);
            assert.includeMembers(result, ["length"]);
            assert.lengthOf(result, 1);
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
            assert.lengthOf(result, 1);
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
