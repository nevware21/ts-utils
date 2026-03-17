/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike } from "../helpers/base";
import { mathFloor } from "../math/floor";
import { mathRandom } from "../math/random";
import { getLength } from "../helpers/length";

/**
 * The arrSample() method returns a random element from the array.
 * Returns undefined if the array is empty or null/undefined.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @param theArray - The array or array-like object to sample from
 * @returns A random element from the array, or undefined if empty
 * @example
 * ```ts
 * arrSample([1, 2, 3, 4, 5]);  // e.g., 3
 * arrSample(["a", "b", "c"]);  // e.g., "b"
 * arrSample([42]);             // 42
 * arrSample([]);               // undefined
 * arrSample(null);             // undefined
 *
 * // Array-like objects
 * arrSample({ length: 3, 0: "x", 1: "y", 2: "z" });  // e.g., "y"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrSample<T>(theArray: ArrayLike<T> | null | undefined): T | undefined {
    let result: T | undefined;

    if (isArrayLike(theArray)) {
        const len = getLength(theArray);
        if (len !== 0) {
            const index = mathFloor(mathRandom() * len);
            result = theArray[index];
        }
    }

    return result;
}
