/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike } from "../helpers/base";
import { getLength } from "../helpers/length";
import { ArrPredicateCallbackFn, ArrPredicateCallbackFn2 } from "./callbacks";
import { arrForEach } from "./forEach";

/**
 * The arrTakeWhile() method returns a new array containing elements from the beginning of the array
 * as long as the predicate function returns true. Once the predicate returns false, iteration stops.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @typeParam E - Identifies the narrowed type when using type guards
 * @param theArray - The array or array-like object to take from
 * @param callbackFn - Function to test each element. Return true to continue, false to stop
 * @param thisArg - Optional value to use as `this` when executing callbackFn
 * @returns A new array containing elements until the predicate returns false
 * @example
 * ```ts
 * arrTakeWhile([1, 2, 3, 4, 1], x => x < 3);      // [1, 2]
 * arrTakeWhile([2, 4, 6, 1, 8], x => x % 2 === 0); // [2, 4, 6]
 * arrTakeWhile([1, 2, 3], x => x > 5);            // []
 * arrTakeWhile([1, 2, 3], x => x < 5);            // [1, 2, 3]
 *
 * // Array-like objects
 * arrTakeWhile({ length: 4, 0: 1, 1: 2, 2: 3, 3: 4 }, x => x < 3);  // [1, 2]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrTakeWhile<T, E extends T = T>(
    theArray: ArrayLike<T> | null | undefined,
    callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>,
    thisArg?: any
): T[] | E[] {
    const result: T[] = [];
    
    if (isArrayLike(theArray)) {
        arrForEach(theArray, (value, idx) => {
            if (!callbackFn.call(thisArg, value, idx, theArray as any)) {
                return -1;
            }

            result.push(value);
        });
    }
    
    return result as (T[] | E[]);
}
