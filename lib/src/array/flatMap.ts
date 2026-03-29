/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrProto } from "../internal/constants";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { isArray, isFunction } from "../helpers/base";
import { throwTypeError } from "../helpers/throw";
import { ArrFlatMapCallbackFn } from "./callbacks";
import { arrForEach } from "./forEach";
import { fnCall } from "../funcs/funcs";
 

/**
 * The arrFlatMap() method returns a new array formed by applying a mapping function to each element
 * and then flattening the mapped result by one level.
 *
 * This is equivalent to calling `arrMap()` followed by `arrFlatten()` with a depth of 1, but it avoids
 * allocating the intermediate mapped array.
 *
 * Use this helper when each input item may produce zero, one, or multiple output items as part of the
 * mapping step. The mapped value is flattened by exactly one level: if the callback returns an array,
 * its elements are appended to the output; non-array values are appended directly.
 *
 * To flatten already-nested data without mapping, use `arrFlatten()` instead.
 *
 * `callbackFn` is invoked only for indexes of the array which have assigned values. Empty slots in
 * sparse arrays are skipped.
 *
 * @function
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the type of array elements
 * @typeParam R - Identifies the type of the flattened result values, defaults to T.
 * @param theArray - The array or array-like object to map and flatten.
 * @param callbackFn - A function that is called for each existing element and may return either a
 * single value or an array of values to flatten into the result.
 * @param thisArg - The value to use as the `this` when executing the `callbackFn`.
 * @returns A new array containing the mapped and flattened values.
 * @example
 * ```ts
 * arrFlatMap([1, 2, 3], (value) => [value, value * 10]);
 * // [1, 10, 2, 20, 3, 30]
 *
 * arrFlatMap(["one", "two"], (value) => value.split(""));
 * // ["o", "n", "e", "t", "w", "o"]
 *
 * arrFlatMap({ length: 2, 0: "a", 1: "b" }, (value, index) => [index, value]);
 * // [0, "a", 1, "b"]
 *
 * arrFlatMap([1, 2, 3, 4], (value) => value % 2 ? [value] : []);
 * // [1, 3]
 *
 * arrFlatMap([1, 2], (value) => [[value, value + 10]] as any);
 * // [[1, 11], [2, 12]]
 * ```
 */
export const arrFlatMap = (/*#__PURE__*/_unwrapFunctionWithPoly("flatMap", ArrProto as any, polyArrFlatMap) as <T, R = T>(theArray: ArrayLike<T>, callbackFn: ArrFlatMapCallbackFn<T, R>, thisArg?: any) => R[]);

/**
 * Polyfill implementation of Array.flatMap() for environments that don't support it.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @group Polyfill
 * @typeParam T - Identifies the base type of array elements
 * @typeParam R - Identifies the flattened output element type
 * @param theArray - The array or array-like object to map and flatten.
 * @param callbackFn - A function that is called for each existing element and may return either a
 * single value or an array of values to flatten into the result.
 * @param thisArg - A value to use as this when executing callbackFn. Defaults to undefined if not provided.
 * @returns A new array containing the mapped and flattened values.
 * @throws TypeError if theArray is null or undefined, or if callbackFn is not a function.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyArrFlatMap<T, R = T>(theArray: ArrayLike<T>, callbackFn: ArrFlatMapCallbackFn<T, R>, thisArg?: any): R[] {
    _throwIfNullOrUndefined(theArray);

    if (!isFunction(callbackFn)) {
        throwTypeError("callbackFn must be a function");
    }

    let result: R[] = [];
    let callbackThis = arguments.length > 2 ? thisArg : undefined;

    arrForEach(theArray, (theValue, index) => {
        let value = fnCall(callbackFn, callbackThis, theValue, index, theArray as any);
        if (isArray(value)) {
            arrForEach(value as any, (mappedValue) => {
                result.push(mappedValue);
            });
        } else {
            result.push(value as R);
        }
    });


    return result;
}