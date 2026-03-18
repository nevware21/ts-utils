/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { StrProto } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";

/**
 * The strReplace() method returns a new string with one, some, or all matches of a pattern replaced
 * by a replacement.
 * @function
 * @since 0.14.0
 * @group String
 * @param value - The string value to search and replace within.
 * @param searchValue - The value to search for. Can be a string or regular expression.
 * @param replaceValue - The replacement string or replacer function.
 * @returns A new string with one, some, or all matches replaced.
 * @example
 * ```ts
 * strReplace("a-b-a", "a", "x");         // "x-b-a"
 * strReplace("a1b2", /\d/g, "#");        // "a#b#"
 * strReplace("hello", /[aeiou]/, "*");    // "h*llo"
 * ```
 */
export const strReplace: (value: string, searchValue: string | RegExp, replaceValue: string | ((substring: string, ...args: any[]) => string)) => string = (/*#__PURE__*/_unwrapFunction("replace", StrProto as any));
