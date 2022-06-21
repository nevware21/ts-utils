/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isString, isUndefined } from "../helpers/base";

/**
 * This method lets you determine whether or not a string begins with another string. This method is case-sensitive.
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the start of the string
 * @param position - [Optional] The position in this string at which to begin searching for `searchString`.
 * Defaults to 0
 * @returns `true` if the given characters are found at the beginning of the string; otherwise, `false`.
 */
export function polyStrStartsWith(value: string, searchString: string, position?: number) {
    let theValue = (isString(value) ? value : "" + value);
    let searchValue = isString(searchString) ? searchString : "" + searchString;
    let chkLen = searchValue.length;
    let pos = position > 0 ? position : 0;

    return theValue.substring(pos, pos + chkLen) === searchValue;
}

/**
 * This method lets you determine whether or not a string ends with another string. This method is case-sensitive.
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the end of `value` string.
 * @param length - If provided, it is used as the length of `value`. Defaults to value.length.
 */
export function polyStrEndsWith(value: string, searchString: string, length?: number) {
    let theValue = (isString(value) ? value : "" + value);
    let searchValue = isString(searchString) ? searchString : "" + searchString;
    let chkLen = searchValue.length;
    let len = theValue.length;
    let end = !isUndefined(length) && length < len ? length : len;

    return theValue.substring(end - chkLen, end) === searchValue;
}