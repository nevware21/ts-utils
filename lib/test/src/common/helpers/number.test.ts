/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { getIntValue } from "../../../../src/helpers/number";

describe("number helpers", () => {
    describe("getIntValue", () => {
        it("Validate passing invalid values returning null values", () => {
            assert.equal(getIntValue(null, null), null, "Expecting the default value for null");
            assert.equal(getIntValue(undefined, null), null, "Expecting the default value for undefined");
            assert.equal(getIntValue("", null), null, "Expecting the default value for empty string");
            assert.equal(getIntValue("undefined", null), null, "Expecting the default value for undefined");
        });

        it("Validate passing invalid values returning undefined values", () => {
            assert.equal(getIntValue(null), undefined, "Expecting the default value for null");
            assert.equal(getIntValue(undefined), undefined, "Expecting the default value for undefined");
            assert.equal(getIntValue(""), undefined, "Expecting the default value for empty string");
            assert.equal(getIntValue("undefined"), undefined, "Expecting the default value for undefined");

            assert.equal(getIntValue(null, undefined), undefined, "Expecting the default value for null");
            assert.equal(getIntValue(undefined, undefined), undefined, "Expecting the default value for undefined");
            assert.equal(getIntValue("", undefined), undefined, "Expecting the default value for empty string");
            assert.equal(getIntValue("undefined", undefined), undefined, "Expecting the default value for undefined");
        });

        it("Validate passing invalid values returning default values", () => {
            assert.equal(getIntValue(null, 42), 42, "Expecting the default value for null");
            assert.equal(getIntValue(undefined, 21), 21, "Expecting the default value for undefined");
            assert.equal(getIntValue("", 0xF00), 0xF00, "Expecting the default value for empty string");
            assert.equal(getIntValue("undefined", 0x123), 0x123, "Expecting the default value for undefined");
        });

        it("Validate returning passed number values", () => {
            assert.equal(getIntValue(42, -1), 42, "Expecting the passed number value of 42");
            assert.equal(getIntValue(21, -1), 21, "Expecting the passed number value of 21");
            assert.equal(getIntValue(0xF00), 0xF00, "Expecting the passed value of 0xF00");
            assert.equal(getIntValue(0x123), 0x123, "Expecting the passed value 0f 0123");
        });

        it("Validate returning passed string values", () => {
            assert.equal(getIntValue("42", -1), 42, "Expecting the passed number value of 42");
            assert.equal(getIntValue("21", -1), 21, "Expecting the passed number value of 21");
            assert.equal(getIntValue("" + 0xF00, -1), 0xF00, "Expecting the passed value of 0xF00");
            assert.equal(getIntValue("" + 0x123, -1), 0x123, "Expecting the passed value 0f 0123");

            assert.equal(getIntValue("-42", -1), -42, "Expecting the passed number value of 42");
            assert.equal(getIntValue("-21", -1), -21, "Expecting the passed number value of 21");
            assert.equal(getIntValue("-" + 0xF00, -1), -0xF00, "Expecting the passed value of 0xF00");
            assert.equal(getIntValue("-" + 0x123, -1), -0x123, "Expecting the passed value 0f 0123");
        });

    });
});
