/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { strSlice } from "../../../../src/string/slice";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isUndefined } from "../../../../src/helpers/base";

describe("string helpers", () => {
    describe("strSlice null / undefined", () => {
        _checkSlice(null, 0);
        _checkSlice(null, 2);
        _checkSlice(null, -2);
        _checkSlice(null, 0, 0);
        _checkSlice(null, 0, -2);
        _checkSlice(null, 2, -2);
        _checkSlice(null, -2, -2);
        _checkSlice(null, -2, 2);
        _checkSlice(undefined, 0);
        _checkSlice(undefined, 2);
        _checkSlice(undefined, -2);
        _checkSlice(undefined, 0, 0);
        _checkSlice(undefined, 0, 2);
        _checkSlice(undefined, 2, -2);
        _checkSlice(undefined, -2, -2);
        _checkSlice(undefined, -2, 2);
    });

    describe("strSlice With values", () => {
        _checkSlice("", 0);
        _checkSlice("null", 0);
        _checkSlice("abcdefg", 0);
        _checkSlice("abcdefg", 10);
        _checkSlice("abcdefg", 100);
        _checkSlice("abcdefg", -1);
        _checkSlice("abcdefg", -10);
        _checkSlice("abcdefg", -100);

        _checkSlice("", 0, 0);
        _checkSlice("null", 0, -1);
        _checkSlice("abcdefg", 0, 1);
        _checkSlice("abcdefg", 0, -1);
        _checkSlice("abcdefg", 10, 1);
        _checkSlice("abcdefg", 100, 10);
        _checkSlice("abcdefg", -1, 0);
        _checkSlice("abcdefg", -10, 5);
        _checkSlice("abcdefg", -100, -5);
    });

    function _checkSlice(value: any, beginIndex: number, endIndex?: number) {
        let trimResult: any;
        let nativeResult: any;
        let trimThrew: any;
        let nativeThrew: any;
        try {
            trimResult = strSlice(value, beginIndex, endIndex);
        } catch (e) {
            trimThrew = e;
        }
        try {
            nativeResult = String.prototype.slice.call(value as any, beginIndex, endIndex);
        } catch (e) {
            nativeThrew = e;
        }

        if (trimThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and strSlice threw or returned undefined [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but strSlice didn't [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(trimResult, nativeResult,
                "Checking whether the Native and strSlice returned the same [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }
});
