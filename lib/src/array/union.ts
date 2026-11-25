/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isStrictNullOrUndefined } from "../helpers/base";
import { _checkArrayLength, _toLength } from "../helpers/length";
import { LENGTH } from "../internal/constants";
import { _createSeenSet } from "../internal/identity_map";

/**
 * The arrUnion() method returns a new array containing all unique elements from all provided arrays.
 * Uses the SameValueZero comparison (like strict equality `===`, except that `NaN` is equal to `NaN`) and maintains
 * insertion order. An empty slot (or a missing index of an array-like) is added as `undefined` (unlike
 * {@link arrUnique}, which skips it).
 *
 * Like the other array helpers (eg.
 * {@link https://nevware21.github.io/ts-utils/typedoc/functions/arrForEach.html | arrForEach}) a string (or `String`
 * object) is read by index, so it is split into its UTF-16 code units (a surrogate pair, eg. an emoji, is two values),
 * unlike {@link arrFrom}, which splits it into its code points (as do the iterator helpers, eg. {@link iterUnion}, on a
 * runtime with `Symbol.iterator`).
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
/*#__NO_SIDE_EFFECTS__*/
export function arrUnion<T>(): T[] {
    let result: T[] = [];
    let theArgs = arguments;

    // The values which have been added (compared like arrIncludes(), SameValueZero), so each is only added once
    let seen = _createSeenSet();

    // The arguments have no empty slots, so they are read with a loop rather than arrForEach()
    for (let lp = 0; lp < theArgs[LENGTH]; lp++) {
        // A null or undefined value is skipped, any other value is read like an array-like (as in v0.16.0), so its
        // length is converted like the native functions (eg. a string length, or a function's length) and a value
        // without a length adds nothing. A length which is longer than an array can be throws a RangeError, as the copy
        // made with slice() did before (and in v0.16.0), rather than reading indexes until the runtime runs out of
        // memory. Each index is read once, and its value is added when it hasn't already been (an empty slot adds
        // undefined, as in v0.16.0), rather than combining copies of the arrays and removing the duplicates
        let arr: ArrayLike<T> = theArgs[lp];
        if (!isStrictNullOrUndefined(arr)) {
            let len = _checkArrayLength(_toLength(arr));
            for (let idx = 0; idx < len; idx++) {
                let value = arr[idx];
                if (!seen.has(value)) {
                    seen.add(value);
                    result.push(value);
                }
            }
        }
    }

    return result;
}
