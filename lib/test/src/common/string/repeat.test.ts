/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { polyStrRepeat, strRepeat } from "../../../../src/string/repeat";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isUndefined } from "../../../../src/helpers/base";

describe("string helpers", () => {
    it("strRepeat null / undefined", () => {
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

    it("polyStrRepeat null / undefined", () => {
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

    it("strRepeat With values", () => {
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

    it("polyStrRepeat With values", () => {
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

    it("polyStrRepeat throws a RangeError for a result which is longer than a string can be, like the native function", () => {
        // The count isn't truncated to 32 bits (2^32 + 1 was 1, so this returned "ab")
        assert.throws(() => polyStrRepeat("ab", Math.pow(2, 32) + 1), RangeError);
        assert.throws(() => polyStrRepeat("a", Math.pow(2, 31)), RangeError);

        // An empty string (or a count of 0) is never too long
        assert.equal(polyStrRepeat("", Math.pow(2, 40)), "");
        assert.equal(polyStrRepeat("ab", 0), "");

        // A negative or infinite count throws, even for an empty string
        assert.throws(() => polyStrRepeat("", -1), RangeError);
        assert.throws(() => polyStrRepeat("", Infinity), RangeError);
        if ((String.prototype as any).repeat) {
            assert.throws(() => String.prototype.repeat.call("ab", Math.pow(2, 32) + 1), RangeError, undefined, "String.prototype.repeat");
            assert.equal(String.prototype.repeat.call("", Math.pow(2, 40)), "", "String.prototype.repeat");
            assert.throws(() => String.prototype.repeat.call("", Infinity), RangeError, undefined, "String.prototype.repeat");
        }
    });

    it("polyStrRepeat converts the value before the count, and a Symbol throws a TypeError, like the native function", () => {
        const getOrder = (repeatFn: (value: any, count: any) => string) => {
            let order: string[] = [];
            let result = repeatFn({
                toString: () => {
                    order.push("value");
                    return "ab";
                }
            }, {
                valueOf: () => {
                    order.push("count");
                    return 2;
                }
            });

            return { result, order };
        };

        assert.deepEqual(getOrder(polyStrRepeat), { result: "abab", order: ["value", "count"] });
        if ((String.prototype as any).repeat) {
            assert.deepEqual(getOrder((value, count) => String.prototype.repeat.call(value, count)), { result: "abab", order: ["value", "count"] }, "String.prototype.repeat");
        }

        if (typeof Symbol === "function") {
            assert.throws(() => polyStrRepeat(Symbol("value") as any, 1), TypeError);
            assert.throws(() => polyStrRepeat("ab", Symbol("count") as any), TypeError);
            (String.prototype as any).repeat && assert.throws(() => String.prototype.repeat.call("ab", Symbol("count") as any), TypeError);
        }
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
