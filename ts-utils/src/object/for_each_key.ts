/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isObject } from "../helpers/base";
import { objHasOwnProperty } from "./has_own_prop";

/**
 * Calls the provided `callbackFn` function once for each key in an object. This is equivelent to `arrForEach(Object.keys(theObject), callbackFn)` or
 * if not using the array helper `Object.keys(theObject).forEach(callbackFn)` except that this helper avoid creating a temporary of the object
 * keys before iterating over them and like the `arrForEach` helper you CAN stop or break the iteration by returning -1 from the `callbackFn` function.
 * @param callbackfn  A function that accepts up to two arguments, the key name and the current value of the property represented by the key.
 * @param thisArg  [Optional] An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, null or undefined
 * the object will be used as the this value.
 * @example
 * ```ts
 * function performAction<T>(target: T, source: any) {
 *    if (!isNullOrUndefined(source)) {
 *        objForEachKey(source, (key, value) => {
 *            // Set the target with a reference to the same value with the same name
 *            target[key] = value;
 *        });
 *    }
 *
 *    return target;
 * }
 * ```
 */
export function objForEachKey(theObject: any, callbackfn: (key: string, value: any) => void | number, thisArg?: any): void {
    if (theObject && isObject(theObject)) {
        for (const prop in theObject) {
            if (objHasOwnProperty(theObject, prop)) {
                if (callbackfn.call(thisArg || theObject, prop, theObject[prop]) === -1) {
                    break;
                }
            }
        }
    }
}
