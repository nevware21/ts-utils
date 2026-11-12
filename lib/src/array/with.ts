/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrProto } from "../internal/constants";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { isArrayLike } from "../helpers/base";
import { _toLength } from "../helpers/length";
import { _arrSliceToArr } from "./slice";
import { throwRangeError } from "../helpers/throw";

/**
 * The arrWith() method is the copying version of using the bracket notation to change the value
 * of a given index. It returns a new array with the element at the given index replaced with the
 * given value. This is an ES2023 feature with polyfill support for older environments.
 * @function
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array or array-like object to copy from
 * @param index - The index at which to change the value. Negative index counts from the end
 * @param value - The new value to set at the index
 * @returns A new array with the element at index replaced, or the original array if index is out of range
 * @example
 * ```ts
 * arrWith([1, 2, 3], 1, 5);       // [1, 5, 3]
 * arrWith([1, 2, 3], -1, 5);      // [1, 2, 5]
 * arrWith([1, 2, 3], -2, 5);      // [1, 5, 3]
 * arrWith([1, 2, 3], 10, 5);      // RangeError (out of bounds)
 *
 * const original = [1, 2, 3];
 * const modified = arrWith(original, 1, 9);
 * // original: [1, 2, 3], modified: [1, 9, 3]
 *
 * // Array-like objects
 * arrWith({ length: 3, 0: "a", 1: "b", 2: "c" }, 1, "x");  // ["a", "x", "c"]
 * ```
 */
export const arrWith = (/*#__PURE__*/_unwrapFunctionWithPoly("with", ArrProto as any, polyArrWith) as <T>(theArray: ArrayLike<T>, index: number, value: T) => T[]);

/**
 * Polyfill implementation of Array.with() for environments that don't support it.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @group Polyfill
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array or array-like object to copy from
 * @param index - The index at which to change the value
 * @param value - The new value to set at the index
 * @returns A new array with the element at index replaced
 * @throws RangeError if the index is out of bounds
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyArrWith<T>(theArray: ArrayLike<T>, index: number, value: T): T[] {
    let result: T[];
    
    if (!isArrayLike(theArray)) {
        throwRangeError("Invalid array");
    }
    
    const len = _toLength(theArray.length);
    // Convert the index (NaN becomes 0), any other value outside of the range is rejected by the check
    let idx = +index || 0;

    // Check the bounds before truncating, which uses % as a bitwise operator would wrap the indexes of an array longer than 2^31
    if (!len || idx <= -len - 1 || idx >= len) {
        throwRangeError("Index out of bounds");
    }

    idx -= idx % 1;

    // Convert negative index to positive
    if (idx < 0) {
        idx = len + idx;
    }
    
    // Create a copy and set value
    result = _arrSliceToArr(theArray);
    result[idx] = value;
    
    return result;
}
