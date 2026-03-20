/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { strCount } from "../../../../src/string/count";

describe("strCount helper", () => {
    it("counts non-overlapping matches", () => {
        assert.equal(strCount("hello hello", "hello"), 2);
        assert.equal(strCount("aaaa", "aa"), 2);
        assert.equal(strCount("banana", "ana"), 1);
        assert.equal(strCount("abc", "z"), 0);
    });

    it("returns zero for empty search strings", () => {
        assert.equal(strCount("abc", ""), 0);
    });

    it("coerces non-string values via asString semantics", () => {
        assert.equal(strCount(10101 as any, 10 as any), 2);
        assert.equal(strCount("null undefined false 0 null" as any, null as any), 2);
        assert.equal(strCount("null undefined false 0 null" as any, undefined as any), 1);
        assert.equal(strCount("null undefined false 0 null" as any, false as any), 1);
        assert.equal(strCount("null undefined false 0 null" as any, 0 as any), 1);
    });

    it("throws for null and undefined values", () => {
        _expectThrow(() => {
            strCount(null as any, "a");
        });

        _expectThrow(() => {
            strCount(undefined as any, "a");
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
});