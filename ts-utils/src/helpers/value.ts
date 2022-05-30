/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isArray, isDate, isNullOrUndefined, isObject } from "./base";
import { objKeys } from "./object";

/**
 * Return whether the value appears to have any `value`, this helper return true for
 * - An array with a length >= 1
 * - A valid Date
 * - An object with at least 1 key of it's onw property (hasOwnProperty)
 * - Is truthy (not null, undefined, numeric zero, empty string)
 * @param value
 */
export function hasValue(value: any): boolean {
    let result = value === false;

    if (!result && !isNullOrUndefined(value)) {
        if (isArray(value)) {
            result = !!value.length;
        } else if (isDate(value)) {
            result = !isNaN(value.getTime());
        } else if (isObject(value)) {
            return !!objKeys(value).length;
        } else {
            result = !!value;
        }
    }

    return result;
}
