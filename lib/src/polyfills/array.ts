/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isNullOrUndefined, objToString } from "../helpers/base";

/**
 * Polyfill support function for Array.isArray
 * @group Polyfill
 * @group Array
 * @param value - The value to be checked
 * @returns true if the value is an array otherwise false.
 */
export function polyIsArray<T>(value: any): value is T[] {
    if (isNullOrUndefined(value)) {
        return false;
    }

    return objToString(value) === "[object Array]";
}

