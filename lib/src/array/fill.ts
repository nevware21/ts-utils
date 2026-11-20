/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrProto, ObjClass, UNDEF_VALUE } from "../internal/constants";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { _toLength, _toRelIndex } from "../helpers/length";
import { WritableArrayLike } from "../helpers/arrayLike";

/**
 * The arrFill() method changes all elements in an array to a static value, from a start index
 * (default 0) to an end index (default array.length). It returns the modified array.
 * This method mutates the array.
 * @function
 * @since 0.14.0
 * @group Array
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array to fill
 * @param value - Value to fill the array with
 * @param start - Start index (inclusive), defaults to 0. Negative index counts from the end
 * @param end - End index (exclusive), defaults to array.length. Negative index counts from the end
 * @returns The modified array
 * @example
 * ```ts
 * arrFill([1, 2, 3], 0);              // [0, 0, 0]
 * arrFill([1, 2, 3], 4, 1);           // [1, 4, 4]
 * arrFill([1, 2, 3], 5, 1, 2);        // [1, 5, 3]
 * arrFill([1, 2, 3], 6, -2);          // [1, 6, 6]
 * arrFill([1, 2, 3], 7, -3, -1);      // [7, 7, 3]
 * arrFill([], 1);                     // []
 * ```
 */
export const arrFill = (/*#__PURE__*/_unwrapFunctionWithPoly("fill", ArrProto, polyArrFill) as <T>(theArray: WritableArrayLike<T>, value: T, start?: number, end?: number) => WritableArrayLike<T>);

/**
 * Polyfill implementation of Array.fill() for environments that don't support it.
 * @function
 * @since 0.14.0
 * @group Array
 * @group Polyfill
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array to fill
 * @param value - Value to fill the array with
 * @param start - Start index (inclusive), defaults to 0
 * @param end - End index (exclusive), defaults to array.length
 * @returns The modified array
 */
export function polyArrFill<T>(theArray: WritableArrayLike<T>, value: T, start?: number, end?: number): WritableArrayLike<T> {
    // Like the native function the length of the value is converted (eg. a string length), reading it throws a
    // TypeError for null and undefined (rather than including a message), and the value is converted to an object
    const len = _toLength(theArray);
    const theObj = ObjClass(theArray);
    const startIdx = _toRelIndex(start, len);
    const endIdx = end === UNDEF_VALUE ? len : _toRelIndex(end, len);

    // Fill the array
    for (let i = startIdx; i < endIdx; i++) {
        theObj[i] = value;
    }

    return theObj;
}
