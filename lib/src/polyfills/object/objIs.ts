/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * Polyfill implementation of Object.is() method for environments where it doesn't exist.
 * Determines whether two values are the same value, taking into account special cases like
 * NaN and signed zeros.
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param value1 - The first value to compare
 * @param value2 - The second value to compare
 * @returns True if the values are the same value, false otherwise
 */
export function polyObjIs(value1: any, value2: any): boolean {
    // Handle special cases
    // 1. NaN is the only value not equal to itself
    if (value1 !== value1) {
        return value2 !== value2;
    }

    // 2. Distinguish between +0 and -0
    if (value1 === 0 && value2 === 0) {
        return 1 / value1 === 1 / value2;
    }

    // Normal strict equality for all other cases
    return value1 === value2;
}