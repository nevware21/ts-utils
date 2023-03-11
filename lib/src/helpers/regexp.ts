/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { EMPTY } from "../internal/constants";
import { asString } from "../string/as_string";

const MATCH_ANY = "(.*)";
const MATCH_SINGLE = "(.)";

/**
 * @internal
 * @ignore
 * Internal function to translate the string and create the Regular Expression
 * @param value - The value to be converted into a RegExp, if the value is not a
 * string it will coerced to a string.
 * @param escapeRgx - The escape regular expression to convert values to not convert
 * @param replaceFn - The function to call to perform any final conversion.
 * @param ignoreCase - Flag to indicate whether the regular expression should be case-sensitive.
 * @param fullMatch - Flag to identify whether the RegExp should be wrapped with `^` and `$` to incidate an entire match
 * @returns The new Regular Expression created from the provided value.
 */
function _createRegExp(value: string, escapeRgx: RegExp, replaceFn: (value: string) => string, ignoreCase: boolean, fullMatch?: boolean) {
    // eslint-disable-next-line security/detect-non-literal-regexp
    return new RegExp(
        (fullMatch ? "^" : EMPTY) + replaceFn(value.replace(escapeRgx, "\\$1")) + (fullMatch ? "$" : EMPTY),
        ignoreCase ? "i" : "");
}

/**
 * Create a simple wildcard regular expression from the string value, converting any embedded wildcard
 * `'*'` characters to match any character zero or more times (including folder seperators `'/'` or `'\'`),
 * while escaping all other characters.
 * The supported matching values are
 * - `'*'` Matches any characters zero or more times (including folder seperators '`'/`' or `'\'`)
 * @since 0.9.0
 * @group RegExp
 * @param value - The value to be converted into a RegExp, if the value is not a string it will coerced
 * to a string.
 * @param ignoreCase - Flag to indicate whether the regular expression should be case-sensitive, Defaults
 * to false.
 * @param fullMatch - Flag to identify whether the RegExp should be wrapped with `'^'` and `'$'` to
 * incidate match the entire string only.
 * @returns The new Regular Expression created from the provided value.
 * @example
 * ```ts
 * let regex = createWildcardRegex("Hello*");
 *
 * let matches = regex.exec("Hello");
 * matches[0]; // "Hello";
 * matches[1]; // ""
 *
 * let matches = regex.exec("Hello Darkness");
 * matches[0]; // "Hello Darkness"
 * matches[1]; // " Darkness"
 *
 * let matches = regex.exec("Darkness Hello");
 * matches[0];  // "Hello"
 * matches[1]; // ""
 *
 * let regex.exec("Darkness Hello.");
 * matches[0]; // "Hello."
 * matches[1]; // "."
 * ```
 */
export function createWildcardRegex(value: string, ignoreCase?: boolean, fullMatch?: boolean) {
    return _createRegExp(asString(value), /([-+|^$#.\?{}()\[\]\\/\"\'])/g, (value: string) => {
        return value.replace(/\*/g, MATCH_ANY);
    }, !!ignoreCase, fullMatch);
}

/**
 * Create a simple filename style regular expression from the string value, converting any embedded
 * filename wildcard characters `'*'` and `'?'`.
 * If the source string contains folder seperators both `'/'` and `'\'` are treated as synonomous.
 * Each wildcard match will be captured as it's own group.
 * The supported matching values are
 * - `'*'` Matches any characters zero or more times (including folder seperators '`'/`' or `'\'`)
 * - `'?'` Matches any single character once only (including folder seperators `'/'` or `'\'`)
 * - `'/'` Matches either `'/'` or `'\'` character, not captured as a group
 * - `'\'` Matches either `'/'` or `'\'` character, not captured as a group
 *
 * @since 0.9.0
 * @group RegExp
 * @param value - The string value to converted
 * @param ignoreCase - Flag to indicate whether the regular expression should be case-sensitive, Defaults
 * to false.
 * @param fullMatch - Flag to identify whether the RegExp should be wrapped with `'^'` and `'$'` to
 * incidate match the entire string only.
 * @returns The new Regular Expression created from the provided value.
 * @example
 * ```ts
 * let regex = createFilenameRegex("*.txt");
 *
 * lat matches = regex.exec("Hello");
 * matches; // null
 *
 * let matches = regex.exec("ug.txt");
 * matches[0]; // "ug.txt"
 * matches[1]; // "ug"
 *
 * let matches = regex.exec(" ug.txt ");
 * matches[0]; // " ug.txt"
 * matches[1]; // " ug"
 *
 * let matches = regex.exec("C:\\temp\\ug.txt");
 * matches[0]; // "C:\\temp\\ug.txt"
 * matches[1]; // "C:\\temp\\ug"
 *
 * let matches = regex.exec("/var/log/ug.txt");
 * matches[0]; // "/var/log/ug.txt"
 * matches[1]; // "/var/log/ug"
 * ```
 */
export function createFilenameRegex(value: string, ignoreCase?: boolean, fullMatch?: boolean) {
    return _createRegExp(asString(value), /([-+|^$#.{}()\\\/\[\]\"\'])/g, (value: string) => {
        return value.replace(/(\\\\|\\\/|\*|\?)/g, function (_all, g1) {
            if (g1 == "\\/" || g1 == "\\\\") {
                return "[\\\\\\/]{1}";
            }
            return g1 == "*" ? MATCH_ANY : MATCH_SINGLE;
        });
    }, !!ignoreCase, fullMatch);
}

/**
 * Create a simple glob style regular expression from the string value, converting `'**'`, `'*'` and `'?'`
 * characters. Unlike {@link createFilenameRegex} the `'*'` and `'?'` will NOT match folder seperator
 * characters `'/'` and `'\'`.
 * If the source string contains folder seperators both `'/'` and `'\'` are treated as synonomous
 * Each wildcard match will be captured as it's own group.
 * The supported matching values are
 * - `'**'` Matches any characters zero or more times include folder seperators `'/'` or `'\'`
 * - `'*'` Matches any characters zero or more times, except `'/'` or `'\'`
 * - `'?'` Matches any single character once only, except `'/'` or `'\'`
 * - `'/'` Matches either `'/'` or `'\'` character, not captured as a group
 * - `'\'` Matches either `'/'` or `'\'` character, not captured as a group
 *
 * @since 0.9.0
 * @group RegExp
 * @param value - The string value to converted.
 * @param ignoreCase - Flag to indicate whether the regular expression should be case-sensitive, Defaults
 * to false.
 * @param fullMatch - Flag to identify whether the RegExp should be wrapped with `'^'` and `'$'` to
 * incidate match the entire string only.
 * @returns The new Regular Expression created from the provided value.
 * @example
 * ```ts
 * let regex = makeGlobRegex("src\\**\\*.ts");
 *
 * let matches = regex.exec("Hello");
 * matches; // null
 *
 * let matches = regex.exec("Src/index.ts");
 * matches; // null - Specify the ignoreCase if you want this to match
 *
 * let matches = regex.exec("src/index.ts");
 * matches[0]; // "src/index.ts"
 * matches[1]; // undefined;
 * matches[2]; // "index"
 *
 * let matches = regex.exec("src\\index.ts");
 * matches[0]; // "src\\index.ts"
 * matches[1]; // undefined;
 * matches[2]; // "index"
 *
 * let matches = regex.exec("src/helpers/regexp.ts");
 * matches[0]; // "src/helpers/regexp.ts"
 * matches[1]; // "helpers/"
 * matches[2]; // "regexp"
 *
 * let matches = regex.exec("src\\helpers/regexp.ts");
 * matches[0]; // "src\\helpers/regexp.ts"
 * matches[1]; // "helpers/"
 * matches[2]; // "regexp"
 *
 * let matches = regex.exec(" src/index.tsx ");
 * matches[0]; // "src/index.ts"
 * matches[1]; // undefined
 * matches[2]; // "index"
 *
 * let matches = regex.exec(" src/helpers/regexp.ts. ");
 * matches[0]; // "src/helpers/regexp.ts"
 * matches[1]; // "helpers/"
 * matches[2]; // "regexp"]);
 * ```
 */
export function makeGlobRegex(value: string, ignoreCase?: boolean, fullMatch?: boolean) {
    return _createRegExp(asString(value), /([-+|^$#.{}()\\\/\[\]\"\'])/g, (value: string) => {
        //"**\/*\.txt"
        return value.replace(/(\*\*\\[\\\/]|\\\\|\\\/|\*\*|\*|\?)/g, function (_all, g1) {
            if (g1 == "**\\/" || g1 == "**\\\\") {
                return "(.*[\\\\\\/])*";
            }
            
            if (g1 === "\\/" || g1 == "\\\\") {
                return "[\\\\\\/]{1}";
            }
            
            if (g1 === "**") {
                return MATCH_ANY;
            }

            return g1 === "*" ? "([^\\\\\\/]*)" : "([^\\\\\\/]{1})";
        });
    }, !!ignoreCase, fullMatch);
}
