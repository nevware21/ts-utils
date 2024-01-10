/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isNullOrUndefined, isNumber } from "./base";

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

