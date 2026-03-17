/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { isArrayLike } from "../helpers/base";
import { getLength } from "../helpers/length";
import { ArrPredicateCallbackFn, ArrPredicateCallbackFn2 } from "./callbacks";
import { arrForEach } from "./forEach";
import { arrSlice } from "./slice";

/**
 * The arrDropWhile() method returns a new array with elements from the beginning removed
 * as long as the predicate function returns true. Once the predicate returns false,
 * all remaining elements (including that one) are included in the result.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @typeParam E - Identifies the narrowed type when using type guards
 * @param theArray - The array or array-like object to drop from
 * @param callbackFn - Function to test each element. Return true to drop, false to stop dropping
 * @param thisArg - Optional value to use as `this` when executing callbackFn
 * @returns A new array with leading elements removed while predicate was true
 * @example
 * ```ts
 * arrDropWhile([1, 2, 3, 4, 1], x => x < 3);      // [3, 4, 1]
 * arrDropWhile([2, 4, 6, 1, 8], x => x % 2 === 0); // [1, 8]
 * arrDropWhile([1, 2, 3], x => x > 5);            // [1, 2, 3]
 * arrDropWhile([1, 2, 3], x => x < 5);            // []
 *
 * // Array-like objects
 * arrDropWhile({ length: 4, 0: 1, 1: 2, 2: 3, 3: 4 }, x => x < 3);  // [3, 4]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrDropWhile<T, E extends T = T>(
    theArray: ArrayLike<T> | null | undefined,
    callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>,
    thisArg?: any
): T[] {
    let result: T[];
    
    if (isArrayLike(theArray)) {
        arrForEach(theArray, (item, index) => {
            if (!fnCall(callbackFn, thisArg, item, index, theArray as any)) {
                result = arrSlice(theArray, index);
                return -1; // Break out of forEach
            }
        });
    }
    
    return result || [];
}
