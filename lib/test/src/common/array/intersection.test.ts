/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrIntersection } from "../../../../src/array/intersection";

describe("arrIntersection", () => {
    it("should return common elements between two arrays", () => {
        assert.deepEqual(arrIntersection([1, 2, 3], [2, 3, 4]), [2, 3]);
        assert.deepEqual(arrIntersection(["a", "b"], ["b", "c"]), ["b"]);
    });

    it("should return common elements across multiple arrays", () => {
        assert.deepEqual(arrIntersection([1, 2, 3], [2, 3], [3, 4]), [3]);
        assert.deepEqual(arrIntersection([1, 2, 3, 4], [2, 3, 4], [3, 4, 5]), [3, 4]);
    });

    it("should return empty array when no common elements", () => {
        assert.deepEqual(arrIntersection([1, 2], [3, 4]), []);
    });

    it("should return empty array when any array is empty", () => {
        assert.deepEqual(arrIntersection([1, 2, 3], []), []);
    });

    it("should handle null and undefined", () => {
        assert.deepEqual(arrIntersection(), []);
        assert.deepEqual(arrIntersection(null, [1, 2]), []);
        assert.deepEqual(arrIntersection(undefined, [1, 2]), []);
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 3, 0: 1, 1: 2, 2: 3 };
        assert.deepEqual(arrIntersection(arrayLike, [2, 3]), [2, 3]);
    });

    it("should use strict equality", () => {
        assert.deepEqual(arrIntersection<any>([1, 2, 3], ["1", "2"]), []);
    });

    it("should preserve order from first array", () => {
        assert.deepEqual(arrIntersection([5, 3, 1, 4, 2], [1, 2, 3, 4, 5]), [5, 3, 1, 4, 2]);
    });

    it("should remove duplicates from result", () => {
        assert.deepEqual(arrIntersection([1, 2, 2, 3, 3], [2, 3]), [2, 3]);
    });
});
