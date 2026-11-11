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

describe("polyArrFill index conversion", () => {
    it("should convert the indexes to integers like the native function", () => {
        assert.deepEqual(polyArrFill([1, 2, 3], 9, 0.5), [9, 9, 9], "A fractional start is truncated");
        assert.deepEqual(polyArrFill([1, 2, 3], 9, NaN), [9, 9, 9], "A NaN start is treated as 0");
        assert.deepEqual(polyArrFill([1, 2, 3], 9, 1, 2.5), [1, 9, 3], "A fractional end is truncated");
        assert.deepEqual(polyArrFill([1, 2, 3], 9, 0, NaN), [1, 2, 3], "A NaN end is treated as 0");
    });

    it("should not add fractional properties", () => {
        assert.deepEqual(Object.keys(polyArrFill([1, 2, 3], 9, 0.5)), ["0", "1", "2"]);
    });
});

describe("polyArrFill compared to the native function", () => {
    const nativeFill = (Array.prototype as any).fill;
    const values: any[] = [
        0, 1, 2, 3, 4, 5, -1, -2, -3, -4, -5, -6,
        0.5, 1.5, 2.5, 3.5, -0.5, -1.5, -2.5, -3.5, -4.5, -5.5,
        NaN, Infinity, -Infinity, "1", "-1", "1.5", "abc", "", null, undefined, true, false,
        2147483647, 2147483648, -2147483648, -2147483649, 4294967295, 4294967296, 4294967297, -4294967296,
        9007199254740991, -9007199254740991, { valueOf: () => 1 }
    ];

    (nativeFill ? it : it.skip)("should return the same result for every kind of start and end", () => {
        const sources = [[], [1], [1, 2, 3, 4]];

        for (let lp = 0; lp < sources.length; lp++) {
            for (let start = 0; start < values.length; start++) {
                for (let end = 0; end < values.length; end++) {
                    const actual = polyArrFill(sources[lp].slice(), 9, values[start], values[end]) as number[];
                    const expected = nativeFill.call(sources[lp].slice(), 9, values[start], values[end]);
                    const details = "length " + sources[lp].length + " start [" + String(values[start]) + "] end [" + String(values[end]) + "]";

                    assert.deepEqual(actual, expected, details);
                    assert.equal(Object.keys(actual).length, sources[lp].length, "No extra properties: " + details);
                }
            }
        }
    });
});
