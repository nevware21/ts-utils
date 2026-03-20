/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction, isRegExp, isStrictNullOrUndefined, isString } from "../helpers/base";
import { throwTypeError } from "../helpers/throw";
import { createLiteralRegex } from "../helpers/regexp";
import { StrProto } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { getKnownSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";
import { asString } from "./as_string";
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
 * - A `RegExp` `searchValue` **must** carry the global (`g`) flag; a non-global `RegExp` throws a
 *   `TypeError`.
 * - A string `searchValue` is treated as a literal pattern (special regex characters are escaped)
 *   and all occurrences are replaced.
 * - If `searchValue` exposes a `[Symbol.replace]` method, that method is called with the coerced
 *   string value and `replaceValue`, mirroring the native delegation behaviour.
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

    let matchSymbol = getKnownSymbol(WellKnownSymbols.match);
    let replaceSymbol = getKnownSymbol(WellKnownSymbols.replace);
    let replaceFn: (value: string, replaceValue: string | ((substring: string, ...args: any[]) => string)) => string;
    let matcher: string | RegExp;
    let isRegex = isRegExp(searchValue);
    let theValue = isString(value) ? value : asString(value);
    let isSearchNotNull = searchValue || !isStrictNullOrUndefined(searchValue);

    if (isRegex && isSearchNotNull) {
        isRegex = (searchValue as any)[matchSymbol] !== false;
    }

    if (isRegex) {
        if (!(searchValue as RegExp).global) {
            throwTypeError("searchValue must be a global regular expression");
        }

        matcher = searchValue;
    } else {
        replaceFn = isSearchNotNull ? (searchValue as any)[replaceSymbol] : null;
        if (isFunction(replaceFn)) {
            return replaceFn.call(searchValue, theValue, replaceValue);
        }

        let search = isString(searchValue) ? searchValue : asString(searchValue);

        matcher = createLiteralRegex(search);
    }

    return strReplace(theValue, matcher, replaceValue as any);
}
