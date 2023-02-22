/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isNullOrUndefined, isString } from "../helpers/base";
import { dumpObj } from "../helpers/diagnostics";
import { throwRangeError, throwTypeError } from "../helpers/throw";
import { EMPTY, UNDEF_VALUE } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";
import { mathToInt } from "../math/to_int";
import { asString } from "./as_string";

const REPEAT = "repeat";

/**
 * The `strRepeat()` method constructs and returns a new string which contains the
 * specified number of copies of the string on which it was called, concatenated
 * together.
 * @group String
 * @param value - The value to be repeated
 * @param count - An integer between 0 and +Infinity, indicating the number of times to repeat the string.
 * @returns A new string containing the specified number of copies of the given string.
 * @throws RangeError: repeat count must be non-negative.
 * @throws RangeError: repeat count must be less than infinity and not overflow maximum string size.
 */
export const strRepeat: (value: string, count: number) => string = _unwrapFunction(REPEAT, UNDEF_VALUE, polyStrRepeat);

/**
 * The `strRepeat()` method constructs and returns a new string which contains the
 * specified number of copies of the string on which it was called, concatenated
 * together.
 * @group Polyfill
 * @group String
 * @param value - The value to be repeated
 * @param count - An integer between 0 and +Infinity, indicating the number of times to repeat the string.
 * @returns A new string containing the specified number of copies of the given string.
 * @throws RangeError: repeat count must be non-negative.
 * @throws RangeError: repeat count must be less than infinity and not overflow maximum string size.
 */
export function polyStrRepeat(value: string, count: number): string {
    if (isNullOrUndefined(value)) {
        throwTypeError("can't convert [" + dumpObj(value) + "]")
    }

    count = mathToInt(count, true);
    if (count < 0) {
        throwRangeError("invalid count must be >= 0 && < Infinity");
    }

    let pad = isString(value) ? value : asString(value);
    let result = EMPTY;

    for (;count > 0; (count >>>= 1) && (pad += pad)) {
        if (count & 1) {
            result += pad;
        }
    }

    return result;
}
