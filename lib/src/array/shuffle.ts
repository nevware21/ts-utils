/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { mathFloor } from "../math/floor";
import { mathRandom } from "../math/random";
import { getLength } from "../helpers/length";
import { arrSlice } from "./slice";

/**
 * The arrShuffle() method returns a new array with elements randomly shuffled.
 * Uses the Fisher-Yates shuffle algorithm for uniform randomization.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @param theArray - The array or array-like object to shuffle
 * @returns A new array with elements in random order
 * @example
 * ```ts
 * arrShuffle([1, 2, 3, 4, 5]);  // e.g., [3, 1, 5, 2, 4]
 * arrShuffle(["a", "b", "c"]);  // e.g., ["c", "a", "b"]
 * arrShuffle([1]);              // [1]
 * arrShuffle([]);               // []
 *
 * // Array-like objects
 * arrShuffle({ length: 3, 0: "x", 1: "y", 2: "z" });  // e.g., ["z", "x", "y"]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrShuffle<T>(theArray: ArrayLike<T> | null | undefined): T[] {
    const result = arrSlice(theArray);
    const len = getLength(result);
    
    // Fisher-Yates shuffle
    for (let i = len - 1; i > 0; i--) {
        const swapVal = result[i];
        const j = mathFloor(mathRandom() * (i + 1));
        result[i] = result[j];
        result[j] = swapVal;
    }
    
    return result;
}
