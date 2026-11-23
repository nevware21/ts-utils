/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { dumpObj } from "../helpers/diagnostics";
import { throwRangeError } from "../helpers/throw";
import { _toInt } from "../helpers/length";
import { DUMP_ERR_MAX_LENGTH } from "../internal/constants";

/**
 * Convert the provided value to an integer, like the ECMAScript ToIntegerOrInfinity(): the value is converted to a number
 * (once), NaN is 0, a fraction is truncated, and -0 (or a value between -1 and 0) is 0 (since 0.20.0, it was -0)
 * @group Math
 * @param value - The value to be converted to an integer.
 * @param throwInfinity - [Optional] Throws RangeError if value is Infinity, defaults to false
 * @returns The value converted to an integer
 */
/*#__NO_SIDE_EFFECTS__*/
export function mathToInt(value: any, throwInfinity?: boolean): number {
    let result = +value;

    if (throwInfinity && (result === Infinity || result == Infinity)) {
        throwRangeError("invalid value [" + dumpObj(value, 0, DUMP_ERR_MAX_LENGTH) + "]");
    }
    
    return _toInt(result);
}