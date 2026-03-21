/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { polyStrAt, strAt } from "../../../../src/string/at";

describe("strAt helper", () => {
    it("returns characters for positive and negative indexes", () => {
        assert.equal(strAt("hello", 0), "h");
        assert.equal(strAt("hello", 1), "e");
        assert.equal(strAt("hello", -1), "o");
        assert.equal(strAt("hello", -2), "l");
    });

    it("returns undefined for out of range indexes", () => {
        assert.isUndefined(strAt("hello", 10));
        assert.isUndefined(strAt("hello", -10));
    });

    it("coerces non-string values", () => {
        assert.equal(strAt(12345 as any, 2), "3");
        assert.equal(polyStrAt(false as any, 1), "a");
    });

    it("throws for null and undefined", () => {
        _expectThrow(() => {
            strAt(null as any, 0);
        });

        _expectThrow(() => {
            polyStrAt(undefined as any, 0);
        });
    });
});

describe("polyStrAt helper", () => {
    it("matches native String.prototype.at behavior", () => {
        let testCases: { value: any; index: any }[] = [
            { value: "hello", index: 0 },
            { value: "hello", index: 2 },
            { value: "hello", index: -1 },
            { value: "hello", index: -6 },
            { value: "hello", index: 99 },
            { value: "hello", index: NaN },
            { value: 12345, index: 1 },
            { value: true, index: 2 },
            { value: { toString: () => "xyz" }, index: -1 }
        ];

        for (let lp = 0; lp < testCases.length; lp++) {
            let testCase = testCases[lp];
            _checkNativeParity("strAt", (value, index) => {
                return strAt(value, index);
            }, testCase.value, testCase.index);

            _checkNativeParity("polyStrAt", (value, index) => {
                return polyStrAt(value, index);
            }, testCase.value, testCase.index);
        }
    });
});

function _expectThrow(cb: () => void): Error {
    try {
        cb();
    } catch (e) {
        assert.ok(true, "Expected an exception to be thrown");
        return e as Error;
    }

    assert.ok(false, "Expected an exception to be thrown");
    return null as any;
}

function _checkNativeParity(testName: string, testFn: (value: any, index: any) => string | undefined, value: any, index: any) {
    let testResult: any;
    let nativeResult: any;
    let testThrew: any;
    let nativeThrew: any;

    try {
        testResult = testFn(value, index);
    } catch (e) {
        testThrew = e;
    }

    try {
        nativeResult = (String.prototype as any).at.call(value, index);
    } catch (e) {
        nativeThrew = e;
    }

    if (testThrew) {
        assert.equal(true, !!nativeThrew,
            "Checking whether Native and " + testName + " both threw [" + dumpObj(testThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "] [" + dumpObj(index) + "]");
    } else if (nativeThrew) {
        assert.ok(false,
            "Native threw but " + testName + " did not [" + dumpObj(testResult) + "] - [" + dumpObj(nativeThrew) + "] for [" + dumpObj(value) + "] [" + dumpObj(index) + "]");
    } else {
        assert.equal(testResult, nativeResult,
            "Checking whether Native and " + testName + " returned the same [" + dumpObj(testResult) + "] - [" + dumpObj(nativeResult) + "] for [" + dumpObj(value) + "] [" + dumpObj(index) + "]");
    }
}
