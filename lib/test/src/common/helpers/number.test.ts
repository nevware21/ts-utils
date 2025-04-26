/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isFiniteNumber, isInteger, _polyNumberIsInteger, getIntValue } from "../../../../src/helpers/number";

describe("number helpers", () => {
    describe("getIntValue", () => {
        it("should return the value when it's a number", () => {
            assert.equal(getIntValue(0), 0, "Should return 0");
            assert.equal(getIntValue(42), 42, "Should return 42");
            assert.equal(getIntValue(-42), -42, "Should return -42");
            assert.equal(getIntValue(3.14), 3.14, "Should return float as-is");
        });

        it("should parse string values to integers", () => {
            assert.equal(getIntValue("0"), 0, "Should parse '0'");
            assert.equal(getIntValue("42"), 42, "Should parse '42'");
            assert.equal(getIntValue("-42"), -42, "Should parse '-42'");
            assert.equal(getIntValue("3.14"), 3, "Should parse '3.14' as 3");
            assert.equal(getIntValue("42px"), 42, "Should parse '42px' as 42");
        });

        it("should return default value for invalid inputs", () => {
            assert.equal(getIntValue("not a number", 99), 99, "Should return default for invalid string");
            assert.equal(getIntValue("", 99), 99, "Should return default for empty string");
            assert.equal(getIntValue(null, 99), 99, "Should return default for null");
            assert.equal(getIntValue(undefined, 99), 99, "Should return default for undefined");
            assert.equal(getIntValue(NaN, 99), 99, "Should return default for NaN");
        });

        it("should return undefined for invalid inputs with no default", () => {
            assert.equal(getIntValue("not a number"), undefined, "Should return undefined for invalid string");
            assert.equal(getIntValue(""), undefined, "Should return undefined for empty string");
            assert.equal(getIntValue(null), undefined, "Should return undefined for null");
            assert.equal(getIntValue(undefined), undefined, "Should return undefined for undefined");
            assert.equal(getIntValue(NaN), undefined, "Should return undefined for NaN");
        });

        it("should handle different default values", () => {
            assert.equal(getIntValue("invalid", 0), 0, "Should return 0 as default");
            assert.equal(getIntValue("invalid", -1), -1, "Should return -1 as default");
            assert.equal(getIntValue("invalid", 42), 42, "Should return 42 as default");
        });
    });

    describe("isInteger", () => {
        it("should identify integer values", () => {
            assert.equal(isInteger(0), true, "Should return true for 0");
            assert.equal(isInteger(42), true, "Should return true for 42");
            assert.equal(isInteger(-42), true, "Should return true for -42");
            assert.equal(isInteger(1e10), true, "Should return true for 1e10");
        });

        it("should return false for non-integer values", () => {
            assert.equal(isInteger(42.5), false, "Should return false for 42.5");
            assert.equal(isInteger(0.1), false, "Should return false for 0.1");
            assert.equal(isInteger(-42.5), false, "Should return false for -42.5");
        });

        it("should return false for non-number values", () => {
            assert.equal(isInteger("42"), false, "Should return false for string '42'");
            assert.equal(isInteger(null), false, "Should return false for null");
            assert.equal(isInteger(undefined), false, "Should return false for undefined");
            assert.equal(isInteger(true), false, "Should return false for boolean");
            assert.equal(isInteger({}), false, "Should return false for object");
            assert.equal(isInteger([]), false, "Should return false for array");
        });

        it("should return false for special number values", () => {
            assert.equal(isInteger(NaN), false, "Should return false for NaN");
            assert.equal(isInteger(Infinity), false, "Should return false for Infinity");
            assert.equal(isInteger(-Infinity), false, "Should return false for -Infinity");
        });
    });

    describe("polyNumberIsInteger", () => {
        it("should identify integer values", () => {
            assert.equal(_polyNumberIsInteger(0), true, "Should return true for 0");
            assert.equal(_polyNumberIsInteger(42), true, "Should return true for 42");
            assert.equal(_polyNumberIsInteger(-42), true, "Should return true for -42");
            assert.equal(_polyNumberIsInteger(1e10), true, "Should return true for 1e10");
        });

        it("should return false for non-integer values", () => {
            assert.equal(_polyNumberIsInteger(42.5), false, "Should return false for 42.5");
            assert.equal(_polyNumberIsInteger(0.1), false, "Should return false for 0.1");
            assert.equal(_polyNumberIsInteger(-42.5), false, "Should return false for -42.5");
        });

        it("should return false for non-number values", () => {
            assert.equal(_polyNumberIsInteger("42"), false, "Should return false for string '42'");
            assert.equal(_polyNumberIsInteger(null), false, "Should return false for null");
            assert.equal(_polyNumberIsInteger(undefined), false, "Should return false for undefined");
            assert.equal(_polyNumberIsInteger(true), false, "Should return false for boolean");
            assert.equal(_polyNumberIsInteger({}), false, "Should return false for object");
            assert.equal(_polyNumberIsInteger([]), false, "Should return false for array");
        });

        it("should return false for special number values", () => {
            assert.equal(_polyNumberIsInteger(NaN), false, "Should return false for NaN");
            assert.equal(_polyNumberIsInteger(Infinity), false, "Should return false for Infinity");
            assert.equal(_polyNumberIsInteger(-Infinity), false, "Should return false for -Infinity");
        });

        it("should match the behavior of native Number.isInteger when available", () => {
            if (typeof Number.isInteger === "function") {
                const testValues = [
                    0, 1, -1, 42, -42, 1e10, 42.5, 0.1, -42.5, NaN, Infinity, -Infinity,
                    "42", null, undefined, true, false, {}, []
                ];
                
                testValues.forEach(value => {
                    assert.equal(
                        _polyNumberIsInteger(value),
                        Number.isInteger(value),
                        `polyNumberIsInteger(${value}) should match Number.isInteger(${value})`
                    );
                });
            }
        });
    });

    describe("isFiniteNumber", () => {
        it("should identify finite numbers", () => {
            assert.equal(isFiniteNumber(0), true, "Should return true for 0");
            assert.equal(isFiniteNumber(42), true, "Should return true for 42");
            assert.equal(isFiniteNumber(-42), true, "Should return true for -42");
            assert.equal(isFiniteNumber(42.5), true, "Should return true for 42.5");
            assert.equal(isFiniteNumber(1e10), true, "Should return true for 1e10");
        });

        it("should return false for non-finite numbers", () => {
            assert.equal(isFiniteNumber(NaN), false, "Should return false for NaN");
            assert.equal(isFiniteNumber(Infinity), false, "Should return false for Infinity");
            assert.equal(isFiniteNumber(-Infinity), false, "Should return false for -Infinity");
        });

        it("should return false for non-number values", () => {
            assert.equal(isFiniteNumber("42"), false, "Should return false for string '42'");
            assert.equal(isFiniteNumber(null), false, "Should return false for null");
            assert.equal(isFiniteNumber(undefined), false, "Should return false for undefined");
            assert.equal(isFiniteNumber(true), false, "Should return false for boolean");
            assert.equal(isFiniteNumber({}), false, "Should return false for object");
            assert.equal(isFiniteNumber([]), false, "Should return false for array");
        });

        it("should be stricter than the global isFinite function", () => {
            // Global isFinite tries to convert the value to a number
            assert.equal(isFinite("42" as any), true, "Global isFinite returns true for string '42'");
            assert.equal(isFiniteNumber("42"), false, "But isFiniteNumber correctly returns false");
            
            assert.equal(isFinite("" as any), true, "Global isFinite returns true for empty string");
            assert.equal(isFiniteNumber(""), false, "But isFiniteNumber correctly returns false");
            
            assert.equal(isFinite(null as any), true, "Global isFinite returns true for null");
            assert.equal(isFiniteNumber(null), false, "But isFiniteNumber correctly returns false");
        });
    });
});
