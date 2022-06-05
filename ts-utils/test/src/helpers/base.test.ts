import * as assert from "assert";
import { isArray, isBoolean, isDate, isDefined, isFunction, isNullOrUndefined, isNumber, isObject, isString, isTypeof, isUndefined, isRegExp, objToString, isFile, isFormData, isBlob } from "../../../src/helpers/base";
import { dumpObj } from "../../../src/helpers/disgnostics";
import { isNode } from "../../../src/helpers/environment";

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
            assert.equal(isTypeof([], null), false, "Checking typeof []");
            assert.equal(isTypeof(new Array(1), null), false, "Checking typeof new Array(1)");
            assert.equal(isTypeof(true, null), false, "Checking typeof true");
            assert.equal(isTypeof(false, null), false, "Checking typeof false");
            assert.equal(isTypeof("true", null), false, "Checking typeof 'true'");
            assert.equal(isTypeof("false", null), false, "Checking typeof 'false'");
            assert.equal(isTypeof(new Boolean(true), null), false, "Checking typeof new Boolean(true)");
            assert.equal(isTypeof(new Boolean(false), null), false, "Checking typeof new Boolean(false)");
            assert.equal(isTypeof(new Boolean("true"), null), false, "Checking typeof new Boolean('true')");
            assert.equal(isTypeof(new Boolean("false"), null), false, "Checking typeof new Boolean('false')");
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
            assert.equal(isTypeof([], undefined), false, "Checking typeof []");
            assert.equal(isTypeof(new Array(1), undefined), false, "Checking typeof new Array(1)");
            assert.equal(isTypeof(true, undefined), false, "Checking typeof true");
            assert.equal(isTypeof(false, undefined), false, "Checking typeof false");
            assert.equal(isTypeof("true", undefined), false, "Checking typeof 'true'");
            assert.equal(isTypeof("false", undefined), false, "Checking typeof 'false'");
            assert.equal(isTypeof(new Boolean(true), undefined), false, "Checking typeof new Boolean(true)");
            assert.equal(isTypeof(new Boolean(false), undefined), false, "Checking typeof new Boolean(false)");
            assert.equal(isTypeof(new Boolean("true"), undefined), false, "Checking typeof new Boolean('true')");
            assert.equal(isTypeof(new Boolean("false"), undefined), false, "Checking typeof new Boolean('false')");
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
            assert.equal(isUndefined([]), false, "Checking typeof []");
            assert.equal(isUndefined(new Array(1)), false, "Checking typeof new Array(1)");
            assert.equal(isUndefined(true), false, "Checking typeof true");
            assert.equal(isUndefined(false), false, "Checking typeof false");
            assert.equal(isUndefined("true"), false, "Checking typeof 'true'");
            assert.equal(isUndefined("false"), false, "Checking typeof 'false'");
            assert.equal(isUndefined(new Boolean(true)), false, "Checking typeof new Boolean(true)");
            assert.equal(isUndefined(new Boolean(false)), false, "Checking typeof new Boolean(false)");
            assert.equal(isUndefined(new Boolean("true")), false, "Checking typeof new Boolean('true')");
            assert.equal(isUndefined(new Boolean("false")), false, "Checking typeof new Boolean('false')");
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
            assert.equal(isNullOrUndefined([]), false, "Checking typeof []");
            assert.equal(isNullOrUndefined(new Array(1)), false, "Checking typeof new Array(1)");
            assert.equal(isNullOrUndefined(true), false, "Checking typeof true");
            assert.equal(isNullOrUndefined(false), false, "Checking typeof false");
            assert.equal(isNullOrUndefined("true"), false, "Checking typeof 'true'");
            assert.equal(isNullOrUndefined("false"), false, "Checking typeof 'false'");
            assert.equal(isNullOrUndefined(new Boolean(true)), false, "Checking typeof new Boolean(true)");
            assert.equal(isNullOrUndefined(new Boolean(false)), false, "Checking typeof new Boolean(false)");
            assert.equal(isNullOrUndefined(new Boolean("true")), false, "Checking typeof new Boolean('true')");
            assert.equal(isNullOrUndefined(new Boolean("false")), false, "Checking typeof new Boolean('false')");
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
            assert.equal(isDefined([]), true, "Checking typeof []");
            assert.equal(isDefined(new Array(1)), true, "Checking typeof new Array(1)");
            assert.equal(isDefined(true), true, "Checking typeof true");
            assert.equal(isDefined(false), true, "Checking typeof false");
            assert.equal(isDefined("true"), true, "Checking typeof 'true'");
            assert.equal(isDefined("false"), true, "Checking typeof 'false'");
            assert.equal(isDefined(new Boolean(true)), true, "Checking typeof new Boolean(true)");
            assert.equal(isDefined(new Boolean(false)), true, "Checking typeof new Boolean(false)");
            assert.equal(isDefined(new Boolean("true")), true, "Checking typeof new Boolean('true')");
            assert.equal(isDefined(new Boolean("false")), true, "Checking typeof new Boolean('false')");
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
            assert.equal(isString([]), false, "Checking typeof []");
            assert.equal(isString(new Array(1)), false, "Checking typeof new Array(1)");
            assert.equal(isString(true), false, "Checking typeof true");
            assert.equal(isString(false), false, "Checking typeof false");
            assert.equal(isString("true"), true, "Checking typeof 'true'");
            assert.equal(isString("false"), true, "Checking typeof 'false'");
            assert.equal(isString(new Boolean(true)), false, "Checking typeof new Boolean(true)");
            assert.equal(isString(new Boolean(false)), false, "Checking typeof new Boolean(false)");
            assert.equal(isString(new Boolean("true")), false, "Checking typeof new Boolean('true')");
            assert.equal(isString(new Boolean("false")), false, "Checking typeof new Boolean('false')");
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
            assert.equal(isFunction([]), false, "Checking typeof []");
            assert.equal(isFunction(new Array(1)), false, "Checking typeof new Array(1)");
            assert.equal(isFunction(true), false, "Checking typeof true");
            assert.equal(isFunction(false), false, "Checking typeof false");
            assert.equal(isFunction("true"), false, "Checking typeof 'true'");
            assert.equal(isFunction("false"), false, "Checking typeof 'false'");
            assert.equal(isFunction(new Boolean(true)), false, "Checking typeof new Boolean(true)");
            assert.equal(isFunction(new Boolean(false)), false, "Checking typeof new Boolean(false)");
            assert.equal(isFunction(new Boolean("true")), false, "Checking typeof new Boolean('true')");
            assert.equal(isFunction(new Boolean("false")), false, "Checking typeof new Boolean('false')");
        });
    });

    describe("isObject", () => {
        it("Validate values", () => {
            assert.equal(isObject(null), false, "Checking typeof null");
            assert.equal(isObject(undefined), false, "Checking typeof undefined");
            assert.equal(isObject("null"), false, "Checking typeof 'null'");
            assert.equal(isObject("undefined"), false, "Checking typeof 'undefined'");
            assert.equal(isObject("1"), false, "Checking typeof '1'");
            assert.equal(isObject("aa"), false, "Checking typeof 'aa'");
            assert.equal(isObject(new Date()), true, "Checking typeof Date");
            assert.equal(isObject(1), false, "Checking typeof 1");
            assert.equal(isObject(""), false, "Checking typeof ''");
            assert.equal(isObject(_dummyFunction), false, "Checking typeof _dummyFunction");
            assert.equal(isObject([]), true, "Checking typeof []");
            assert.equal(isObject(new Array(1)), true, "Checking typeof new Array(1)");
            assert.equal(isObject(true), false, "Checking typeof true");
            assert.equal(isObject(false), false, "Checking typeof false");
            assert.equal(isObject("true"), false, "Checking typeof 'true'");
            assert.equal(isObject("false"), false, "Checking typeof 'false'");
            assert.equal(isObject(new Boolean(true)), true, "Checking typeof new Boolean(true)");
            assert.equal(isObject(new Boolean(false)), true, "Checking typeof new Boolean(false)");
            assert.equal(isObject(new Boolean("true")), true, "Checking typeof new Boolean('true')");
            assert.equal(isObject(new Boolean("false")), true, "Checking typeof new Boolean('false')");
            assert.equal(isObject(/[a-z]/g), true, "Checking typeof '/[a-z]/g'");
            assert.equal(isObject(new RegExp("")), true, "Checking typeof new RegExp('')");
            _isFileCheck(isObject, true);
            _isFormDataCheck(isObject, true);
            _isBlobCheck(isObject, true);
        });
    });

    describe("isArray", () => {
        it("Validate values", () => {
            assert.equal(isArray(null), false, "Checking typeof null");
            assert.equal(isArray(undefined), false, "Checking typeof undefined");
            assert.equal(isArray("null"), false, "Checking typeof 'null'");
            assert.equal(isArray("undefined"), false, "Checking typeof 'undefined'");
            assert.equal(isArray("1"), false, "Checking typeof '1'");
            assert.equal(isArray("aa"), false, "Checking typeof 'aa'");
            assert.equal(isArray(new Date()), false, "Checking typeof Date");
            assert.equal(isArray(1), false, "Checking typeof 1");
            assert.equal(isArray(""), false, "Checking typeof ''");
            assert.equal(isArray(_dummyFunction), false, "Checking typeof _dummyFunction");
            assert.equal(isArray([]), true, "Checking typeof []");
            assert.equal(isArray(new Array(1)), true, "Checking typeof new Array(1)");
            assert.equal(isArray(true), false, "Checking typeof true");
            assert.equal(isArray(false), false, "Checking typeof false");
            assert.equal(isArray("true"), false, "Checking typeof 'true'");
            assert.equal(isArray("false"), false, "Checking typeof 'false'");
            assert.equal(isArray(new Boolean(true)), false, "Checking typeof new Boolean(true)");
            assert.equal(isArray(new Boolean(false)), false, "Checking typeof new Boolean(false)");
            assert.equal(isArray(new Boolean("true")), false, "Checking typeof new Boolean('true')");
            assert.equal(isArray(new Boolean("false")), false, "Checking typeof new Boolean('false')");
            assert.equal(isArray(/[a-z]/g), false, "Checking typeof '/[a-z]/g'");
            assert.equal(isArray(new RegExp("")), false, "Checking typeof new RegExp('')");
            _isFileCheck(isArray, false);
            _isFormDataCheck(isArray, false);
            _isBlobCheck(isArray, false);
        });
    });

    describe("isDate", () => {
        it("Validate values", () => {
            assert.equal(isDate(null), false, "Checking typeof null");
            assert.equal(isDate(undefined), false, "Checking typeof undefined");
            assert.equal(isDate("null"), false, "Checking typeof 'null'");
            assert.equal(isDate("undefined"), false, "Checking typeof 'undefined'");
            assert.equal(isDate("1"), false, "Checking typeof '1'");
            assert.equal(isDate("aa"), false, "Checking typeof 'aa'");
            assert.equal(isDate(new Date()), true, "Checking typeof Date");
            assert.equal(isDate(1), false, "Checking typeof 1");
            assert.equal(isDate(""), false, "Checking typeof ''");
            assert.equal(isDate(_dummyFunction), false, "Checking typeof _dummyFunction");
            assert.equal(isDate([]), false, "Checking typeof []");
            assert.equal(isDate(new Array(1)), false, "Checking typeof new Array(1)");
            assert.equal(isDate(true), false, "Checking typeof true");
            assert.equal(isDate(false), false, "Checking typeof false");
            assert.equal(isDate("true"), false, "Checking typeof 'true'");
            assert.equal(isDate("false"), false, "Checking typeof 'false'");
            assert.equal(isDate(new Boolean(true)), false, "Checking typeof new Boolean(true)");
            assert.equal(isDate(new Boolean(false)), false, "Checking typeof new Boolean(false)");
            assert.equal(isDate(new Boolean("true")), false, "Checking typeof new Boolean('true')");
            assert.equal(isDate(new Boolean("false")), false, "Checking typeof new Boolean('false')");
            assert.equal(isDate(/[a-z]/g), false, "Checking typeof '/[a-z]/g'");
            assert.equal(isDate(new RegExp("")), false, "Checking typeof new RegExp('')");
            _isFileCheck(isDate, false);
            _isFormDataCheck(isDate, false);
            _isBlobCheck(isDate, false);
        });
    });

    describe("isNumber", () => {
        it("Validate values", () => {
            assert.equal(isNumber(null), false, "Checking typeof null");
            assert.equal(isNumber(undefined), false, "Checking typeof undefined");
            assert.equal(isNumber("null"), false, "Checking typeof 'null'");
            assert.equal(isNumber("undefined"), false, "Checking typeof 'undefined'");
            assert.equal(isNumber("1"), false, "Checking typeof '1'");
            assert.equal(isNumber("aa"), false, "Checking typeof 'aa'");
            assert.equal(isNumber(new Date()), false, "Checking typeof Date");
            assert.equal(isNumber(1), true, "Checking typeof 1");
            assert.equal(isNumber(""), false, "Checking typeof ''");
            assert.equal(isNumber(_dummyFunction), false, "Checking typeof _dummyFunction");
            assert.equal(isNumber([]), false, "Checking typeof []");
            assert.equal(isNumber(new Array(1)), false, "Checking typeof new Array(1)");
            assert.equal(isNumber(true), false, "Checking typeof true");
            assert.equal(isNumber(false), false, "Checking typeof false");
            assert.equal(isNumber("true"), false, "Checking typeof 'true'");
            assert.equal(isNumber("false"), false, "Checking typeof 'false'");
            assert.equal(isNumber(new Boolean(true)), false, "Checking typeof new Boolean(true)");
            assert.equal(isNumber(new Boolean(false)), false, "Checking typeof new Boolean(false)");
            assert.equal(isNumber(new Boolean("true")), false, "Checking typeof new Boolean('true')");
            assert.equal(isNumber(new Boolean("false")), false, "Checking typeof new Boolean('false')");
            assert.equal(isNumber(/[a-z]/g), false, "Checking typeof '/[a-z]/g'");
            assert.equal(isNumber(new RegExp("")), false, "Checking typeof new RegExp('')");
            _isFileCheck(isNumber, false);
            _isFormDataCheck(isNumber, false);
            _isBlobCheck(isNumber, false);
        });
    });

    describe("isBoolean", () => {
        it("Validate values", () => {
            assert.equal(isBoolean(null), false, "Checking typeof null");
            assert.equal(isBoolean(undefined), false, "Checking typeof undefined");
            assert.equal(isBoolean("null"), false, "Checking typeof 'null'");
            assert.equal(isBoolean("undefined"), false, "Checking typeof 'undefined'");
            assert.equal(isBoolean("1"), false, "Checking typeof '1'");
            assert.equal(isBoolean("aa"), false, "Checking typeof 'aa'");
            assert.equal(isBoolean(new Date()), false, "Checking typeof Date");
            assert.equal(isBoolean(1), false, "Checking typeof 1");
            assert.equal(isBoolean(""), false, "Checking typeof ''");
            assert.equal(isBoolean(_dummyFunction), false, "Checking typeof _dummyFunction");
            assert.equal(isBoolean([]), false, "Checking typeof []");
            assert.equal(isBoolean(new Array(1)), false, "Checking typeof new Array(1)");
            assert.equal(isBoolean(true), true, "Checking typeof true");
            assert.equal(isBoolean(false), true, "Checking typeof false");
            assert.equal(isBoolean("true"), false, "Checking typeof 'true'");
            assert.equal(isBoolean("false"), false, "Checking typeof 'false'");
            assert.equal(isBoolean(new Boolean(true)), false, "Checking typeof new Boolean(true)");
            assert.equal(isBoolean(new Boolean(false)), false, "Checking typeof new Boolean(false)");
            assert.equal(isBoolean(new Boolean("true")), false, "Checking typeof new Boolean('true')");
            assert.equal(isBoolean(new Boolean("false")), false, "Checking typeof new Boolean('false')");
            assert.equal(isBoolean(/[a-z]/g), false, "Checking typeof '/[a-z]/g'");
            assert.equal(isBoolean(new RegExp("")), false, "Checking typeof new RegExp('')");
            _isFileCheck(isBoolean, false);
            _isFormDataCheck(isBoolean, false);
            _isBlobCheck(isBoolean, false);
        });
    });

    describe("isRegExp", () => {
        it("Validate values", () => {
            assert.equal(isRegExp(null), false, "Checking typeof null");
            assert.equal(isRegExp(undefined), false, "Checking typeof undefined");
            assert.equal(isRegExp("null"), false, "Checking typeof 'null'");
            assert.equal(isRegExp("undefined"), false, "Checking typeof 'undefined'");
            assert.equal(isRegExp("1"), false, "Checking typeof '1'");
            assert.equal(isRegExp("aa"), false, "Checking typeof 'aa'");
            assert.equal(isRegExp(new Date()), false, "Checking typeof Date");
            assert.equal(isRegExp(1), false, "Checking typeof 1");
            assert.equal(isRegExp(""), false, "Checking typeof ''");
            assert.equal(isRegExp(_dummyFunction), false, "Checking typeof _dummyFunction");
            assert.equal(isRegExp([]), false, "Checking typeof []");
            assert.equal(isRegExp(new Array(1)), false, "Checking typeof new Array(1)");
            assert.equal(isRegExp(true), false, "Checking typeof true");
            assert.equal(isRegExp(false), false, "Checking typeof false");
            assert.equal(isRegExp("true"), false, "Checking typeof 'true'");
            assert.equal(isRegExp("false"), false, "Checking typeof 'false'");
            assert.equal(isRegExp(new Boolean(true)), false, "Checking typeof new Boolean(true)");
            assert.equal(isRegExp(new Boolean(false)), false, "Checking typeof new Boolean(false)");
            assert.equal(isRegExp(new Boolean("true")), false, "Checking typeof new Boolean('true')");
            assert.equal(isRegExp(new Boolean("false")), false, "Checking typeof new Boolean('false')");
            assert.equal(isRegExp(/[a-z]/g), true, "Checking typeof '/[a-z]/g'");
            assert.equal(isRegExp(new RegExp("")), true, "Checking typeof new RegExp('')");
            _isFileCheck(isRegExp, false);
            _isFormDataCheck(isRegExp, false);
            _isBlobCheck(isRegExp, false);
        });
    });

    describe("isFile", () => {
        it("Validate values", () => {
            assert.equal(isFile(null), false, "Checking typeof null");
            assert.equal(isFile(undefined), false, "Checking typeof undefined");
            assert.equal(isFile("null"), false, "Checking typeof 'null'");
            assert.equal(isFile("undefined"), false, "Checking typeof 'undefined'");
            assert.equal(isFile("1"), false, "Checking typeof '1'");
            assert.equal(isFile("aa"), false, "Checking typeof 'aa'");
            assert.equal(isFile(new Date()), false, "Checking typeof Date");
            assert.equal(isFile(1), false, "Checking typeof 1");
            assert.equal(isFile(""), false, "Checking typeof ''");
            assert.equal(isFile(_dummyFunction), false, "Checking typeof _dummyFunction");
            assert.equal(isFile([]), false, "Checking typeof []");
            assert.equal(isFile(new Array(1)), false, "Checking typeof new Array(1)");
            assert.equal(isFile(true), false, "Checking typeof true");
            assert.equal(isFile(false), false, "Checking typeof false");
            assert.equal(isFile("true"), false, "Checking typeof 'true'");
            assert.equal(isFile("false"), false, "Checking typeof 'false'");
            assert.equal(isFile(new Boolean(true)), false, "Checking typeof new Boolean(true)");
            assert.equal(isFile(new Boolean(false)), false, "Checking typeof new Boolean(false)");
            assert.equal(isFile(new Boolean("true")), false, "Checking typeof new Boolean('true')");
            assert.equal(isFile(new Boolean("false")), false, "Checking typeof new Boolean('false')");
            assert.equal(isFile(/[a-z]/g), false, "Checking typeof '/[a-z]/g'");
            assert.equal(isFile(new RegExp("")), false, "Checking typeof new RegExp('')");
            _isFileCheck(isFile, true);
            _isFormDataCheck(isFile, false);
            _isBlobCheck(isFile, false);
        });
    });

    describe("isFormData", () => {
        it("Validate values", () => {
            assert.equal(isFormData(null), false, "Checking typeof null");
            assert.equal(isFormData(undefined), false, "Checking typeof undefined");
            assert.equal(isFormData("null"), false, "Checking typeof 'null'");
            assert.equal(isFormData("undefined"), false, "Checking typeof 'undefined'");
            assert.equal(isFormData("1"), false, "Checking typeof '1'");
            assert.equal(isFormData("aa"), false, "Checking typeof 'aa'");
            assert.equal(isFormData(new Date()), false, "Checking typeof Date");
            assert.equal(isFormData(1), false, "Checking typeof 1");
            assert.equal(isFormData(""), false, "Checking typeof ''");
            assert.equal(isFormData(_dummyFunction), false, "Checking typeof _dummyFunction");
            assert.equal(isFormData([]), false, "Checking typeof []");
            assert.equal(isFormData(new Array(1)), false, "Checking typeof new Array(1)");
            assert.equal(isFormData(true), false, "Checking typeof true");
            assert.equal(isFormData(false), false, "Checking typeof false");
            assert.equal(isFormData("true"), false, "Checking typeof 'true'");
            assert.equal(isFormData("false"), false, "Checking typeof 'false'");
            assert.equal(isFormData(new Boolean(true)), false, "Checking typeof new Boolean(true)");
            assert.equal(isFormData(new Boolean(false)), false, "Checking typeof new Boolean(false)");
            assert.equal(isFormData(new Boolean("true")), false, "Checking typeof new Boolean('true')");
            assert.equal(isFormData(new Boolean("false")), false, "Checking typeof new Boolean('false')");
            assert.equal(isFormData(/[a-z]/g), false, "Checking typeof '/[a-z]/g'");
            assert.equal(isFormData(new RegExp("")), false, "Checking typeof new RegExp('')");
            _isFileCheck(isFormData, false);
            _isFormDataCheck(isFormData, true);
            _isBlobCheck(isFormData, false);
        });

        describe("isBlob", () => {
            it("Validate values", () => {
                assert.equal(isBlob(null), false, "Checking typeof null");
                assert.equal(isBlob(undefined), false, "Checking typeof undefined");
                assert.equal(isBlob("null"), false, "Checking typeof 'null'");
                assert.equal(isBlob("undefined"), false, "Checking typeof 'undefined'");
                assert.equal(isBlob("1"), false, "Checking typeof '1'");
                assert.equal(isBlob("aa"), false, "Checking typeof 'aa'");
                assert.equal(isBlob(new Date()), false, "Checking typeof Date");
                assert.equal(isBlob(1), false, "Checking typeof 1");
                assert.equal(isBlob(""), false, "Checking typeof ''");
                assert.equal(isBlob(_dummyFunction), false, "Checking typeof _dummyFunction");
                assert.equal(isBlob([]), false, "Checking typeof []");
                assert.equal(isBlob(new Array(1)), false, "Checking typeof new Array(1)");
                assert.equal(isBlob(true), false, "Checking typeof true");
                assert.equal(isBlob(false), false, "Checking typeof false");
                assert.equal(isBlob("true"), false, "Checking typeof 'true'");
                assert.equal(isBlob("false"), false, "Checking typeof 'false'");
                assert.equal(isBlob(new Boolean(true)), false, "Checking typeof new Boolean(true)");
                assert.equal(isBlob(new Boolean(false)), false, "Checking typeof new Boolean(false)");
                assert.equal(isBlob(new Boolean("true")), false, "Checking typeof new Boolean('true')");
                assert.equal(isBlob(new Boolean("false")), false, "Checking typeof new Boolean('false')");
                assert.equal(isBlob(/[a-z]/g), false, "Checking typeof '/[a-z]/g'");
                assert.equal(isBlob(new RegExp("")), false, "Checking typeof new RegExp('')");
                _isFileCheck(isBlob, false);
                _isFormDataCheck(isBlob, false);
                _isBlobCheck(isBlob, true);
            });
        });
    });

    function _dummyFunction() {

    }

    function _isFileCheck(chkFn: (value: any) => boolean, expected: boolean) {
        let theFile: File = null;
        try {
            theFile = new File([], "text.txt");
        } catch (e) {
            // Node doesn't have the file class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
            expected = false;
        }

        assert.equal(chkFn(theFile), expected, "Checking typeof new File([], '')");
    }

    function _isFormDataCheck(chkFn: (value: any) => boolean, expected: boolean) {
        let formData: FormData = null;
        try {
            formData = new FormData();
        } catch (e) {
            // Node doesn't have the FormData class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
            expected = false;
        }

        assert.equal(chkFn(formData), expected, "Checking typeof new FormData()");
    }

    function _isBlobCheck(chkFn: (value: any) => boolean, expected: boolean) {
        let blob: Blob = null;
        try {
            blob = new Blob();
        } catch (e) {
            // Node doesn't have the Blob class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
            expected = false;
        }

        assert.equal(chkFn(blob), expected, "Checking typeof new Blob()");
    }

});