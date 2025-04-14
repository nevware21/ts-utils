/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isBigInt } from "../../../../src/helpers/base";

describe("isBigInt helper", () => {
    it("should identify BigInt values correctly", () => {
        // BigInt may not be available in all environments, so we need to check
        // eslint-disable-next-line no-constant-condition
        if (typeof BigInt !== "undefined") {
            assert.equal(isBigInt(BigInt(42)), true, "should identify BigInt(42) as BigInt");
            assert.equal(isBigInt(BigInt(0)), true, "should identify BigInt(0) as BigInt");
            assert.equal(isBigInt(BigInt(-42)), true, "should identify BigInt(-42) as BigInt");
        }

        // In environments that support the 'n' suffix for BigInt literals
        // eslint-disable-next-line no-constant-condition
        // if (typeof 1n !== "undefined") {
        //     assert.equal(isBigInt(42n), true, "should identify 42n as BigInt");
        //     assert.equal(isBigInt(0n), true, "should identify 0n as BigInt");
        //     assert.equal(isBigInt(-42n), true, "should identify -42n as BigInt");
        // }
    });

    it("should return false for non-BigInt values", () => {
        assert.equal(isBigInt(42), false, "should identify 42 as not BigInt");
        assert.equal(isBigInt("42"), false, "should identify '42' as not BigInt");
        assert.equal(isBigInt(null), false, "should identify null as not BigInt");
        assert.equal(isBigInt(undefined), false, "should identify undefined as not BigInt");
        assert.equal(isBigInt(true), false, "should identify true as not BigInt");
        assert.equal(isBigInt(false), false, "should identify false as not BigInt");
        assert.equal(isBigInt({}), false, "should identify empty object as not BigInt");
        assert.equal(isBigInt([]), false, "should identify empty array as not BigInt");
        assert.equal(isBigInt(new Date()), false, "should identify Date as not BigInt");
        assert.equal(isBigInt(function() {}), false, "should identify function as not BigInt");
    });
});
