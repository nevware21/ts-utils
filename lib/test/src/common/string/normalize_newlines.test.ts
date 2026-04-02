/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { strNormalizeNewlines } from "../../../../src/string/normalize_newlines";

describe("string newline normalization helper", () => {
    it("throws for null/undefined values", () => {
        _expectThrow(() => strNormalizeNewlines(null as any));
        _expectThrow(() => strNormalizeNewlines(undefined as any));
    });

    it("normalizes CRLF and CR to LF by default", () => {
        assert.equal(strNormalizeNewlines("a\r\nb\rc\nd"), "a\nb\nc\nd", "mixed newlines should normalize to LF");
        assert.equal(strNormalizeNewlines("a\r\r\nb"), "a\n\nb", "sequential CR and CRLF should normalize");
    });

    it("supports target newline modes", () => {
        assert.equal(strNormalizeNewlines("a\r\nb\rc\nd", "\r\n"), "a\r\nb\r\nc\r\nd", "should normalize to CRLF");
        assert.equal(strNormalizeNewlines("a\r\nb\rc\nd", "\r"), "a\rb\rc\rd", "should normalize to CR");
        assert.equal(strNormalizeNewlines("a\r\nb\rc\nd", "\n\r"), "a\n\rb\n\rc\n\rd", "should normalize to LFCR");
    });

    it("normalizes LFCR newline pairs correctly", () => {
        assert.equal(strNormalizeNewlines("a\n\rb", "\n"), "a\nb", "LFCR pair should be treated as a single newline");
        assert.equal(strNormalizeNewlines("a\n\rb", "\r\n"), "a\r\nb", "LFCR pair should normalize to CRLF");
        assert.equal(strNormalizeNewlines("a\r\n\n\rb", "\n"), "a\n\nb", "mixed CRLF and LFCR should normalize consistently");
    });

    it("preserves already normalized strings", () => {
        assert.equal(strNormalizeNewlines("a\nb\nc"), "a\nb\nc", "already LF-normalized strings should not change");
    });

    it("coerces values to strings", () => {
        assert.equal(strNormalizeNewlines(42 as any), "42", "non-string value should be coerced");
    });

    it("defaults to LF when newlineType is omitted or undefined", () => {
        assert.equal(strNormalizeNewlines("a\r\nb", undefined), "a\nb", "undefined mode should default to LF");
    });

    it("throws for unsupported newlineType values", () => {
        _expectThrow(() => strNormalizeNewlines("a\r\nb", 99 as any));
        _expectThrow(() => strNormalizeNewlines("a\r\nb", -1 as any));
        _expectThrow(() => strNormalizeNewlines("a\r\nb", "\n" as any));
        _expectThrow(() => strNormalizeNewlines("a\r\nb", null as any));
    });

    function _expectThrow(cb: () => void): void {
        try {
            cb();
            assert.ok(false, "Expected an exception to be thrown");
        } catch (e) {
            assert.ok(true, "Expected an exception to be thrown");
        }
    }
});
