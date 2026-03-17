/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrTake } from "../../../../src/array/take";
import { arrDrop } from "../../../../src/array/drop";
import { arrTakeWhile } from "../../../../src/array/take_while";
import { arrDropWhile } from "../../../../src/array/drop_while";

describe("arrTake", () => {
    it("should take first n elements", () => {
        assert.deepEqual(arrTake([1, 2, 3, 4, 5], 3), [1, 2, 3]);
        assert.deepEqual(arrTake(["a", "b", "c"], 2), ["a", "b"]);
    });

    it("should return all elements when n exceeds length", () => {
        assert.deepEqual(arrTake([1, 2], 5), [1, 2]);
    });

    it("should return empty array when n is 0 or negative", () => {
        assert.deepEqual(arrTake([1, 2, 3], 0), []);
        assert.deepEqual(arrTake([1, 2, 3], -1), []);
    });

    it("should throw for null and undefined", () => {
        // arrSlice (used internally) throws TypeError for null/undefined
        assert.throws(() => arrTake(null, 2));
        assert.throws(() => arrTake(undefined, 2));
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 4, 0: 1, 1: 2, 2: 3, 3: 4 };
        assert.deepEqual(arrTake(arrayLike, 2), [1, 2]);
    });
});

describe("arrDrop", () => {
    it("should drop first n elements", () => {
        assert.deepEqual(arrDrop([1, 2, 3, 4, 5], 2), [3, 4, 5]);
        assert.deepEqual(arrDrop(["a", "b", "c"], 1), ["b", "c"]);
    });

    it("should return empty array when n exceeds length", () => {
        assert.deepEqual(arrDrop([1, 2], 5), []);
    });

    it("should return all elements when n is 0 or negative", () => {
        assert.deepEqual(arrDrop([1, 2, 3], 0), [1, 2, 3]);
        assert.deepEqual(arrDrop([1, 2, 3], -1), [1, 2, 3]);
    });

    it("should throw for null and undefined", () => {
        // arrSlice (used internally) throws TypeError for null/undefined
        assert.throws(() => arrDrop(null, 2));
        assert.throws(() => arrDrop(undefined, 2));
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 4, 0: 1, 1: 2, 2: 3, 3: 4 };
        assert.deepEqual(arrDrop(arrayLike, 2), [3, 4]);
    });
});

describe("arrTakeWhile", () => {
    it("should take elements while predicate is true", () => {
        assert.deepEqual(arrTakeWhile([1, 2, 3, 4, 1], x => x < 3), [1, 2]);
        assert.deepEqual(arrTakeWhile([2, 4, 6, 1, 8], x => x % 2 === 0), [2, 4, 6]);
    });

    it("should return empty array when first element fails predicate", () => {
        assert.deepEqual(arrTakeWhile([1, 2, 3], x => x > 5), []);
    });

    it("should return all elements when all match predicate", () => {
        assert.deepEqual(arrTakeWhile([1, 2, 3], x => x < 5), [1, 2, 3]);
    });

    it("should handle empty array", () => {
        assert.deepEqual(arrTakeWhile([], x => x > 0), []);
    });

    it("should handle null and undefined", () => {
        assert.deepEqual(arrTakeWhile<number>(null, x => x > 0), []);
        assert.deepEqual(arrTakeWhile<number>(undefined, x => x > 0), []);
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 4, 0: 1, 1: 2, 2: 3, 3: 4 };
        assert.deepEqual(arrTakeWhile(arrayLike, x => x < 3), [1, 2]);
    });

    it("should support thisArg", () => {
        const threshold = { value: 3 };
        const result = arrTakeWhile([1, 2, 3, 4, 5], function(x) {
            return x < this.value;
        }, threshold);
        assert.deepEqual(result, [1, 2]);
    });
});

describe("arrDropWhile", () => {
    it("should drop elements while predicate is true", () => {
        assert.deepEqual(arrDropWhile([1, 2, 3, 4, 1], x => x < 3), [3, 4, 1]);
        assert.deepEqual(arrDropWhile([2, 4, 6, 1, 8], x => x % 2 === 0), [1, 8]);
    });

    it("should return all elements when first element fails predicate", () => {
        assert.deepEqual(arrDropWhile([1, 2, 3], x => x > 5), [1, 2, 3]);
    });

    it("should return empty array when all match predicate", () => {
        assert.deepEqual(arrDropWhile([1, 2, 3], x => x < 5), []);
    });

    it("should handle empty array", () => {
        assert.deepEqual(arrDropWhile([], x => x > 0), []);
    });

    it("should handle null and undefined", () => {
        assert.deepEqual(arrDropWhile<number>(null, x => x > 0), []);
        assert.deepEqual(arrDropWhile<number>(undefined, x => x > 0), []);
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 4, 0: 1, 1: 2, 2: 3, 3: 4 };
        assert.deepEqual(arrDropWhile(arrayLike, x => x < 3), [3, 4]);
    });

    it("should support thisArg", () => {
        const threshold = { value: 3 };
        const result = arrDropWhile([1, 2, 3, 4, 5], function(x) {
            return x < this.value;
        }, threshold);
        assert.deepEqual(result, [3, 4, 5]);
    });
});
