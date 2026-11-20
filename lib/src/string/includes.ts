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
import { DUMP_ERR_MAX_LENGTH, StrProto } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { _pureAssign } from "../internal/treeshake_helpers";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction"
import { asString } from "./as_string";
import { strIndexOf } from "./index_of";

/**
 * The strIncludes() method performs a __case-sensitive__ search to determine whether one string
 * may be found within another string, returning `true` or `false` as appropriate.
 *
 * This method lets you determine whether or not a string includes another string.
 * @function
 * @since 0.9.0
 * @group String
 * @param value - The string value to be searched.
 * @param searchString - A string to be searched for within the value. Cannot be a regex. All
 * values that are not regexes are coerced to strings, so omitting it or passing undefined
 * causes `strIncludes()` to search for the string "undefined", which is rarely what you want.
 * @param position - The position within the string at which to begin searching for searchString. (Defaults to 0.)
 * @returns `true` if the search string is found anywhere within the given string value, including
 * when searchString is an empty string; otherwise, `false`.
 * @throws TypeError If searchString is a regex, or the value is `null` or `undefined`.
 */
export const strIncludes: (value: string, searchString: string, position?: number) => boolean = (/*#__PURE__*/_unwrapFunctionWithPoly("includes", StrProto, polyStrIncludes));

/**
 * The strContains() method performs a __case-sensitive__ search to determine whether one string
 * may be found within another string, returning `true` or `false` as appropriate.
 *
 * This method lets you determine whether or not a string includes another string.
 * @function
 * @since 0.9.0
 * @group String
 * @param value - The string value to be searched.
 * @param searchString - A string to be searched for within the value. Cannot be a regex. All
 * values that are not regexes are coerced to strings, so omitting it or passing undefined
 * causes `strContains()` to search for the string "undefined", which is rarely what you want.
 * @param position - The position within the string at which to begin searching for searchString. (Defaults to 0.)
 * @returns `true` if the search string is found anywhere within the given string value, including
 * when searchString is an empty string; otherwise, `false`.
 * @throws TypeError If searchString is a regex, or the value is `null` or `undefined`.
 */
export const strContains: (value: string, searchString: string, position?: number) => boolean = (/*#__PURE__*/_pureAssign(strIncludes));

/**
 * The polyStrIncludes() method performs a case-sensitive search to determine whether one string
 * may be found within another string, returning `true` or `false` as appropriate.
 * Like the native function the value (eg. a `String` object, a number or an array) is converted to a string, but
 * unlike it a `Symbol` value or searchString is also converted (eg. to `"Symbol(abc)"`) rather than throwing a
 * TypeError.
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
 * @throws TypeError If searchString is a regex, or the value is `null` or `undefined`.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyStrIncludes(value: string, searchString: string, position?: number): boolean {
    _throwIfNullOrUndefined(value);

    // Like the native function the value (eg. a String object, a number or an array) and then the searchString are
    // converted to strings (rather than the value's own indexOf() being used)
    let theValue = asString(value);

    return strIndexOf(theValue, _toSearchString(searchString), position) !== -1;
}

/**
 * @internal
 * @ignore
 * Converts the searchString of the includes(), startsWith() and endsWith() polyfills into a string, like the native
 * functions a RegExp throws a TypeError (rather than its source being searched for) and the value is only converted
 * once (so a toString() function is only called once). It is not annotated as having no side effects, as every caller
 * uses its result (so an annotation wouldn't allow any call to be removed).
 * @param searchString - The value to convert
 * @returns The searchString as a string
 */
export function _toSearchString(searchString: any): string {
    if (isRegExp(searchString)) {
        throwTypeError("'searchString' must not be a regular expression " + dumpObj(searchString, 0, DUMP_ERR_MAX_LENGTH));
    }

    return asString(searchString);
}
