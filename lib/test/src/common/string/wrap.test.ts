/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { strUnwrap, strWrap } from "../../../../src/string/wrap";

describe("string wrap helpers", () => {
    describe("strWrap", () => {
        it("throws for null/undefined values", () => {
            _expectThrow(() => strWrap(null as any, "["));
            _expectThrow(() => strWrap(undefined as any, "["));
        });

        it("wraps with same prefix/suffix when suffix is omitted", () => {
            assert.equal(strWrap("value", "\""), "\"value\"", "same wrapper should be used when suffix omitted");
            assert.equal(strWrap("value", ""), "value", "empty wrapper should return original value");
        });

        it("wraps with different prefix and suffix", () => {
            assert.equal(strWrap("value", "[", "]"), "[value]", "square bracket wrapping");
            assert.equal(strWrap("value", "<", ">"), "<value>", "angle bracket wrapping");
        });

        it("coerces prefix and suffix values to strings", () => {
            assert.equal(strWrap("value", 1 as any, 2 as any), "1value2", "numeric wrappers should be coerced");
            assert.equal(strWrap("value", null as any), "nullvaluenull", "null wrapper should be coerced");
        });
    });

    describe("strUnwrap", () => {
        it("throws for null/undefined values", () => {
            _expectThrow(() => strUnwrap(null as any, "["));
            _expectThrow(() => strUnwrap(undefined as any, "["));
        });

        it("unwraps same prefix/suffix when suffix is omitted", () => {
            assert.equal(strUnwrap("\"value\"", "\""), "value", "matching same wrapper should unwrap");
        });

        it("unwraps different prefix and suffix", () => {
            assert.equal(strUnwrap("[value]", "[", "]"), "value", "matching wrappers should unwrap");
            assert.equal(strUnwrap("<value>", "<", ">"), "value", "matching wrappers should unwrap");
        });

        it("returns original string when wrapper does not match", () => {
            assert.equal(strUnwrap("value", "[", "]"), "value", "plain string should remain unchanged");
            assert.equal(strUnwrap("[value", "[", "]"), "[value", "missing suffix should remain unchanged");
            assert.equal(strUnwrap("value]", "[", "]"), "value]", "missing prefix should remain unchanged");
        });

        it("removes only one layer of wrapping", () => {
            assert.equal(strUnwrap("[[value]]", "[", "]"), "[value]", "only one wrapper layer should be removed");
        });

        it("supports empty prefix/suffix behaviors", () => {
            assert.equal(strUnwrap("value]", "", "]"), "value", "empty prefix and matching suffix should trim suffix");
            assert.equal(strUnwrap("[value", "[", ""), "value", "matching prefix and empty suffix should trim prefix");
            assert.equal(strUnwrap("value", "", ""), "value", "empty wrappers should keep value unchanged");
        });
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
