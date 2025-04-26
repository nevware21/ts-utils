/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { _returnNothing, _returnEmptyArray, _returnFalse } from "../../../../src/internal/stubs";
import { isArray, isUndefined } from "../../../../src/helpers/base";

describe("stubs", () => {
    describe("_returnNothing", () => {
        it("should return undefined", () => {
            const result = _returnNothing();
            assert.isTrue(isUndefined(result), "Expected undefined to be returned");
        });

        it("should return undefined regardless of type parameter", () => {
            // Test with different type parameters
            const numberResult = _returnNothing<number>();
            const stringResult = _returnNothing<string>();
            const objectResult = _returnNothing<object>();
            
            assert.isTrue(isUndefined(numberResult), "Expected undefined to be returned for number type");
            assert.isTrue(isUndefined(stringResult), "Expected undefined to be returned for string type");
            assert.isTrue(isUndefined(objectResult), "Expected undefined to be returned for object type");
        });
    });

    describe("_returnEmptyArray", () => {
        it("should return an empty array", () => {
            const result = _returnEmptyArray();
            
            assert.isTrue(isArray(result), "Expected an array to be returned");
            assert.strictEqual(result.length, 0, "Expected the array to be empty");
        });

        it("should return an empty array regardless of type parameter", () => {
            // Test with different type parameters
            const numberResult = _returnEmptyArray<number>();
            const stringResult = _returnEmptyArray<string>();
            const objectResult = _returnEmptyArray<object>();
            
            assert.isTrue(isArray(numberResult), "Expected an array to be returned for number type");
            assert.strictEqual(numberResult.length, 0, "Expected the array to be empty for number type");
            
            assert.isTrue(isArray(stringResult), "Expected an array to be returned for string type");
            assert.strictEqual(stringResult.length, 0, "Expected the array to be empty for string type");
            
            assert.isTrue(isArray(objectResult), "Expected an array to be returned for object type");
            assert.strictEqual(objectResult.length, 0, "Expected the array to be empty for object type");
        });
    });

    describe("_returnFalse", () => {
        it("should return false", () => {
            const result = _returnFalse();
            
            assert.isBoolean(result, "Expected a boolean to be returned");
            assert.isFalse(result, "Expected false to be returned");
        });
    });
});
