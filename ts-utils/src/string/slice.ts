/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { StrProto } from "../internal/constants";

/**
 * The `strSlice()` method extracts a section of a string and returns it as a new string, without
 * modifying the original string.
 * `strSlice()` extracts the text from one string and returns a new string. Changes to the text in one
 * string do not affect the other string.
 * `strSlice()` extracts up to but not including endIndex. str.slice(1, 4) extracts the second character
 * through the fourth character (characters indexed 1, 2, and 3).
 * As an example, strSlice(2, -1) extracts the third character through the second to last character
 * in the string.
 * @param value - The value to haveextract a number
 * @param beginIndex - The zero-based index at which to begin extraction.
 * If `beginIndex` is negative, `strSlice()` begins extraction from `value.length + beginIndex`.
 * (E.g. `strSlice("test", -2)` returns "st")
 * If `beginIndex` is omitted, undefined, or cannot be converted to a number (using Number(`beginIndex`)),
 * strSlice() begins extraction from the beginning of the string. (E.g. `strSlice("test")` returns "test")
 * If `beginIndex` is greater than or equal to `value.length`, an empty string is returned.
 * (E.g. `strSlice("test", 4)` returns "")
 * @param endIndex - The index of the first character to exclude from the returned substring.
 * If `endIndex` is omitted, undefined, or cannot be converted to a number (using Number(`endIndex`))
 * strSlice() extracts to the end of the string. (E.g. `strSlice("test", 2)` returns "st")
 * If `endIndex` is greater than `value.length`, strSlice() also extracts to the end of the string.
 * (E.g. strSlice("test", 2, 10)` returns "st")
 * If `endIndex` is negative, `strSlice()` treats it as `value.length + endIndex`. (E.g, if `endIndex`
 * is -2, it is treated as `value.length - 2` and `strSlice("test", 1, -2)` returns "e") .
 * If `endIndex` represents a position that is before the one represented by startIndex, `strSlice()`
 * returns "". (E.g `strSlice("test", 2, -10)`, strSlice("test", -1, -2)` or `strSlice("test", 3, 2)`).
 * @returns A new string containing the extracted section of the string.
 */
export function strSlice(value: string, beginIndex: number, endIndex?: number): string {
    return StrProto.slice.call(value, beginIndex, endIndex);
}
