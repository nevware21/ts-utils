/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { polyStrRepeat, strRepeat } from "../../../../src/string/repeat";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isUndefined } from "../../../../src/helpers/base";

describe("string helpers", () => {
    describe("strRepeat null / undefined", () => {
        _checkRepeat(null, 0);
        _checkRepeat(null, 2);
        _checkRepeat(null, -2);
        _checkRepeat(null, 10);
        _checkRepeat(null, 100);
        _checkRepeat(undefined, 0);
        _checkRepeat(undefined, 2);
        _checkRepeat(undefined, -2);
        _checkRepeat(undefined, 10);
        _checkRepeat(undefined, 100);
    });

    describe("polyStrRepeat null / undefined", () => {
        _checkPolyRepeat(null, 0);
        _checkPolyRepeat(null, 2);
        _checkPolyRepeat(null, -2);
        _checkPolyRepeat(null, 10);
        _checkPolyRepeat(null, 100);
        _checkPolyRepeat(undefined, 0);
        _checkPolyRepeat(undefined, 2);
        _checkPolyRepeat(undefined, -2);
        _checkPolyRepeat(undefined, 10);
        _checkPolyRepeat(undefined, 100);
    });

    describe("strRepeat With values", () => {
        _checkRepeat("", 0);
        _checkRepeat("null", 0);
        _checkRepeat("abcdefg", 0);
        _checkRepeat("abcdefg", 10);
        _checkRepeat("abcdefg", 100);
        _checkRepeat("abcdefg", -1);
        _checkRepeat("abcdefg", -10);
        _checkRepeat("abcdefg", -100);
        _checkRepeat("abc", 3.5);
        _checkRepeat("abc", 1/0);
    });

    describe("polyStrRepeat With values", () => {
        _checkPolyRepeat("", 0);
        _checkPolyRepeat("null", 0);
        _checkPolyRepeat("abcdefg", 0);
        _checkPolyRepeat("abcdefg", 10);
        _checkPolyRepeat("abcdefg", 100);
        _checkPolyRepeat("abcdefg", -1);
        _checkPolyRepeat("abcdefg", -10);
        _checkPolyRepeat("abcdefg", -100);
        _checkPolyRepeat("abc", 3.5);
        _checkPolyRepeat("abc", 1/0);
    });

    function _checkRepeat(value: any, count: number) {
        let repeatResult: any;
        let nativeResult: any;
        let repeatThrew: any;
        let nativeThrew: any;
        try {
            repeatResult = strRepeat(value, count);
        } catch (e) {
            repeatThrew = e;
        }
        try {
            nativeResult = String.prototype.repeat.call(value as any, count);
        } catch (e) {
            nativeThrew = e;
        }

        if (repeatThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and strRepeat threw or returned undefined [" + dumpObj(repeatThrew || repeatResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but strRepeat didn't [" + dumpObj(repeatThrew || repeatResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(repeatResult, nativeResult,
                "Checking whether the Native and strRepeat returned the same [" + dumpObj(repeatThrew || repeatResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }

    function _checkPolyRepeat(value: any, count: number) {
        let repeatResult: any;
        let nativeResult: any;
        let repeatThrew: any;
        let nativeThrew: any;
        try {
            repeatResult = polyStrRepeat(value, count);
        } catch (e) {
            repeatThrew = e;
        }
        try {
            nativeResult = String.prototype.repeat.call(value as any, count);
        } catch (e) {
            nativeThrew = e;
        }

        if (repeatThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and polyStrRepeat threw or returned undefined [" + dumpObj(repeatThrew || repeatResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but polyStrRepeat didn't [" + dumpObj(repeatThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(repeatResult, nativeResult,
                "Checking whether the Native and polyStrRepeat returned the same [" + dumpObj(repeatThrew || repeatResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }
});
