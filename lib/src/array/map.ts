/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrProto } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";
import { ArrMapCallbackFn } from "./callbacks";

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
 *
 * @since 0.3.3
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the type of the array elements
 * @typeParam R - Identifies the type of the elements returned by the callback function, defaults to T.
 * @param theArray - The array or array like object of elements to be searched.
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
 *
 * // Also supports Array Like objects with same output
 * const kvArray = {
 *   length: 3,
 *   0: { key: 1, value: 10 },
 *   1: { key: 2, value: 20 },
 *   2: { key: 3, value: 30 }
 * };
 * ```
 */
export const arrMap: <T, R = T>(theArray: ArrayLike<T>, callbackFn: ArrMapCallbackFn<T, R>, thisArg?: any) => R[] = (/*#__PURE__*/_unwrapFunction("map", ArrProto));
