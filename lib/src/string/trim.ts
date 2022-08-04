/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { StrProto } from "../internal/constants";
import { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "../polyfills/trim";

const _strTrim = StrProto.trim;
const _strTrimStart = StrProto.trimStart;
const _strTrimEnd = StrProto.trimEnd;

/**
 * The trim() method removes whitespace from both ends of a string and returns a new string,
 * without modifying the original string. Whitespace in this context is all the whitespace
 * characters (space, tab, no-break space, etc.) and all the line terminator characters
 * (LF, CR, etc.).
 * @group String
 * @param value - The string value to be trimmed.
 * @returns A new string representing str stripped of whitespace from both its beginning and end.
 * If neither the beginning or end of str has any whitespace, a new string is still returned (essentially
 * a copy of str), with no exception being thrown.
 * To return a new string with whitespace trimmed from just one end, use `strTrimStart()` or `strTrimEnd()`.
 */
export function strTrim(value: string): string {
    return _strTrim ? _strTrim.call(value) : polyStrTrim(value);
}

/**
 * The `strTrimStart()` method removes whitespace from the beginning of a string.
 * @group String
 * @param value - The value to be trimmed.
 * @returns A new string representing str stripped of whitespace from its beginning (left side).
 * If the beginning of str has no whitespace, a new string is still returned (essentially a copy of str),
 * with no exception being thrown.
 */
export function strTrimStart(value: string): string {
    return _strTrimStart ? _strTrimStart.call(value) : polyStrTrimStart(value);
}

/**
 * Alias for `strTrimStart()` method removes whitespace from the beginning of a string.
 * @group String
 * @param value - The value to be trimmed.
 * @returns A new string representing str stripped of whitespace from its beginning (left side).
 * If the beginning of str has no whitespace, a new string is still returned (essentially a copy of str),
 * with no exception being thrown.
 */
export const strTrimLeft = strTrimStart;

/**
 * The `strTrimEnd()` method removes whitespace from the end of a string.
 * @group String
 * @param value - The value to be trimmed.
 * @returns A new string representing str stripped of whitespace from its end (right side).
 * If the end of str has no whitespace, a new string is still returned (essentially a copy of str),
 * with no exception being thrown.
 */
export function strTrimEnd(value: string): string {
    return _strTrimEnd ? _strTrimEnd.call(value) : polyStrTrimEnd(value);
}

/**
 * Alias for `strTrimEnd()` method removes whitespace from the end of a string.
 * @group String
 * @param value - The value to be trimmed.
 * @returns A new string representing str stripped of whitespace from its end (right side).
 * If the end of str has no whitespace, a new string is still returned (essentially a copy of str),
 * with no exception being thrown.
 */
export const strTrimRight = strTrimEnd;
