/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isNullOrUndefined } from "../helpers/base";
import { EMPTY, LENGTH } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { mathToInt } from "../math/to_int";
import { asString } from "./as_string";
import { strLeft } from "./substring";

/**
 * Truncate the provided value to the requested maximum length and optionally append a suffix.
 *
 * When the value is already within `maxLength`, the original string is returned unchanged. When a
 * suffix is supplied, the result length remains capped at `maxLength`, so the original value is
 * shortened further as needed to make room for the suffix.
 *
 * Both `value` and `suffix` are coerced to strings via {@link asString} before processing.
 * Passing `null` or `undefined` for `value` will cause this function to throw, while a
 * `null`/`undefined` `suffix` is treated as an empty string (no suffix is appended).
 *
 * @since 0.14.0
 * @group String
 * @group Conversion
 * @param value - The value to truncate. This is coerced to a string and must not be `null` or `undefined`.
 * @param maxLength - The maximum length of the returned value.
 * @param suffix - An optional suffix to append when truncation occurs. When provided, it is coerced to a
 * string; if `null` or `undefined`, it is treated as an empty string.
 * @returns A truncated string that does not exceed `maxLength`.
 * @throws TypeError If `value` is `null` or `undefined`.
 * @example
 * ```ts
 * strTruncate("hello world", 5); // "hello"
 * strTruncate("hello world", 8, "..."); // "hello..."
 * strTruncate("short", 10, "..."); // "short"
 * strTruncate("important", 3, "..."); // "..."
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function strTruncate(value: string, maxLength: number, suffix?: string): string {
    _throwIfNullOrUndefined(value);

    let result: string;
    let length = mathToInt(maxLength);

    if (length > 0) {
        result = asString(value);

        if (result[LENGTH] > length) {
            let theSuffix = (!suffix && isNullOrUndefined(suffix)) ? EMPTY : asString(suffix);

            if (theSuffix[LENGTH] >= length) {
                result = strLeft(theSuffix, length);
            } else {
                result = strLeft(result, length - theSuffix[LENGTH]) + theSuffix;
            }
        }
    }

    return result || EMPTY;
}