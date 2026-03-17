/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrDifference } from "../../../../src/array/difference";

describe("arrDifference", () => {
    it("should return elements in first array not in second array", () => {
        assert.deepEqual(arrDifference([1, 2, 3, 4], [2, 4]), [1, 3]);
        assert.deepEqual(arrDifference(["a", "b", "c"], ["b"]), ["a", "c"]);
    });

    it("should handle multiple exclude arrays", () => {
        assert.deepEqual(arrDifference([1, 2, 3], [2], [3]), [1]);
        assert.deepEqual(arrDifference([1, 2, 3, 4, 5], [2, 4], [3, 5]), [1]);
    });

    it("should return all elements when exclude arrays are empty", () => {
        assert.deepEqual(arrDifference([1, 2, 3], []), [1, 2, 3]);
        assert.deepEqual(arrDifference([1, 2, 3]), [1, 2, 3]);
    });

    it("should return empty array when source is empty", () => {
        assert.deepEqual(arrDifference([], [1, 2]), []);
    });

    it("should handle null source array", () => {
        assert.deepEqual(arrDifference(null, [1, 2]), []);
        assert.deepEqual(arrDifference(undefined, [1, 2]), []);
    });

    it("should handle null exclude arrays", () => {
        assert.deepEqual(arrDifference([1, 2, 3], null), [1, 2, 3]);
        assert.deepEqual(arrDifference([1, 2, 3], undefined), [1, 2, 3]);
        assert.deepEqual(arrDifference([1, 2, 3], [2], null), [1, 3]);
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 3, 0: 1, 1: 2, 2: 3 };
        assert.deepEqual(arrDifference(arrayLike, [2]), [1, 3]);
    });

    it("should use strict equality", () => {
        assert.deepEqual(arrDifference<any>([1, 2, 3], ["1", "2"]), [1, 2, 3]);
        assert.deepEqual(arrDifference<any>(["1", "2", "3"], [1, 2]), ["1", "2", "3"]);
    });

    it("should preserve order from source array", () => {
        assert.deepEqual(arrDifference([5, 3, 1, 4, 2], [3, 1]), [5, 4, 2]);
    });

    it("should handle duplicate values in source array", () => {
        assert.deepEqual(arrDifference([1, 2, 2, 3, 3, 3], [2]), [1, 3, 3, 3]);
    });
});
