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
import { _strArgsToArr } from "./slice";
import { LENGTH } from "../internal/constants";

/**
 * The arrIntersection() method returns a new array containing elements that exist in all provided arrays.
 * Uses strict equality (===) for comparison and maintains order from the first array.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @param arrays - Two or more arrays to intersect
 * @returns A new array containing elements common to all arrays
 * @example
 * ```ts
 * arrIntersection([1, 2, 3], [2, 3, 4]);           // [2, 3]
 * arrIntersection([1, 2, 3], [2, 3], [3, 4]);      // [3]
 * arrIntersection(["a", "b"], ["b", "c"]);         // ["b"]
 * arrIntersection([1, 2], [3, 4]);                 // []
 * arrIntersection([1, 2, 3], []);                  // []
 *
 * // Array-like objects
 * arrIntersection({ length: 3, 0: 1, 1: 2, 2: 3 }, [2, 3]);  // [2, 3]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrIntersection<T>(...arrays: ArrayLike<T>[]): T[];
/*#__NO_SIDE_EFFECTS__*/
export function arrIntersection<T>(): T[] {
    // A string's own includes() matches a substring, so its characters are compared instead
    return _arrIntersection(_strArgsToArr(arguments as ArrayLike<ArrayLike<T>>));
}

/**
 * @internal
 * @ignore
 * Returns the unique values of the first array-like which are included in every other array-like (a value which isn't
 * an array-like includes nothing), used by arrIntersection() and iterIntersection()
 * @param theArrays - The array-likes
 * @returns The values which are included in every array-like
 */
/*#__NO_SIDE_EFFECTS__*/
export function _arrIntersection<T>(theArrays: ArrayLike<ArrayLike<T>>): T[] {
    const result: T[] = [];

    if (theArrays[LENGTH] > 0) {
        
        const firstArray = theArrays[0];
        if (isArrayLike(firstArray)) {
            arrForEach(firstArray, (item) => {
                let inAll = true;
                arrForEach(theArrays, (arr, index) => {
                    if (index > 0 && !(isArrayLike(arr) && arrIncludes(arr, item))) {
                        inAll = false;
                        return -1; // Break out of forEach
                    }
                });

                if (inAll && !arrIncludes(result, item)) {
                    result.push(item);
                }
            });
        }
    }

    return result;
}
