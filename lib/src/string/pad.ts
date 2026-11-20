/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isStrictUndefined } from "../helpers/base";
import { EMPTY, LENGTH, StrProto, SUBSTRING } from "../internal/constants";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { mathToInt } from "../math/to_int";
import { asString } from "./as_string";

/*#__NO_SIDE_EFFECTS__*/
function _padValue(value: string, targetLength: number, padString?: string) {
    let result = EMPTY;
    targetLength = mathToInt(targetLength, true);
    targetLength >>= 0;

    let len = value[LENGTH];
    if (len < targetLength) {
        // Like the native functions only an undefined padString uses the default, any other value (including null) is
        // converted into a string
        result = isStrictUndefined(padString) ? " " : asString(padString);
        targetLength = targetLength - len;

        // Doubled until it is long enough (only adding what is missing, so it is never longer than the result, which
        // may be close to the maximum length of a string) and then truncated to remove any extra from a long padString.
        // An empty padString can't pad the value so it is returned as-is (rather than doubling "" forever). This doesn't
        // use strRepeat() so the polyfills don't include its polyfill. The result is always a primitive string, so its
        // own substring() is called directly (rather than via strSubstring(), which is slower)
        while (result && result[LENGTH] < targetLength) {
            result += result[SUBSTRING](0, targetLength - result[LENGTH]);
        }

        result = result[SUBSTRING](0, targetLength);
    }

    return result;
}

/**
 * The `strPadStart()` method pads the current string with another string (multiple times, if needed)
 * until the resulting string reaches the given length. The padding is applied from the start of the
 * current string. This will use any native implementation if available, but will fall back to the
 * provided polyfill for runtimes that don't support [padStart](https://caniuse.com/?search=padStart)
 * @function
 * @group String
 * @param value - The value to be padded
 * @param targetLength - The length of the resulting string once the current str has been padded.
 * If the value is less than str.length, then str is returned as-is.
 * @param padString - The string to pad the current str with. If padString is too long to stay within
 * the targetLength, it will be truncated from the end. The default value is the unicode "space"
 * character (U+0020).
 */
export const strPadStart: (value: string, targetLength: number, padString?: string) => string = (/*#__PURE__*/_unwrapFunctionWithPoly("padStart", StrProto, polyStrPadStart));

/**
 * The `strPadEnd()` method pads the current string with a given string (repeated, if needed) so that
 * the resulting string reaches a given length. The padding is applied from the end of the current string.
 * @function
 * @group String
 * @param value - The value to be padded
 * @param targetLength - The length of the resulting string once the current `value` has been padded. If
 * the `targetLength` is lower than `value.length`, the current string will be returned as-is.
 * @param padString - The string to pad the current `value` with. If padString is too long to stay within
 * `targetLength`, it will be truncated: for left-to-right languages the left-most part and for right-to-left
 * languages the right-most will be applied. The default value for this parameter is " " (U+0020).
 * @returns A String of the specified targetLength with the padString applied at the end of the current str.
 */
export const strPadEnd: (value: string, targetLength: number, padString?: string) => string = (/*#__PURE__*/_unwrapFunctionWithPoly("padEnd", StrProto, polyStrPadEnd));

/**
 * The `strPadStart()` method pads the current string with another string (multiple times, if needed)
 * until the resulting string reaches the given length. The padding is applied from the start of the
 * current string. Provided for runtimes that don't support see [padStart](https://caniuse.com/?search=padStart)
 * @group Polyfill
 * @group String
 * @param value - The value to be padded
 * @param targetLength - The length of the resulting string once the current str has been padded.
 * If the value is less than str.length, then str is returned as-is.
 * @param padString - The string to pad the current str with. If padString is too long to stay within
 * the targetLength, it will be truncated from the end. The default value is the unicode "space"
 * character (U+0020).
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyStrPadStart(value: string, targetLength: number, padString?: string): string {
    return _padValue(value, targetLength, padString) + value;
}

/**
 * The `strPadEnd()` method pads the current string with a given string (repeated, if needed) so that
 * the resulting string reaches a given length. The padding is applied from the end of the current string.
 * @group Polyfill
 * @group String
 * @param value - The value to be padded
 * @param targetLength - The length of the resulting string once the current `value`` has been padded. If
 * the `targetLength` is lower than `value.length`, the current string will be returned as-is.
 * @param padString - The string to pad the current `value` with. If padString is too long to stay within
 * `targetLength`, it will be truncated. The default value for this parameter is " " (U+0020).
 * @returns A String of the specified targetLength with the padString applied at the end of the current str.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyStrPadEnd(value: string, targetLength: number, padString?: string): string {
    return value + _padValue(value, targetLength, padString);
}
