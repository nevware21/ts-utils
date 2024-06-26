/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { EMPTY } from "../internal/constants";
import { asString } from "./as_string";
import { strTrim } from "./trim";
import { strLower, strUpper } from "./upper_lower";

/**
 * @internal
 * @ignore
 * Internal function to escape and convert the case
 * @param value - The value to be converted
 * @param newPrefix - The new prefix to add between matches
 * @param upperWord - Identify whether to uppercase the match
 * @returns The converted string
 */
/*#__NO_SIDE_EFFECTS__*/
function _convertCase<T>(value: T, newPrefix: string, upperWord?: boolean): string {
    return strTrim(asString(value)).replace(/((_|\W)+(\w){0,1}|([a-z])([A-Z]))/g,
        (_match, _g1, _g2, wordStart, upperPrefix, upperLetter) => {
            let convertMatch = wordStart || upperLetter|| EMPTY;
            if (upperWord) {
                convertMatch = strUpper(convertMatch);
            }
            return (upperPrefix || EMPTY) + newPrefix + convertMatch;
        });
}

/**
 * Convert the provided value to a `Letter Cased` string, where the start of each word is
 * capitalized, all non-word character and spaces are retained.
 * If the value is not a string it will be converted.
 * @since 0.9.0
 * @group String
 * @group Conversion
 * @param value - The value to be converted to letter case
 * @returns The Letter Cased version of the provided value
 * @example
 * ```ts
 * strLetterCase(null);             // "Null"
 * strLetterCase(undefined);        // "Undefined"
 * strLetterCase("hello darkness"); // "Hello Darkness"
 * strLetterCase("hello_darkness"); // "Hello_Darkness"
 * strLetterCase("_hello_darkness"); // "_Hello_Darkness"
 * strLetterCase("hello darkness, my old friend."); // "Hello Darkness; // My Old Friend."
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function strLetterCase<T>(value: T): string {
    return asString(value).replace(/(_|\b)\w/g, strUpper);
}

/**
 * Convert the provided value to `camelCased` string, you can optionally specifify whether the
 * first caracter is upper cased (lowercase by default)from kebab `-` or snake `_` case.
 * All whitespace characters are removed
 * If the value is not a string it will be converted.
 * @since 0.9.0
 * @group String
 * @group Conversion
 * @param value - The value to be converted to camelCased string
 * @param upperFirst - Optionally, uppercase the first character of the first word, so when `true`
 * this will produce a Pascal Cased result.
 * @returns The `camelCased` version of the provided value.
 * @example
 * ```ts
 * strCamelCase(null);                  // "null"
 * strCamelCase(undefined);             // "undefined"
 * strCamelCase("hello darkness");      // "helloDarkness"
 * strCamelCase("hello_darkness");      // "helloDarkness"
 * strCamelCase("_hello_darkness");     // "helloDarkness"
 * strCamelCase("hello-darkness");      // "helloDarkness"
 * strCamelCase("-hello-darkness");     // "helloDarkness"
 * strCamelCase("hello darkness, my old friend."); // "helloDarknessMyOldFriend"
 *
 * // Uppercase first character
 * strCamelCase("hello darkness", true); // "HelloDarkness"
 * strCamelCase("hello_darkness", true); // "HelloDarkness"
 * strCamelCase("_hello_darkness", true); // "HelloDarkness"
 * strCamelCase("hello-darkness", true); // "HelloDarkness"
 * strCamelCase("-hello-darkness", true); // "HelloDarkness"
 * strCamelCase("hello darkness, my old friend.", true); // "HelloDarknessMyOldFriend"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function strCamelCase<T>(value: T, upperFirst?: boolean): string {
    let result = _convertCase(value, "", true);

    return result.replace(/^\w/, upperFirst ? strUpper : strLower);
}

/**
 * Convert the provided value to `kebab-cased` string, you can optionally specify whther the result
 * is all uppercased by passing `true` as the optional `scream` argument, otherwise the entire result
 * will be lowercased.
 * If the value is not a string it will be converted.
 * @since 0.9.0
 * @group String
 * @group Conversion
 * @param value - The value to be converted to kebab-case string
 * @param scream - Optionally return the result as UpperCase (Screaming).
 * @returns The `kebab-cased` version of the provided value
 * @example
 * ```ts
 * strKebabCase(null);              // "null"
 * strKebabCase(undefined);         // "undefined"
 * strKebabCase("hello darkness");  // "hello-darkness"
 * strKebabCase("hello_darkness");  // "hello-darkness"
 * strKebabCase("_hello_darkness"); // "-hello-darkness"
 * strKebabCase("hello darkness, my old friend."); // "hello-darkness-my-old-friend-"
 *
 * // Add optional SCREAM flag
 * strKebabCase("hello darkness", true);    // "HELLO-DARKNESS"
 * strKebabCase("hello_darkness", true);    // "HELLO-DARKNESS"
 * strKebabCase("_hello_darkness", true);   // "-HELLO-DARKNESS"
 * strKebabCase("hello darkness, my old friend.", true); // "HELLO-DARKNESS-MY-OLD-FRIEND-"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function strKebabCase<T>(value: T, scream?: boolean): string {
    let result = _convertCase(value, "-");
    return (scream ? strUpper : strLower)(result);
}

/**
 * Convert the provided value to `snake_cased` string, you can optionally specify whther the result
 * is all uppercased by passing `true` as the optional `scream` argument, otherwise the entire result
 * will be lowercased.
 * If the value is not a string it will be converted.
 * @since 0.9.0
 * @group String
 * @group Conversion
 * @param value - The value to be converted to `snake_cased` string
 * @param scream - Optionally return the result as UpperCase (Screaming).
 * @returns The `snake-cased` version of the provided value
 * @example
 * ```ts
 * strSnakeCase(null);              // "null"
 * strSnakeCase(undefined);         // "undefined"
 * strSnakeCase("hello darkness");  // "hello_darkness"
 * strSnakeCase("hello_darkness");  // "hello_darkness"
 * strSnakeCase("_hello_darkness"); // "_hello_darkness"
 * strSnakeCase("hello-darkness");  // "hello_darkness"
 * strSnakeCase("-hello-darkness"); // "_hello_darkness"
 * strSnakeCase("hello darkness, my old friend."); // "hello_darkness_my_old_friend_"
 *
 * // Use optional Scream flag
 * strSnakeCase("hello darkness", true);    // "HELLO_DARKNESS"
 * strSnakeCase("hello_darkness", true);    // "HELLO_DARKNESS"
 * strSnakeCase("_hello_darkness", true);   // "_HELLO_DARKNESS"
 * strSnakeCase("hello-darkness", true);    // "HELLO_DARKNESS"
 * strSnakeCase("-hello-darkness", true);   // "_HELLO_DARKNESS"
 * strSnakeCase("hello darkness, my old friend.", true); // "HELLO_DARKNESS_MY_OLD_FRIEND_"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function strSnakeCase<T>(value: T, scream?: boolean): string {
    let result = _convertCase(value, "_");
    return (scream ? strUpper : strLower)(result);
}
