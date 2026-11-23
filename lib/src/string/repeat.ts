/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { _toInt } from "../helpers/length";
import { throwRangeError } from "../helpers/throw";
import { EMPTY, LENGTH, StrProto } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { _toString } from "./as_string";

/**
 * The `strRepeat()` method constructs and returns a new string which contains the
 * specified number of copies of the string on which it was called, concatenated
 * together.
 * @function
 * @group String
 * @param value - The value to be repeated
 * @param count - An integer between 0 and +Infinity, indicating the number of times to repeat the string.
 * @returns A new string containing the specified number of copies of the given string.
 * @throws RangeError: repeat count must be non-negative.
 * @throws RangeError: repeat count must be less than infinity and not overflow maximum string size.
 */
export const strRepeat: (value: string, count: number) => string = (/*#__PURE__*/_unwrapFunctionWithPoly("repeat", StrProto, polyStrRepeat));

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
/*#__NO_SIDE_EFFECTS__*/
export function polyStrRepeat(value: string, count: number): string {
    _throwIfNullOrUndefined(value);

    // Like the native function the value is converted to a string (a Symbol throws a TypeError) before the count is
    // converted like ToIntegerOrInfinity (a fraction is truncated, NaN is 0 and a Symbol or BigInt throws a TypeError),
    // and a negative or infinite count throws a RangeError (even for an empty string)
    let pad = _toString(value);
    let num = _toInt(count);
    let result = EMPTY;
    if (num < 0 || num === Infinity) {
        throwRangeError("invalid count must be >= 0 && < Infinity");
    }

    if (pad && num) {
        // Like the native function a result which is longer than a string can be throws a RangeError (for every runtime
        // that is less than 2^31), so the count is then less than 2^31 and is halved as a 32-bit value
        if (pad[LENGTH] * num > 0x7FFFFFFF) {
            throwRangeError("Invalid string length");
        }

        for (;num > 0; (num >>>= 1) && (pad += pad)) {
            if (num & 1) {
                result += pad;
            }
        }
    }

    return result;
}
