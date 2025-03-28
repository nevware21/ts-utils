/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { polyObjEntries, polyObjIs, polyObjKeys, polyObjValues } from "../../../../src/polyfills/object";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isObject, isUndefined } from "../../../../src/helpers/base";

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

    // Add this after the polyObjValues test section and before the _checkObjKeys function

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

    function _getFile(): File {
        let theFile: File = null;
        try {
            theFile = new File([], "text.txt");
        } catch (e) {
            // Node doesn't have the file class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
        }

        return theFile;
    }

    function _getFormData(): FormData {
        let formData: FormData = null;
        try {
            formData = new FormData();
        } catch (e) {
            // Node doesn't have the FormData class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
        }

        return formData;
    }

    function _getBlob(): Blob {
        let blob: Blob = null;
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
