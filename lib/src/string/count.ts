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
 * Both `value` and `searchString` are converted to strings using {@link asString} before searching.
 * If the converted search string is empty, this function returns `0` to avoid an unbounded match
 * count. The `value` parameter must not be `null` or `undefined`, while `searchString` may be
 * `null` or `undefined` and will be stringified (for example, to `"null"` or `"undefined"`).
 * @since 0.14.0
 * @group String
 * @param value - The value to search within. Must not be `null` or `undefined`; it is coerced to a
 * string using {@link asString} before searching.
 * @param searchString - The substring to count. It is coerced to a string using {@link asString};
 * if `null` or `undefined`, it is stringified (for example, to `"null"` or `"undefined"`). If the
 * resulting string is empty, `0` is returned.
 * @returns The number of non-overlapping substring occurrences.
 * @throws {TypeError} If `value` is `null` or `undefined`.
 * @example
 * ```ts
 * strCount("hello hello", "hello"); // 2
 * strCount("aaaa", "aa"); // 2
 * strCount("banana", "ana"); // 1
 * strCount("abc", ""); // 0
 * strCount("null hello null", null as any); // 2 - searchString is coerced to "null"
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