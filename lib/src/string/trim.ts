/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { StrProto } from "../internal/constants";
import { _pureAssign } from "../internal/treeshake_helpers";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "../polyfills/trim";

/**
 * The strTrim() method removes whitespace from both ends of a string and returns a new string,
 * without modifying the original string. Whitespace in this context is all the whitespace
 * characters (space, tab, no-break space, etc.) and all the line terminator characters
 * (LF, CR, etc.).
 *
 * @function
 * @group String
 * @param value - The string value to be trimmed.
 * @returns A new string representing str stripped of whitespace from both its beginning and end.
 * If neither the beginning or end of str has any whitespace, a new string is still returned (essentially
 * a copy of str), with no exception being thrown.
 * To return a new string with whitespace trimmed from just one end, use `strTrimStart()` or `strTrimEnd()`.
 */
export const strTrim: (value: string) => string = (/*#__PURE__*/_unwrapFunctionWithPoly("trim", StrProto, polyStrTrim));

/**
 * The `strTrimStart()` method removes whitespace from the beginning of a string.
 *
 * @function
 * @group String
 * @param value - The value to be trimmed.
 * @returns A new string representing str stripped of whitespace from its beginning (left side).
 * If the beginning of str has no whitespace, a new string is still returned (essentially a copy of str),
 * with no exception being thrown.
 */
export const strTrimStart: (value: string) => string = (/*#__PURE__*/_unwrapFunctionWithPoly("trimStart", StrProto, polyStrTrimStart));

/**
 * Alias for `strTrimStart()` method removes whitespace from the beginning of a string.
 *
 * @function
 * @group String
 * @param value - The value to be trimmed.
 * @returns A new string representing str stripped of whitespace from its beginning (left side).
 * If the beginning of str has no whitespace, a new string is still returned (essentially a copy of str),
 * with no exception being thrown.
 */
export const strTrimLeft = (/*#__PURE__*/_pureAssign(strTrimStart));

/**
 * The `strTrimEnd()` method removes whitespace from the end of a string.
 *
 * @function
 * @group String
 * @param value - The value to be trimmed.
 * @returns A new string representing str stripped of whitespace from its end (right side).
 * If the end of str has no whitespace, a new string is still returned (essentially a copy of str),
 * with no exception being thrown.
 */
export const strTrimEnd: (value: string) => string = (/*#__PURE__*/_unwrapFunctionWithPoly("trimEnd", StrProto, polyStrTrimEnd));

/**
 * Alias for `strTrimEnd()` method removes whitespace from the end of a string.
 *
 * @function
 * @group String
 * @param value - The value to be trimmed.
 * @returns A new string representing str stripped of whitespace from its end (right side).
 * If the end of str has no whitespace, a new string is still returned (essentially a copy of str),
 * with no exception being thrown.
 */
export const strTrimRight = (/*#__PURE__*/_pureAssign(strTrimEnd));
