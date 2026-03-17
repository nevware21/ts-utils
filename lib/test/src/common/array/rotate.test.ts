/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrRotate } from "../../../../src/array/rotate";

describe("arrRotate", () => {
    it("should rotate array left by default", () => {
        assert.deepEqual(arrRotate([1, 2, 3, 4, 5], 1), [2, 3, 4, 5, 1]);
        assert.deepEqual(arrRotate([1, 2, 3, 4, 5], 2), [3, 4, 5, 1, 2]);
    });

    it("should rotate array right with negative positions", () => {
        assert.deepEqual(arrRotate([1, 2, 3, 4, 5], -1), [5, 1, 2, 3, 4]);
        assert.deepEqual(arrRotate([1, 2, 3, 4, 5], -2), [4, 5, 1, 2, 3]);
    });

    it("should handle rotation by length", () => {
        assert.deepEqual(arrRotate([1, 2, 3], 3), [1, 2, 3]);
        assert.deepEqual(arrRotate([1, 2, 3], -3), [1, 2, 3]);
    });

    it("should handle rotation greater than length", () => {
        assert.deepEqual(arrRotate([1, 2, 3], 4), [2, 3, 1]);
        assert.deepEqual(arrRotate([1, 2, 3], -4), [3, 1, 2]);
    });

    it("should handle zero rotation", () => {
        assert.deepEqual(arrRotate([1, 2, 3], 0), [1, 2, 3]);
    });

    it("should handle empty array", () => {
        assert.deepEqual(arrRotate([], 5), []);
    });

    it("should handle single element array", () => {
        assert.deepEqual(arrRotate([1], 5), [1]);
    });

    it("should handle null and undefined", () => {
        assert.deepEqual(arrRotate(null, 2), []);
        assert.deepEqual(arrRotate(undefined, 2), []);
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 4, 0: "a", 1: "b", 2: "c", 3: "d" };
        assert.deepEqual(arrRotate(arrayLike, 1), ["b", "c", "d", "a"]);
    });

    it("should not modify original array", () => {
        const original = [1, 2, 3, 4];
        const copy = [...original];
        arrRotate(original, 2);
        
        assert.deepEqual(original, copy);
    });
});
