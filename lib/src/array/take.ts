/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrSlice } from "./slice";
import { mathMax } from "../math/min_max";

/**
 * The arrTake() method returns a new array with the first n elements from the source array.
 * If n is greater than the array length, returns all elements. If n is negative or 0, returns empty array.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @param theArray - The array or array-like object to take from
 * @param count - The number of elements to take from the beginning
 * @returns A new array containing the first n elements
 * @example
 * ```ts
 * arrTake([1, 2, 3, 4, 5], 3);    // [1, 2, 3]
 * arrTake(["a", "b", "c"], 2);    // ["a", "b"]
 * arrTake([1, 2], 5);             // [1, 2]
 * arrTake([1, 2, 3], 0);          // []
 * arrTake([1, 2, 3], -1);         // []
 *
 * // Array-like objects
 * arrTake({ length: 4, 0: 1, 1: 2, 2: 3, 3: 4 }, 2);  // [1, 2]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrTake<T>(theArray: ArrayLike<T> | null | undefined, count: number): T[] {
    return arrSlice(theArray, 0, mathMax(0, count));
}
