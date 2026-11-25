/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike } from "../helpers/base";
import { _toLength } from "../helpers/length";
import { arrForEach } from "./forEach";
import { LENGTH } from "../internal/constants";
import { _createIncludes } from "../internal/identity_map";

/**
 * The arrDifference() method returns a new array containing elements from the first array
 * that do not exist in any of the other provided arrays. Uses the SameValueZero comparison (like strict equality
 * `===`, except that `NaN` is equal to `NaN`).
 *
 * Like {@link https://nevware21.github.io/ts-utils/typedoc/functions/arrForEach.html | arrForEach} an empty slot (or a
 * missing index) of the first array is skipped, so it isn't included as `undefined`, while one in another array
 * excludes an `undefined` value of the first array. Since 0.20.0 each of the other arrays is read by index, so a string
 * is compared by its characters (rather than matching a substring) and an array-like's own `includes()` isn't called.
 * An array to exclude is only read when a value of the first array isn't in any of the arrays to exclude before it, and
 * only until that value is found, and each of its indexes is read at most once (and its length only when it is first
 * reached), so a change made to it during the call (eg. by a getter of the first array) may not be seen.
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
export function arrDifference<T>(theArray: ArrayLike<T> | null | undefined, ...excludeArrays: ArrayLike<T>[]): T[];

/*#__NO_SIDE_EFFECTS__*/
export function arrDifference<T>(theArray: ArrayLike<T> | null | undefined): T[] {
    let result: T[] = [];

    if (isArrayLike(theArray)) {
        // The arrays to exclude are the arguments after theArray, which are only read so they are not copied into a new
        // array (any value which isn't an array-like is ignored)
        let theArgs = arguments;

        // Whether a value is included in each array-like to exclude which a value has reached (compared like
        // arrIncludes(), SameValueZero). An array-like is only read when a value isn't in any of those before it (as
        // before, when it was searched with includes()), and only until the value is found, continuing from the last
        // index read, so each index is read at most once. As an array-like is only reached after those before it, these
        // are added in order (index lp - 1) so there are no empty slots, which would be read from Array.prototype. A
        // string is read by its characters (rather than its own includes() matching a substring), and an empty slot is
        // undefined
        let excludes: Array<(item: T) => boolean> = [];

        arrForEach(theArray, (item) => {
            for (let lp = 1; lp < theArgs[LENGTH]; lp++) {
                if (lp > excludes[LENGTH]) {
                    let values: ArrayLike<T> = theArgs[lp];
                    excludes.push(_createIncludes(values, isArrayLike(values) ? _toLength(values) : 0));
                }

                if (excludes[lp - 1](item)) {
                    return;
                }
            }

            result.push(item);
        });
    }
    
    return result;
}
