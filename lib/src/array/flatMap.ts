/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrCls, ArrProto, CONSTRUCTOR, NULL_VALUE, UNDEF_VALUE } from "../internal/constants";
import { _getNativeSymbol } from "../internal/native_symbol";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { _throwIfNotCallbackFn, _toObject } from "../internal/throwIf";
import { isArray, isPrimitive } from "../helpers/base";
import { isNativeFn } from "../funcs/isNative";
import { ArrFlatMapCallbackFn } from "./callbacks";
import { fnCall } from "../funcs/funcs";
import { _toLength } from "../helpers/length";
import { _pushOwnValue } from "../object/define";
 

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
 * @throws TypeError if `theArray` is `null` or `undefined`, or `callbackFn` is not a function (even when the array is empty)
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
    // Like the native function the array is converted to an object (so a string's callbackFn is passed its String
    // object) and its length is read once, before the callbackFn is checked
    let theObj = _toObject(theArray);
    let len = _toLength(theObj);
    _throwIfNotCallbackFn(callbackFn);

    let result: R[];
    let ctor: any;
    let isSpecies: boolean;
    let targetIdx = 0;

    // Like the native function (ArraySpeciesCreate) the result of an array is created by its constructor's
    // [Symbol.species] (eg. a subclass of Array creates an instance of the subclass), which is only read on a runtime
    // with a native Symbol.species, as on any other runtime (eg. IE) the native array functions create an Array. Another
    // realm's Array (eg. an iframe's, identified by its native source) creates an Array of this realm, a null species is
    // ignored, and a constructor or species which isn't a constructor throws a TypeError (the runtime's own)
    let speciesSym = _getNativeSymbol("species");
    if (speciesSym && isArray(theObj)) {
        ctor = (theObj as any)[CONSTRUCTOR];
        if (ctor !== ArrCls && isNativeFn(ctor, "Array")) {
            ctor = UNDEF_VALUE;
        }

        if (!isPrimitive(ctor)) {
            ctor = ctor[speciesSym];
            if (ctor === NULL_VALUE) {
                ctor = UNDEF_VALUE;
            }
        }

        // Only undefined (not eg. the string "undefined", which throws a TypeError) creates an Array
        isSpecies = ctor !== UNDEF_VALUE && ctor !== ArrCls;
    }

    result = isSpecies ? new ctor(0) : [];

    // Like the native function an empty slot is skipped, and each value is added as an own property (so a setter or
    // read-only property of the same index on Array.prototype doesn't stop it being added), a species' result is
    // defined (like the native function a TypeError is thrown when it can't be) at the next index
    function _addValue(value: any) {
        _pushOwnValue(result, value, targetIdx++, isSpecies);
    }

    for (let idx = 0; idx < len; idx++) {
        if (idx in theObj) {
            let value = fnCall(callbackFn, thisArg, (theObj as any)[idx], idx, theObj as any);
            if (isArray(value)) {
                // Like the native function the array's length is read once and an empty slot is skipped (looped here,
                // rather than with arrForEach, so a replaced Function.prototype.call isn't used to add the values)
                let valueLen = _toLength(value);
                for (let valueIdx = 0; valueIdx < valueLen; valueIdx++) {
                    valueIdx in value && _addValue(value[valueIdx]);
                }
            } else {
                _addValue(value);
            }
        }
    }

    return result;
}