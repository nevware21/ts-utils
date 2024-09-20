/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import {
    isArray, isBoolean, isDate, isDefined, isFunction, isNullOrUndefined, isNumber, isObject, isString, isTypeof,
    isUndefined, isRegExp, isFile, isFormData, isBlob, isArrayBuffer, isError, isPromiseLike, isPromise, isNotTruthy,
    isTruthy, isStrictUndefined, isStrictNullOrUndefined, isPrimitive, isPrimitiveType
} from "../../../../src/helpers/base";
import { polyObjCreate } from "../../../../src//object/create";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isNode } from "../../../../src/helpers/environment";

describe("base helpers", () => {
    describe("isTypeOf", () => {
        it("Validate values of type null", () => {
            assert.equal(isTypeof(null, null as any), false, "Checking null");
            assert.equal(isTypeof(undefined, null as any), false, "Checking undefined");
            assert.equal(isTypeof("null", null as any), false, "Checking 'null'");
            assert.equal(isTypeof("undefined", null as any), false, "Checking 'undefined'");
            assert.equal(isTypeof("1", null as any), false, "Checking '1'");
            assert.equal(isTypeof("aa", null as any), false, "Checking 'aa'");
            assert.equal(isTypeof(new Date(), null as any), false, "Checking Date");
            assert.equal(isTypeof(1, null as any), false, "Checking 1");
            assert.equal(isTypeof("", null as any), false, "Checking ''");
            assert.equal(isTypeof(_dummyFunction, null as any), false, "Checking _dummyFunction");
            assert.equal(isTypeof([], null as any), false, "Checking []");
            assert.equal(isTypeof(new Array(1), null as any), false, "Checking new Array(1)");
            assert.equal(isTypeof(true, null as any), false, "Checking true");
            assert.equal(isTypeof(false, null as any), false, "Checking false");
            assert.equal(isTypeof("true", null as any), false, "Checking 'true'");
            assert.equal(isTypeof("false", null as any), false, "Checking 'false'");
            assert.equal(isTypeof(new Boolean(true), null as any), false, "Checking new Boolean(true)");
            assert.equal(isTypeof(new Boolean(false), null as any), false, "Checking new Boolean(false)");
            assert.equal(isTypeof(new Boolean("true"), null as any), false, "Checking new Boolean('true')");
            assert.equal(isTypeof(new Boolean("false"), null as any), false, "Checking new Boolean('false')");
            assert.equal(isTypeof(Boolean(true), null as any), false, "Checking Boolean(true)");
            assert.equal(isTypeof(Boolean(false), null as any), false, "Checking Boolean(false)");
            assert.equal(isTypeof(Boolean("true"), null as any), false, "Checking Boolean('true')");
            assert.equal(isTypeof(Boolean("false"), null as any), false, "Checking Boolean('false')");
            assert.equal(isTypeof(new RegExp(""), null as any), false, "Checking new RegExp('')");
            assert.equal(isTypeof(new ArrayBuffer(0), null as any), false, "Checking new ArrayBuffer([])");
            assert.equal(isTypeof(new Error("Test Error"), null as any), false, "Checking new Error('')");
            assert.equal(isTypeof(new TypeError("Test TypeError"), null as any), false, "Checking new TypeError('')");
            assert.equal(isTypeof(new TestError("Test TestError"), null as any), false, "Checking new TestError('')");
            assert.equal(isTypeof(_dummyError(), null as any), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isTypeof(Promise.reject(), null as any), false, "Checking Promise.reject");
            assert.equal(isTypeof(Promise.resolve(), null as any), false, "Checking Promise.reject");
            assert.equal(isTypeof(new Promise(() => {}), null as any), false, "Checking new Promise(() => {})");
            assert.equal(isTypeof(_simplePromise(), null as any), false, "Checking _simplePromise");
            assert.equal(isTypeof(_simplePromiseLike(), null as any), false, "Checking _simplePromiseLike");
            assert.equal(isTypeof(Object.create(null), null as any), false, "Checking Object.create(null as any)");
            assert.equal(isTypeof(polyObjCreate(null), null as any), false, "Checking polyObjCreate(null)");
        });

        it("Validate values of type undefined", () => {
            assert.equal(isTypeof(null, undefined as any), false, "Checking null");
            assert.equal(isTypeof(undefined, undefined as any), false, "Checking undefined");
            assert.equal(isTypeof("null", undefined as any), false, "Checking 'null'");
            assert.equal(isTypeof("undefined", undefined as any), false, "Checking 'undefined'");
            assert.equal(isTypeof("1", undefined as any), false, "Checking '1'");
            assert.equal(isTypeof("aa", undefined as any), false, "Checking 'aa'");
            assert.equal(isTypeof(new Date(), undefined as any), false, "Checking Date");
            assert.equal(isTypeof(1, undefined as any), false, "Checking 1");
            assert.equal(isTypeof("", undefined as any), false, "Checking ''");
            assert.equal(isTypeof(_dummyFunction, undefined as any), false, "Checking _dummyFunction");
            assert.equal(isTypeof([], undefined as any), false, "Checking []");
            assert.equal(isTypeof(new Array(1), undefined as any), false, "Checking new Array(1)");
            assert.equal(isTypeof(true, undefined as any), false, "Checking true");
            assert.equal(isTypeof(false, undefined as any), false, "Checking false");
            assert.equal(isTypeof("true", undefined as any), false, "Checking 'true'");
            assert.equal(isTypeof("false", undefined as any), false, "Checking 'false'");
            assert.equal(isTypeof(new Boolean(true), undefined as any), false, "Checking new Boolean(true)");
            assert.equal(isTypeof(new Boolean(false), undefined as any), false, "Checking new Boolean(false)");
            assert.equal(isTypeof(new Boolean("true"), undefined as any), false, "Checking new Boolean('true')");
            assert.equal(isTypeof(new Boolean("false"), undefined as any), false, "Checking new Boolean('false')");
            assert.equal(isTypeof(Boolean(true), undefined as any), false, "Checking Boolean(true)");
            assert.equal(isTypeof(Boolean(false), undefined as any), false, "Checking Boolean(false)");
            assert.equal(isTypeof(Boolean("true"), undefined as any), false, "Checking Boolean('true')");
            assert.equal(isTypeof(Boolean("false"), undefined as any), false, "Checking Boolean('false')");
            assert.equal(isTypeof(new RegExp(""), undefined as any), false, "Checking new RegExp('')");
            assert.equal(isTypeof(new ArrayBuffer(0), undefined as any), false, "Checking new ArrayBuffer([])");
            assert.equal(isTypeof(new Error("Test Error"), undefined as any), false, "Checking new Error('')");
            assert.equal(isTypeof(new TypeError("Test TypeError"), undefined as any), false, "Checking new TypeError('')");
            assert.equal(isTypeof(new TestError("Test TestError"), undefined as any), false, "Checking new TestError('')");
            assert.equal(isTypeof(_dummyError(), undefined as any), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isTypeof(Promise.reject(), undefined as any), false, "Checking Promise.reject");
            assert.equal(isTypeof(Promise.resolve(), undefined as any), false, "Checking Promise.reject");
            assert.equal(isTypeof(new Promise(() => {}), undefined as any), false, "Checking new Promise(() => {})");
            assert.equal(isTypeof(_simplePromise(), undefined as any), false, "Checking _simplePromise");
            assert.equal(isTypeof(_simplePromiseLike(), undefined as any), false, "Checking _simplePromiseLike");
            assert.equal(isTypeof(Object.create(null), undefined as any), false, "Checking Object.create(null)");
            assert.equal(isTypeof(polyObjCreate(null), undefined as any), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isUndefined", () => {
        it("Validate values", () => {
            assert.equal(isUndefined(null), false, "Checking null");
            assert.equal(isUndefined(undefined), true, "Checking undefined");
            assert.equal(isUndefined("null"), false, "Checking 'null'");
            assert.equal(isUndefined("undefined"), true, "Checking 'undefined'");
            assert.equal(isUndefined("1"), false, "Checking '1'");
            assert.equal(isUndefined("aa"), false, "Checking 'aa'");
            assert.equal(isUndefined(new Date()), false, "Checking Date");
            assert.equal(isUndefined(1), false, "Checking 1");
            assert.equal(isUndefined(""), false, "Checking ''");
            assert.equal(isUndefined(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isUndefined([]), false, "Checking []");
            assert.equal(isUndefined(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isUndefined(true), false, "Checking true");
            assert.equal(isUndefined(false), false, "Checking false");
            assert.equal(isUndefined("true"), false, "Checking 'true'");
            assert.equal(isUndefined("false"), false, "Checking 'false'");
            assert.equal(isUndefined(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isUndefined(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isUndefined(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isUndefined(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isUndefined(Boolean(true)), false, "Checking Boolean(true)");
            assert.equal(isUndefined(Boolean(false)), false, "Checking Boolean(false)");
            assert.equal(isUndefined(Boolean("true")), false, "Checking Boolean('true')");
            assert.equal(isUndefined(Boolean("false")), false, "Checking Boolean('false')");
            assert.equal(isUndefined(new RegExp("")), false, "Checking new RegExp('')");
            assert.equal(isUndefined(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isUndefined(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isUndefined(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isUndefined(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isUndefined(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isUndefined(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isUndefined(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isUndefined(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isUndefined(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isUndefined(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isUndefined(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isUndefined(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isStrictUndefined", () => {
        it("Validate values", () => {
            assert.equal(isStrictUndefined(null), false, "Checking null");
            assert.equal(isStrictUndefined(undefined), true, "Checking undefined");
            assert.equal(isStrictUndefined("null"), false, "Checking 'null'");
            assert.equal(isStrictUndefined("undefined"), false, "Checking 'undefined'");
            assert.equal(isStrictUndefined("1"), false, "Checking '1'");
            assert.equal(isStrictUndefined("aa"), false, "Checking 'aa'");
            assert.equal(isStrictUndefined(new Date()), false, "Checking Date");
            assert.equal(isStrictUndefined(0), false, "Checking 1");
            assert.equal(isStrictUndefined(1), false, "Checking 1");
            assert.equal(isStrictUndefined(""), false, "Checking ''");
            assert.equal(isStrictUndefined(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isStrictUndefined([]), false, "Checking []");
            assert.equal(isStrictUndefined(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isStrictUndefined(true), false, "Checking true");
            assert.equal(isStrictUndefined(false), false, "Checking false");
            assert.equal(isStrictUndefined("true"), false, "Checking 'true'");
            assert.equal(isStrictUndefined("false"), false, "Checking 'false'");
            assert.equal(isStrictUndefined(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isStrictUndefined(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isStrictUndefined(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isStrictUndefined(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isStrictUndefined(Boolean(true)), false, "Checking Boolean(true)");
            assert.equal(isStrictUndefined(Boolean(false)), false, "Checking Boolean(false)");
            assert.equal(isStrictUndefined(Boolean("true")), false, "Checking Boolean('true')");
            assert.equal(isStrictUndefined(Boolean("false")), false, "Checking Boolean('false')");
            assert.equal(isStrictUndefined(new RegExp("")), false, "Checking new RegExp('')");
            assert.equal(isStrictUndefined(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isStrictUndefined(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isStrictUndefined(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isStrictUndefined(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isStrictUndefined(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isStrictUndefined(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isStrictUndefined(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isStrictUndefined(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isStrictUndefined(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isStrictUndefined(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isStrictUndefined(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isStrictUndefined(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isNullOrUndefined", () => {
        it("Validate values", () => {
            assert.equal(isNullOrUndefined(null), true, "Checking null");
            assert.equal(isNullOrUndefined(undefined), true, "Checking undefined");
            assert.equal(isNullOrUndefined("null"), false, "Checking 'null'");
            assert.equal(isNullOrUndefined("undefined"), true, "Checking 'undefined'");
            assert.equal(isNullOrUndefined("1"), false, "Checking '1'");
            assert.equal(isNullOrUndefined("aa"), false, "Checking 'aa'");
            assert.equal(isNullOrUndefined(new Date()), false, "Checking Date");
            assert.equal(isNullOrUndefined(1), false, "Checking 1");
            assert.equal(isNullOrUndefined(""), false, "Checking ''");
            assert.equal(isNullOrUndefined(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isNullOrUndefined([]), false, "Checking []");
            assert.equal(isNullOrUndefined(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isNullOrUndefined(true), false, "Checking true");
            assert.equal(isNullOrUndefined(false), false, "Checking false");
            assert.equal(isNullOrUndefined("true"), false, "Checking 'true'");
            assert.equal(isNullOrUndefined("false"), false, "Checking 'false'");
            assert.equal(isNullOrUndefined(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isNullOrUndefined(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isNullOrUndefined(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isNullOrUndefined(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isNullOrUndefined(Boolean(true)), false, "Checking Boolean(true)");
            assert.equal(isNullOrUndefined(Boolean(false)), false, "Checking Boolean(false)");
            assert.equal(isNullOrUndefined(Boolean("true")), false, "Checking Boolean('true')");
            assert.equal(isNullOrUndefined(Boolean("false")), false, "Checking Boolean('false')");
            assert.equal(isNullOrUndefined(new RegExp("")), false, "Checking new RegExp('')");
            assert.equal(isNullOrUndefined(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isNullOrUndefined(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isNullOrUndefined(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isNullOrUndefined(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isNullOrUndefined(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isNullOrUndefined(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isNullOrUndefined(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isNullOrUndefined(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isNullOrUndefined(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isNullOrUndefined(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isNullOrUndefined(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isNullOrUndefined(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isStrictNullOrUndefined", () => {
        it("Validate values", () => {
            assert.equal(isStrictNullOrUndefined(null), true, "Checking null");
            assert.equal(isStrictNullOrUndefined(undefined), true, "Checking undefined");
            assert.equal(isStrictNullOrUndefined("null"), false, "Checking 'null'");
            assert.equal(isStrictNullOrUndefined("undefined"), false, "Checking 'undefined'");
            assert.equal(isStrictNullOrUndefined("1"), false, "Checking '1'");
            assert.equal(isStrictNullOrUndefined("aa"), false, "Checking 'aa'");
            assert.equal(isStrictNullOrUndefined(new Date()), false, "Checking Date");
            assert.equal(isStrictNullOrUndefined(1), false, "Checking 1");
            assert.equal(isStrictNullOrUndefined(""), false, "Checking ''");
            assert.equal(isStrictNullOrUndefined(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isStrictNullOrUndefined([]), false, "Checking []");
            assert.equal(isStrictNullOrUndefined(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isStrictNullOrUndefined(true), false, "Checking true");
            assert.equal(isStrictNullOrUndefined(false), false, "Checking false");
            assert.equal(isStrictNullOrUndefined("true"), false, "Checking 'true'");
            assert.equal(isStrictNullOrUndefined("false"), false, "Checking 'false'");
            assert.equal(isStrictNullOrUndefined(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isStrictNullOrUndefined(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isStrictNullOrUndefined(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isStrictNullOrUndefined(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isStrictNullOrUndefined(Boolean(true)), false, "Checking Boolean(true)");
            assert.equal(isStrictNullOrUndefined(Boolean(false)), false, "Checking Boolean(false)");
            assert.equal(isStrictNullOrUndefined(Boolean("true")), false, "Checking Boolean('true')");
            assert.equal(isStrictNullOrUndefined(Boolean("false")), false, "Checking Boolean('false')");
            assert.equal(isStrictNullOrUndefined(new RegExp("")), false, "Checking new RegExp('')");
            assert.equal(isStrictNullOrUndefined(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isStrictNullOrUndefined(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isStrictNullOrUndefined(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isStrictNullOrUndefined(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isStrictNullOrUndefined(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isStrictNullOrUndefined(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isStrictNullOrUndefined(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isStrictNullOrUndefined(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isStrictNullOrUndefined(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isStrictNullOrUndefined(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isStrictNullOrUndefined(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isStrictNullOrUndefined(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isDefined: (is not undefined)", () => {
        it("Validate values", () => {
            assert.equal(isDefined(null), true, "Checking null");
            assert.equal(isDefined(undefined), false, "Checking undefined");
            assert.equal(isDefined("null"), true, "Checking 'null'");
            assert.equal(isDefined("undefined"), true, "Checking 'undefined'");
            assert.equal(isDefined("1"), true, "Checking '1'");
            assert.equal(isDefined("aa"), true, "Checking 'aa'");
            assert.equal(isDefined(new Date()), true, "Checking Date");
            assert.equal(isDefined(1), true, "Checking 1");
            assert.equal(isDefined(""), true, "Checking ''");
            assert.equal(isDefined(_dummyFunction), true, "Checking _dummyFunction");
            assert.equal(isDefined([]), true, "Checking []");
            assert.equal(isDefined(new Array(1)), true, "Checking new Array(1)");
            assert.equal(isDefined(true), true, "Checking true");
            assert.equal(isDefined(false), true, "Checking false");
            assert.equal(isDefined("true"), true, "Checking 'true'");
            assert.equal(isDefined("false"), true, "Checking 'false'");
            assert.equal(isDefined(new Boolean(true)), true, "Checking new Boolean(true)");
            assert.equal(isDefined(new Boolean(false)), true, "Checking new Boolean(false)");
            assert.equal(isDefined(new Boolean("true")), true, "Checking new Boolean('true')");
            assert.equal(isDefined(new Boolean("false")), true, "Checking new Boolean('false')");
            assert.equal(isDefined(Boolean(true)), true, "Checking Boolean(true)");
            assert.equal(isDefined(Boolean(false)), true, "Checking Boolean(false)");
            assert.equal(isDefined(Boolean("true")), true, "Checking Boolean('true')");
            assert.equal(isDefined(Boolean("false")), true, "Checking Boolean('false')");
            assert.equal(isDefined(new RegExp("")), true, "Checking new RegExp('')");
            assert.equal(isDefined(new ArrayBuffer(0)), true, "Checking new ArrayBuffer([])");
            assert.equal(isDefined(new Error("Test Error")), true, "Checking new Error('')");
            assert.equal(isDefined(new TypeError("Test TypeError")), true, "Checking new TypeError('')");
            assert.equal(isDefined(new TestError("Test TestError")), true, "Checking new TestError('')");
            assert.equal(isDefined(_dummyError()), true, "Checking dummy error (object that looks like an error)");
            assert.equal(isDefined(Promise.reject()), true, "Checking Promise.reject");
            assert.equal(isDefined(Promise.resolve()), true, "Checking Promise.reject");
            assert.equal(isDefined(new Promise(() => {})), true, "Checking new Promise(() => {})");
            assert.equal(isDefined(_simplePromise()), true, "Checking _simplePromise");
            assert.equal(isDefined(_simplePromiseLike()), true, "Checking _simplePromiseLike");
            assert.equal(isDefined(Object.create(null)), true, "Checking Object.create(null)");
            assert.equal(isDefined(polyObjCreate(null)), true, "Checking polyObjCreate(null)");
        });
    });

    describe("isString", () => {
        it("Validate values", () => {
            assert.equal(isString(null), false, "Checking null");
            assert.equal(isString(undefined), false, "Checking undefined");
            assert.equal(isString("null"), true, "Checking 'null'");
            assert.equal(isString("undefined"), true, "Checking 'undefined'");
            assert.equal(isString("1"), true, "Checking '1'");
            assert.equal(isString("aa"), true, "Checking 'aa'");
            assert.equal(isString(new Date()), false, "Checking Date");
            assert.equal(isString(1), false, "Checking 1");
            assert.equal(isString(""), true, "Checking ''");
            assert.equal(isString(String("")), true, "Checking String('')");
            assert.equal(isString(new String("aa")), false, "Checking new String('aa')");
            assert.equal(isString(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isString([]), false, "Checking []");
            assert.equal(isString(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isString(true), false, "Checking true");
            assert.equal(isString(false), false, "Checking false");
            assert.equal(isString("true"), true, "Checking 'true'");
            assert.equal(isString("false"), true, "Checking 'false'");
            assert.equal(isString(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isString(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isString(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isString(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isString(new RegExp("")), false, "Checking new RegExp('')");
            _isFileCheck(isString, false);
            _isFormDataCheck(isString, false);
            _isBlobCheck(isString, false);
            assert.equal(isString(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isString(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isString(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isString(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isString(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isString(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isString(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isString(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isString(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isString(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isString(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isString(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isFunction", () => {
        it("Validate values", () => {
            assert.equal(isFunction(null), false, "Checking null");
            assert.equal(isFunction(undefined), false, "Checking undefined");
            assert.equal(isFunction("null"), false, "Checking 'null'");
            assert.equal(isFunction("undefined"), false, "Checking 'undefined'");
            assert.equal(isFunction("1"), false, "Checking '1'");
            assert.equal(isFunction("aa"), false, "Checking 'aa'");
            assert.equal(isFunction(new Date()), false, "Checking Date");
            assert.equal(isFunction(1), false, "Checking 1");
            assert.equal(isFunction(""), false, "Checking ''");
            assert.equal(isFunction(_dummyFunction), true, "Checking _dummyFunction");
            assert.equal(isFunction([]), false, "Checking []");
            assert.equal(isFunction(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isFunction(true), false, "Checking true");
            assert.equal(isFunction(false), false, "Checking false");
            assert.equal(isFunction("true"), false, "Checking 'true'");
            assert.equal(isFunction("false"), false, "Checking 'false'");
            assert.equal(isFunction(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isFunction(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isFunction(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isFunction(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isFunction(new RegExp("")), false, "Checking new RegExp('')");
            _isFileCheck(isFunction, false);
            _isFormDataCheck(isFunction, false);
            _isBlobCheck(isFunction, false);
            assert.equal(isFunction(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isFunction(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isFunction(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isFunction(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isFunction(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isFunction(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isFunction(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isFunction(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isFunction(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isFunction(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isFunction(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isFunction(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isObject", () => {
        it("Validate values", () => {
            assert.equal(isObject(null), false, "Checking null");
            assert.equal(isObject(undefined), false, "Checking undefined");
            assert.equal(isObject("null"), false, "Checking 'null'");
            assert.equal(isObject("undefined"), false, "Checking 'undefined'");
            assert.equal(isObject("1"), false, "Checking '1'");
            assert.equal(isObject("aa"), false, "Checking 'aa'");
            assert.equal(isObject(new Date()), true, "Checking Date");
            assert.equal(isObject(1), false, "Checking 1");
            assert.equal(isObject(""), false, "Checking ''");
            assert.equal(isObject(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isObject([]), true, "Checking []");
            assert.equal(isObject(new Array(1)), true, "Checking new Array(1)");
            assert.equal(isObject(true), false, "Checking true");
            assert.equal(isObject(false), false, "Checking false");
            assert.equal(isObject("true"), false, "Checking 'true'");
            assert.equal(isObject("false"), false, "Checking 'false'");

            // Test boolean objects
            assert.equal(isObject(new Boolean(true)), true, "Checking new Boolean(true)");
            assert.equal(isObject(new Boolean(false)), true, "Checking new Boolean(false)");
            assert.equal(isObject(new Boolean("true")), true, "Checking new Boolean('true')");
            assert.equal(isObject(new Boolean("false")), true, "Checking new Boolean('false')");
            assert.equal(isObject(new Boolean("0")), true, "Checking new Boolean('0')");
            assert.equal(isObject(new Boolean(0)), true, "Checking new Boolean(0)");
            assert.equal(isObject(new Boolean("1")), true, "Checking new Boolean('1')");
            assert.equal(isObject(new Boolean(1)), true, "Checking new Boolean(1)");

            // Test boolean values
            assert.equal(isObject(Boolean(true)), false, "Checking Boolean(true)");
            assert.equal(isObject(Boolean(false)), false, "Checking Boolean(false)");
            assert.equal(isObject(Boolean("true")), false, "Checking Boolean('true')");
            assert.equal(isObject(Boolean("false")), false, "Checking Boolean('false')");
            assert.equal(isObject(Boolean("0")), false, "Checking Boolean('0')");
            assert.equal(isObject(Boolean(0)), false, "Checking Boolean(0)");
            assert.equal(isObject(Boolean("1")), false, "Checking Boolean('1')");
            assert.equal(isObject(Boolean(1)), false, "Checking Boolean(1)");

            assert.equal(isObject(/[a-z]/g), true, "Checking '/[a-z]/g'");
            assert.equal(isObject(new RegExp("")), true, "Checking new RegExp('')");
            _isFileCheck(isObject, true);
            _isFormDataCheck(isObject, true);
            _isBlobCheck(isObject, true);
            assert.equal(isObject(new ArrayBuffer(0)), true, "Checking new ArrayBuffer([])");
            assert.equal(isObject(new Error("Test Error")), true, "Checking new Error('')");
            assert.equal(isObject(new TypeError("Test TypeError")), true, "Checking new TypeError('')");
            assert.equal(isObject(new TestError("Test TestError")), true, "Checking new TestError('')");
            assert.equal(isObject(_dummyError()), true, "Checking dummy error (object that looks like an error)");
            assert.equal(isObject(Promise.reject()), true, "Checking Promise.reject");
            assert.equal(isObject(Promise.resolve()), true, "Checking Promise.reject");
            assert.equal(isObject(new Promise(() => {})), true, "Checking new Promise(() => {})");
            assert.equal(isObject(_simplePromise()), true, "Checking _simplePromise");
            assert.equal(isObject(_simplePromiseLike()), true, "Checking _simplePromiseLike");

            assert.equal(isObject(Object.create(null)), true, "Checking Object.create(null)");
            assert.equal(isObject(polyObjCreate(null)), true, "Checking polyObjCreate(null)");
        });
    });

    describe("isPrimitive", () => {
        it("Validate values", () => {
            assert.equal(isPrimitive(null), true, "Checking null");
            assert.equal(isPrimitive(undefined), true, "Checking undefined");
            assert.equal(isPrimitive("null"), true, "Checking 'null'");
            assert.equal(isPrimitive("undefined"), true, "Checking 'undefined'");
            assert.equal(isPrimitive("1"), true, "Checking '1'");
            assert.equal(isPrimitive("aa"), true, "Checking 'aa'");
            assert.equal(isPrimitive(new Date()), false, "Checking Date");
            assert.equal(isPrimitive(1), true, "Checking 1");
            assert.equal(isPrimitive(Number(2)), true, "Checking Number(2)");
            assert.equal(isPrimitive(""), true, "Checking ''");
            assert.equal(isPrimitive(String("")), true, "Checking String('')");
            assert.equal(isPrimitive(new String("aa")), false, "Checking new String('aa')");
            assert.equal(isPrimitive(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isPrimitive([]), false, "Checking []");
            assert.equal(isPrimitive(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isPrimitive(true), true, "Checking true");
            assert.equal(isPrimitive(false), true, "Checking false");
            assert.equal(isPrimitive("true"), true, "Checking 'true'");
            assert.equal(isPrimitive("false"), true, "Checking 'false'");
            assert.equal(isPrimitive(BigInt(42)), true, "Checking BigInt");
            assert.equal(isPrimitive(Symbol.for("Hello")), true, "Checking BigInt");
            assert.equal(isPrimitive(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isPrimitive(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isPrimitive(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isPrimitive(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isPrimitive(/[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(isPrimitive(new RegExp("")), false, "Checking new RegExp('')");
            _isFileCheck(isPrimitive, false);
            _isFormDataCheck(isPrimitive, false);
            _isBlobCheck(isPrimitive, false);
            assert.equal(isPrimitive(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isPrimitive(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isPrimitive(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isPrimitive(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isPrimitive(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isPrimitive(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isPrimitive(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isPrimitive(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isPrimitive(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isPrimitive(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isPrimitive(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isPrimitive(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isPrimitiveType", () => {
        it("Validate values", () => {
            assert.equal(isPrimitiveType("string"), true, "Checking 'string'");
            assert.equal(isPrimitiveType("number"), true, "Checking 'number'");
            assert.equal(isPrimitiveType("boolean"), true, "Checking 'boolean'");
            assert.equal(isPrimitiveType("undefined"), true, "Checking 'undefined'");
            assert.equal(isPrimitiveType("symbol"), true, "Checking 'symbol'");
            assert.equal(isPrimitiveType("bigint"), true, "Checking 'bigint'");

            assert.equal(isPrimitiveType(null as any), false, "Checking null");
            assert.equal(isPrimitiveType(undefined as any), false, "Checking undefined");
            assert.equal(isPrimitiveType("null"), false, "Checking 'null'");
            assert.equal(isPrimitiveType("1"), false, "Checking '1'");
            assert.equal(isPrimitiveType("aa"), false, "Checking 'aa'");
            assert.equal(isPrimitiveType(new Date() as any), false, "Checking Date");
            assert.equal(isPrimitiveType(1 as any), false, "Checking 1");
            assert.equal(isPrimitiveType(Number(2) as any), false, "Checking Number(2)");
            assert.equal(isPrimitiveType(""), false, "Checking ''");
            assert.equal(isPrimitiveType(String("")), false, "Checking String('')");
            assert.equal(isPrimitiveType(new String("aa") as any), false, "Checking new String('aa')");
            assert.equal(isPrimitiveType(_dummyFunction as any), false, "Checking _dummyFunction");
            assert.equal(isPrimitiveType([] as any), false, "Checking []");
            assert.equal(isPrimitiveType(new Array(1) as any), false, "Checking new Array(1)");
            assert.equal(isPrimitiveType(true as any), false, "Checking true");
            assert.equal(isPrimitiveType(false as any), false, "Checking false");
            assert.equal(isPrimitiveType("true"), false, "Checking 'true'");
            assert.equal(isPrimitiveType("false"), false, "Checking 'false'");
            assert.equal(isPrimitiveType(BigInt(42) as any), false, "Checking BigInt");
            assert.equal(isPrimitiveType(Symbol.for("Hello") as any), false, "Checking BigInt");
            assert.equal(isPrimitiveType(new Boolean(true) as any), false, "Checking new Boolean(true)");
            assert.equal(isPrimitiveType(new Boolean(false) as any), false, "Checking new Boolean(false)");
            assert.equal(isPrimitiveType(new Boolean("true") as any), false, "Checking new Boolean('true')");
            assert.equal(isPrimitiveType(new Boolean("false") as any), false, "Checking new Boolean('false')");
            assert.equal(isPrimitiveType(/[a-z]/g as any), false, "Checking '/[a-z]/g'");
            assert.equal(isPrimitiveType(new RegExp("") as any), false, "Checking new RegExp('')");
            _isFileCheck(isPrimitiveType, false);
            _isFormDataCheck(isPrimitiveType, false);
            _isBlobCheck(isPrimitiveType, false);
            assert.equal(isPrimitiveType(new ArrayBuffer(0) as any), false, "Checking new ArrayBuffer([])");
            assert.equal(isPrimitiveType(new Error("Test Error") as any), false, "Checking new Error('')");
            assert.equal(isPrimitiveType(new TypeError("Test TypeError") as any), false, "Checking new TypeError('')");
            assert.equal(isPrimitiveType(new TestError("Test TestError") as any), false, "Checking new TestError('')");
            assert.equal(isPrimitiveType(_dummyError() as any), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isPrimitiveType(Promise.reject() as any), false, "Checking Promise.reject");
            assert.equal(isPrimitiveType(Promise.resolve() as any), false, "Checking Promise.reject");
            assert.equal(isPrimitiveType(new Promise(() => {}) as any), false, "Checking new Promise(() => {})");
            assert.equal(isPrimitiveType(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isPrimitiveType(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isPrimitiveType(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isPrimitiveType(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });

        it("Validate value types", () => {
            assert.equal(isPrimitiveType(typeof null), false, "Checking null");
            assert.equal(isPrimitiveType(typeof undefined), true, "Checking undefined");
            assert.equal(isPrimitiveType(typeof "null"), true, "Checking 'null'");
            assert.equal(isPrimitiveType(typeof "undefined"), true, "Checking 'undefined'");
            assert.equal(isPrimitiveType(typeof "1"), true, "Checking '1'");
            assert.equal(isPrimitiveType(typeof "aa"), true, "Checking 'aa'");
            assert.equal(isPrimitiveType(typeof new Date()), false, "Checking Date");
            assert.equal(isPrimitiveType(typeof 1), true, "Checking 1");
            assert.equal(isPrimitiveType(typeof Number(2)), true, "Checking Number(2)");
            assert.equal(isPrimitiveType(typeof ""), true, "Checking ''");
            assert.equal(isPrimitiveType(typeof String("")), true, "Checking String('')");
            assert.equal(isPrimitiveType(typeof new String("aa")), false, "Checking new String('aa')");
            assert.equal(isPrimitiveType(typeof _dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isPrimitiveType(typeof []), false, "Checking []");
            assert.equal(isPrimitiveType(typeof new Array(1)), false, "Checking new Array(1)");
            assert.equal(isPrimitiveType(typeof true), true, "Checking true");
            assert.equal(isPrimitiveType(typeof false), true, "Checking false");
            assert.equal(isPrimitiveType(typeof "true"), true, "Checking 'true'");
            assert.equal(isPrimitiveType(typeof "false"), true, "Checking 'false'");
            assert.equal(isPrimitiveType(typeof BigInt(42)), true, "Checking BigInt");
            assert.equal(isPrimitiveType(typeof Symbol.for("Hello")), true, "Checking BigInt");
            assert.equal(isPrimitiveType(typeof new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isPrimitiveType(typeof new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isPrimitiveType(typeof new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isPrimitiveType(typeof new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isPrimitiveType(typeof /[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(isPrimitiveType(typeof new RegExp("")), false, "Checking new RegExp('')");
            assert.equal(isPrimitiveType(typeof new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isPrimitiveType(typeof new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isPrimitiveType(typeof new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isPrimitiveType(typeof new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isPrimitiveType(typeof _dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isPrimitiveType(typeof Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isPrimitiveType(typeof Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isPrimitiveType(typeof new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isPrimitiveType(typeof _simplePromise()), false, "Checking _simplePromise");
            assert.equal(isPrimitiveType(typeof _simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isPrimitiveType(typeof Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isPrimitiveType(typeof polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });

    });

    describe("isArray", () => {
        it("Validate values", () => {
            assert.equal(isArray(null), false, "Checking null");
            assert.equal(isArray(undefined), false, "Checking undefined");
            assert.equal(isArray("null"), false, "Checking 'null'");
            assert.equal(isArray("undefined"), false, "Checking 'undefined'");
            assert.equal(isArray("1"), false, "Checking '1'");
            assert.equal(isArray("aa"), false, "Checking 'aa'");
            assert.equal(isArray(new Date()), false, "Checking Date");
            assert.equal(isArray(1), false, "Checking 1");
            assert.equal(isArray(""), false, "Checking ''");
            assert.equal(isArray(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isArray([]), true, "Checking []");
            assert.equal(isArray(new Array(1)), true, "Checking new Array(1)");
            assert.equal(isArray(true), false, "Checking true");
            assert.equal(isArray(false), false, "Checking false");
            assert.equal(isArray("true"), false, "Checking 'true'");
            assert.equal(isArray("false"), false, "Checking 'false'");
            assert.equal(isArray(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isArray(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isArray(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isArray(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isArray(/[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(isArray(new RegExp("")), false, "Checking new RegExp('')");
            _isFileCheck(isArray, false);
            _isFormDataCheck(isArray, false);
            _isBlobCheck(isArray, false);
            assert.equal(isArray(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isArray(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isArray(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isArray(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isArray(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isArray(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isArray(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isArray(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isArray(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isArray(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isArray(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isArray(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isDate", () => {
        it("Validate values", () => {
            assert.equal(isDate(null), false, "Checking null");
            assert.equal(isDate(undefined), false, "Checking undefined");
            assert.equal(isDate("null"), false, "Checking 'null'");
            assert.equal(isDate("undefined"), false, "Checking 'undefined'");
            assert.equal(isDate("1"), false, "Checking '1'");
            assert.equal(isDate("aa"), false, "Checking 'aa'");
            assert.equal(isDate(new Date()), true, "Checking Date");
            assert.equal(isDate(1), false, "Checking 1");
            assert.equal(isDate(""), false, "Checking ''");
            assert.equal(isDate(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isDate([]), false, "Checking []");
            assert.equal(isDate(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isDate(true), false, "Checking true");
            assert.equal(isDate(false), false, "Checking false");
            assert.equal(isDate("true"), false, "Checking 'true'");
            assert.equal(isDate("false"), false, "Checking 'false'");
            assert.equal(isDate(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isDate(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isDate(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isDate(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isDate(/[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(isDate(new RegExp("")), false, "Checking new RegExp('')");
            _isFileCheck(isDate, false);
            _isFormDataCheck(isDate, false);
            _isBlobCheck(isDate, false);
            assert.equal(isDate(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isDate(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isDate(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isDate(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isDate(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isDate(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isDate(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isDate(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isDate(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isDate(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isDate(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isDate(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isNumber", () => {
        it("Validate values", () => {
            assert.equal(isNumber(null), false, "Checking null");
            assert.equal(isNumber(undefined), false, "Checking undefined");
            assert.equal(isNumber("null"), false, "Checking 'null'");
            assert.equal(isNumber("undefined"), false, "Checking 'undefined'");
            assert.equal(isNumber("1"), false, "Checking '1'");
            assert.equal(isNumber("aa"), false, "Checking 'aa'");
            assert.equal(isNumber(new Date()), false, "Checking Date");
            assert.equal(isNumber(1), true, "Checking 1");
            assert.equal(isNumber(""), false, "Checking ''");
            assert.equal(isNumber(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isNumber([]), false, "Checking []");
            assert.equal(isNumber(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isNumber(true), false, "Checking true");
            assert.equal(isNumber(false), false, "Checking false");
            assert.equal(isNumber("true"), false, "Checking 'true'");
            assert.equal(isNumber("false"), false, "Checking 'false'");
            assert.equal(isNumber(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isNumber(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isNumber(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isNumber(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isNumber(/[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(isNumber(new RegExp("")), false, "Checking new RegExp('')");
            _isFileCheck(isNumber, false);
            _isFormDataCheck(isNumber, false);
            _isBlobCheck(isNumber, false);
            assert.equal(isNumber(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isNumber(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isNumber(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isNumber(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isNumber(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isNumber(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isNumber(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isNumber(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isNumber(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isNumber(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isNumber(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isNumber(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isBoolean", () => {
        it("Validate values", () => {
            assert.equal(isBoolean(null), false, "Checking null");
            assert.equal(isBoolean(undefined), false, "Checking undefined");
            assert.equal(isBoolean("null"), false, "Checking 'null'");
            assert.equal(isBoolean("undefined"), false, "Checking 'undefined'");
            assert.equal(isBoolean("1"), false, "Checking '1'");
            assert.equal(isBoolean("aa"), false, "Checking 'aa'");
            assert.equal(isBoolean(new Date()), false, "Checking Date");
            assert.equal(isBoolean(1), false, "Checking 1");
            assert.equal(isBoolean(""), false, "Checking ''");
            assert.equal(isBoolean(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isBoolean([]), false, "Checking []");
            assert.equal(isBoolean(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isBoolean(true), true, "Checking true");
            assert.equal(isBoolean(false), true, "Checking false");
            assert.equal(isBoolean("true"), false, "Checking 'true'");
            assert.equal(isBoolean("false"), false, "Checking 'false'");

            // Test Boolean objects
            assert.equal(isBoolean(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isBoolean(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isBoolean(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isBoolean(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isBoolean(new Boolean("0")), false, "Checking new Boolean('0')");
            assert.equal(isBoolean(new Boolean(0)), false, "Checking new Boolean(0)");
            assert.equal(isBoolean(new Boolean("1")), false, "Checking new Boolean('1')");
            assert.equal(isBoolean(new Boolean(1)), false, "Checking new Boolean(1)");

            // Test Boolean values
            assert.equal(isBoolean(Boolean(true)), true, "Checking Boolean(true)");
            assert.equal(isBoolean(Boolean(false)), true, "Checking Boolean(false)");
            assert.equal(isBoolean(Boolean("true")), true, "Checking Boolean('true')");
            assert.equal(isBoolean(Boolean("false")), true, "Checking Boolean('false')");
            assert.equal(isBoolean(Boolean("0")), true, "Checking Boolean('0')");
            assert.equal(isBoolean(Boolean(0)), true, "Checking Boolean(0)");
            assert.equal(isBoolean(Boolean("1")), true, "Checking Boolean('1')");
            assert.equal(isBoolean(Boolean(1)), true, "Checking Boolean(1)");

            assert.equal(isBoolean(/[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(isBoolean(new RegExp("")), false, "Checking new RegExp('')");
            _isFileCheck(isBoolean, false);
            _isFormDataCheck(isBoolean, false);
            _isBlobCheck(isBoolean, false);
            assert.equal(isBoolean(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isBoolean(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isBoolean(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isBoolean(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isBoolean(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isBoolean(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isBoolean(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isBoolean(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isBoolean(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isBoolean(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isBoolean(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isBoolean(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isRegExp", () => {
        it("Validate values", () => {
            assert.equal(isRegExp(null), false, "Checking null");
            assert.equal(isRegExp(undefined), false, "Checking undefined");
            assert.equal(isRegExp("null"), false, "Checking 'null'");
            assert.equal(isRegExp("undefined"), false, "Checking 'undefined'");
            assert.equal(isRegExp("1"), false, "Checking '1'");
            assert.equal(isRegExp("aa"), false, "Checking 'aa'");
            assert.equal(isRegExp(new Date()), false, "Checking Date");
            assert.equal(isRegExp(1), false, "Checking 1");
            assert.equal(isRegExp(""), false, "Checking ''");
            assert.equal(isRegExp(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isRegExp([]), false, "Checking []");
            assert.equal(isRegExp(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isRegExp(true), false, "Checking true");
            assert.equal(isRegExp(false), false, "Checking false");
            assert.equal(isRegExp("true"), false, "Checking 'true'");
            assert.equal(isRegExp("false"), false, "Checking 'false'");
            assert.equal(isRegExp(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isRegExp(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isRegExp(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isRegExp(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isRegExp(/[a-z]/g), true, "Checking '/[a-z]/g'");
            assert.equal(isRegExp(new RegExp("")), true, "Checking new RegExp('')");
            _isFileCheck(isRegExp, false);
            _isFormDataCheck(isRegExp, false);
            _isBlobCheck(isRegExp, false);
            assert.equal(isRegExp(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isRegExp(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isRegExp(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isRegExp(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isRegExp(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isRegExp(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isRegExp(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isRegExp(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isRegExp(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isRegExp(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isRegExp(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isRegExp(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isFile", () => {
        it("Validate values", () => {
            assert.equal(isFile(null), false, "Checking null");
            assert.equal(isFile(undefined), false, "Checking undefined");
            assert.equal(isFile("null"), false, "Checking 'null'");
            assert.equal(isFile("undefined"), false, "Checking 'undefined'");
            assert.equal(isFile("1"), false, "Checking '1'");
            assert.equal(isFile("aa"), false, "Checking 'aa'");
            assert.equal(isFile(new Date()), false, "Checking Date");
            assert.equal(isFile(1), false, "Checking 1");
            assert.equal(isFile(""), false, "Checking ''");
            assert.equal(isFile(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isFile([]), false, "Checking []");
            assert.equal(isFile(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isFile(true), false, "Checking true");
            assert.equal(isFile(false), false, "Checking false");
            assert.equal(isFile("true"), false, "Checking 'true'");
            assert.equal(isFile("false"), false, "Checking 'false'");
            assert.equal(isFile(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isFile(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isFile(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isFile(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isFile(/[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(isFile(new RegExp("")), false, "Checking new RegExp('')");
            _isFileCheck(isFile, true);
            _isFormDataCheck(isFile, false);
            _isBlobCheck(isFile, false);
            assert.equal(isFile(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isFile(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isFile(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isFile(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isFile(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isFile(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isFile(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isFile(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isFile(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isFile(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isFile(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isFile(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isFormData", () => {
        it("Validate values", () => {
            assert.equal(isFormData(null), false, "Checking null");
            assert.equal(isFormData(undefined), false, "Checking undefined");
            assert.equal(isFormData("null"), false, "Checking 'null'");
            assert.equal(isFormData("undefined"), false, "Checking 'undefined'");
            assert.equal(isFormData("1"), false, "Checking '1'");
            assert.equal(isFormData("aa"), false, "Checking 'aa'");
            assert.equal(isFormData(new Date()), false, "Checking Date");
            assert.equal(isFormData(1), false, "Checking 1");
            assert.equal(isFormData(""), false, "Checking ''");
            assert.equal(isFormData(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isFormData([]), false, "Checking []");
            assert.equal(isFormData(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isFormData(true), false, "Checking true");
            assert.equal(isFormData(false), false, "Checking false");
            assert.equal(isFormData("true"), false, "Checking 'true'");
            assert.equal(isFormData("false"), false, "Checking 'false'");
            assert.equal(isFormData(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isFormData(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isFormData(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isFormData(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isFormData(/[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(isFormData(new RegExp("")), false, "Checking new RegExp('')");
            _isFileCheck(isFormData, false);
            _isFormDataCheck(isFormData, true);
            _isBlobCheck(isFormData, false);
            assert.equal(isFormData(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isFormData(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isFormData(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isFormData(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isFormData(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isFormData(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isFormData(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isFormData(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isFormData(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isFormData(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isFormData(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isFormData(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });

        describe("isBlob", () => {
            it("Validate values", () => {
                assert.equal(isBlob(null), false, "Checking null");
                assert.equal(isBlob(undefined), false, "Checking undefined");
                assert.equal(isBlob("null"), false, "Checking 'null'");
                assert.equal(isBlob("undefined"), false, "Checking 'undefined'");
                assert.equal(isBlob("1"), false, "Checking '1'");
                assert.equal(isBlob("aa"), false, "Checking 'aa'");
                assert.equal(isBlob(new Date()), false, "Checking Date");
                assert.equal(isBlob(1), false, "Checking 1");
                assert.equal(isBlob(""), false, "Checking ''");
                assert.equal(isBlob(_dummyFunction), false, "Checking _dummyFunction");
                assert.equal(isBlob([]), false, "Checking []");
                assert.equal(isBlob(new Array(1)), false, "Checking new Array(1)");
                assert.equal(isBlob(true), false, "Checking true");
                assert.equal(isBlob(false), false, "Checking false");
                assert.equal(isBlob("true"), false, "Checking 'true'");
                assert.equal(isBlob("false"), false, "Checking 'false'");
                assert.equal(isBlob(new Boolean(true)), false, "Checking new Boolean(true)");
                assert.equal(isBlob(new Boolean(false)), false, "Checking new Boolean(false)");
                assert.equal(isBlob(new Boolean("true")), false, "Checking new Boolean('true')");
                assert.equal(isBlob(new Boolean("false")), false, "Checking new Boolean('false')");
                assert.equal(isBlob(/[a-z]/g), false, "Checking '/[a-z]/g'");
                assert.equal(isBlob(new RegExp("")), false, "Checking new RegExp('')");
                _isFileCheck(isBlob, false);
                _isFormDataCheck(isBlob, false);
                _isBlobCheck(isBlob, true);
                assert.equal(isBlob(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
                assert.equal(isBlob(new Error("Test Error")), false, "Checking new Error('')");
                assert.equal(isBlob(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
                assert.equal(isBlob(new TestError("Test TestError")), false, "Checking new TestError('')");
                assert.equal(isBlob(_dummyError()), false, "Checking dummy error (object that looks like an error)");
                assert.equal(isBlob(Promise.reject()), false, "Checking Promise.reject");
                assert.equal(isBlob(Promise.resolve()), false, "Checking Promise.reject");
                assert.equal(isBlob(new Promise(() => {})), false, "Checking new Promise(() => {})");
                assert.equal(isBlob(_simplePromise()), false, "Checking _simplePromise");
                assert.equal(isBlob(_simplePromiseLike()), false, "Checking _simplePromiseLike");
                assert.equal(isBlob(Object.create(null)), false, "Checking Object.create(null)");
                assert.equal(isBlob(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
            });
        });


        describe("isArrayBuffer", () => {
            it("Validate values", () => {
                assert.equal(isArrayBuffer(null), false, "Checking null");
                assert.equal(isArrayBuffer(undefined), false, "Checking undefined");
                assert.equal(isArrayBuffer("null"), false, "Checking 'null'");
                assert.equal(isArrayBuffer("undefined"), false, "Checking 'undefined'");
                assert.equal(isArrayBuffer("1"), false, "Checking '1'");
                assert.equal(isArrayBuffer("aa"), false, "Checking 'aa'");
                assert.equal(isArrayBuffer(new Date()), false, "Checking Date");
                assert.equal(isArrayBuffer(1), false, "Checking 1");
                assert.equal(isArrayBuffer(""), false, "Checking ''");
                assert.equal(isArrayBuffer(_dummyFunction), false, "Checking _dummyFunction");
                assert.equal(isArrayBuffer([]), false, "Checking []");
                assert.equal(isArrayBuffer(new Array(1)), false, "Checking new Array(1)");
                assert.equal(isArrayBuffer(true), false, "Checking true");
                assert.equal(isArrayBuffer(false), false, "Checking false");
                assert.equal(isArrayBuffer("true"), false, "Checking 'true'");
                assert.equal(isArrayBuffer("false"), false, "Checking 'false'");
                assert.equal(isArrayBuffer(new Boolean(true)), false, "Checking new Boolean(true)");
                assert.equal(isArrayBuffer(new Boolean(false)), false, "Checking new Boolean(false)");
                assert.equal(isArrayBuffer(new Boolean("true")), false, "Checking new Boolean('true')");
                assert.equal(isArrayBuffer(new Boolean("false")), false, "Checking new Boolean('false')");
                assert.equal(isArrayBuffer(/[a-z]/g), false, "Checking '/[a-z]/g'");
                assert.equal(isArrayBuffer(new RegExp("")), false, "Checking new RegExp('')");
                _isFileCheck(isArrayBuffer, false);
                _isFormDataCheck(isArrayBuffer, false);
                _isBlobCheck(isArrayBuffer, false);
                assert.equal(isArrayBuffer(new ArrayBuffer(0)), true, "Checking new ArrayBuffer([])");
                assert.equal(isArrayBuffer(new Error("Test Error")), false, "Checking new Error('')");
                assert.equal(isArrayBuffer(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
                assert.equal(isArrayBuffer(new TestError("Test TestError")), false, "Checking new TestError('')");
                assert.equal(isArrayBuffer(_dummyError()), false, "Checking dummy error (object that looks like an error)");
                assert.equal(isArrayBuffer(Promise.reject()), false, "Checking Promise.reject");
                assert.equal(isArrayBuffer(Promise.resolve()), false, "Checking Promise.reject");
                assert.equal(isArrayBuffer(new Promise(() => {})), false, "Checking new Promise(() => {})");
                assert.equal(isArrayBuffer(_simplePromise()), false, "Checking _simplePromise");
                assert.equal(isArrayBuffer(_simplePromiseLike()), false, "Checking _simplePromiseLike");
                assert.equal(isArrayBuffer(Object.create(null)), false, "Checking Object.create(null)");
                assert.equal(isArrayBuffer(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
            });
        });
    });

    describe("isError", () => {
        it("Validate values", () => {
            assert.equal(isError(null), false, "Checking null");
            assert.equal(isError(undefined), false, "Checking undefined");
            assert.equal(isError("null"), false, "Checking 'null'");
            assert.equal(isError("undefined"), false, "Checking 'undefined'");
            assert.equal(isError("1"), false, "Checking '1'");
            assert.equal(isError("aa"), false, "Checking 'aa'");
            assert.equal(isError(new Date()), false, "Checking Date");
            assert.equal(isError(1), false, "Checking 1");
            assert.equal(isError(""), false, "Checking ''");
            assert.equal(isError(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isError([]), false, "Checking []");
            assert.equal(isError(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isError(true), false, "Checking true");
            assert.equal(isError(false), false, "Checking false");
            assert.equal(isError("true"), false, "Checking 'true'");
            assert.equal(isError("false"), false, "Checking 'false'");
            assert.equal(isError(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isError(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isError(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isError(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isError(/[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(isError(new RegExp("")), false, "Checking new RegExp('')");
            _isFileCheck(isError, false);
            _isFormDataCheck(isError, false);
            _isBlobCheck(isError, false);
            assert.equal(isError(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isError(new Error("Test Error")), true, "Checking new Error('')");
            assert.equal(isError(new TypeError("Test TypeError")), true, "Checking new TypeError('')");
            assert.equal(isError(new TestError("Test TestError")), true, "Checking new TestError('')");
            assert.equal(isError(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isError(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isError(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isError(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isError(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isError(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isError(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isError(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isPromiseLike", () => {
        it("Validate values", () => {
            assert.equal(isPromiseLike(null), false, "Checking null");
            assert.equal(isPromiseLike(undefined), false, "Checking undefined");
            assert.equal(isPromiseLike("null"), false, "Checking 'null'");
            assert.equal(isPromiseLike("undefined"), false, "Checking 'undefined'");
            assert.equal(isPromiseLike("1"), false, "Checking '1'");
            assert.equal(isPromiseLike("aa"), false, "Checking 'aa'");
            assert.equal(isPromiseLike(new Date()), false, "Checking Date");
            assert.equal(isPromiseLike(1), false, "Checking 1");
            assert.equal(isPromiseLike(""), false, "Checking ''");
            assert.equal(isPromiseLike(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isPromiseLike([]), false, "Checking []");
            assert.equal(isPromiseLike(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isPromiseLike(true), false, "Checking true");
            assert.equal(isPromiseLike(false), false, "Checking false");
            assert.equal(isPromiseLike("true"), false, "Checking 'true'");
            assert.equal(isPromiseLike("false"), false, "Checking 'false'");
            assert.equal(isPromiseLike(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isPromiseLike(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isPromiseLike(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isPromiseLike(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isPromiseLike(/[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(isPromiseLike(new RegExp("")), false, "Checking new RegExp('')");
            _isFileCheck(isPromiseLike, false);
            _isFormDataCheck(isPromiseLike, false);
            _isBlobCheck(isPromiseLike, false);
            assert.equal(isPromiseLike(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isPromiseLike(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isPromiseLike(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isPromiseLike(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isPromiseLike(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isPromiseLike(Promise.reject()), true, "Checking Promise.reject");
            assert.equal(isPromiseLike(Promise.resolve()), true, "Checking Promise.reject");
            assert.equal(isPromiseLike(new Promise(() => {})), true, "Checking new Promise(() => {})");
            assert.equal(isPromiseLike(_simplePromise()), true, "Checking _simplePromise");
            assert.equal(isPromiseLike(_simplePromiseLike()), true, "Checking _simplePromiseLike");
            assert.equal(isPromiseLike(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isPromiseLike(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isPromise", () => {
        it("Validate values", () => {
            assert.equal(isPromise(null), false, "Checking null");
            assert.equal(isPromise(undefined), false, "Checking undefined");
            assert.equal(isPromise("null"), false, "Checking 'null'");
            assert.equal(isPromise("undefined"), false, "Checking 'undefined'");
            assert.equal(isPromise("1"), false, "Checking '1'");
            assert.equal(isPromise("aa"), false, "Checking 'aa'");
            assert.equal(isPromise(new Date()), false, "Checking Date");
            assert.equal(isPromise(0), false, "Checking 0");
            assert.equal(isPromise(1), false, "Checking 1");
            assert.equal(isPromise(""), false, "Checking ''");
            assert.equal(isPromise(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isPromise([]), false, "Checking []");
            assert.equal(isPromise(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isPromise(true), false, "Checking true");
            assert.equal(isPromise(false), false, "Checking false");
            assert.equal(isPromise("true"), false, "Checking 'true'");
            assert.equal(isPromise("false"), false, "Checking 'false'");
            assert.equal(isPromise(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isPromise(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isPromise(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isPromise(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isPromise(/[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(isPromise(new RegExp("")), false, "Checking new RegExp('')");
            _isFileCheck(isPromise, false);
            _isFormDataCheck(isPromise, false);
            _isBlobCheck(isPromise, false);
            assert.equal(isPromise(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isPromise(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isPromise(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isPromise(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isPromise(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isPromise(Promise.reject()), true, "Checking Promise.reject");
            assert.equal(isPromise(Promise.resolve()), true, "Checking Promise.reject");
            assert.equal(isPromise(new Promise(() => {})), true, "Checking new Promise(() => {})");
            assert.equal(isPromise(_simplePromise()), true, "Checking _simplePromise");
            assert.equal(isPromise(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isPromise(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isPromise(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isNotTruthy", () => {
        it("Validate values", () => {
            assert.equal(isNotTruthy(null), true, "Checking null");
            assert.equal(isNotTruthy(undefined), true, "Checking undefined");
            assert.equal(isNotTruthy("null"), false, "Checking 'null'");
            assert.equal(isNotTruthy("undefined"), false, "Checking 'undefined'");
            assert.equal(isNotTruthy("0"), false, "Checking '0'");
            assert.equal(isNotTruthy("1"), false, "Checking '1'");
            assert.equal(isNotTruthy("aa"), false, "Checking 'aa'");
            assert.equal(isNotTruthy(new Date()), false, "Checking Date");
            assert.equal(isNotTruthy(0), true, "Checking 0");
            assert.equal(isNotTruthy(1), false, "Checking 1");
            assert.equal(isNotTruthy(""), true, "Checking ''");
            assert.equal(isNotTruthy(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isNotTruthy([]), false, "Checking []");
            assert.equal(isNotTruthy(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isNotTruthy(true), false, "Checking true");
            assert.equal(isNotTruthy(false), true, "Checking false");
            assert.equal(isNotTruthy("true"), false, "Checking 'true'");
            assert.equal(isNotTruthy("false"), false, "Checking 'false'");

            // Test Boolean objects
            assert.equal(isNotTruthy(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isNotTruthy(new Boolean(false)), true, "Checking new Boolean(false)");
            assert.equal(isNotTruthy(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isNotTruthy(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isNotTruthy(new Boolean("0")), false, "Checking new Boolean('0')");
            assert.equal(isNotTruthy(new Boolean(0)), true, "Checking new Boolean(0)");
            assert.equal(isNotTruthy(new Boolean("1")), false, "Checking new Boolean('0')");
            assert.equal(isNotTruthy(new Boolean(1)), false, "Checking new Boolean(0)");

            // Test Boolean values
            assert.equal(isNotTruthy(Boolean(true)), false, "Checking Boolean(true)");
            assert.equal(isNotTruthy(Boolean(false)), true, "Checking Boolean(false)");
            assert.equal(isNotTruthy(Boolean("true")), false, "Checking Boolean('true')");
            assert.equal(isNotTruthy(Boolean("false")), false, "Checking Boolean('false')");
            assert.equal(isNotTruthy(Boolean("0")), false, "Checking Boolean('0')");
            assert.equal(isNotTruthy(Boolean(0)), true, "Checking Boolean(0)");
            assert.equal(isNotTruthy(Boolean("1")), false, "Checking Boolean('0')");
            assert.equal(isNotTruthy(Boolean(1)), false, "Checking Boolean(0)");

            assert.equal(isNotTruthy(/[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(isNotTruthy(new RegExp("")), false, "Checking new RegExp('')");
            assert.equal(isNotTruthy(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isNotTruthy(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isNotTruthy(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isNotTruthy(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isNotTruthy(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isNotTruthy(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isNotTruthy(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isNotTruthy(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isNotTruthy(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isNotTruthy(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isNotTruthy(Object.create(null)), false, "Checking Object.create(null)");
            assert.equal(isNotTruthy(polyObjCreate(null)), false, "Checking polyObjCreate(null)");
        });
    });

    describe("isTruthy", () => {
        it("Validate values", () => {
            assert.equal(isTruthy(null), false, "Checking null");
            assert.equal(isTruthy(undefined), false, "Checking undefined");
            assert.equal(isTruthy("null"), true, "Checking 'null'");
            assert.equal(isTruthy("undefined"), true, "Checking 'undefined'");
            assert.equal(isTruthy("0"), true, "Checking '0'");
            assert.equal(isTruthy("1"), true, "Checking '1'");
            assert.equal(isTruthy("aa"), true, "Checking 'aa'");
            assert.equal(isTruthy(new Date()), true, "Checking Date");
            assert.equal(isTruthy(0), false, "Checking 0");
            assert.equal(isTruthy(1), true, "Checking 1");
            assert.equal(isTruthy(""), false, "Checking ''");
            assert.equal(isTruthy(_dummyFunction), true, "Checking _dummyFunction");
            assert.equal(isTruthy([]), true, "Checking []");
            assert.equal(isTruthy(new Array(1)), true, "Checking new Array(1)");
            assert.equal(isTruthy(true), true, "Checking true");
            assert.equal(isTruthy(false), false, "Checking false");
            assert.equal(isTruthy("true"), true, "Checking 'true'");
            assert.equal(isTruthy("false"), true, "Checking 'false'");
            // Test Boolean objects
            assert.equal(isTruthy(new Boolean(true)), true, "Checking new Boolean(true)");
            assert.equal(isTruthy(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isTruthy(new Boolean("true")), true, "Checking new Boolean('true')");
            assert.equal(isTruthy(new Boolean("false")), true, "Checking new Boolean('false')");
            assert.equal(isTruthy(new Boolean("0")), true, "Checking new Boolean('0')");
            assert.equal(isTruthy(new Boolean(0)), false, "Checking new Boolean(0)");
            assert.equal(isTruthy(new Boolean("1")), true, "Checking new Boolean('1')");
            assert.equal(isTruthy(new Boolean(1)), true, "Checking new Boolean(1)");

            // test Boolean values
            assert.equal(isTruthy(Boolean(true)), true, "Checking Boolean(true)");
            assert.equal(isTruthy(Boolean(false)), false, "Checking Boolean(false)");
            assert.equal(isTruthy(Boolean("true")), true, "Checking Boolean('true')");
            assert.equal(isTruthy(Boolean("false")), true, "Checking Boolean('false')");
            assert.equal(isTruthy(Boolean("0")), true, "Checking Boolean('0')");
            assert.equal(isTruthy(Boolean(0)), false, "Checking Boolean(0)");
            assert.equal(isTruthy(Boolean("1")), true, "Checking Boolean('1')");
            assert.equal(isTruthy(Boolean(1)), true, "Checking Boolean(1)");

            assert.equal(isTruthy(/[a-z]/g), true, "Checking '/[a-z]/g'");
            assert.equal(isTruthy(new RegExp("")), true, "Checking new RegExp('')");
            assert.equal(isTruthy(new ArrayBuffer(0)), true, "Checking new ArrayBuffer([])");
            assert.equal(isTruthy(new Error("Test Error")), true, "Checking new Error('')");
            assert.equal(isTruthy(new TypeError("Test TypeError")), true, "Checking new TypeError('')");
            assert.equal(isTruthy(new TestError("Test TestError")), true, "Checking new TestError('')");
            assert.equal(isTruthy(_dummyError()), true, "Checking dummy error (object that looks like an error)");
            assert.equal(isTruthy(Promise.reject()), true, "Checking Promise.reject");
            assert.equal(isTruthy(Promise.resolve()), true, "Checking Promise.reject");
            assert.equal(isTruthy(new Promise(() => {})), true, "Checking new Promise(() => {})");
            assert.equal(isTruthy(_simplePromise()), true, "Checking _simplePromise");
            assert.equal(isTruthy(_simplePromiseLike()), true, "Checking _simplePromiseLike");
            assert.equal(isTruthy(Object.create(null)), true, "Checking Object.create(null)");
            assert.equal(isTruthy(polyObjCreate(null)), true, "Checking polyObjCreate(null)");
        });
    });

    function _dummyFunction() {

    }

    function _dummyError(): Error {
        return {
            name: "Dummy Error",
            message: "Dummy Message"
        };
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
        if (!isNode()) {
            assert.equal(chkFn(theFile), expected, "Checking new File([], '') - " + (typeof theFile) + dumpObj(theFile));
        }
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

        if (!isNode()) {
            assert.equal(chkFn(formData), expected, "Checking new FormData()");
        }
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

        if (!isNode()) {
            assert.equal(chkFn(blob), expected, "Checking new Blob()");
        }
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
