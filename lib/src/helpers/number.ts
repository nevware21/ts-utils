/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isNullOrUndefined, isNumber } from "./base";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";
import { NumberCls } from "../internal/constants";
import { mathFloor } from "../math/floor";

/**
 * Helper to obtain the integer value using base 10 conversion from a string,
 * also handles `null`, `undefined` and `Nan` cases which will all return the
 * default value.
 * @group Conversion
 * @group Value
 * @param value - The string or numeric value to get the integer value from
 * @param defValue - The default value if unsuccessful
 * @returns The default or parsed value.
 */
/*#__NO_SIDE_EFFECTS__*/
export function getIntValue(value?: string | number, defValue?: number): number {
    if (!isNullOrUndefined(value)) {
        if (isNumber(value)) {
            return value;
        }

        let theValue = parseInt(value, 10);
        return isNaN(theValue) ? defValue : theValue;
    }

    return defValue;
}


/**
 * Checks if a value is an integer (a whole number).
 * @function
 * @group Type Identity
 * @group Number
 * @param value - The value to check
 * @returns True if the value is an integer, false otherwise
 * @example
 * ```ts
 * isInteger(42);                  // true
 * isInteger(0);                   // true
 * isInteger(-10);                 // true
 *
 * isInteger(42.5);                // false
 * isInteger("42");                // false
 * isInteger(null);                // false
 * isInteger(undefined);           // false
 * isInteger(NaN);                 // false
 * isInteger(Infinity);            // false
 * ```
 */
export const isInteger: (value: unknown) => value is number = (/* #__PURE__*/_pureAssign((/* #__PURE__*/_pureRef<(value: unknown) => value is number>(NumberCls as any, "isInteger")), _polyNumberIsInteger));

/**
 * A polyfill implementation of Number.isInteger that checks if a value is an integer.
 * @internal
 * @group Polyfill
 * @group Number
 * @param value - The value to check
 * @returns True if the value is an integer, false otherwise
 */
export function _polyNumberIsInteger(value: unknown): value is number {
    return isNumber(value) && !isNaN(value) &&
           isFinite(value) &&
           mathFloor(value) === value;
}

/**
 * Checks if a value is a finite number.
 * This is a more type-safe wrapper around Number.isFinite that ensures the value is also a number.
 * @group Type Identity
 * @group Number
 * @param value - The value to check
 * @returns True if the value is a finite number, false otherwise
 * @example
 * ```ts
 * isFiniteNumber(42);               // true
 * isFiniteNumber(-1);               // true
 * isFiniteNumber(0);                // true
 *
 * isFiniteNumber(Infinity);         // false
 * isFiniteNumber(-Infinity);        // false
 * isFiniteNumber(NaN);              // false
 * isFiniteNumber("42");             // false
 * isFiniteNumber(null);             // false
 * isFiniteNumber(undefined);        // false
 * ```
 */
export function isFiniteNumber(value: any): value is number {
    return isNumber(value) && !isNaN(value) && isFinite(value);
}
