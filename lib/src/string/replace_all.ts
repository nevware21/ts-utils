/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction, isRegExp, isStrictNullOrUndefined, isString } from "../helpers/base";
import { throwTypeError } from "../helpers/throw";
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
 * Polyfill implementation of String.prototype.replaceAll().
 * @since 0.14.0
 * @group String
 * @group Polyfill
 * @param value - The string value to search and replace within.
 * @param searchValue - The value to search for. Can be a string or a global regular expression.
 * @param replaceValue - The replacement string or replacer function.
 * @returns A new string with every occurrence of searchValue replaced.
 * @throws TypeError if searchValue is a regular expression without the global flag.
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

        // eslint-disable-next-line security/detect-non-literal-regexp
        matcher = new RegExp(strReplace(search, /[.*+?^${}()|[\]\\]/g, "\\$&") || "(?:)", "g");
    }

    return strReplace(theValue, matcher, replaceValue as any);
}
