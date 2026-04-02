/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { strEndsWithAny, strStartsWithAny } from "../../../../src/string/starts_ends_with_any";

describe("string starts / ends with any helpers", () => {
    describe("strStartsWithAny", () => {
        it("throws for null/undefined values", () => {
            _expectThrow(() => strStartsWithAny(null as any, ["a"]));
            _expectThrow(() => strStartsWithAny(undefined as any, ["a"]));
        });

        it("returns false for empty or missing search values", () => {
            assert.equal(strStartsWithAny("hello", []), false, "[] should be false");
            assert.equal(strStartsWithAny("hello", null as any), false, "null search list should be false");
            assert.equal(strStartsWithAny("hello", undefined as any), false, "undefined search list should be false");
        });

        it("matches native startsWith behavior for each candidate", () => {
            _checkStartsWithAny("hello", ["x", "h", "he"]);
            _checkStartsWithAny("hello", ["x", "y"]);
            _checkStartsWithAny("hello", ["", "z"]);
            _checkStartsWithAny("hello", [null as any, "he"]);
            _checkStartsWithAny("undefined", [undefined as any]);
            _checkStartsWithAny("1234", [123 as any]);
            _checkStartsWithAny("hello", ["x", "l"], 2);
            _checkStartsWithAny("hello", ["h", "he"], 10);
        });

        it("supports array-like search values", () => {
            let searchValues = { 0: "x", 1: "he", length: 2 };
            assert.equal(strStartsWithAny("hello", searchValues as any), true, "array-like should be supported");
        });
    });

    describe("strEndsWithAny", () => {
        it("throws for null/undefined values", () => {
            _expectThrow(() => strEndsWithAny(null as any, ["a"]));
            _expectThrow(() => strEndsWithAny(undefined as any, ["a"]));
        });

        it("returns false for empty or missing search values", () => {
            assert.equal(strEndsWithAny("hello", []), false, "[] should be false");
            assert.equal(strEndsWithAny("hello", null as any), false, "null search list should be false");
            assert.equal(strEndsWithAny("hello", undefined as any), false, "undefined search list should be false");
        });

        it("matches native endsWith behavior for each candidate", () => {
            _checkEndsWithAny("hello", ["x", "o", "lo"]);
            _checkEndsWithAny("hello", ["x", "y"]);
            _checkEndsWithAny("hello", ["", "z"]);
            _checkEndsWithAny("hello", [null as any, "lo"]);
            _checkEndsWithAny("null", [null as any]);
            _checkEndsWithAny("1234", [34 as any]);
            _checkEndsWithAny("hello", ["e", "he"], 2);
            _checkEndsWithAny("hello", ["o", "lo"], 10);
        });

        it("supports array-like search values", () => {
            let searchValues = { 0: "x", 1: "lo", length: 2 };
            assert.equal(strEndsWithAny("hello", searchValues as any), true, "array-like should be supported");
        });
    });

    function _checkStartsWithAny(value: any, searchValues: ArrayLike<any>, position?: number) {
        let helperResult = strStartsWithAny(value, searchValues, position);
        let nativeResult = false;

        for (let idx = 0; idx < searchValues.length; idx++) {
            if (String.prototype.startsWith.call("" + value, searchValues[idx], position)) {
                nativeResult = true;
                break;
            }
        }

        assert.equal(helperResult, nativeResult, "strStartsWithAny should match native for " + dumpObj(value));
    }

    function _checkEndsWithAny(value: any, searchValues: ArrayLike<any>, length?: number) {
        let helperResult = strEndsWithAny(value, searchValues, length);
        let nativeResult = false;

        for (let idx = 0; idx < searchValues.length; idx++) {
            if (String.prototype.endsWith.call("" + value, searchValues[idx], length)) {
                nativeResult = true;
                break;
            }
        }

        assert.equal(helperResult, nativeResult, "strEndsWithAny should match native for " + dumpObj(value));
    }

    function _expectThrow(cb: () => void): void {
        try {
            cb();
            assert.ok(false, "Expected an exception to be thrown");
        } catch (e) {
            assert.ok(true, "Expected an exception to be thrown");
        }
    }
});
