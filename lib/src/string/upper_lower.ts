/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { StrProto } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";

/**
 * The strUpper() method returns the calling string value converted to uppercase.
 * (the value will be converted to a string if it isn't one).
 * 
 * @function
 * @since 0.9.0
 * @group String
 * @group Conversion
 * @param value - The string value to be converted to uppercase.
 * @return A new string representing the calling string converted to upper case.
 * @throws TypeError - When called on null or undefined.
 * @example
 * ```ts
 * strUpper("Hello");       // HELLO
 * strUpper("darkness");    // DARKNESS
 *
 * strUpper(null);          // Throws TypeError
 * strUpper(undefined);     // Throws TypeError
 * ```
 */
export const strUpper: <T>(value: T) => string = (/*#__PURE__*/_unwrapFunction("toUpperCase", StrProto));

/**
 * The strLower() method returns the value of the string converted to lower case.
 * strLower() does not affect the value of the string str itself.
 * 
 * @function
 * @since 0.9.0
 * @group String
 * @group Conversion
 * @return A new string representing the calling string converted to lower case.
 * @throws TypeError - When called on null or undefined.
 * @example
 * ```ts
 * strLower("Hello");       // hello
 * strLower("darkness");    // darkness
 *
 * strLower(null);          // Throws TypeError
 * strLower(undefined);     // Throws TypeError
 * ```
 */
export const strLower: <T>(value: T) => string = (/*#__PURE__*/_unwrapFunction("toLowerCase", StrProto));
