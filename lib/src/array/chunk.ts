/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike } from "../helpers/base";
import { arrForEach } from "./forEach";

/**
 * The arrChunk() method returns a new array with elements divided into groups of a specified size.
 * The last group may have fewer elements if the array length is not divisible by the chunk size.
 * @function
 * @since 0.13.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @param theArray - The array or array-like object to chunk
 * @param size - The size of each chunk. Must be a positive integer
 * @returns A new array of chunks, where each chunk is an array of the specified size
 * @example
 * ```ts
 * arrChunk([1, 2, 3, 4, 5, 6, 7], 2);     // [[1, 2], [3, 4], [5, 6], [7]]
 * arrChunk([1, 2, 3, 4, 5], 3);          // [[1, 2, 3], [4, 5]]
 * arrChunk([1, 2, 3], 1);                // [[1], [2], [3]]
 * arrChunk([1, 2, 3], 5);                // [[1, 2, 3]]
 * arrChunk([], 2);                       // []
 *
 * // Array-like objects
 * arrChunk({ length: 5, 0: "a", 1: "b", 2: "c", 3: "d", 4: "e" }, 2);
 * // [["a", "b"], ["c", "d"], ["e"]]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrChunk<T>(theArray: ArrayLike<T> | null | undefined, size: number): T[][] {
    const result: T[][] = [];
    
    if (isArrayLike(theArray) && size > 0) {
        let idx = 0;
        let chunkIdx = 0;

        arrForEach(theArray, (item) => {
            if (idx % size === 0) {
                result.push([]);
                chunkIdx = result.length - 1;
            }

            result[chunkIdx].push(item);
            idx++;
        });
    }

    return result;
}
