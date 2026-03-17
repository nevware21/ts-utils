/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrUnique } from "./unique";
import { arrAppend } from "./append";
import { arrSlice } from "./slice";
import { arrForEach } from "./forEach";

/**
 * The arrUnion() method returns a new array containing all unique elements from all provided arrays.
 * Uses strict equality (===) for comparison and maintains insertion order.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @param arrays - One or more arrays to combine
 * @returns A new array containing all unique elements from all arrays
 * @example
 * ```ts
 * arrUnion([1, 2], [2, 3]);                  // [1, 2, 3]
 * arrUnion([1, 2], [3, 4], [4, 5]);          // [1, 2, 3, 4, 5]
 * arrUnion(["a", "b"], ["b", "c"]);          // ["a", "b", "c"]
 * arrUnion([1, 1, 2], [2, 2, 3]);            // [1, 2, 3]
 * arrUnion([], [1, 2]);                      // [1, 2]
 *
 * // Array-like objects
 * arrUnion({ length: 2, 0: 1, 1: 2 }, [2, 3]);  // [1, 2, 3]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrUnion<T>(...arrays: ArrayLike<T>[]): T[];
export function arrUnion<T>(): T[] {
    let combined: T[] = [];
    let theArgs = arguments;

    arrForEach(theArgs, (arr) => {
        combined = arrAppend(combined, arrSlice(arr));
    });
    
    return arrUnique(combined);
}
