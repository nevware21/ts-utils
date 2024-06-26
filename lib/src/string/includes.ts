/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isRegExp } from "../helpers/base";
import { dumpObj } from "../helpers/diagnostics";
import { throwTypeError } from "../helpers/throw";
import { StrProto } from "../internal/constants";
import { _pureAssign } from "../internal/treeshake_helpers";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction"
import { asString } from "./as_string";
import { strIndexOf } from "./index_of";

/**
 * The strIncludes() method performs a __case-sensitive__ search to determine whether one string
 * may be found within another string, returning `true` or `false` as appropriate.
 *
 * This method lets you determine whether or not a string includes another string.
 * @since 0.9.0
 * @group String
 * @param value - The string value to be searched.
 * @param searchString - A string to be searched for within the value. Cannot be a regex. All
 * values that are not regexes are coerced to strings, so omitting it or passing undefined
 * causes `strIncludes()` to search for the string "undefined", which is rarely what you want.
 * @param position - The position within the string at which to begin searching for searchString. (Defaults to 0.)
 * @returns `true` if the search string is found anywhere within the given string value, including
 * when searchString is an empty string; otherwise, `false`.
 * @throws TypeError If searchString is a regex.
 */
export const strIncludes: (value: string, searchString: string, position?: number) => boolean = (/*#__PURE__*/_unwrapFunctionWithPoly("includes", StrProto, polyStrIncludes));

/**
 * The strContains() method performs a __case-sensitive__ search to determine whether one string
 * may be found within another string, returning `true` or `false` as appropriate.
 *
 * This method lets you determine whether or not a string includes another string.
 * @since 0.9.0
 * @group String
 * @param value - The string value to be searched.
 * @param searchString - A string to be searched for within the value. Cannot be a regex. All
 * values that are not regexes are coerced to strings, so omitting it or passing undefined
 * causes `strContains()` to search for the string "undefined", which is rarely what you want.
 * @param position - The position within the string at which to begin searching for searchString. (Defaults to 0.)
 * @returns `true` if the search string is found anywhere within the given string value, including
 * when searchString is an empty string; otherwise, `false`.
 * @throws TypeError If searchString is a regex.
 */
export const strContains: (value: string, searchString: string, position?: number) => boolean = (/*#__PURE__*/_pureAssign(strIncludes));

/**
 * The polyStrIncludes() method performs a case-sensitive search to determine whether one string
 * may be found within another string, returning `true` or `false` as appropriate.
 * @since 0.9.0
 * @group String
 * @group Polyfill
 * @param value - The string value to be searched.
 * @param searchString - A string to be searched for within the value. Cannot be a regex. All
 * values that are not regexes are coerced to strings, so omitting it or passing undefined
 * causes `strIncludes()` to search for the string "undefined", which is rarely what you want.
 * @param position - The position within the string at which to begin searching for searchString. (Defaults to 0.)
 * @returns `true` if the search string is found anywhere within the given string value, including
 * when searchString is an empty string; otherwise, `false`.
 * @throws TypeError If searchString is a regex.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyStrIncludes(value: string, searchString: string, position?: number): boolean {
    if (isRegExp(searchString)) {
        throwTypeError("'searchString' must not be a regular expression" + dumpObj(searchString))
    }

    return strIndexOf(value, asString(searchString), position) !== -1;
}
