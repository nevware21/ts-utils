/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { PROTOTYPE } from "../internal/constants";
import { polyStrEndsWith, polyStrStartsWith } from "../polyfills/string";
import { isNullOrUndefined, isString } from "./base";

const EMPTY = "";
const StrProto = String[PROTOTYPE];
const _strTrim = StrProto.trim;
const _strEndsWith = StrProto.endsWith;
const _strStartsWith = StrProto.startsWith;

/**
 * This method checks if the string `value` is null, undefined, an empty string or only contains
 * whiltespace `\t \r \n \f \v` characters.
 * @param value - The string value to be checked.
 * @returns `true` if the string is null, undefined an empty string or contains only whitespace characters.
 */
export function strIsNullOrWhiteSpace(value: string): boolean {
    if (isString(value)) {
        return value.replace(/[\s\t\r\n\f]+/g, EMPTY) === EMPTY;
    }

    return isNullOrUndefined(value)
}

/**
 * Checks whether the passed `value` is null, undefined or an empty string.
 * @param value - The string value to be checked.
 * @returns `true` if the string is null, undefined or an empty string.
 */
export function strIsNullOrEmpty(value: string): boolean {
    if (isString(value)) {
        return value === EMPTY;
    }

    return isNullOrUndefined(value)
}

/**
 * This method lets you determine whether or not a string begins with another string. This method is case-sensitive.
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the start of the string
 * @param position - [Optional] The position in this string at which to begin searching for `searchString`.
 * Defaults to 0
 * @returns `true` if the given characters are found at the beginning of the string; otherwise, `false`.
 */
export function strStartsWith(value: string, searchString: string, position?: number) {
    let theValue = (isString(value) ? value : "" + value);

    return _strStartsWith ? _strStartsWith.call(theValue, searchString, position) : polyStrStartsWith(theValue, searchString, position);
}

/**
 * This method lets you determine whether or not a string ends with another string. This method is case-sensitive.
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the end of `value` string.
 * @param length - If provided, it is used as the length of `value`. Defaults to value.length.
 */
export function strEndsWith(value: string, searchString: string, length?: number) {
    let theValue = (isString(value) ? value : "" + value);

    return _strEndsWith ? _strEndsWith.call(theValue, searchString, length) : polyStrEndsWith(theValue, searchString, length);
}