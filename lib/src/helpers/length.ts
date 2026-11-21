/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { LENGTH } from "../internal/constants";
import { _unwrapProp } from "../internal/unwrapFunction";
import { throwRangeError } from "./throw";

/**
 * Interface to identify that an object contains the length property used as a type
 * constraint for {@link getLength}
 *
 * @since 0.4.2
 * @group String
 * @group Array
 * @group Object
 */
export interface IGetLength {

    /**
     * Identifies the property that returns the length of the instance
     */
    length: unknown;
}

/**
 * Helper to return the length value of an object, this will return the value
 * of the "length" property. Generally used to return the length of a string or array.
 *
 * @function
 * @since 0.4.2
 * @group Array
 * @group String
 * @group String
 * @group Array
 * @group Object
 * @param value - The value to return the length property from, must contain a `length` property
 * @example
 * ```ts
 * getLength("");               // returns 0
 * getLength("Hello World");    // returns 11
 * getLength([]);               // returns 0;
 * getLength([0, 1, 2, 3]);     // returns 4;
 * getLength({ length: 42});    // returns 42
 * getLength({ length: () => 53; }); // returns the function that if called would return 53
 * ```
 */
export const getLength: <T extends IGetLength>(value: T) => T["length"] = (/*#__PURE__*/_unwrapProp<IGetLength>(LENGTH));

/**
 * @internal
 * @ignore
 * Returns the length of the array or array-like value, converting its `length` property like the native array functions
 * do (the ECMAScript LengthOfArrayLike() operation) into an integer from 0 to 2^53 - 1. So NaN and negative values are 0
 * and fractions are truncated.
 * @param value - The array or array-like value to return the length of
 * @returns The length
 */
/*#__NO_SIDE_EFFECTS__*/
export function _toLength(value: ArrayLike<any>): number {
    let len = +value[LENGTH];

    // A length which is already a valid integer (the normal case) is returned as-is, except -0 which is 0 (like ToLength)
    return len >>> 0 === len ? len || 0 : (len > 0 ? (len < 0x1FFFFFFFFFFFFF ? len - len % 1 : 0x1FFFFFFFFFFFFF) : 0);
}

/**
 * @internal
 * @ignore
 * Checks the length of a new array, like the native functions (ArrayCreate) it throws a RangeError for a length which
 * is longer than an array can be (2^32 - 1), rather than adding values until the runtime runs out of memory. It is not
 * annotated as having no side effects, as the check is what it does.
 * @param len - The (converted) length of the new array
 * @returns The length
 */
export function _checkArrayLength(len: number): number {
    if (len > 0xFFFFFFFF) {
        throwRangeError("Invalid array length");
    }

    return len;
}

/**
 * @internal
 * @ignore
 * Converts the value to an integer like the native ToIntegerOrInfinity() (eg. for an index, position or count), so NaN
 * and -0 are 0, a fraction is truncated and Infinity is kept (as Infinity % 1 is NaN). An integer (the usual value) is
 * returned as-is, and the truncation doesn't use mathTrunc(), so its polyfill isn't included with the functions which use
 * this.
 * @param value - The value to convert
 * @returns The integer
 */
/*#__NO_SIDE_EFFECTS__*/
export function _toInt(value: any): number {
    let num = +value;

    return num % 1 ? num - num % 1 : (num || 0);
}

/**
 * @internal
 * @ignore
 * Converts a relative start / end index (eg. of Array.prototype.fill() or includes()) into the position within the
 * array that it identifies, which is always in range. Like the native functions the value is converted to an integer
 * (NaN is 0), a negative index counts back from the end, and the result is clamped to 0 to len.
 * @param value - The value to convert (NaN becomes 0)
 * @param len - The length of the array
 * @returns The position within the array
 */
/*#__NO_SIDE_EFFECTS__*/
export function _toRelIndex(value: number, len: number): number {
    let idx = _toInt(value);

    if (idx <= -len) {
        return 0;
    }

    if (idx >= len) {
        return len;
    }

    return idx < 0 ? len + idx : idx;
}
