/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 Nevware21
 * Licensed under the MIT license.
 */

import { StrProto } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";
import { polyStrSymSplit } from "../polyfills/split";
import { getKnownSymbol, hasSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";

/**
 * The `strSplit()` splits a string into substrings using the pattern and divides a String
 * into an ordered list of substrings by searching for the pattern, puts these substrings
 * into an array, and returns the array.
 * @since 0.9.1
 * @group String
 * @param value - The string value to be split into substrings.
 * @param separator - The pattern describing where each split should occur. Can be undefined, a
 * string, or an object with a [`Symbol.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/split)
 * method (if supported) — the typical example being a regular expression. Omitting separator or
 * passing undefined causes strSplit() to return an array with the calling string as a single
 * element. All values that are not undefined or objects with a `@@split` method are coerced to strings.
 * @param limit - A non-negative integer specifying a limit on the number of substrings to be
 * included in the array. If provided, splits the string at each occurrence of the specified
 * separator, but stops when limit entries have been placed in the array. Any leftover text is
 * not included in the array at all.
 * - The array may contain fewer entries than limit if the end of the string is reached before
 * the limit is reached.
 * - If limit is 0, [] is returned.
 * @return An Array of strings, split at each point where the separator occurs in the given string.
 * @example
 * ```ts
 * strSplit("Oh brave new world that has such people in it.", " ");
 * // [ "Oh", "brave", "new", "world", "that", "has", "such", "people", "in", "it." ]
 *
 * strSplit("Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec", ",");
 * // [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
 * ```
 */
export const strSplit: (value: string, separator: string | RegExp, limit?: number) => string[] = _unwrapFunction("split", StrProto);

/**
 * The `strSymSplit()` splits a string into substrings using the [`Symbol.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/split)
 * method from the splitter object to provide custom behavior. If the runtime supports symbols
 * then the default runtime `split` method will be called, It will use {@link getKnownSymbol}
 * to get the {@link WellKnownSymbols.split} symbol which will return the runtime symbol or the
 * polyfill symbol when not supported by the runtime.
 * @since 0.9.1
 * @group String
 * @param value - The string value to be split into substrings.
 * @param splitter - The object which contains a Symbol.split method, Omitting splitter or passing
 * an object that doesn't contain a Symbol.split causes it to return an array with the calling
 * string as a single element.
 * @param limit - A non-negative integer specifying a limit on the number of substrings to be
 * included in the array. If provided, splits the string at each occurrence of the specified
 * separator, but stops when limit entries have been placed in the array. Any leftover text is
 * not included in the array at all.
 * - The array may contain fewer entries than limit if the end of the string is reached before
 * the limit is reached.
 * - If limit is 0, [] is returned.
 * @return An Array of strings, split at each point where the separator occurs in the given string.
 * @example
 * ```ts
 * const splitByNumber = {
 *   [Symbol.split]: (str: string) => {
 *     let num = 1;
 *     let pos = 0;
 *     const result = [];
 *     while (pos < str.length) {
 *       const matchPos = strIndexOf(str, asString(num), pos);
 *       if (matchPos === -1) {
 *         result.push(strSubstring(str, pos));
 *         break;
 *       }
 *       result.push(strSubstring(str, pos, matchPos));
 *       pos = matchPos + asString(num).length;
 *       num++;
 *     }
 *     return result;
 *   }
 * };
 *
 * const myString = "a1bc2c5d3e4f";
 * console.log(strSymSplit(myString, splitByNumber)); // [ "a", "bc", "c5d", "e", "f" ]
 * ```
 */
export const strSymSplit: (value: string, splitter: { [Symbol.split](string: string, limit?: number): string[]; }, limit?: number) => string[] = hasSymbol() ? _unwrapFunction("split", StrProto) : polyStrSymSplit;
