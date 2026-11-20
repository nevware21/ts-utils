/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * @internal
 * @ignore
 * Returns the length to cut the value at, so that a surrogate pair (eg. an emoji) is not split. When the last code unit
 * which would be kept is a high surrogate the length is reduced by one, so the pair is removed rather than split.
 * @param value - The string value which is being cut
 * @param length - The length to cut the value at
 * @returns The length to cut the value at
 */
/*#__NO_SIDE_EFFECTS__*/
export function _cutLength(value: string, length: number): number {
    // A high surrogate is 0xD800 to 0xDBFF (NaN, when there is no code unit, is not)
    return (value.charCodeAt(length - 1) & 0xFC00) === 0xD800 ? length - 1 : length;
}

/**
 * @internal
 * @ignore
 * Returns the number of code units of the character at the index, this is 2 for a supplementary plane character (a
 * high surrogate `0xD800 - 0xDBFF` followed by a low surrogate `0xDC00 - 0xDFFF`), otherwise (including when the
 * index is not within the value) 1. The low surrogate is only checked after a high surrogate, so this is a single
 * `charCodeAt()` for all other characters.
 * @param value - The string value
 * @param index - The index of the character
 * @returns The number of code units of the character (1 or 2)
 */
/*#__NO_SIDE_EFFECTS__*/
export function _charLen(value: string, index: number): number {
    // NaN, when there is no code unit, is not a surrogate
    return ((value.charCodeAt(index) & 0xFC00) === 0xD800 && (value.charCodeAt(index + 1) & 0xFC00) === 0xDC00) ? 2 : 1;
}
