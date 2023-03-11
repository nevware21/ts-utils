/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { strLower, strUpper } from "../../../../src/string/upper_lower";

function _expectThrow(cb: () => void): Error {
    try {
        cb();
    } catch (e) {
        assert.ok(true, "Expected an exception to be thrown");
        return e;
    }
}

describe("strUpper", () => {
    it("null/undefined", () => {
        _expectThrow(() => {
            strUpper(null);
        });

        _expectThrow(() => {
            strUpper(undefined);
        });
    });

    it("basic", () => {
        assert.equal(strUpper("Hello"), "HELLO");
        assert.equal(strUpper("darkness"), "DARKNESS");
    });
});

describe("strLower", () => {
    it("null/undefined", () => {
        _expectThrow(() => {
            strLower(null);
        });

        _expectThrow(() => {
            strLower(undefined);
        });
    });

    it("basic", () => {
        assert.equal(strLower("Hello"), "hello");
        assert.equal(strLower("darkness"), "darkness");
    });
});