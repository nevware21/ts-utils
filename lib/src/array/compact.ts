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
 * The arrCompact() method returns a new array with all falsy values removed.
 * Falsy values include: false, 0, -0, 0n, "", null, undefined, and NaN.
 * @function
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @param theArray - The array or array-like object to compact
 * @returns A new array with all falsy values filtered out
 * @example
 * ```ts
 * arrCompact([0, 1, false, 2, "", 3, null, undefined, 4]);  // [1, 2, 3, 4]
 * arrCompact([false, 0, "", null, undefined]);              // []
 * arrCompact([1, 2, 3]);                                    // [1, 2, 3]
 * arrCompact([]);                                           // []
 *
 * // Array-like objects
 * arrCompact({ length: 5, 0: 0, 1: 1, 2: false, 3: 2, 4: null });  // [1, 2]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrCompact<T>(theArray: ArrayLike<T | null | undefined | false | 0 | ""> | null | undefined): T[] {
    const result: T[] = [];

    if (isArrayLike(theArray)) {
        arrForEach(theArray, (item) => {
            if (item) {
                result.push(item);
            }
        });
    }

    return result;
}
