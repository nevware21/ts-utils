/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { ArrProto } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";

/**
 * The `reducer` function called for {@link arrReduce}.
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the type of array elements
 * @typeParam R - Identifies the type of the return array elements (defaults to T)
 * @param previousValue - The value resulting from the previous call to callbackFn. On first call, initialValue if
 * specified, otherwise the value of array[0].
 * @param currentValue - The value of the current element. On first call, the value of array[0] if an initialValue
 * was specified, otherwise the value of array[1].
 * @param currentIndex - The index position of currentValue in the array. On first call, 0 if initialValue was
 * specified, otherwise 1.
 * @param array -The array being traversed.
 */
export type ArrReduceCallbackFn<T, R = T> = (previousValue: T | R, currentValue: T, currentIndex: number, array: T[]) => R;

/**
 * The arrReduce() method executes a user-supplied "reducer" callback function on each element of the array,
 * in order, passing in the return value from the calculation on the preceding element. The final result of
 * running the reducer across all elements of the array is a single value.
 *
 * The first time that the callback is run there is no "return value of the previous calculation". If supplied,
 * an initial value may be used in its place. Otherwise the array element at index 0 is used as the initial
 * value and iteration starts from the next element (index 1 instead of index 0).
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array or array like object of elements to be searched.
 * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
 * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
 * @returns The value that results from running the "reducer" callback function to completion over the entire array.
 * @example
 * ```ts
 * const getMax = (a: number, b: number) => Math.max(a, b);
 *
 * // callback is invoked for each element in the array starting at index 0
 * arrReduce([1, 100], getMax, 50); // 100
 * arrReduce([    50], getMax, 10); // 50
 *
 * // callback is invoked once for element at index 1
 * arrReduce([1, 100], getMax);     // 100
 *
 * // callback is not invoked
 * arrReduce([    50], getMax);     // 50
 * arrReduce([      ], getMax, 1);  // 1
 *
 * arrReduce([      ], getMax);     // throws TypeError
 *
 * // Also supports Array like objects
 * arrReduce({ length: 2, 0: 1, 1: 100 }, getMax, 50); // 100
 * arrReduce({ length: 1, 0: 50 }, getMax, 10); // 50
 *
 * // callback is invoked once for element at index 1
 * arrReduce({ length: 2, 0: 1, 1: 100 }, getMax);     // 100
 *
 * // callback is not invoked
 * arrReduce({ length: 1, 0: 50 }, getMax);     // 50
 * arrReduce({ length: 0 }, getMax, 1);  // 1
  * ```
 */
export const arrReduce: <T, R = T>(theArray: ArrayLike<T>, callbackfn: ArrReduceCallbackFn<T, R>, initialValue?: T | R) => R = (/*#__PURE__*/_unwrapFunction("reduce", ArrProto));
