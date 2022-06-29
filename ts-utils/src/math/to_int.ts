/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { dumpObj } from "../helpers/diagnostics";
import { throwRangeError } from "../helpers/throw";
import { mathTrunc } from "./trunc";

/**
 * Convert the provided value to an integer
 * @param value - The value to be converted to an integer.
 * @param throwInfinity - [Optional] Throws RangeError if value is Infinity, defaults to false
 * @returns The value converted to an integer
 */
export function mathToInt(value: any, throwInfinity?: boolean): number {
    let result = +value;

    if (result == Infinity && throwInfinity) {
        throwRangeError("invalid value [" + dumpObj(value) + "]");
    }
    
    return result !== result || result === 0 ? 0 : mathTrunc(result);
}