/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { mathRandom } from "../../../../src/math/random";

describe("math random", () => {
    it("mathRandom should return values between 0 and 1", () => {
    // Run multiple tests since it's random
        for (let i = 0; i < 100; i++) {
            const result = mathRandom();
            assert.isTrue(result >= 0, "Random value should be at least 0");
            assert.isTrue(result < 1, "Random value should be below 1");
        }
    });
    it("mathRandom should return different values across calls", () => {
        const results = new Set<number>();
        // Generate several random values and check for duplicates
        for (let i = 0; i < 10; i++) {
            results.add(mathRandom());
        }
        
        // With 10 random numbers, we should have close to 10 unique values
        // (the probability of a collision is very low but not impossible)
        assert.isTrue(results.size >= 8, "Should have at least 8 unique values out of 10 calls");
    });
});
