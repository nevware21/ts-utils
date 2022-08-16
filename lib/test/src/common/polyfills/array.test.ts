/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { polyIsArray } from "../../../../src/polyfills/array";
import { dumpObj } from "../../../../src/helpers/diagnostics";

describe("array polyfills", () => {
    it("polyIsArray", () => {
        _checkIsArray(null);
        _checkIsArray(undefined);
        _checkIsArray("null");
        _checkIsArray("undefined");
        _checkIsArray("1");
        _checkIsArray("aa");
        _checkIsArray(new Date());
        _checkIsArray(1);
        _checkIsArray("");
        _checkIsArray(_dummyFunction);
        _checkIsArray([]);
        _checkIsArray(new Array(1));
        _checkIsArray(true);
        _checkIsArray(false);
        _checkIsArray("true");
        _checkIsArray("false");
        _checkIsArray(new Boolean(true));
        _checkIsArray(new Boolean(false));
        _checkIsArray(new Boolean("true"));
        _checkIsArray(new Boolean("false"));
        _checkIsArray(/[a-z]/g);
        _checkIsArray(new RegExp(""));
        _checkIsArray(_getFile());
        _checkIsArray(_getFormData());
        _checkIsArray(_getBlob());
        _checkIsArray(new ArrayBuffer(0));
        _checkIsArray(new Error("Test Error"));
        _checkIsArray(new TypeError("Test TypeError"));
        _checkIsArray(new TestError("Test TestError"));
        _checkIsArray(_dummyError());
        _checkIsArray(Promise.reject());
        _checkIsArray(Promise.resolve());
        _checkIsArray(new Promise(() => {}));
        _checkIsArray(_simplePromise());
        _checkIsArray(_simplePromiseLike());
    });

    function _checkIsArray(value: any) {
        let polyResult = polyIsArray(value);
        let nativeResult = Array.isArray(value);

        assert.equal(polyResult, nativeResult, "Checking Native and polyfill result for [" + dumpObj(value) + "]");
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
