/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrSlice } from "./slice";
import { getLength } from "../helpers/length";
import { isArrayLike } from "../helpers/base";
import { arrAppend } from "./append";

/**
 * The arrRotate() method returns a new array with elements rotated by the specified number of positions.
 * Positive values rotate left (elements shift forward), negative values rotate right
 * (elements shift backward). The original array is not modified.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array or array-like object to rotate
 * @param count - Number of positions to rotate. Positive = right, negative = left
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
        const len = theArray.length;

        if (!(len === 0 || count === 0)) {
            // Normalize the rotation count to be within array bounds
            let rotations = count % len;
            if (rotations < 0) {
                rotations = len + rotations;
            }
            
            // If no effective rotation needed
            if (rotations !== 0) {
                // Split at rotation point and recombine
                // For positive count: rotate left (elements shift forward)
                result = [];
                arrAppend(result, arrSlice(theArray, rotations));
                arrAppend(result, arrSlice(theArray, 0, rotations));
            }
        }

        if (!result) {
            result = arrSlice(theArray);
        }
    }

    return result || [];
}
