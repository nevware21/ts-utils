/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { EMPTY } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";

/*#__NO_SIDE_EFFECTS__*/
function _createTrimFn(exp: RegExp): (value: string) => string {
    return function _doTrim(value: string): string {
        _throwIfNullOrUndefined(value);
    
        if (value && value.replace) {
            value = value.replace(exp, EMPTY);
        }
    
        return value;
    }
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
export const polyStrTrim = (/*#__PURE__*/_createTrimFn(/^\s+|(?=\s)\s+$/g));

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
export const polyStrTrimStart = (/*#__PURE__*/_createTrimFn(/^\s+/g));
 
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
export const polyStrTrimEnd = (/*#__PURE__*/_createTrimFn(/(?=\s)\s+$/g));
