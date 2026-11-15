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
import { asString } from "./as_string";
import { polyStrIncludes } from "./includes";
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
 * @throws TypeError If searchString is a regex.
 */
export const strStartsWith: (value: string, searchString: string, position?: number) => boolean = (/*#__PURE__*/_unwrapFunctionWithPoly("startsWith", StrProto, polyStrStartsWith));

/**
 * This method lets you determine whether or not a string begins with another string. This method is case-sensitive.
 * @group Polyfill
 * @group String
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the start of the string
 * @param position - [Optional] The position in this string at which to begin searching for `searchString`.
 * Defaults to 0
 * @returns `true` if the given characters are found at the beginning of the string; otherwise, `false`.
 * @throws TypeError If searchString is a regex.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyStrStartsWith(value: string, searchString: string, position?: number): boolean {
    _throwIfNullOrUndefined(value);

    // Like the native function the value (eg. a String object or a number) and searchString are converted to strings,
    // and the position to a number (so NaN and a value which isn't a number are 0), substring() truncates a fraction
    let pos = +position;
    pos = pos > 0 ? pos : 0;

    // The substring is never longer than the searchString, so it only includes the searchString when they are equal,
    // polyStrIncludes() also throws a TypeError (like the native function) when the searchString is a RegExp
    return polyStrIncludes(strSubstring(asString(value), pos, pos + asString(searchString)[LENGTH]), searchString);
}
