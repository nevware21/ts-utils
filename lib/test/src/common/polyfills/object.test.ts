/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { polyObjEntries, polyObjKeys, polyObjValues } from "../../../../src/polyfills/object";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isObject, isUndefined } from "../../../../src/helpers/base";

describe("object polyfills", () => {
    it("ployObjKeys", () => {
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
