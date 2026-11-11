/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrWith, polyArrWith } from "../../../../src/array/with";

describe("arrWith", () => {
    it("should return new array with element replaced", () => {
        const arr = [1, 2, 3];
        const result = arrWith(arr, 1, 99);
        
        assert.deepEqual(result, [1, 99, 3]);
        assert.deepEqual(arr, [1, 2, 3]); // Original unchanged
    });

    it("should handle negative indices", () => {
        const arr = [1, 2, 3, 4, 5];
        assert.deepEqual(arrWith(arr, -1, 99), [1, 2, 3, 4, 99]);
        assert.deepEqual(arrWith(arr, -2, 88), [1, 2, 3, 88, 5]);
    });

    it("should throw RangeError for out of bounds positive index", () => {
        assert.throws(() => arrWith([1, 2, 3], 5, 99), RangeError);
        assert.throws(() => arrWith([1, 2, 3], 3, 99), RangeError);
        assert.throws(() => arrWith([1, 2, 3], 100, 0), RangeError);
    });

    it("should throw RangeError for out of bounds negative index", () => {
        assert.throws(() => arrWith([1, 2, 3], -4, 99), RangeError);
        assert.throws(() => arrWith([1, 2, 3], -10, 99), RangeError);
        assert.throws(() => arrWith([1, 2, 3], -100, 0), RangeError);
    });

    it("should throw RangeError for empty array", () => {
        assert.throws(() => arrWith([], 0, 99), RangeError);
        assert.throws(() => arrWith([], -1, 99), RangeError);
    });

    it("should replace last element with -1", () => {
        assert.deepEqual(arrWith([10, 20, 30], -1, 99), [10, 20, 99]);
    });

    it("should replace first element with -length", () => {
        assert.deepEqual(arrWith([10, 20, 30], -3, 99), [99, 20, 30]);
    });

    it("should throw when index equals length", () => {
        const arr = [1, 2, 3];
        assert.throws(() => arrWith(arr, arr.length, 99), RangeError);
    });

    it("should throw when negative index points beyond start", () => {
        const arr = [1, 2, 3];
        assert.throws(() => arrWith(arr, -(arr.length + 1), 99), RangeError);
    });

    it("should handle index 0", () => {
        assert.deepEqual(arrWith([1, 2, 3], 0, 99), [99, 2, 3]);
    });

    it("should throw for null and undefined array", () => {
        // Native .with() throws TypeError for null/undefined
        assert.throws(() => arrWith(null as any, 0, 99));
        assert.throws(() => arrWith(undefined as any, 0, 99));
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 3, 0: "a", 1: "b", 2: "c" };
        assert.deepEqual(arrWith(arrayLike, 1, "x"), ["a", "x", "c"]);
    });

    it("should not modify original array", () => {
        const original = [1, 2, 3];
        const copy = [...original];
        arrWith(original, 1, 99);
        
        assert.deepEqual(original, copy);
    });
});

describe("polyArrWith", () => {
    it("should throw RangeError for invalid array-like input", () => {
        assert.throws(() => polyArrWith(null as any, 0, 99), RangeError);
        assert.throws(() => polyArrWith(undefined as any, 0, 99), RangeError);
        assert.throws(() => polyArrWith(123 as any, 0, 99), RangeError);
        assert.throws(() => polyArrWith({} as any, 0, 99), RangeError);
    });

    it("should match native Array.prototype.with for valid indices", () => {
        const arr: any = [1, 2, 3, 4, 5];
        
        for (let i = 0; i < arr.length; i++) {
            const polyResult = polyArrWith(arr, i, 99);
            
            if (arr.with) {
                const nativeResult = arr.with(i, 99);
                assert.deepEqual(polyResult, nativeResult, `Index ${i} should match`);
            } else {
                const expected = [...arr];
                expected[i] = 99;
                assert.deepEqual(polyResult, expected);
            }
        }
    });

    it("should match native Array.prototype.with for negative indices", () => {
        const arr: any = [1, 2, 3, 4, 5];
        
        for (let i = -1; i >= -arr.length; i--) {
            const polyResult = polyArrWith(arr, i, 99);
            
            if (arr.with) {
                const nativeResult = arr.with(i, 99);
                assert.deepEqual(polyResult, nativeResult, `Index ${i} should match`);
            } else {
                const expected = [...arr];
                expected[arr.length + i] = 99;
                assert.deepEqual(polyResult, expected);
            }
        }
    });

    it("should throw RangeError for out of bounds like native", () => {
        const arr: any = [1, 2, 3];
        
        assert.throws(() => polyArrWith(arr, 5, 99), RangeError);
        assert.throws(() => polyArrWith(arr, -10, 99), RangeError);
        assert.throws(() => polyArrWith(arr, 3, 0), RangeError); // Index at length
        assert.throws(() => polyArrWith(arr, -4, 0), RangeError); // Negative index beyond start
        
        if (arr.with) {
            assert.throws(() => arr.with(5, 99), RangeError);
            assert.throws(() => arr.with(-10, 99), RangeError);
        }
    });

    it("should throw RangeError for empty array-like objects", () => {
        const emptyArrayLike = { length: 0 };
        assert.throws(() => polyArrWith(emptyArrayLike, 0, 99), RangeError);
        assert.throws(() => polyArrWith(emptyArrayLike, -1, 99), RangeError);
    });

    it("should handle boundary indices correctly", () => {
        const arr = [10, 20, 30];
        
        // Valid: index 0 to length-1
        assert.deepEqual(polyArrWith(arr, 0, 1), [1, 20, 30]);
        assert.deepEqual(polyArrWith(arr, 1, 2), [10, 2, 30]);
        assert.deepEqual(polyArrWith(arr, 2, 3), [10, 20, 3]);
        
        // Valid: negative indices from -1 to -length
        assert.deepEqual(polyArrWith(arr, -1, 1), [10, 20, 1]);
        assert.deepEqual(polyArrWith(arr, -2, 2), [10, 2, 30]);
        assert.deepEqual(polyArrWith(arr, -3, 3), [3, 20, 30]);
    });

    it("should not modify original array like native", () => {
        const arr: any = [1, 2, 3];
        const copy = [...arr];
        
        polyArrWith(arr, 1, 99);
        assert.deepEqual(arr, copy);
        
        if (arr.with) {
            arr.with(1, 99);
            assert.deepEqual(arr, copy);
        }
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 3, 0: 10, 1: 20, 2: 30 };
        const result = polyArrWith(arrayLike, 1, 99);
        
        assert.deepEqual(result, [10, 99, 30]);
    });

    it("should handle empty array correctly", () => {
        const arr: number[] = [];
        
        assert.throws(() => polyArrWith(arr, 0, 99), RangeError);
        
        if ((arr as any).with) {
            assert.throws(() => (arr as any).with(0, 99), RangeError);
        }
    });
});

describe("polyArrWith index conversion", () => {
    it("should convert the index to an integer like the native function", () => {
        assert.deepEqual(polyArrWith([1, 2, 3], 1.5, 9), [1, 9, 3], "A fraction is truncated");
        assert.deepEqual(polyArrWith([1, 2, 3], -1.5, 9), [1, 2, 9], "A negative fraction is truncated");
        assert.deepEqual(polyArrWith([1, 2, 3], NaN, 9), [9, 2, 3], "NaN is treated as 0");
    });
});

describe("polyArrWith compared to the native function", () => {
    const nativeWith = (Array.prototype as any).with;
    const values: any[] = [
        0, 1, 2, 3, 4, 5, -1, -2, -3, -4, -5, -6,
        0.5, 1.5, 2.5, 3.5, -0.5, -1.5, -2.5, -3.5, -4.5, -5.5,
        NaN, Infinity, -Infinity, "1", "-1", "1.5", "abc", "", null, undefined, true, false,
        2147483647, 2147483648, -2147483648, -2147483649, 4294967295, 4294967296, 4294967297, -4294967296,
        9007199254740991, -9007199254740991, { valueOf: () => 1 }
    ];

    function _run(fn: () => number[]) {
        try {
            return fn();
        } catch (e) {
            return (e as any).name;
        }
    }

    (nativeWith ? it : it.skip)("should return the same result or throw for every kind of index", () => {
        const arrays = [[], [1], [1, 2, 3, 4]];

        for (let lp = 0; lp < arrays.length; lp++) {
            for (let idx = 0; idx < values.length; idx++) {
                const theArray = arrays[lp];
                const value = values[idx];

                assert.deepEqual(_run(() => polyArrWith(theArray, value, 9)), _run(() => nativeWith.call(theArray, value, 9)), "length " + theArray.length + " index [" + String(value) + "]");
            }
        }
    });
});
