/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { dumpObj } from "../helpers/diagnostics";
import { throwRangeError } from "../helpers/throw";
import { mathTrunc } from "./trunc";

/**
 * Convert the provided value to an integer
 * @group Math
 * @param value - The value to be converted to an integer.
 * @param throwInfinity - [Optional] Throws RangeError if value is Infinity, defaults to false
 * @returns The value converted to an integer
 */
/*#__NO_SIDE_EFFECTS__*/
export function mathToInt(value: any, throwInfinity?: boolean): number {
    let result = +value;

    if (throwInfinity && (result === Infinity || result == Infinity)) {
        throwRangeError("invalid value [" + dumpObj(value) + "]");
    }
    
    return result !== result || result === 0 ? 0 : mathTrunc(result);
}