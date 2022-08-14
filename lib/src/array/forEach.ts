/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { LENGTH } from "../internal/constants";

/**
 * Calls the provided `callbackFn` function once for each element in an array in ascending index order. It is not invoked for index properties
 * that have been deleted or are uninitialized. And unlike the ES6 forEach() you CAN stop or break the iteration by returning -1 from the
 * `callbackFn` function.
 *
 * The range (number of elements) processed by arrForEach() is set before the first call to the `callbackFn`. Any elements added beyond the range
 * or elements which as assigned to indexes already processed will not be visited by the `callbackFn`.
 * @group Array
 * @typeParam T - Identifies the element type of the array
 * @param callbackfn A `synchronous` function that accepts up to three arguments. arrForEach calls the callbackfn function one time for each element in the array.
 * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, null or undefined
 * the array will be used as the this value.
 * @remarks
 * arrForEach expects a `synchronous` function.
 * arrForEach does not wait for promises. Make sure you are aware of the implications while using promises (or async functions) as forEach callback.
 * @example
 * ```ts
 * const items = ['item1', 'item2', 'item3'];
 * const copyItems = [];
 *
 * // before using for loop
 * for (let i = 0; i < items.length; i++) {
 *   copyItems.push(items[i]);
 * }
 *
 * // before using forEach()
 * items.forEach((item) => {
 *   copyItems.push(item);
 * });
 *
 * // after
 * arrForEach(items, (item) => {
 *   copyItems.push(item);
 *   // May return -1 to abort the iteration
 * });
 * ```
 */
export function arrForEach<T>(arr: T[], callbackfn: (value: T, index?: number, array?: T[]) => void | number, thisArg?: any): void {
    if (arr) {
        const len = arr[LENGTH];
        for (let idx = 0; idx < len; idx++) {
            if (idx in arr) {
                if (callbackfn.call(thisArg || arr, arr[idx], idx, arr) === -1) {
                    break;
                }
            }
        }
    }
}
