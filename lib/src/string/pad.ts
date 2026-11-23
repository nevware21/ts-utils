/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isStrictUndefined } from "../helpers/base";
import { throwRangeError } from "../helpers/throw";
import { LENGTH, StrProto, SUBSTRING } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { _toInt } from "../helpers/length";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { _toString } from "./as_string";

/**
 * The shared implementation of polyStrPadStart() and polyStrPadEnd(), like the native functions null or undefined
 * throws a TypeError, the value is converted to a string, then the targetLength to a length (ToLength, so NaN and a
 * negative value are 0 and a fraction is truncated) and (only when the value is shorter) the padString to a string (a
 * Symbol throws a TypeError, and only undefined uses the default). An empty padString returns the value as-is.
 */
/*#__NO_SIDE_EFFECTS__*/
function _strPad(value: string, targetLength: number, padString: string, atStart: boolean): string {
    _throwIfNullOrUndefined(value);
    let theValue = _toString(value);
    let maxLength = _toInt(targetLength);

    let len = theValue[LENGTH];
    if (len < maxLength) {
        let result = isStrictUndefined(padString) ? " " : _toString(padString);
        maxLength -= len;

        if (result) {
            // Like the native functions a padded string which is longer than a string can be throws a RangeError (rather
            // than first building a string up to the runtime's limit, which is less than 2^31 for every runtime)
            if (maxLength > 0x7FFFFFFF) {
                throwRangeError("Invalid string length");
            }

            // Doubled until it is long enough (only adding what is missing, so it is never longer than the result, which
            // may be close to the maximum length of a string) and then truncated to remove any extra from a long
            // padString. This doesn't use strRepeat() so the polyfills don't include its polyfill. The result is always a
            // primitive string, so its own substring() is called directly (rather than via strSubstring(), which is slower)
            while (result[LENGTH] < maxLength) {
                result += result[SUBSTRING](0, maxLength - result[LENGTH]);
            }

            result = result[SUBSTRING](0, maxLength);
            theValue = atStart ? result + theValue : theValue + result;
        }
    }

    return theValue;
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
    return _strPad(value, targetLength, padString, true);
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
    return _strPad(value, targetLength, padString, false);
}
