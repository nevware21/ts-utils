/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrReverse } from "../../../../src/array/reverse";

describe("arrReverse", () => {
    it("should reverse array in place", () => {
        const arr = [1, 2, 3, 4];
        const result = arrReverse(arr);
        
        assert.deepEqual(result, [4, 3, 2, 1]);
        assert.deepEqual(arr, [4, 3, 2, 1]); // Mutates original
        assert.strictEqual(result, arr); // Returns same reference
    });

    it("should handle single element array", () => {
        const arr = [1];
        arrReverse(arr);
        
        assert.deepEqual(arr, [1]);
    });

    it("should handle empty array", () => {
        const arr: number[] = [];
        arrReverse(arr);
        
        assert.deepEqual(arr, []);
    });

    it("should handle two element array", () => {
        const arr = [1, 2];
        arrReverse(arr);
        
        assert.deepEqual(arr, [2, 1]);
    });

    it("should handle null and undefined", () => {
        // arrReverse wraps native reverse which doesn't accept null/undefined
        // These would throw TypeError in native implementation
        assert.throws(() => arrReverse(null as any));
        assert.throws(() => arrReverse(undefined as any));
    });

    it("should work with array-like objects after conversion", () => {
        // Native reverse requires actual Array, not array-like
        const arrayLike = { length: 3, 0: "a", 1: "b", 2: "c" };
        // Convert to array first using Array.from or arrSlice
        const arr = Array.from(arrayLike as any);
        const result = arrReverse(arr);
        
        assert.equal(result[0], "c");
        assert.equal(result[1], "b");
        assert.equal(result[2], "a");
    });

    it("should reverse array of strings", () => {
        const result = arrReverse(["h", "e", "l", "l", "o"]);
        assert.deepEqual(result, ["o", "l", "l", "e", "h"]);
    });

    it("should match native Array.prototype.reverse", () => {
        const arr1 = [1, 2, 3, 4, 5];
        const arr2 = [1, 2, 3, 4, 5];
        
        arrReverse(arr1);
        arr2.reverse();
        
        assert.deepEqual(arr1, arr2);
    });
});
