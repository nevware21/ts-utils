/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isStrictUndefined } from "../helpers/base";
import { LENGTH, StrProto } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { _toString } from "./as_string";
import { _toSearchString } from "./includes";
import { strSubstring } from "./substring";

/**
 * This method lets you determine whether or not a string ends with another string. This method is case-sensitive.
 * @function
 * @group String
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the end of `value` string.
 * @param length - If provided, it is used as the length of `value`. Defaults to value.length.
 * @returns `true` if the given characters are found at the end of the string; otherwise, `false`.
 * @throws TypeError If searchString is a regex, or the value is `null` or `undefined`.
 */
export const strEndsWith: (value: string, searchString: string, length?: number) => boolean = (/*#__PURE__*/_unwrapFunctionWithPoly("endsWith", StrProto, polyStrEndsWith));

/**
 * This method lets you determine whether or not a string ends with another string. This method is case-sensitive.
 * Like the native function the value (eg. a `String` object or a number) and the searchString are converted to strings
 * (since 0.20.0 a `Symbol` throws a TypeError, like the native function), and a regular expression searchString
 * (identified like the native IsRegExp) throws a TypeError.
 * @group Polyfill
 * @group String
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the end of `value` string.
 * @param length - If provided, it is used as the length of `value`. Defaults to value.length.
 * @returns `true` if the given characters are found at the end of the string; otherwise, `false`.
 * @throws TypeError If searchString is a regex, or the value is `null` or `undefined`.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyStrEndsWith(value: string, searchString: string, length?: number): boolean {
    _throwIfNullOrUndefined(value);

    // Like the native function the value (eg. a String object or a number) and then the searchString are converted to
    // strings (the searchString only once, and like polyStrIncludes() a RegExp throws a TypeError), and then the length
    // to a number (so NaN, the "undefined" string and a value which isn't a number are 0) which can't be longer than
    // the value, substring() truncates a fraction and treats a negative index as 0
    let theValue = _toString(value);
    let searchValue = _toSearchString(searchString);
    let len = theValue[LENGTH];
    let end = +length;
    end = isStrictUndefined(length) || end > len ? len : (end || 0);

    return strSubstring(theValue, end - searchValue[LENGTH], end) === searchValue;
}
