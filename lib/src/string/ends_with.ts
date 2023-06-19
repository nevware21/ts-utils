/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isString, isUndefined } from "../helpers/base";
import { dumpObj } from "../helpers/diagnostics";
import { throwTypeError } from "../helpers/throw";
import { LENGTH, StrProto } from "../internal/constants";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { asString } from "./as_string";
import { strSubstring } from "./substring";

/**
 * This method lets you determine whether or not a string ends with another string. This method is case-sensitive.
 * @group String
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the end of `value` string.
 * @param length - If provided, it is used as the length of `value`. Defaults to value.length.
 */
export const strEndsWith: (value: string, searchString: string, length?: number) => boolean = _unwrapFunctionWithPoly("endsWith", StrProto, polyStrEndsWith);

/**
 * This method lets you determine whether or not a string ends with another string. This method is case-sensitive.
 * @group Polyfill
 * @group String
 * @param value - The value to be checked
 * @param searchString - The characters to be searched for at the end of `value` string.
 * @param length - If provided, it is used as the length of `value`. Defaults to value.length.
 */
export function polyStrEndsWith(value: string, searchString: string, length?: number): boolean {
    if (!isString(value)) {
        throwTypeError("'" + dumpObj(value) + "' is not a string");
    }

    let searchValue = isString(searchString) ? searchString : asString(searchString);
    let chkLen = searchValue[LENGTH];
    let len = value[LENGTH];
    let end = !isUndefined(length) && length < len ? length : len;

    return strSubstring(value, end - chkLen, end) === searchValue;
}
