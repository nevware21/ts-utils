/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrShuffle } from "../../../../src/array/shuffle";
import { arrSample } from "../../../../src/array/sample";

describe("arrShuffle", () => {
    it("should return array with same elements", () => {
        const original = [1, 2, 3, 4, 5];
        const shuffled = arrShuffle(original);
        
        assert.equal(shuffled.length, original.length);
        original.forEach(val => {
            assert.ok(shuffled.includes(val), `Should contain ${val}`);
        });
    });

    it("should not modify original array", () => {
        const original = [1, 2, 3, 4, 5];
        const copy = [...original];
        arrShuffle(original);
        
        assert.deepEqual(original, copy);
    });

    it("should handle single element array", () => {
        assert.deepEqual(arrShuffle([1]), [1]);
    });

    it("should handle empty array", () => {
        assert.deepEqual(arrShuffle([]), []);
    });

    it("should throw for null and undefined", () => {
        // arrSlice (used internally) throws TypeError for null/undefined
        assert.throws(() => arrShuffle(null));
        assert.throws(() => arrShuffle(undefined));
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 3, 0: "x", 1: "y", 2: "z" };
        const shuffled = arrShuffle(arrayLike);
        
        assert.equal(shuffled.length, 3);
        assert.ok(shuffled.includes("x"));
        assert.ok(shuffled.includes("y"));
        assert.ok(shuffled.includes("z"));
    });

    it("should produce different results (statistical)", () => {
        const original = [1, 2, 3, 4, 5];
        let different = false;
        
        // Try multiple times - should be different at least once
        for (let i = 0; i < 10; i++) {
            const shuffled = arrShuffle(original);
            if (JSON.stringify(shuffled) !== JSON.stringify(original)) {
                different = true;
                break;
            }
        }
        
        assert.ok(different, "Should produce different ordering");
    });
});

describe("arrSample", () => {
    it("should return element from array", () => {
        const arr = [1, 2, 3, 4, 5];
        const sample = arrSample(arr);
        
        assert.ok(arr.includes(sample), "Sample should be from array");
    });

    it("should return single element for single item array", () => {
        assert.equal(arrSample([42]), 42);
    });

    it("should return undefined for empty array", () => {
        assert.isUndefined(arrSample([]));
    });

    it("should throw for null and undefined", () => {
        // arrSample expects a valid array
        assert.isUndefined(arrSample(null));
        assert.isUndefined(arrSample(undefined));
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 3, 0: "x", 1: "y", 2: "z" };
        const sample = arrSample(arrayLike);
        
        assert.ok(["x", "y", "z"].includes(sample));
    });

    it("should return different values (statistical)", () => {
        const arr = [1, 2, 3, 4, 5];
        const samples = new Set();
        
        // Sample many times - should get different values
        for (let i = 0; i < 50; i++) {
            samples.add(arrSample(arr));
        }
        
        assert.ok(samples.size > 1, "Should sample different values");
    });

    it("should truncate a fractional length, like the native functions", () => {
        const arrayLike: any = { length: 2.5, 0: "x", 1: "y", 2: "z" };

        // Previously the index could be 2, which is after the length
        for (let i = 0; i < 50; i++) {
            const value = arrSample(arrayLike);
            assert.ok(value === "x" || value === "y", "Only the values within the length should be sampled, not " + value);
        }

        assert.isUndefined(arrSample({ length: 0.5, 0: "x" } as any), "A length of 0.5 is 0");
    });
});
