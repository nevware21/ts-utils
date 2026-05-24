/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { polyArrAt } from "../array/at";
import { StrProto } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { mathToInt } from "../math/to_int";
import { asString } from "./as_string";

/**
 * The `strAt()` method takes an integer value and returns a new string consisting of the single
 * UTF-16 code unit located at the specified offset into the string. It accepts both positive and
 * negative integers: negative integers count back from the last string character.
 *
 * This is the equivalent of `String.prototype.at()` and falls back to {@link polyStrAt} in
 * environments where the native method is unavailable.
 *
 * @function
 * @since 0.14.0
 * @group String
 * @param value - The string value to retrieve a character from.
 * @param index - The zero-based index of the character to return. A negative index counts from
 * the end of the string: `-1` returns the last character, `-2` the second-to-last, and so on.
 * @returns A single-character string at the given index, or `undefined` if the index is out of
 * range.
 * @throws `TypeError` if `value` is `null` or `undefined`.
 * @example
 * ```ts
 * strAt("hello", 0);   // "h"
 * strAt("hello", 1);   // "e"
 * strAt("hello", -1);  // "o"  — last character
 * strAt("hello", -2);  // "l"  — second-to-last
 * strAt("hello", 99);  // undefined — out of range
 * strAt("hello", -99); // undefined — out of range
 * ```
 */
export const strAt: (value: string, index: number) => string | undefined = (/*#__PURE__*/_unwrapFunctionWithPoly("at", StrProto as any, polyStrAt));

/**
 * Polyfill implementation of `String.prototype.at()` that returns the character at the given
 * integer index, supporting negative indices which count back from the end of the string.
 *
 * Delegates index normalisation and bounds checking to {@link polyArrAt} by treating the string
 * as an array-like object, matching native `String.prototype.at()` behaviour exactly.
 *
 * @since 0.14.0
 * @group String
 * @group Polyfill
 * @param value - The string value to retrieve a character from.
 * @param index - The zero-based index of the character to return. Negative values count from the
 * end: `-1` is the last character, `-2` is the second-to-last, and so on.
 * @returns A single-character string at the normalised index, or `undefined` if out of range.
 * @throws `TypeError` if `value` is `null` or `undefined`.
 * @example
 * ```ts
 * polyStrAt("hello", 0);   // "h"
 * polyStrAt("hello", -1);  // "o"
 * polyStrAt("hello", -2);  // "l"
 * polyStrAt("hello", 99);  // undefined
 * polyStrAt("hello", -99); // undefined
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyStrAt(value: string, index: number): string | undefined {
    _throwIfNullOrUndefined(value);

    // Reuse the Array.at polyfill for index normalization and bounds behavior.
    return polyArrAt(asString(value), mathToInt(index));
}
