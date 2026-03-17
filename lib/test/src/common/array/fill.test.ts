/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrFill, polyArrFill } from "../../../../src/array/fill";

describe("arrFill", () => {
    it("should fill entire array with value", () => {
        const arr = [1, 2, 3, 4];
        const result = arrFill(arr, 0);
        
        assert.deepEqual(result, [0, 0, 0, 0]);
        assert.deepEqual(arr, [0, 0, 0, 0]); // Mutates original
    });

    it("should fill from start index", () => {
        const arr = [1, 2, 3, 4];
        arrFill(arr, 0, 2);
        
        assert.deepEqual(arr, [1, 2, 0, 0]);
    });

    it("should fill between start and end indices", () => {
        const arr = [1, 2, 3, 4, 5];
        arrFill(arr, 9, 1, 3);
        
        assert.deepEqual(arr, [1, 9, 9, 4, 5]);
    });

    it("should handle negative start index", () => {
        const arr = [1, 2, 3, 4];
        arrFill(arr, 0, -2);
        
        assert.deepEqual(arr, [1, 2, 0, 0]);
    });

    it("should handle negative end index", () => {
        const arr = [1, 2, 3, 4];
        arrFill(arr, 0, 0, -1);
        
        assert.deepEqual(arr, [0, 0, 0, 4]);
    });

    it("should throw for null and undefined", () => {
        // Native .fill() throws TypeError for null/undefined
        assert.throws(() => arrFill(null, 0));
        assert.throws(() => arrFill(undefined, 0));
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 3, 0: 1, 1: 2, 2: 3 };
        const result = arrFill(arrayLike, 0);
        
        assert.equal(result[0], 0);
        assert.equal(result[1], 0);
        assert.equal(result[2], 0);
    });
});

describe("polyArrFill", () => {
    it("should match native Array.prototype.fill for full fill", () => {
        const arr1 = [1, 2, 3, 4];
        const arr2 = [1, 2, 3, 4];
        
        polyArrFill(arr1, 0);
        if (arr2.fill) {
            arr2.fill(0);
        } else {
            for (let i = 0; i < arr2.length; i++) {
                arr2[i] = 0;
            }
        }
        
        assert.deepEqual(arr1, arr2);
    });

    it("should match native Array.prototype.fill with start index", () => {
        const arr1 = [1, 2, 3, 4];
        const arr2 = [1, 2, 3, 4];
        
        polyArrFill(arr1, 9, 2);
        if (arr2.fill) {
            arr2.fill(9, 2);
            assert.deepEqual(arr1, arr2);
        }
    });

    it("should match native Array.prototype.fill with start and end", () => {
        const arr1 = [1, 2, 3, 4, 5];
        const arr2 = [1, 2, 3, 4, 5];
        
        polyArrFill(arr1, 8, 1, 3);
        if (arr2.fill) {
            arr2.fill(8, 1, 3);
            assert.deepEqual(arr1, arr2);
        }
    });

    it("should match native for negative indices", () => {
        const arr1 = [1, 2, 3, 4];
        const arr2 = [1, 2, 3, 4];
        
        polyArrFill(arr1, 0, -2, -1);
        if (arr2.fill) {
            arr2.fill(0, -2, -1);
            assert.deepEqual(arr1, arr2);
        }
    });

    it("should mutate array like native", () => {
        const arr = [1, 2, 3];
        const result = polyArrFill(arr, 0);
        
        assert.deepEqual(arr, [0, 0, 0]);
        assert.strictEqual(result, arr); // Returns same reference
        
        if (arr.fill) {
            const arr2 = [1, 2, 3];
            const result2 = arr2.fill(0);
            assert.strictEqual(result2, arr2);
        }
    });

    it("should handle empty array like native", () => {
        const arr: number[] = [];
        polyArrFill(arr, 5);
        
        assert.deepEqual(arr, []);
        
        if (arr.fill) {
            const arr2: number[] = [];
            arr2.fill(5);
            assert.deepEqual(arr2, []);
        }
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 4, 0: 1, 1: 2, 2: 3, 3: 4 };
        polyArrFill(arrayLike, 0, 1, 3);
        
        assert.equal(arrayLike[0], 1);
        assert.equal(arrayLike[1], 0);
        assert.equal(arrayLike[2], 0);
        assert.equal(arrayLike[3], 4);
    });
});
