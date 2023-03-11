/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isNullOrUndefined, isUndefined } from "../helpers/base";
import { dumpObj } from "../helpers/diagnostics";
import { throwTypeError } from "../helpers/throw";
import { EMPTY, LENGTH, StrProto } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";
import { mathMax } from "../math/min_max";
import { strSlice } from "./slice";

/**
 * The `strSubstring()` method returns the part of the string between the start and end indexes, or to the end of the string.
 *
 * `strSubstring()` extracts characters from indexStart up to but not including indexEnd. In particular:
 * - If `indexEnd` is omitted, strSubstring() extracts characters to the end of the string.
 * - If `indexStart` is equal to indexEnd, strSubstring() returns an empty string.
 * - If `indexStart` is greater than indexEnd, then the effect of strSubstring() is as if the two arguments were swapped; see example below.
 *
 * Any argument value that is less than 0 or greater than `value.length` is treated as if it were 0 and `value.length`, respectively.
 *
 * Any argument value that is NaN is treated as if it were 0.
 * @group String
 * @param value - The string value to return the substring from.
 * @param indexStart - The index of the first character to include in the returned substring.
 * @param indexEnd - The index of the first character to exclude from the returned substring.
 * @return A new string containing the specified part of the given string
 * @example
 * ```ts
 * const anyString = 'Nevware21';
 * // Displays 'N'
 * console.log(strSubstring(anyString, 0, 1));
 * console.log(strSubstring(anyString, 1, 0));
 *
 * // Displays 'Nevwar'
 * console.log(strSubstring(anyString, 0, 6));
 *
 * // Displays 'are21'
 * console.log(strSubstring(anyString, 4));
 *
 * // Displays 'are'
 * console.log(strSubstring(anyString, 4, 7));
 *
 * // Displays '21'
 * console.log(strSubstring(anyString, 7, 4));
 *
 * // Displays 'Nevware'
 * console.log(strSubstring(anyString, 0, 7));
 *
 * // Displays 'Nevware21'
 * console.log(strSubstring(anyString, 0, 10));
 * ```
 */
export const strSubstring: (value: string, indexStart: number, indexEnd?: number) => string = _unwrapFunction("substring", StrProto);

/**
 * The strSubstr() method returns a portion of the string, starting at the specified index and extending for a given
 * number of characters afterwards.
 *
 * @since 0.4.2
 * @group String
 * @param value - The string value to return the substring from.
 * @param start - The index of the first character to include in the returned substring.
 * @param length - The number of characters to extract.
 * @returns A new string containing the specified part of the given string.
 */
export const strSubstr: (value: string, indexStart: number, indexEnd?: number) => string = _unwrapFunction("substr", StrProto, polyStrSubstr);

/**
 * The polyStrSubstr() method returns a portion of the string, starting at the specified index and extending for a given
 * number of characters afterwards.
 *
 * @since 0.4.2
 * @group String
 * @group Polyfill
 * @param value - The string value to return the substring from.
 * @param start - The index of the first character to include in the returned substring.
 * @param length - The number of characters to extract.
 * @returns A new string containing the specified part of the given string.
 */
export function polyStrSubstr(value: string, start: number, length?: number): string {
    if (isNullOrUndefined(value)) {
        throwTypeError("'polyStrSubstr called with invalid " + dumpObj(value));
    }

    if (length < 0) {
        return EMPTY;
    }

    // If start is omitted or undefined, its treated as zero
    start = start || 0;

    if (start < 0) {
        start = mathMax(start + value[LENGTH], 0);
    }

    if (isUndefined(length)) {
        return strSlice(value, start);
    }

    return strSlice(value, start, start + length);
}

/**
 * Returns a substring of the string starting from the left.
 *
 * `strLeft()` extracts the number of characters from left of the string up to the count. In particular:
 * - If `count` is less than zero, strLeft() returns an empty string.
 * - If `count` is less than `value.length', strLeft() returns a new string with the `count` number of characters from the left of the string.
 * - If `count` is greater than `value.length`, then the value original value is returned.
 *
 * Any argument value that is NaN is treated as if it were 0.
 *
 * @since 0.4.2
 * @group String
 * @param value - The string value to return the substring from.
 * @param count - The number of characters to extract
 * @returns The substring based on the count number of characters from the right
 * @example
 * ```ts
 * strLeft("Nevware21", -1); // ""
 * strLeft("Nevware21", 0); // ""
 * strLeft("Nevware21", 1); // "N"
 * strLeft("Nevware21", 3); // "Nev"
 * strLeft("Nevware21", 21); // "Nevware21"
 * ```
 */
export function strLeft(value: string, count: number): string {
    return strSubstring(value, 0, count);
}

/**
 * Returns a substring of the string starting from the right.
 *
 * `strRight()` extracts the number of characters from right of the string up to the count. In particular:
 * - If `count` is less than zero, strRight() returns an empty string.
 * - If `count` is less than `value.length', strRight() returns a new string with the `count` number of characters from the right of the string.
 * - If `count` is greater than `value.length`, then the value original value is returned.
 *
 * Any argument value that is NaN is treated as if it were 0.
 *
 * @since 0.4.2
 * @group String
 * @param value - The string value to return the substring from.
 * @param count - The number of characters to extract
 * @returns The substring based on the count number of characters from the right
 * @example
 * ```ts
 * strRight("Nevware21", -1); // ""
 * strRight("Nevware21", 0); // ""
 * strRight("Nevware21", 1); // "1"
 * strRight("Nevware21", 3); // "e21"
 * strRight("Nevware21", 21); // "Nevware21"
 * ```
 */
export function strRight(value: string, count: number): string {
    let len = value[LENGTH];
    if (count <= 0) {
        return EMPTY;
    }

    return len > count ? strSubstring(value, len - count) : value;
}