/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { EMPTY, LENGTH } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { asString } from "./as_string";
import { strIndexOf } from "./index_of";

/**
 * Count the number of non-overlapping occurrences of a substring within the provided value.
 *
 * The search value is converted using `asString()`. An empty search string returns `0` to avoid an
 * unbounded match count.
 * @since 0.14.0
 * @group String
 * @param value - The string value to search within.
 * @param searchString - The substring to count.
 * @returns The number of non-overlapping substring occurrences.
 * @example
 * ```ts
 * strCount("hello hello", "hello"); // 2
 * strCount("aaaa", "aa"); // 2
 * strCount("banana", "ana"); // 1
 * strCount("abc", ""); // 0
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function strCount(value: string, searchString: string): number {
    _throwIfNullOrUndefined(value);

    let count = 0;
    let pos = 0;
    let matcher = asString(searchString);

    if (matcher !== EMPTY) {
        let theValue = asString(value);
        while ((pos = strIndexOf(theValue, matcher, pos)) !== -1) {
            count++;
            pos += matcher[LENGTH];
        }
    }

    return count;
}