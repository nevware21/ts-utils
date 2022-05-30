import * as assert from "assert";

import { isDefined, isFunction, isNullOrUndefined, isString, isTypeof, isUndefined } from "../../../src/helpers/base";

describe("base helpers", () => {
    describe("isTypeOf", () => {
        it("Validate values of type null", () => {
            assert.equal(isTypeof(null, null), false, "Checking typeof null");
            assert.equal(isTypeof(undefined, null), false, "Checking typeof undefined");
            assert.equal(isTypeof("null", null), false, "Checking typeof 'null'");
            assert.equal(isTypeof("undefined", null), false, "Checking typeof 'undefined'");
            assert.equal(isTypeof("1", null), false, "Checking typeof '1'");
            assert.equal(isTypeof("aa", null), false, "Checking typeof 'aa'");
            assert.equal(isTypeof(new Date(), null), false, "Checking typeof Date");
            assert.equal(isTypeof(1, null), false, "Checking typeof 1");
            assert.equal(isTypeof("", null), false, "Checking typeof ''");
            assert.equal(isTypeof(_dummyFunction, null), false, "Checking typeof _dummyFunction");
        });

        it("Validate values of type undefined", () => {
            assert.equal(isTypeof(null, undefined), false, "Checking typeof null");
            assert.equal(isTypeof(undefined, undefined), false, "Checking typeof undefined");
            assert.equal(isTypeof("null", undefined), false, "Checking typeof 'null'");
            assert.equal(isTypeof("undefined", undefined), false, "Checking typeof 'undefined'");
            assert.equal(isTypeof("1", null), false, "Checking typeof '1'");
            assert.equal(isTypeof("aa", null), false, "Checking typeof 'aa'");
            assert.equal(isTypeof(new Date(), undefined), false, "Checking typeof Date");
            assert.equal(isTypeof(1, undefined), false, "Checking typeof 1");
            assert.equal(isTypeof("", undefined), false, "Checking typeof ''");
            assert.equal(isTypeof(_dummyFunction, undefined), false, "Checking typeof _dummyFunction");
        });
    });

    describe("isUndefined", () => {
        it("Validate values", () => {
            assert.equal(isUndefined(null), false, "Checking typeof null");
            assert.equal(isUndefined(undefined), true, "Checking typeof undefined");
            assert.equal(isUndefined("null"), false, "Checking typeof 'null'");
            assert.equal(isUndefined("undefined"), true, "Checking typeof 'undefined'");
            assert.equal(isUndefined("1"), false, "Checking typeof '1'");
            assert.equal(isUndefined("aa"), false, "Checking typeof 'aa'");
            assert.equal(isUndefined(new Date()), false, "Checking typeof Date");
            assert.equal(isUndefined(1), false, "Checking typeof 1");
            assert.equal(isUndefined(""), false, "Checking typeof ''");
            assert.equal(isUndefined(_dummyFunction), false, "Checking typeof _dummyFunction");
        });
    });

    describe("isNullOrUndefined", () => {
        it("Validate values", () => {
            assert.equal(isNullOrUndefined(null), true, "Checking typeof null");
            assert.equal(isNullOrUndefined(undefined), true, "Checking typeof undefined");
            assert.equal(isNullOrUndefined("null"), false, "Checking typeof 'null'");
            assert.equal(isNullOrUndefined("undefined"), true, "Checking typeof 'undefined'");
            assert.equal(isNullOrUndefined("1"), false, "Checking typeof '1'");
            assert.equal(isNullOrUndefined("aa"), false, "Checking typeof 'aa'");
            assert.equal(isNullOrUndefined(new Date()), false, "Checking typeof Date");
            assert.equal(isNullOrUndefined(1), false, "Checking typeof 1");
            assert.equal(isNullOrUndefined(""), false, "Checking typeof ''");
            assert.equal(isNullOrUndefined(_dummyFunction), false, "Checking typeof _dummyFunction");
        });
    });

    describe("isDefined: (is not undefined)", () => {
        it("Validate values", () => {
            assert.equal(isDefined(null), true, "Checking typeof null");
            assert.equal(isDefined(undefined), false, "Checking typeof undefined");
            assert.equal(isDefined("null"), true, "Checking typeof 'null'");
            assert.equal(isDefined("undefined"), true, "Checking typeof 'undefined'");
            assert.equal(isDefined("1"), true, "Checking typeof '1'");
            assert.equal(isDefined("aa"), true, "Checking typeof 'aa'");
            assert.equal(isDefined(new Date()), true, "Checking typeof Date");
            assert.equal(isDefined(1), true, "Checking typeof 1");
            assert.equal(isDefined(""), true, "Checking typeof ''");
            assert.equal(isDefined(_dummyFunction), true, "Checking typeof _dummyFunction");
        });
    });

    describe("isString", () => {
        it("Validate values", () => {
            assert.equal(isString(null), false, "Checking typeof null");
            assert.equal(isString(undefined), false, "Checking typeof undefined");
            assert.equal(isString("null"), true, "Checking typeof 'null'");
            assert.equal(isString("undefined"), true, "Checking typeof 'undefined'");
            assert.equal(isString("1"), true, "Checking typeof '1'");
            assert.equal(isString("aa"), true, "Checking typeof 'aa'");
            assert.equal(isString(new Date()), false, "Checking typeof Date");
            assert.equal(isString(1), false, "Checking typeof 1");
            assert.equal(isString(""), true, "Checking typeof ''");
            assert.equal(isString(_dummyFunction), false, "Checking typeof _dummyFunction");
        });
    });

    describe("isFunction", () => {
        it("Validate values", () => {
            assert.equal(isFunction(null), false, "Checking typeof null");
            assert.equal(isFunction(undefined), false, "Checking typeof undefined");
            assert.equal(isFunction("null"), false, "Checking typeof 'null'");
            assert.equal(isFunction("undefined"), false, "Checking typeof 'undefined'");
            assert.equal(isFunction("1"), false, "Checking typeof '1'");
            assert.equal(isFunction("aa"), false, "Checking typeof 'aa'");
            assert.equal(isFunction(new Date()), false, "Checking typeof Date");
            assert.equal(isFunction(1), false, "Checking typeof 1");
            assert.equal(isFunction(""), false, "Checking typeof ''");
            assert.equal(isFunction(_dummyFunction), true, "Checking typeof _dummyFunction");
        });
    });

    function _dummyFunction() {

    }
});