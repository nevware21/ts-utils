/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isUndefined } from "../../../../src/helpers/base";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { mathTrunc, polyMathTrunc } from "../../../../src/math/trunc";

describe("math helpers", () => {
    it("poly math trunc", () => {
        _checkPolyTrunc(null);
        _checkPolyTrunc(undefined);
        _checkPolyTrunc("null");
        _checkPolyTrunc("undefined");
        _checkPolyTrunc("1");
        _checkPolyTrunc("aa");
        _checkPolyTrunc(new Date());
        _checkPolyTrunc(1);
        _checkPolyTrunc("");
        _checkPolyTrunc(1.12345);
        _checkPolyTrunc(1.9);
        _checkPolyTrunc(-1.1);
        _checkPolyTrunc(-1.9);
    });

    it("math trunc", () => {
        _checkTrunc(null);
        _checkTrunc(undefined);
        _checkTrunc("null");
        _checkTrunc("undefined");
        _checkTrunc("1");
        _checkTrunc("aa");
        _checkTrunc(new Date());
        _checkTrunc(1);
        _checkTrunc("");
        _checkTrunc(1.12345);
        _checkTrunc(1.9);
        _checkTrunc(-1.1);
        _checkTrunc(-1.9);
    });

    function _checkPolyTrunc(value: any) {
        let truncResult: any;
        let nativeResult: any;
        let truncThrew: any;
        let nativeThrew: any;
        try {
            truncResult = polyMathTrunc(value);
        } catch (e) {
            truncThrew = e;
        }
        try {
            nativeResult = Math.trunc(value);
        } catch (e) {
            nativeThrew = e;
        }

        if (truncThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and polyMathTrunc threw or returned undefined [" + dumpObj(truncThrew || truncResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but polyMathTrunc didn't [" + dumpObj(truncThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if (isNaN(truncResult)) {
            assert.ok(isNaN(nativeResult),
                "Checking whether the Native and polyMathTrunc returned NaN [" + dumpObj(truncThrew || truncResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if (isNaN(nativeResult)) {
            assert.ok(isNaN(truncResult),
                "Checking whether the Native and polyMathTrunc returned NaN [" + dumpObj(truncThrew || truncResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(truncResult, nativeResult,
                "Checking whether the Native and polyMathTrunc returned the same [" + dumpObj(truncThrew || truncResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }

    function _checkTrunc(value: any) {
        let truncResult: any;
        let nativeResult: any;
        let truncThrew: any;
        let nativeThrew: any;
        try {
            truncResult = mathTrunc(value);
        } catch (e) {
            truncThrew = e;
        }
        try {
            nativeResult = mathTrunc(value);
        } catch (e) {
            nativeThrew = e;
        }

        if (truncThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and mathTrunc threw or returned undefined [" + dumpObj(truncThrew || truncResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but mathTrunc didn't [" + dumpObj(truncThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if (isNaN(truncResult)) {
            assert.ok(isNaN(nativeResult),
                "Checking whether the Native and mathTrunc returned NaN [" + dumpObj(truncThrew || truncResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if (isNaN(nativeResult)) {
            assert.ok(isNaN(truncResult),
                "Checking whether the Native and mathTrunc returned NaN [" + dumpObj(truncThrew || truncResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(truncResult, nativeResult,
                "Checking whether the Native and mathTrunc returned the same [" + dumpObj(truncThrew || truncResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }
});