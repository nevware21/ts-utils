/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isString } from "../helpers/base";
import { throwRangeError } from "../helpers/throw";
import { EMPTY, StrProto } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { mathToInt } from "../math/to_int";
import { asString } from "./as_string";

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
