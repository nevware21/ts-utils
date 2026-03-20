/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { strTruncate } from "../../../../src/string/truncate";

describe("strTruncate helper", () => {
    it("returns empty for zero or negative lengths", () => {
        assert.equal(strTruncate("hello", 0), "");
        assert.equal(strTruncate("hello", -1), "");
        assert.equal(strTruncate("hello", NaN as any), "");
    });

    it("returns the original value when no truncation is needed", () => {
        assert.equal(strTruncate("short", 10), "short");
        assert.equal(strTruncate("short", 10, "..."), "short");
        assert.equal(strTruncate("short", Infinity as any, "..."), "short");
    });

    it("truncates without a suffix", () => {
        assert.equal(strTruncate("hello world", 5), "hello");
        assert.equal(strTruncate(123456 as any, 4), "1234");
    });

    it("truncates with a suffix while honoring max length", () => {
        assert.equal(strTruncate("hello world", 8, "..."), "hello...");
        assert.equal(strTruncate("hello world", 7, ".."), "hello..");
        assert.equal(strTruncate("hello world", 7, "..."), "hell...");
    });

    it("returns a truncated suffix when the suffix is longer than the max length", () => {
        assert.equal(strTruncate("important", 3, "..."), "...");
        assert.equal(strTruncate("important", 2, null as any), "im");
        assert.equal(strTruncate("important", 2, "..."), "..");
    });

    it("coerces non-string suffix values via asString", () => {
        // Number suffix should be coerced to string
        assert.equal(strTruncate("hello world", 6, 123 as any), "hel123");
        // Boolean suffix should be coerced to string
        assert.equal(strTruncate("hello world", 6, true as any), "hetrue");
        // Object suffix should be coerced via asString
        assert.equal(strTruncate("hello world", 10, { toString: () => "!" } as any), "hello wor!");
    });

    it("respects maxLength constraint with non-string suffix after coercion", () => {
        // Test with number suffix - must coerce and respect maxLength
        const numResult = strTruncate("abcdefghij", 5, 999 as any);
        assert.equal(numResult.length, 5, "Result length must not exceed maxLength");
        assert.equal(numResult, "ab999", "Number suffix coerced correctly");
        
        // Test with boolean suffix - must coerce and respect maxLength
        const boolResult = strTruncate("abcdefghij", 7, false as any);
        assert.equal(boolResult.length, 7, "Result length must not exceed maxLength");
        assert.equal(boolResult, "abfalse", "Boolean suffix coerced correctly");
        
        // Test with number suffix longer than maxLength - suffix itself truncated
        const truncSuffixResult = strTruncate("hello", 3, 123456 as any);
        assert.equal(truncSuffixResult.length, 3, "Result length must not exceed maxLength even when suffix exceeds it");
        assert.equal(truncSuffixResult, "123", "Coerced suffix properly truncated to fit maxLength");
    });

    it("throws for null and undefined values", () => {
        _expectThrow(() => {
            strTruncate(null as any, 2);
        });

        _expectThrow(() => {
            strTruncate(undefined as any, 2);
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