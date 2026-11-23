/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { LENGTH, StrProto } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { _toInt } from "../helpers/length";
import { _toString } from "./as_string";
import { _toSearchString } from "./includes";
import { strSubstring } from "./substring";

/**
 * This method lets you determine whether or not a string begins with another string. This method is case-sensitive.
 * @function
 * @group String
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the start of the string
 * @param position - [Optional] The position in this string at which to begin searching for `searchString`.
 * Defaults to 0
 * @returns `true` if the given characters are found at the beginning of the string; otherwise, `false`.
 * @throws TypeError If searchString is a regex, or the value is `null` or `undefined`.
 */
export const strStartsWith: (value: string, searchString: string, position?: number) => boolean = (/*#__PURE__*/_unwrapFunctionWithPoly("startsWith", StrProto, polyStrStartsWith));

/**
 * This method lets you determine whether or not a string begins with another string. This method is case-sensitive.
 * Like the native function the value (eg. a `String` object or a number) and the searchString are converted to strings
 * (since 0.20.0 a `Symbol` throws a TypeError, like the native function), and a regular expression searchString
 * (identified like the native IsRegExp) throws a TypeError.
 * @group Polyfill
 * @group String
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the start of the string
 * @param position - [Optional] The position in this string at which to begin searching for `searchString`.
 * Defaults to 0
 * @returns `true` if the given characters are found at the beginning of the string; otherwise, `false`.
 * @throws TypeError If searchString is a regex, or the value is `null` or `undefined`.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyStrStartsWith(value: string, searchString: string, position?: number): boolean {
    _throwIfNullOrUndefined(value);

    // Like the native function the value (eg. a String object or a number) and then the searchString are converted to
    // strings (the searchString only once, and like polyStrIncludes() a RegExp throws a TypeError), and then the position
    // to a number (so NaN and a value which isn't a number are 0)
    let theValue = _toString(value);
    let searchValue = _toSearchString(searchString);
    // Like the native function the position is converted to an integer (so a fraction is truncated before the length is
    // added, as the sum could otherwise round up) and a negative position is 0
    let pos = _toInt(position);
    pos = pos > 0 ? pos : 0;

    return strSubstring(theValue, pos, pos + searchValue[LENGTH]) === searchValue;
}
