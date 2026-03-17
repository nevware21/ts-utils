/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike } from "../helpers/base";
import { arrForEach } from "./forEach";
import { arrIncludes } from "./includes";

/**
 * The arrDifference() method returns a new array containing elements from the first array
 * that do not exist in any of the other provided arrays. Uses strict equality (===) for comparison.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @param theArray - The source array to compare from
 * @param excludeArrays - One or more arrays whose values should be excluded
 * @returns A new array containing elements only in the source array
 * @example
 * ```ts
 * arrDifference([1, 2, 3, 4], [2, 4]);           // [1, 3]
 * arrDifference([1, 2, 3], [2], [3]);            // [1]
 * arrDifference(["a", "b", "c"], ["b"]);         // ["a", "c"]
 * arrDifference([1, 2, 3], []);                  // [1, 2, 3]
 * arrDifference([], [1, 2]);                     // []
 *
 * // Array-like objects
 * arrDifference({ length: 3, 0: 1, 1: 2, 2: 3 }, [2]);  // [1, 3]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrDifference<T>(theArray: ArrayLike<T> | null | undefined, ...excludeArrays: ArrayLike<T>[]): T[] {
    let result: T[] = [];
    
    if (isArrayLike(theArray)) {
        arrForEach(theArray, (item) => {
            let excluded = false;
            for (let lp = 0; lp < excludeArrays.length; lp++) {
                let exclValue = excludeArrays[lp];
                // Check if excludeArray is valid before using arrIncludes
                if (isArrayLike(exclValue) && arrIncludes(exclValue, item)) {
                    excluded = true;
                    break;
                }
            }

            if (!excluded) {
                result.push(item);
            }
        });
    }
    
    return result;
}
