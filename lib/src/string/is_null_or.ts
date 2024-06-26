/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isNullOrUndefined, isString } from "../helpers/base";
import { EMPTY } from "../internal/constants";

/**
 * This method checks if the string `value` is null, undefined, an empty string or only contains
 * whiltespace `\t \r \n \f \v` characters.
 * @group String
 * @param value - The string value to be checked.
 * @returns `true` if the string is null, undefined an empty string or contains only whitespace characters.
 */
/*#__NO_SIDE_EFFECTS__*/
export function strIsNullOrWhiteSpace(value: string): boolean {
    if (isString(value)) {
        return value.replace(/[\s\t\r\n\f]+/g, EMPTY) === EMPTY;
    }

    return isNullOrUndefined(value)
}

/**
 * Checks whether the passed `value` is null, undefined or an empty string.
 * @group String
 * @param value - The string value to be checked.
 * @returns `true` if the string is null, undefined or an empty string.
 */
/*#__NO_SIDE_EFFECTS__*/
export function strIsNullOrEmpty(value: string): boolean {
    if (isString(value)) {
        return value === EMPTY;
    }

    return isNullOrUndefined(value)
}

