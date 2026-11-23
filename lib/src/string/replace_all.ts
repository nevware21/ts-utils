/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { isStrictNullOrUndefined } from "../helpers/base";
import { createLiteralRegex } from "../helpers/regexp";
import { StrProto, UNDEF_VALUE } from "../internal/constants";
import { _getNativeSymbol } from "../internal/native_symbol";
import { getKnownSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";
import { _isRegExp, _isRegExpObj, _throwIfNotGlobal } from "../internal/is_regexp";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { _toString } from "./as_string";
import { strReplace } from "./replace";

/**
 * The strReplaceAll() method returns a new string with all matches of a pattern replaced by a replacement.
 * @function
 * @since 0.14.0
 * @group String
 * @param value - The string value to search and replace within.
 * @param searchValue - The value to search for. Can be a string or a global regular expression.
 * @param replaceValue - The replacement string or replacer function.
 * @returns A new string with every occurrence of searchValue replaced.
 * @throws TypeError if searchValue is a regular expression without the global flag.
 * @example
 * ```ts
 * strReplaceAll("a-b-a", "a", "x");       // "x-b-x"
 * strReplaceAll("abc123abc", /abc/g, "X"); // "X123X"
 * strReplaceAll("abca", "a", (value, index) => value.toUpperCase() + index);
 * // "A0bcA3"
 * ```
 */
export const strReplaceAll: (value: string, searchValue: string | RegExp, replaceValue: string | ((substring: string, ...args: any[]) => string)) => string = (/*#__PURE__*/_unwrapFunctionWithPoly("replaceAll", StrProto as any, polyStrReplaceAll));

/**
 * Polyfill implementation of `String.prototype.replaceAll()` that returns a new string with all
 * matches of a pattern replaced by a replacement.
 *
 * Matches the behaviour of the native `String.prototype.replaceAll()` method:
 * - A regular expression `searchValue` (identified like the native IsRegExp, so a `RegExp` whose `Symbol.match` is
 *   falsy isn't one and an object whose `Symbol.match` is truthy is) **must** have a global (`g`) flag in its `flags`;
 *   a non-global one throws a `TypeError`.
 * - A string `searchValue` is treated as a literal pattern (special regex characters are escaped)
 *   and all occurrences are replaced. Like the native function the value and the `searchValue` are converted to
 *   strings (a `Symbol` throws a `TypeError`).
 * - If `searchValue` has a `[Symbol.replace]` (read once, a value which isn't `null`, `undefined` or a function throws
 *   a `TypeError`), it is called with the (unconverted) value and `replaceValue`, like the native function. On a
 *   runtime without a native `Symbol` (eg. IE) the method for the polyfill symbol
 *   (`getKnownSymbol(WellKnownSymbols.replace)`) is called, and on a runtime without `Symbol.replace` a `RegExp` is
 *   used like its native `[Symbol.replace]`.
 * - If `replaceValue` is a function it is invoked for each match with the matched substring,
 *   captured groups, the match index, and the original string.
 *
 * @since 0.14.0
 * @group String
 * @group Polyfill
 * @param value - The string value to search and replace within.
 * @param searchValue - The value to search for. Can be a string, a global `RegExp`, or any object
 * with a `[Symbol.replace]` method.
 * @param replaceValue - The replacement string (may use `$&`, `$1`…`$n`, `$\`` and `$'` patterns)
 * or a replacer function called once per match.
 * @returns A new string with every occurrence of `searchValue` replaced by `replaceValue`.
 * @throws `TypeError` if `searchValue` is a `RegExp` without the global (`g`) flag.
 * @throws `TypeError` if `value` is `null` or `undefined`.
 * @example
 * ```ts
 * // String literal replacement — replaces every occurrence
 * polyStrReplaceAll("aabbcc", "b", "x");       // "aaxxcc"
 * polyStrReplaceAll("a-b-a", "a", "x");        // "x-b-x"
 * ```
 * @example
 * ```ts
 * // Global RegExp replacement
 * polyStrReplaceAll("abc123abc", /abc/g, "X"); // "X123X"
 * ```
 * @example
 * ```ts
 * // Replacer function
 * polyStrReplaceAll("abca", "a", (match, offset) => match.toUpperCase() + offset);
 * // "A0bcA3"
 * ```
 * @example
 * ```ts
 * // Special regex characters in search string are escaped
 * polyStrReplaceAll("a.b.c", ".", "-");  // "a-b-c"  (dot is literal)
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyStrReplaceAll(value: string, searchValue: string | RegExp, replaceValue: string | ((substring: string, ...args: any[]) => string)): string {
    _throwIfNullOrUndefined(value);

    // Like the native function (in the same order) a searchValue which isn't null or undefined is checked first: a
    // regular expression (IsRegExp, eg. a RegExp whose Symbol.match isn't falsy or an object whose Symbol.match is
    // truthy) must have a "g" in its flags, then its [Symbol.replace] (read once, only a null or undefined one is
    // ignored, any other value which isn't a function throws a TypeError) is called with the value (not yet converted).
    // On a runtime without a native Symbol (eg. IE) the method for the polyfill symbol is used, while a runtime with a
    // native Symbol which has no Symbol.replace has no key for it
    if (!isStrictNullOrUndefined(searchValue)) {
        _isRegExp(searchValue) && _throwIfNotGlobal(searchValue, "searchValue");

        let replaceSym = _getNativeSymbol("replace");
        let replaceKey = replaceSym || getKnownSymbol(WellKnownSymbols.replace);
        let replacer = replaceKey ? (searchValue as any)[replaceKey] : UNDEF_VALUE;
        if (!isStrictNullOrUndefined(replacer)) {
            return fnCall(replacer, searchValue, value, replaceValue);
        }

        if (!replaceSym && _isRegExpObj(searchValue)) {
            // On a runtime without Symbol.replace (eg. IE) a RegExp is used like its native [Symbol.replace]
            return strReplace(_toString(value), searchValue as RegExp, replaceValue as any);
        }
    }

    // Like the native function the value and then the searchValue are converted to strings (a Symbol throws a TypeError)
    // and every occurrence of the searchValue is replaced
    let theValue = _toString(value);

    return strReplace(theValue, createLiteralRegex(_toString(searchValue)), replaceValue as any);
}
