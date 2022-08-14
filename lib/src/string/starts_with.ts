/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isString } from "../helpers/base";
import { dumpObj } from "../helpers/diagnostics";
import { throwTypeError } from "../helpers/throw";
import { LENGTH, StrProto } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";
import { strSubstring } from "./substring";

const STARTS_WITH = "startsWith";

/**
 * This method lets you determine whether or not a string begins with another string. This method is case-sensitive.
 * @group String
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the start of the string
 * @param position - [Optional] The position in this string at which to begin searching for `searchString`.
 * Defaults to 0
 * @returns `true` if the given characters are found at the beginning of the string; otherwise, `false`.
 */
export const strStartsWith: (value: string, searchString: string, length?: number) => boolean = StrProto[STARTS_WITH] ? _unwrapFunction(STARTS_WITH) : polyStrStartsWith;

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
export function polyStrStartsWith(value: string, searchString: string, position?: number): boolean {
    if (!isString(value)) {
        throwTypeError("'" + dumpObj(value) + "' is not a string");
    }
    let searchValue = isString(searchString) ? searchString : "" + searchString;
    let chkLen = searchValue[LENGTH];
    let pos = position > 0 ? position : 0;

    return strSubstring(value, pos, pos + chkLen) === searchValue;
}
