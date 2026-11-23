/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { _returnNothing } from "../../../../src/internal/stubs";
import { isUndefined } from "../../../../src/helpers/base";

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
});
