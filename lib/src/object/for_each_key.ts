/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction, isObject } from "../helpers/base";
import { CALL } from "../internal/constants";
import { objHasOwn } from "./has_own";

/**
 * Calls the provided `callbackFn` function once for each key in an object. This is equivelent to `arrForEach(Object.keys(theObject), callbackFn)` or
 * if not using the array helper `Object.keys(theObject).forEach(callbackFn)` except that this helper avoid creating a temporary of the object
 * keys before iterating over them and like the `arrForEach` helper you CAN stop or break the iteration by returning -1 from the `callbackFn` function.
 * @group Object
 * @typeParam T - The object type
 * @param callbackfn - A function that accepts up to two arguments, the key name and the current value of the property represented by the key.
 * @param thisArg - [Optional] An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, null or undefined
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
export function objForEachKey<T>(theObject: T, callbackfn: (key: string, value: T[keyof T]) => void | number, thisArg?: any): void {
    if (theObject && (isObject(theObject) || isFunction(theObject))) {
        for (const prop in theObject) {
            if (objHasOwn(theObject, prop)) {
                if (callbackfn[CALL](thisArg || theObject, prop, theObject[prop]) === -1) {
                    break;
                }
            }
        }
    }
}
