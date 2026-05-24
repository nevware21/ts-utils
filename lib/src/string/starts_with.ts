/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isString } from "../helpers/base";
import { LENGTH, StrProto } from "../internal/constants";
import { _throwIfNotString } from "../internal/throwIf";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { asString } from "./as_string";
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
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyStrStartsWith(value: string, searchString: string, position?: number): boolean {
    _throwIfNotString(value);

    let searchValue = isString(searchString) ? searchString : asString(searchString);
    let pos = position > 0 ? position : 0;

    return strSubstring(value, pos, pos + searchValue[LENGTH]) === searchValue;
}
