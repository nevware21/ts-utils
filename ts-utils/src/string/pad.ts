/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isNullOrUndefined } from "../helpers/base";
import { EMPTY, StrProto } from "../internal/constants";
import { mathCeil } from "../math/floor";
import { mathToInt } from "../math/to_int";
import { strRepeat } from "./repeat";

const _strPadStart = StrProto.padStart;
const _strPadEnd = StrProto.padEnd;

function _padValue(value: string, targetLength: number, padString?: string) {
    let result = EMPTY;
    targetLength = mathToInt(targetLength, true);
    targetLength >>= 0;

    let len = value.length;
    if (len < targetLength) {
        result = isNullOrUndefined(padString) ? " " : "" + padString;
        targetLength = targetLength - len;
        if (targetLength > result.length) {
            result = strRepeat(result, mathCeil(targetLength / result.length));
        }

        if (result.length > targetLength) {
            result = result.substring(0, targetLength);
        }
    }

    return result;
}

/**
 * The `strPadStart()` method pads the current string with another string (multiple times, if needed)
 * until the resulting string reaches the given length. The padding is applied from the start of the
 * current string. This will use any native implementation if available, but will fall back to the
 * provided polyfill for runtimes that don't support [padStart](https://caniuse.com/?search=padStart)
 * @param value - The value to be padded
 * @param targetLength - The length of the resulting string once the current str has been padded.
 * If the value is less than str.length, then str is returned as-is.
 * @param padString - The string to pad the current str with. If padString is too long to stay within
 * the targetLength, it will be truncated from the end. The default value is the unicode "space"
 * character (U+0020).
 */
export function strPadStart(value: string, targetLength: number, padString?: string): string {
    return _strPadStart ? _strPadStart.call(value, targetLength, padString) : polyStrPadStart(value, targetLength, padString);
}

/**
 * The `strPadEnd()` method pads the current string with a given string (repeated, if needed) so that
 * the resulting string reaches a given length. The padding is applied from the end of the current string.
 * @param value - The value to be padded
 * @param targetLength - The length of the resulting string once the current `value`` has been padded. If
 * the `targetLength` is lower than `value.length`, the current string will be returned as-is.
 * @param padString - The string to pad the current `value` with. If padString is too long to stay within
 * `targetLength`, it will be truncated: for left-to-right languages the left-most part and for right-to-left
 * languages the right-most will be applied. The default value for this parameter is " " (U+0020).
 * @returns A String of the specified targetLength with the padString applied at the end of the current str.
 */
export function strPadEnd(value: string, targetLength: number, padString?: string): string {
    return _strPadEnd ? _strPadEnd.call(value, targetLength, padString) : polyStrPadEnd(value, targetLength, padString);
}

/**
 * The `strPadStart()` method pads the current string with another string (multiple times, if needed)
 * until the resulting string reaches the given length. The padding is applied from the start of the
 * current string. Provided for runtimes that don't support see [padStart](https://caniuse.com/?search=padStart)
 * @param value - The value to be padded
 * @param targetLength - The length of the resulting string once the current str has been padded.
 * If the value is less than str.length, then str is returned as-is.
 * @param padString - The string to pad the current str with. If padString is too long to stay within
 * the targetLength, it will be truncated from the end. The default value is the unicode "space"
 * character (U+0020).
 */
export function polyStrPadStart(value: string, targetLength: number, padString?: string): string {
    return _padValue(value, targetLength, padString) + value;
}

/**
 * The `strPadEnd()` method pads the current string with a given string (repeated, if needed) so that
 * the resulting string reaches a given length. The padding is applied from the end of the current string.
 * @param value - The value to be padded
 * @param targetLength - The length of the resulting string once the current `value`` has been padded. If
 * the `targetLength` is lower than `value.length`, the current string will be returned as-is.
 * @param padString - The string to pad the current `value` with. If padString is too long to stay within
 * `targetLength`, it will be truncated. The default value for this parameter is " " (U+0020).
 * @returns A String of the specified targetLength with the padString applied at the end of the current str.
 */
export function polyStrPadEnd(value: string, targetLength: number, padString?: string): string {
    return value + _padValue(value, targetLength, padString);
}
