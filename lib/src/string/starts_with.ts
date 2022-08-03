/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isString } from "../helpers/base";
import { StrProto } from "../internal/constants";

const _strStartsWith = StrProto.startsWith;

/**
 * This method lets you determine whether or not a string begins with another string. This method is case-sensitive.
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the start of the string
 * @param position - [Optional] The position in this string at which to begin searching for `searchString`.
 * Defaults to 0
 * @returns `true` if the given characters are found at the beginning of the string; otherwise, `false`.
 */
export function strStartsWith(value: string, searchString: string, position?: number): boolean {
    let theValue = (isString(value) ? value : "" + value);

    return _strStartsWith ? _strStartsWith.call(theValue, searchString, position) : polyStrStartsWith(theValue, searchString, position);
}

/**
 * This method lets you determine whether or not a string begins with another string. This method is case-sensitive.
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the start of the string
 * @param position - [Optional] The position in this string at which to begin searching for `searchString`.
 * Defaults to 0
 * @returns `true` if the given characters are found at the beginning of the string; otherwise, `false`.
 */
export function polyStrStartsWith(value: string, searchString: string, position?: number): boolean {
    let theValue = (isString(value) ? value : "" + value);
    let searchValue = isString(searchString) ? searchString : "" + searchString;
    let chkLen = searchValue.length;
    let pos = position > 0 ? position : 0;

    return theValue.substring(pos, pos + chkLen) === searchValue;
}
