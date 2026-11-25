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

    it("should truncate a fractional length, like the native functions", () => {
        const arrayLike: any = { length: 2.5, 0: "a", 1: "b", 2: "c" };

        // The rotation is a whole number of positions of the 2 values, previously 3 and 4 positions were 0.5 and 1.5
        assert.deepEqual(arrRotate(arrayLike, 1), ["b", "a"]);
        assert.deepEqual(arrRotate(arrayLike, 2), ["a", "b"]);
        assert.deepEqual(arrRotate(arrayLike, 3), ["b", "a"], "3 positions of 2 values is 1 position");
        assert.deepEqual(arrRotate(arrayLike, 4), ["a", "b"], "4 positions of 2 values is no rotation");
        assert.deepEqual(arrRotate(arrayLike, -1), ["b", "a"]);
        assert.deepEqual(arrRotate({ length: 0.5, 0: "a" } as any, 1), []);
    });

    it("should rotate by a whole number of positions for a fractional, NaN or infinite count (as in v0.16.0)", () => {
        const values = ["a", "b", "c"];

        // A fraction is truncated (after the count is normalized to the array bounds)
        assert.deepEqual(arrRotate(values, 1.5), ["b", "c", "a"], "1.5 is 1 position");
        assert.deepEqual(arrRotate(values, 2.9), ["c", "a", "b"], "2.9 is 2 positions");
        assert.deepEqual(arrRotate(values, 0.5), ["a", "b", "c"], "0.5 is no rotation");
        assert.deepEqual(arrRotate(values, -0.5), ["c", "a", "b"], "-0.5 is 2.5, so 2 positions");
        assert.deepEqual(arrRotate(values, -3.5), ["c", "a", "b"], "-3.5 is 2.5, so 2 positions");

        // NaN or an infinite count is no rotation
        assert.deepEqual(arrRotate(values, NaN), ["a", "b", "c"], "NaN");
        assert.deepEqual(arrRotate(values, Infinity), ["a", "b", "c"], "Infinity");
        assert.deepEqual(arrRotate(values, -Infinity), ["a", "b", "c"], "-Infinity");
    });

    it("should not rotate for a tiny negative fraction that normalizes to the length (as in v0.16.0)", () => {
        // -1e-17 % 3 is -1e-17, and 3 + -1e-17 rounds to 3 (the length), which is no rotation
        assert.deepEqual(arrRotate([1, 2, 3], -1e-17), [1, 2, 3]);
        assert.deepEqual(arrRotate({ length: 2, 0: "a", 1: "b" }, -Number.MIN_VALUE), ["a", "b"]);
    });

    it("should fill an empty slot with undefined when rotating (as in v0.16.0)", () => {
        // eslint-disable-next-line no-sparse-arrays
        const result = arrRotate([1, , 3], 1);

        assert.deepEqual(result, [undefined, 3, 1]);
        assert.isTrue(0 in result, "The empty slot is an undefined value");
    });

    it("should fill an empty slot with undefined for a count which isn't 0 or a multiple of the length, and keep it in a copy (as in v0.16.0)", () => {
        [NaN, 0.5, Infinity, undefined, -1e-17].forEach((count) => {
            // eslint-disable-next-line no-sparse-arrays
            const result = arrRotate([1, , 3], count as any);

            assert.deepEqual(result, [1, undefined, 3], "Count " + count);
            assert.isTrue(1 in result, "The empty slot is an undefined value for a count of " + count);
        });

        // A count of 0 or a multiple of the length (or null) returns a copy, which keeps the empty slot
        [0, 3, -3, null].forEach((count) => {
            // eslint-disable-next-line no-sparse-arrays
            const result = arrRotate([1, , 3], count as any);

            assert.deepEqual(result, [1, undefined, 3], "Count " + count);
            assert.isFalse(1 in result, "The empty slot is kept for a count of " + count);
        });
    });

    it("should rotate an array with more values than apply() accepts as arguments", () => {
        const values: number[] = [];
        for (let lp = 0; lp < 300000; lp++) {
            values.push(lp);
        }

        const result = arrRotate(values, 1);
        assert.equal(result.length, 300000);
        assert.equal(result[0], 1);
        assert.equal(result[299998], 299999);
        assert.equal(result[299999], 0);
    });

    it("should read each index once, in the order of the result", () => {
        const reads: number[] = [];
        const values: any = { length: 3 };
        ["a", "b", "c"].forEach((value, idx) => {
            Object.defineProperty(values, idx, {
                get: () => {
                    reads.push(idx);
                    return value;
                }
            });
        });

        assert.deepEqual(arrRotate(values, 1), ["b", "c", "a"]);
        assert.deepEqual(reads, [1, 2, 0]);
    });

    it("should throw a RangeError for a length which is longer than an array can be, before reading an index", () => {
        const values = Object.defineProperty({ length: 2 ** 32 }, 1, {
            get: () => {
                throw new Error("Read");
            }
        });

        // A rotation of 1 reads index 1 first
        assert.throws(() => arrRotate(values as any, 1), RangeError);
    });

    it("should fill an empty slot with undefined, rather than an index added to Array.prototype where it is moved to", () => {
        const arrProto: any = Array.prototype;
        let result: any[];

        try {
            arrProto[1] = "P";
            // eslint-disable-next-line no-sparse-arrays
            result = arrRotate(["a", "b", , "d"], 1);
        } finally {
            delete arrProto[1];
        }

        assert.deepEqual(result, ["b", undefined, "d", "a"]);
        assert.isTrue(1 in result, "The empty slot is an undefined value");
    });

    it("should not use the Symbol.species of an array which it rotates, so one which can't be written to doesn't throw", function() {
        if (typeof Symbol !== "function" || !Symbol.species) {
            this.skip();
            return;
        }

        // A species which creates a frozen array, so a copy made with it can't be written to (main and v0.16.0
        // copied the array with slice(), which uses it, and threw a TypeError)
        const values: any = [1, 2, 3];
        const ctor: any = {};
        ctor[Symbol.species] = function (len: number) {
            return Object.freeze(new Array(len));
        };
        values.constructor = ctor;

        assert.deepEqual(arrRotate(values, 1), [2, 3, 1]);

        // The copy which is returned for a count of 0 or a multiple of the length still uses slice(), and so the
        // species
        assert.throws(() => arrRotate(values, 3), TypeError);
    });
});
