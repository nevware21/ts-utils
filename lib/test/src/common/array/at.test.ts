/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrAt, polyArrAt } from "../../../../src/array/at";

describe("arrAt", () => {
    it("should return element at positive index", () => {
        assert.equal(arrAt([1, 2, 3], 0), 1);
        assert.equal(arrAt([1, 2, 3], 1), 2);
        assert.equal(arrAt([1, 2, 3], 2), 3);
    });

    it("should return element at negative index", () => {
        assert.equal(arrAt([1, 2, 3], -1), 3);
        assert.equal(arrAt([1, 2, 3], -2), 2);
        assert.equal(arrAt([1, 2, 3], -3), 1);
    });

    it("should return undefined for out of bounds index", () => {
        assert.isUndefined(arrAt([1, 2, 3], 5));
        assert.isUndefined(arrAt([1, 2, 3], -5));
    });

    it("should handle empty array", () => {
        assert.isUndefined(arrAt([], 0));
    });

    it("should throw for null and undefined", () => {
        // Native .at() throws TypeError for null/undefined
        assert.throws(() => arrAt(null, 0));
        assert.throws(() => arrAt(undefined, 0));
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 3, 0: "a", 1: "b", 2: "c" };
        assert.equal(arrAt(arrayLike, 0), "a");
        assert.equal(arrAt(arrayLike, -1), "c");
    });

    it("should work with strings", () => {
        assert.equal(arrAt("hello", 0), "h");
        assert.equal(arrAt("hello", -1), "o");
    });
});

describe("polyArrAt", () => {
    it("should match native Array.prototype.at behavior for positive indices", () => {
        const arr = [1, 2, 3, 4, 5];
        for (let i = 0; i < arr.length; i++) {
            assert.equal(
                polyArrAt(arr, i),
                (arr as any).at ? (arr as any).at(i) : arr[i],
                `Index ${i} should match`
            );
        }
    });

    it("should match native Array.prototype.at behavior for negative indices", () => {
        const arr = [1, 2, 3, 4, 5];
        for (let i = -1; i >= -arr.length; i--) {
            const polyResult = polyArrAt(arr, i);
            const nativeResult = (arr as any).at ? (arr as any).at(i) : arr[arr.length + i];
            assert.equal(polyResult, nativeResult, `Index ${i} should match`);
        }
    });

    it("should return undefined for out of bounds like native", () => {
        const arr = [1, 2, 3];
        assert.isUndefined(polyArrAt(arr, 10));
        assert.isUndefined(polyArrAt(arr, -10));
        
        if ((arr as any).at) {
            assert.equal(polyArrAt(arr, 10), (arr as any).at(10));
            assert.equal(polyArrAt(arr, -10), (arr as any).at(-10));
        }
    });

    it("should handle index 0", () => {
        const arr = [42];
        assert.equal(polyArrAt(arr, 0), 42);
        if ((arr as any).at) {
            assert.equal(polyArrAt(arr, 0), (arr as any).at(0));
        }
    });

    it("should handle empty array like native", () => {
        const arr: number[] = [];
        assert.isUndefined(polyArrAt(arr, 0));
        if ((arr as any).at) {
            assert.equal(polyArrAt(arr, 0), (arr as any).at(0));
        }
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 3, 0: "x", 1: "y", 2: "z" };
        assert.equal(polyArrAt(arrayLike, 0), "x");
        assert.equal(polyArrAt(arrayLike, -1), "z");
        assert.equal(polyArrAt(arrayLike, 1), "y");
        assert.equal(polyArrAt(arrayLike, -2), "y");
    });
});
