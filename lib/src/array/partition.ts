/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike } from "../helpers/base";
import { ArrPredicateCallbackFn, ArrPredicateCallbackFn2 } from "./callbacks";
import { arrForEach } from "./forEach";

/**
 * The arrPartition() method splits an array into two arrays based on a predicate function.
 * The first array contains elements for which the predicate returns true, the second contains the rest.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @typeParam E - Identifies the narrowed type when using type guards
 * @param theArray - The array or array-like object to partition
 * @param callbackFn - Function to test each element. Return true to include in first array, false for second
 * @param thisArg - Optional value to use as `this` when executing callbackFn
 * @returns A tuple of two arrays: [matching elements, non-matching elements]
 * @example
 * ```ts
 * arrPartition([1, 2, 3, 4, 5], x => x % 2 === 0);  // [[2, 4], [1, 3, 5]]
 * arrPartition(["a", "bb", "ccc"], x => x.length > 1);  // [["bb", "ccc"], ["a"]]
 *
 * // With type guard
 * const mixed: (string | number)[] = [1, "a", 2, "b"];
 * const [strings, numbers] = arrPartition(mixed, (x): x is string => typeof x === "string");
 * // strings: string[], numbers: (string | number)[]
 *
 * // Array-like objects
 * arrPartition({ length: 4, 0: 1, 1: 2, 2: 3, 3: 4 }, x => x > 2);  // [[3, 4], [1, 2]]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrPartition<T, E extends T>(
    theArray: ArrayLike<T> | null | undefined,
    callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>,
    thisArg?: any
): [T[] | E[], T[]] {
    const truthy: T[] = [];
    const falsy: T[] = [];
    
    if (isArrayLike(theArray)) {
        arrForEach(theArray, (value, index, array) => {
            if (callbackFn.call(thisArg, value, index, array)) {
                truthy.push(value);
            } else {
                falsy.push(value);
            }
        });
    }
    
    return [truthy as any, falsy];
}
