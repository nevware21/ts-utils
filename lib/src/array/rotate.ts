/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { _arrSliceToArr } from "./slice";
import { isArrayLike } from "../helpers/base";
import { ArrCls } from "../internal/constants";
import { _toLength } from "../helpers/length";

/**
 * The arrRotate() method returns a new array with elements rotated by the specified number of positions.
 * Positive values rotate left (elements shift forward), negative values rotate right
 * (elements shift backward). The original array is not modified. An empty slot (or a missing index of an array-like)
 * is `undefined` in the result, except when the count is 0 or a multiple of the length, where a copy (with its empty
 * slots) is returned.
 *
 * Like the other array helpers (eg.
 * {@link https://nevware21.github.io/ts-utils/typedoc/functions/arrForEach.html | arrForEach}) a string (or `String`
 * object) is read by index, so it is split into its UTF-16 code units (a surrogate pair, eg. an emoji, is two values),
 * unlike {@link arrFrom} which splits it into its code points.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array or array-like object to rotate
 * @param count - Number of positions to rotate. Positive = left, negative = right
 * @returns A new array with elements rotated
 * @example
 * ```ts
 * arrRotate([1, 2, 3, 4, 5], 2);      // [3, 4, 5, 1, 2]
 * arrRotate([1, 2, 3, 4, 5], -2);     // [4, 5, 1, 2, 3]
 * arrRotate([1, 2, 3], 0);            // [1, 2, 3]
 * arrRotate([1, 2, 3], 3);            // [1, 2, 3] (full rotation)
 * arrRotate([1, 2, 3], 5);            // [3, 1, 2] (wraps around)
 * arrRotate([1, 2, 3], -5);           // [2, 3, 1] (wraps around)
 * arrRotate([], 3);                   // []
 *
 * // Array-like objects
 * arrRotate({ length: 3, 0: "a", 1: "b", 2: "c" }, 1);  // ["b", "c", "a"]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrRotate<T>(theArray: ArrayLike<T> | null | undefined, count: number): T[] {
    let result: T[];

    if (isArrayLike(theArray)) {
        // A fractional length is truncated (like the native functions), so the rotation is a whole number of positions
        const len = _toLength(theArray);

        if (!(len === 0 || count === 0)) {
            // Normalize the rotation count to be within array bounds
            let rotations = count % len;
            if (rotations < 0) {
                rotations = len + rotations;
            }

            // If no effective rotation needed
            if (rotations !== 0) {
                // Rotate left by a whole number of positions (for a positive count), as in v0.16.0 where the rotation
                // was the start / end passed to slice(). The normalized rotation is in (0, len] or NaN, and new
                // ArrCls(len) has already checked len is at most 2^32 - 1, so `>>> 0` truncates a fraction (eg. for a
                // length of 3, -0.5 is normalized to 2.5, rotating 2 left, which is one right), NaN (eg. for a count of
                // Infinity or undefined) is 0, and a tiny negative fraction (eg. -1e-17, where `len + rotations` rounds
                // to `len`) is `len`, which is reset to 0 before the first read. Each index is read once, in the order
                // of the result, into a presized array (rather than copying two slices and appending them), so an empty
                // slot is undefined (as in v0.16.0) even when the converted rotation is 0, while the copy returned for
                // a count of 0 or a multiple of the length keeps it
                result = new ArrCls(len);
                rotations >>>= 0;
                for (let idx = 0; idx < len; idx++) {
                    if (rotations === len) {
                        rotations = 0;
                    }

                    result[idx] = theArray[rotations++];
                }
            }
        }

        if (!result) {
            result = _arrSliceToArr(theArray);
        }
    }

    return result || [];
}
