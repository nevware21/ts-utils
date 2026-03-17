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
 * The arrDrop() method returns a new array with the first n elements removed from the source array.
 * If n is greater than the array length, returns empty array. If n is negative or 0, returns all elements.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @param theArray - The array or array-like object to drop from
 * @param count - The number of elements to drop from the beginning
 * @returns A new array with the first n elements removed
 * @example
 * ```ts
 * arrDrop([1, 2, 3, 4, 5], 2);    // [3, 4, 5]
 * arrDrop(["a", "b", "c"], 1);    // ["b", "c"]
 * arrDrop([1, 2], 5);             // []
 * arrDrop([1, 2, 3], 0);          // [1, 2, 3]
 * arrDrop([1, 2, 3], -1);         // [1, 2, 3]
 *
 * // Array-like objects
 * arrDrop({ length: 4, 0: 1, 1: 2, 2: 3, 3: 4 }, 2);  // [3, 4]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrDrop<T>(theArray: ArrayLike<T> | null | undefined, count: number): T[] {
    return arrSlice(theArray, mathMax(0, count));
}
