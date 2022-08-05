/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isString, isUndefined } from "../helpers/base";
import { StrProto } from "../internal/constants";

const _strEndsWith = StrProto.endsWith;

/**
 * This method lets you determine whether or not a string ends with another string. This method is case-sensitive.
 * @group String
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the end of `value` string.
 * @param length - If provided, it is used as the length of `value`. Defaults to value.length.
 */
export function strEndsWith(value: string, searchString: string, length?: number): boolean {
    let theValue = (isString(value) ? value : "" + value);

    return _strEndsWith ? _strEndsWith.call(theValue, searchString, length) : polyStrEndsWith(theValue, searchString, length);
}

/**
 * This method lets you determine whether or not a string ends with another string. This method is case-sensitive.
 * @group Polyfill
 * @group String
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the end of `value` string.
 * @param length - If provided, it is used as the length of `value`. Defaults to value.length.
 */
export function polyStrEndsWith(value: string, searchString: string, length?: number): boolean {
    let theValue = (isString(value) ? value : "" + value);
    let searchValue = isString(searchString) ? searchString : "" + searchString;
    let chkLen = searchValue.length;
    let len = theValue.length;
    let end = !isUndefined(length) && length < len ? length : len;

    return theValue.substring(end - chkLen, end) === searchValue;
}
