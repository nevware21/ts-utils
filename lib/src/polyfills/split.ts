/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { isStrictNullOrUndefined } from "../helpers/base";
import { StrProto } from "../internal/constants";
import { _getNativeSymbol } from "../internal/native_symbol";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { getKnownSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";

/**
 * The `polyStrSymSplit()` splits a string into substrings using the [`Symbol.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/split)
 * method from the splitter object to provide custom behavior, like the native `split` method.
 * On a runtime without a native `Symbol.split` (eg. IE) it calls the splitter's method for the
 * polyfill symbol, which {@link getKnownSymbol} returns for {@link WellKnownSymbols.split}, with
 * a native `Symbol.split` the runtime `split` method is called (which calls the splitter's method).
 * @since 0.9.1
 * @group Polyfill
 * @group String
 * @param value - The string value to be split into substrings.
 * @param splitter - The object which contains a Symbol.split method, Omitting splitter or passing
 * null or undefined returns an array with the calling string as a single element, like the
 * native `split` any other value without a Symbol.split method is converted to a string (a
 * RegExp is used as the pattern) which is used to split the string.
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
/*#__NO_SIDE_EFFECTS__*/
export function polyStrSymSplit(value: string, splitter: { [Symbol.split](string: string, limit?: number): string[]; }, limit?: number): string[] {
    // Without a native Symbol.split (eg. IE) the polyfill symbol is used like the native split uses Symbol.split (with a
    // native Symbol but no Symbol.split, getKnownSymbol() returns undefined and the runtime split is used). The value must
    // not be null or undefined, then the splitter's [Symbol.split] (when the splitter isn't null or undefined) is read
    // once, only a null or undefined one is ignored (any other value which isn't a function throws a TypeError) and it
    // is called with the splitter as `this`, the value (not yet converted) and the limit
    let splitKey = !_getNativeSymbol("split") && getKnownSymbol(WellKnownSymbols.split);
    if (splitKey && !isStrictNullOrUndefined(splitter)) {
        _throwIfNullOrUndefined(value);

        let splitFn = (splitter as any)[splitKey];
        if (!isStrictNullOrUndefined(splitFn)) {
            return fnCall(splitFn, splitter, value, limit);
        }
    }

    // Otherwise the runtime split is used, which with a native Symbol.split calls the splitter's [Symbol.split] itself
    // (so it's only read once) and converts any other splitter to a string (a RegExp is used as the pattern)
    return fnCall(StrProto.split, value, splitter as any, limit);
}
