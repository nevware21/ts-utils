/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { EMPTY, LENGTH, SUBSTRING } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { asString } from "../string/as_string";
import { strReplace } from "../string/replace";

// A single whitespace (or line terminator) character, the characters which the native trim functions remove
const WHITESPACE = /\s/;

/*#__NO_SIDE_EFFECTS__*/
function _createTrimFn(trimStart: boolean, trimEnd?: boolean): (value: string) => string {
    return function _doTrim(value: string): string {
        _throwIfNullOrUndefined(value);
        value = asString(value);

        if (value && trimStart) {
            // Anchored to the start, so it is only tried at the first character
            value = strReplace(value, /^\s+/, EMPTY);
        }

        if (value && trimEnd) {
            // The whitespace at the end is found by searching backwards from the end, as a regular expression which
            // matches it (eg. /\s+$/g) is tried at each position, which takes quadratic time for a string with a long
            // run of whitespace before its end (eg. ~7s for 80k spaces followed by "x ")
            let len = value[LENGTH];
            while (len && WHITESPACE.test(value[len - 1])) {
                len--;
            }

            value = value[SUBSTRING](0, len);
        }

        return value;
    };
}

/**
 * The trim() method removes whitespace from both ends of a string and returns a new string,
 * without modifying the original string. Whitespace in this context is all the whitespace
 * characters (space, tab, no-break space, etc.) and all the line terminator characters
 * (LF, CR, etc.).
 * @function
 * @group Polyfill
 * @group String
 * @param value - The string value to be trimmed.
 * @returns A new string representing str stripped of whitespace from both its beginning and end.
 * If neither the beginning or end of str has any whitespace, a new string is still returned (essentially
 * a copy of str), with no exception being thrown.
 * To return a new string with whitespace trimmed from just one end, use `strTrimStart()` or `strTrimEnd()`.
 */
export const polyStrTrim = (/*#__PURE__*/_createTrimFn(true, true));

/**
 * The `polyStrTrimStart()` method removes whitespace from the beginning of a string.
 * @function
 * @group Polyfill
 * @group String
 * @param value - The value to be trimmed.
 * @returns A new string representing str stripped of whitespace from its beginning (left side).
 * If the beginning of str has no whitespace, a new string is still returned (essentially a copy of str),
 * with no exception being thrown.
 */
export const polyStrTrimStart = (/*#__PURE__*/_createTrimFn(true));
 
/**
 * The `polyStrTrimEnd()` method removes whitespace from the end of a string.
 * @function
 * @group Polyfill
 * @group String
 * @param value - The value to be trimmed.
 * @returns A new string representing str stripped of whitespace from its end (right side).
 * If the end of str has no whitespace, a new string is still returned (essentially a copy of str),
 * with no exception being thrown.
 */
export const polyStrTrimEnd = (/*#__PURE__*/_createTrimFn(false, true));
