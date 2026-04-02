/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { LENGTH } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { arrForEach } from "../array/forEach";
import { strEndsWith } from "./ends_with";
import { strStartsWith } from "./starts_with";

/**
 * Checks whether the string starts with any of the provided search values.
 * @since 0.14.0
 * @group String
 * @param value - The string value to be checked.
 * @param searchValues - An array-like list of values to check at the start of the string.
 * @param position - The position in this string at which to begin searching. Defaults to 0.
 * @returns True if any value matches at the start; otherwise false.
 * @throws TypeError If value is null or undefined.
 */
/*#__NO_SIDE_EFFECTS__*/
export function strStartsWithAny(value: string, searchValues: ArrayLike<string>, position?: number): boolean {
    _throwIfNullOrUndefined(value);

    let result = false;
    if (searchValues && searchValues[LENGTH]) {
        arrForEach(searchValues, (searchValue) => {
            if (strStartsWith(value, searchValue, position)) {
                result = true;
                return -1;
            }
        });
    }

    return result;
}

/**
 * Checks whether the string ends with any of the provided search values.
 * @since 0.14.0
 * @group String
 * @param value - The string value to be checked.
 * @param searchValues - An array-like list of values to check at the end of the string.
 * @param length - If provided, it is used as the length of value. Defaults to value.length.
 * @returns True if any value matches at the end; otherwise false.
 * @throws TypeError If value is null or undefined.
 */
/*#__NO_SIDE_EFFECTS__*/
export function strEndsWithAny(value: string, searchValues: ArrayLike<string>, length?: number): boolean {
    _throwIfNullOrUndefined(value);

    let result = false;
    if (searchValues && searchValues[LENGTH]) {
        arrForEach(searchValues, (searchValue) => {
            if (strEndsWith(value, searchValue, length)) {
                result = true;
                return -1;
            }
        });
    }

    return result;
}
