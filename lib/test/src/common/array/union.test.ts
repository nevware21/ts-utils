/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrUnion } from "../../../../src/array/union";

describe("arrUnion", () => {
    it("should return unique elements from two arrays", () => {
        assert.deepEqual(arrUnion([1, 2], [2, 3]), [1, 2, 3]);
        assert.deepEqual(arrUnion(["a", "b"], ["b", "c"]), ["a", "b", "c"]);
    });

    it("should handle multiple arrays", () => {
        assert.deepEqual(arrUnion([1, 2], [3, 4], [4, 5]), [1, 2, 3, 4, 5]);
    });

    it("should remove duplicates", () => {
        assert.deepEqual(arrUnion([1, 1, 2], [2, 2, 3]), [1, 2, 3]);
    });

    it("should handle empty arrays", () => {
        assert.deepEqual(arrUnion([], [1, 2]), [1, 2]);
        assert.deepEqual(arrUnion([1, 2], []), [1, 2]);
        assert.deepEqual(arrUnion([], []), []);
    });

    it("should handle single array", () => {
        assert.deepEqual(arrUnion([1, 2, 3]), [1, 2, 3]);
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 2, 0: 1, 1: 2 };
        assert.deepEqual(arrUnion(arrayLike, [2, 3]), [1, 2, 3]);
    });

    it("should use strict equality", () => {
        assert.deepEqual(arrUnion<any>([1, 2], ["1", "2"]), [1, 2, "1", "2"]);
    });

    it("should preserve insertion order", () => {
        assert.deepEqual(arrUnion([3, 1], [2, 4]), [3, 1, 2, 4]);
    });
});
