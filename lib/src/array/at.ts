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

/**
 * The arrAt() method takes an integer value and returns the item at that index, allowing for
 * positive and negative integers. Negative integers count back from the last item in the array.
 * This is an ES2022 feature with polyfill support for older environments.
 * @function
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array or array-like object to get element from
 * @param index - The index of the element to return. Negative index counts from the end
 * @returns The element at the specified index, or undefined if index is out of range
 * @example
 * ```ts
 * arrAt([1, 2, 3, 4, 5], 0);      // 1
 * arrAt([1, 2, 3, 4, 5], 2);      // 3
 * arrAt([1, 2, 3, 4, 5], -1);     // 5
 * arrAt([1, 2, 3, 4, 5], -2);     // 4
 * arrAt([1, 2, 3], 10);           // undefined
 * arrAt([1, 2, 3], -10);          // undefined
 *
 * // Array-like objects
 * arrAt({ length: 3, 0: "a", 1: "b", 2: "c" }, -1);  // "c"
 * ```
 */
export const arrAt = (/*#__PURE__*/_unwrapFunctionWithPoly("at", ArrProto as any, polyArrAt) as <T>(theArray: ArrayLike<T>, index: number) => T | undefined);

/**
 * Polyfill implementation of Array.at() for environments that don't support it.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @group Polyfill
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array or array-like object to get element from
 * @param index - The index of the element to return
 * @returns The element at the specified index, or undefined if out of range
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyArrAt<T>(theArray: ArrayLike<T>, index: number): T | undefined {
    let result: T | undefined;
    
    if (isArrayLike(theArray)) {
        const len = theArray.length;
        let idx = index;
        
        // Convert negative index to positive
        if (idx < 0) {
            idx = len + idx;
        }
        
        // Check bounds and get value
        if (idx >= 0 && idx < len) {
            result = theArray[idx];
        }
    }
    
    return result;
}
