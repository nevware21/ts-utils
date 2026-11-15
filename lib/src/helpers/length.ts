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

    // A length which is already a valid integer (the normal case) is returned as-is
    return len >>> 0 === len ? len : (len > 0 ? (len < 0x1FFFFFFFFFFFFF ? len - len % 1 : 0x1FFFFFFFFFFFFF) : 0);
}

/**
 * @internal
 * @ignore
 * Returns the length of the array or array-like value as the length of a new array, like {@link _toLength} but (like
 * the native functions) it throws a RangeError for a length which is longer than an array can be (2^32 - 1), rather
 * than adding values until the runtime runs out of memory. It is not annotated as having no side effects as it can
 * throw.
 * @param value - The array or array-like value to return the length of
 * @returns The length
 */
export function _toArrayLength(value: ArrayLike<any>): number {
    let len = _toLength(value);
    if (len > 0xFFFFFFFF) {
        throwRangeError("Invalid array length");
    }

    return len;
}
