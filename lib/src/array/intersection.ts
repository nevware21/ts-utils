/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike, isStrictNullOrUndefined } from "../helpers/base";
import { _toLength } from "../helpers/length";
import { arrForEach } from "./forEach";
import { LENGTH } from "../internal/constants";
import { _createIncludes, _createSeenSet } from "../internal/identity_map";

/**
 * The arrIntersection() method returns a new array containing elements that exist in all provided arrays.
 * Uses the SameValueZero comparison (like strict equality `===`, except that `NaN` is equal to `NaN`) and maintains
 * order from the first array.
 *
 * Like {@link https://nevware21.github.io/ts-utils/typedoc/functions/arrForEach.html | arrForEach} an empty slot (or a
 * missing index) of the first array is skipped, so it isn't included as `undefined`, while one in another array matches
 * an `undefined` value of the first array. Since 0.20.0 each of the other arrays is read by index, so a string is
 * compared by its characters (rather than matching a substring) and an array-like's own `includes()` isn't called. An
 * array is only read when a value of the first array is included in all of the arrays before it, and only until that
 * value is found, and each of its indexes is read at most once (and its length only when it is first reached), so a
 * change made to it during the call (eg. by a getter of the first array) may not be seen.
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
    // The arrays are only read, so the arguments are used rather than copied into a new array
    return _arrIntersection(arguments as ArrayLike<ArrayLike<T>>);
}

/**
 * @internal
 * @ignore
 * Returns the unique values of the first array-like which are included in every other array-like (a first value which
 * isn't an array-like, or a later null or undefined value, includes nothing), used by arrIntersection() and
 * iterIntersection()
 * @param theArrays - The array-likes
 * @returns The values which are included in every array-like
 */
/*#__NO_SIDE_EFFECTS__*/
export function _arrIntersection<T>(theArrays: ArrayLike<ArrayLike<T>>): T[] {
    const result: T[] = [];

    // Index 0 is only read when there is at least one value, as with none an index 0 inherited by the arguments (or
    // the values of iterIntersection()) would be used
    const firstArray = theArrays[LENGTH] && theArrays[0];

    if (isArrayLike(firstArray)) {
        // Whether a value is included in each later array-like which a value of the first array has reached (compared
        // like arrIncludes(), SameValueZero). A later array-like is only read when a value of the first array is in all
        // of those before it (as before, when it was searched with includes()), and only until the value is found,
        // continuing from the last index read, so each index is read at most once. As a later array-like is only
        // reached after those before it, these are added in order (index lp - 1) so there are no empty slots, which
        // would be read from Array.prototype. A null or undefined later value includes nothing, any other value is read
        // like an array-like (its length is converted like the native functions, an empty slot is undefined and a
        // string is read by its characters, rather than its own includes() matching a substring)
        const laterIncludes: Array<(item: T) => boolean> = [];

        // The values which have been added, so each is only added once
        const seen = _createSeenSet();
        arrForEach(firstArray, (item) => {
            for (let lp = 1; lp < theArrays[LENGTH]; lp++) {
                if (lp > laterIncludes[LENGTH]) {
                    const values: ArrayLike<T> = theArrays[lp];
                    laterIncludes.push(_createIncludes(values, isStrictNullOrUndefined(values) ? 0 : _toLength(values)));
                }

                if (!laterIncludes[lp - 1](item)) {
                    return;
                }
            }

            if (!seen.has(item)) {
                seen.add(item);
                result.push(item);
            }
        });
    }

    return result;
}
