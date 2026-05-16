/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isUnsafeTarget } from "../../../../src/object/isUnsafeTarget";

describe("object isUnsafeTarget tests", () => {
    it("should identify common built-in prototype objects", () => {
        assert.isTrue(isUnsafeTarget(Object.prototype), "Object.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(Function.prototype), "Function.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(Array.prototype), "Array.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(Date.prototype), "Date.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(RegExp.prototype), "RegExp.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(Number.prototype), "Number.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(String.prototype), "String.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(Boolean.prototype), "Boolean.prototype should be unsafe");
    });

    it("should identify error prototype objects", () => {
        assert.isTrue(isUnsafeTarget(Error.prototype), "Error.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(TypeError.prototype), "TypeError.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(RangeError.prototype), "RangeError.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(SyntaxError.prototype), "SyntaxError.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(ReferenceError.prototype), "ReferenceError.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(EvalError.prototype), "EvalError.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(URIError.prototype), "URIError.prototype should be unsafe");
    });

    it("should return false for normal targets", () => {
        assert.isFalse(isUnsafeTarget({}), "plain objects should be safe");
        assert.isFalse(isUnsafeTarget([]), "array instances should be safe");
        assert.isFalse(isUnsafeTarget(function() {}), "function instances should be safe");
        assert.isFalse(isUnsafeTarget(new Date()), "Date instances should be safe");
        assert.isFalse(isUnsafeTarget(Object.create(null)), "null prototype objects should be safe");
    });

    it("should return false for primitive and nullish values", () => {
        assert.isFalse(isUnsafeTarget(null), "null should be safe");
        assert.isFalse(isUnsafeTarget(undefined), "undefined should be safe");
        assert.isFalse(isUnsafeTarget(0), "number should be safe");
        assert.isFalse(isUnsafeTarget("test"), "string should be safe");
        assert.isFalse(isUnsafeTarget(false), "boolean should be safe");
    });
});
