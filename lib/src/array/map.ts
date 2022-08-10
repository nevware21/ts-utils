/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { _unwrapFunction } from "../internal/unwrapFunction";

/**
 * Callback signature for {@link arrMap} that is called for every element of array. Each time callbackFn
 * executes, the returned value is added to newArray.
 * @group Array
 * @typeParam T - Identifies the type of the array elements
 * @typeParam R - Identifies the type of the elements returned by the callback function, defaults to T.
 * @param value - The current element being processed in the array.
 * @param index - The index of the current element being processed in the array.
 * @param array - The array that the `map` function was called on.
 */
export type ArrMapCallbackFn<T, R = T> = (value: T, index?: number, array?: T[]) => R;

/**
 * The arrMap() method creates a new array populated with the results of calling a provided function on every
 * element in the calling array.
 *
 * `arrMap` calls a provided callbackFn function once for each element in an array, in order, and constructs
 * a new array from the results. callbackFn is invoked only for indexes of the array which have assigned
 * values (including undefined).
 *
 * It is not called for missing elements of the array; that is:
 * - indexes that have never been set;
 * - indexes which have been deleted.
 * @group Array
 * @typeParam T - Identifies the type of the array elements
 * @typeParam R - Identifies the type of the elements returned by the callback function, defaults to T.
 * @param theArray
 * @param callbackFn - The function that is called for evetn element of `theArray`.
 * @param thisArg - The value to use as the `this` when executing the `callbackFn`.
 * @example
 * ```ts
 * const numbers = [1, 4, 9];
 * const roots = arrMap(numbers, (num) => Math.sqrt(num));
 *
 * // roots is now     [1, 2, 3]
 * // numbers is still [1, 4, 9]
 *
 * const kvArray = [{ key: 1, value: 10 },
 *                  { key: 2, value: 20 },
 *                  { key: 3, value: 30 }];
 *
 * const reformattedArray = arrMap(kvArray, ({ key, value}) => ({ [key]: value }));
 *
 * // reformattedArray is now [{1: 10}, {2: 20}, {3: 30}],
 *
 * // kvArray is still:
 * // [{key: 1, value: 10},
 * //  {key: 2, value: 20},
 * //  {key: 3, value: 30}]
 * ```
 */
export const arrMap: <T, R = T>(theArray: T[], callbackFn: ArrMapCallbackFn<T, R>, thisArg?: any) => R[] = _unwrapFunction("map");
