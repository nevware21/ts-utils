/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 Nevware21
 * Licensed under the MIT license.
 */

import { getKnownSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";

/**
 * The `polyStrSymSplit()` splits a string into substrings using the [`Symbol.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/split)
 * method from the splitter object to provide custom behavior. It uses {@link getKnownSymbol}
 * to get the {@link WellKnownSymbols.split} symbol which will return the polyfill symbol value.
 * @since 0.9.1
 * @group Polyfill
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
 *   [getKnownSymbol<typeof Symbol.split>(WellKnownSymbols.split)]: (str: string) => {
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
 * console.log(polyStrSymSplit(myString, splitByNumber)); // [ "a", "bc", "c5d", "e", "f" ]
 * ```
 */
export function polyStrSymSplit(value: string, splitter: { [Symbol.split](string: string, limit?: number): string[]; }, limit?: number): string[] {
    let splitFn: (string: string, limit?: number) => string[] = splitter && splitter[getKnownSymbol(WellKnownSymbols.split)];
    
    return splitFn ? splitFn(value, limit) : [ value ];
}
