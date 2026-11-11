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

describe("polyArrAt index conversion", () => {
    it("should convert the index to an integer like the native function", () => {
        assert.equal(polyArrAt([1, 2, 3], 1.5), 2, "A fraction is truncated");
        assert.equal(polyArrAt([1, 2, 3], -1.5), 3, "A negative fraction is truncated");
        assert.equal(polyArrAt([1, 2, 3], NaN), 1, "NaN is treated as 0");
        assert.equal(polyArrAt([1, 2, 3], "1" as any), 2, "A numeric string is converted");
        assert.equal(polyArrAt([1, 2, 3], Infinity), undefined, "Infinity is out of bounds");
    });
});

describe("polyArrAt compared to the native function", () => {
    const nativeAt = (Array.prototype as any).at;
    const values: any[] = [
        0, 1, 2, 3, 4, 5, -1, -2, -3, -4, -5, -6,
        0.5, 1.5, 2.5, 3.5, -0.5, -1.5, -2.5, -3.5, -4.5, -5.5,
        NaN, Infinity, -Infinity, "1", "-1", "1.5", "abc", "", null, undefined, true, false,
        2147483647, 2147483648, -2147483648, -2147483649, 4294967295, 4294967296, 4294967297, -4294967296,
        9007199254740991, -9007199254740991, { valueOf: () => 1 }
    ];

    (nativeAt ? it : it.skip)("should return the same result for every kind of index", () => {
        const arrays: any[] = [[], [1], [1, 2, 3, 4], { length: 0, 0: "x" }, { length: 2, 0: "x", 1: "y" }];

        for (let lp = 0; lp < arrays.length; lp++) {
            for (let idx = 0; idx < values.length; idx++) {
                assert.equal(polyArrAt(arrays[lp], values[idx]), nativeAt.call(arrays[lp], values[idx]), "length " + arrays[lp].length + " index [" + String(values[idx]) + "]");
            }
        }
    });
});

describe("polyArrAt with indexes above 2^31", () => {
    const BIG = 0x80000000;

    it("should not wrap a large index of an array-like", () => {
        const arrayLike: any = { length: BIG + 1, 1: "wrong" };
        arrayLike[BIG] = "x";

        assert.equal(polyArrAt(arrayLike, BIG), "x");
        assert.equal(polyArrAt(arrayLike, BIG + 0.5), "x", "A fractional index is still truncated");
    });

    it("should not wrap a large negative index", () => {
        const arrayLike: any = { length: BIG + 2, 1: "target" };

        assert.equal(polyArrAt(arrayLike, -(BIG + 1)), "target");
    });

    it("should support a sparse array longer than 2^31", () => {
        const sparse: string[] = [];
        sparse[1] = "wrong";
        sparse[BIG] = "x";

        assert.equal(polyArrAt(sparse, BIG), "x");
        assert.equal(polyArrAt(sparse, -1), "x");
    });
});
