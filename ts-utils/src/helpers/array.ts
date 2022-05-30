/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { PROTOTYPE } from "../internal/constants";
import { isArray, isUndefined } from "./base";

/**
 * Calls the provided `callbackFn` function once for each element in an array in ascending index order. It is not invoked for index properties
 * that have been deleted or are uninitialized. And unlike the ES6 forEach() you CAN stop or break the iteration by returning -1 from the
 * `callbackFn` function.
 *
 * The range (number of elements) processed by arrForEach() is set before the first call to the `callbackFn`. Any elements added beyond the range
 * or elements which as assigned to indexes already processed will not be visited by the `callbackFn`.
 * @param callbackfn  A function that accepts up to three arguments. arrForEach calls the callbackfn function one time for each element in the array.
 * @param thisArg  [Optional] An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, null or undefined
 * the array will be used as the this value.
 */
export function arrForEach<T>(arr: T[], callbackfn: (value: T, index?: number, array?: T[]) => void | number, thisArg?: any): void {
    if (arr) {
        const len = arr.length;
        for (let idx = 0; idx < len; idx++) {
            if (idx in arr) {
                if (callbackfn.call(thisArg || arr, arr[idx], idx, arr) === -1) {
                    break;
                }
            }
        }
    }
}

/**
 * Appends the `elms` to the `target` where the elms may be an array or single object
 * @param target - The target array
 * @param elms - The item or items to add to the target
 */
export function arrAppend(target: any[], elms: any[] | any) {
    if (!isUndefined(elms)) {
        if (isArray(elms)) {
            Array[PROTOTYPE].push.apply(target, elms);
        } else {
            target.push(elms);
        }
    }
}