/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { asString } from "./as_string";
import { strLower, strUpper } from "./upper_lower";

let _wordChar: RegExp;
let _numberChar: RegExp;
let _markChar: RegExp;

function _isWordChar(value: string): boolean {
    if (!_wordChar) {
        try {
            _wordChar = new RegExp("^[\\p{L}\\p{N}\\p{M}]$", "u");
            _numberChar = new RegExp("^\\p{N}$", "u");
            _markChar = new RegExp("^\\p{M}$", "u");
        } catch (_e) {
            _wordChar = /^(?:[a-zA-Z0-9\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02ff\u0370-\u052f\u0590-\u1fff\u2c00-\u2dff\u3040-\u30fa\u30fc-\ud7ff\uf900-\ufdcf\ufdf0-\uffef]|[\u0300-\u036f])$/;
            _numberChar = /^[0-9\u0660-\u0669\u06f0-\u06f9\uff10-\uff19]$/;
            _markChar = /^[\u0300-\u036f]$/;
        }
    }

    return _wordChar.test(value) || (value.length === 2 && strLower(value) !== strUpper(value));
}

function _charAt(value: string, index: number): string {
    let first = value.charCodeAt(index);
    let second = value.charCodeAt(index + 1);
    return first >= 0xd800 && first <= 0xdbff && second >= 0xdc00 && second <= 0xdfff ?
        value.substring(index, index + 2) : value.charAt(index);
}

function _appendWord(result: string, value: string, start: number, end: number, newPrefix: string, upperWord?: boolean): string {
    let word = strLower(value.substring(start, end));
    if (result) {
        if (upperWord) {
            let first = _charAt(word, 0);
            word = strUpper(first) + word.substring(first.length);
        }
        result += newPrefix;
    }
    return result + word;
}

/*#__NO_SIDE_EFFECTS__*/
function _convertCase<T>(value: T, newPrefix: string, upperWord?: boolean): string {
    let input = asString(value);
    let result = "";
    let start = -1;
    let prevType = 0;
    let run = 0;
    let upperStart = -1;
    let previous = 0;

    for (let idx = 0; idx < input.length;) {
        let chr = _charAt(input, idx);
        if (!_isWordChar(chr)) {
            if (start !== -1) {
                result = _appendWord(result, input, start, idx, newPrefix, upperWord);
                start = -1;
            }
            prevType = 0;
            run = 0;
        } else {
            let lower = strLower(chr);
            let upper = strUpper(chr);
            let type = lower !== upper ? (chr === upper ? 2 : 1) : (_numberChar.test(chr) ? 3 : 4);
            if (start === -1) {
                start = idx;
            } else if (type === 2 && ((prevType === 1 &&
                (run > 1 || (upperStart === start && previous === start + _charAt(input, start).length))) || prevType === 3)) {
                result = _appendWord(result, input, start, idx, newPrefix, upperWord);
                start = idx;
            } else if (type === 1 && prevType === 2 && run > 1 && upperStart === start) {
                result = _appendWord(result, input, start, previous, newPrefix, upperWord);
                start = previous;
            }

            if (!_markChar.test(chr)) {
                if (type !== prevType) {
                    run = 0;
                    if (type === 2) {
                        upperStart = idx;
                    }
                }
                run++;
                prevType = type;
                previous = idx;
            }
        }
        idx += chr.length;
    }

    if (start !== -1) {
        result = _appendWord(result, input, start, input.length, newPrefix, upperWord);
    }
    return result;
}

/**
 * Convert the provided value to a `Letter Cased` string, where the start of each word is
 * capitalized, all non-word character and spaces are retained.
 * Letters, numbers and combining marks form words; on engines without Unicode property
 * escapes an approximate character range is used.
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
    let input = asString(value);
    let result = "";
    let inWord = false;
    for (let idx = 0; idx < input.length;) {
        let chr = _charAt(input, idx);
        let word = _isWordChar(chr);
        result += word && !inWord ? strUpper(chr) : chr;
        inWord = word;
        idx += chr.length;
    }
    return result;
}

/**
 * Convert the provided value to `Capitalized Words`, where each detected word starts with an
 * uppercase character and the remaining characters of that word are lowercased.
 *
 * Separators (spaces, punctuation, `_`, and `-`) are retained. The value is lowercased before
 * detecting words, so existing camel-case boundaries are not retained.
 * If the value is not a string it will be converted.
 * @since 0.14.0
 * @group String
 * @group Conversion
 * @param value - The value to be converted to capitalized words
 * @returns The Capitalized Words version of the provided value
 * @example
 * ```ts
 * strCapitalizeWords(null);                      // "Null"
 * strCapitalizeWords(undefined);                 // "Undefined"
 * strCapitalizeWords("hello darkness");         // "Hello Darkness"
 * strCapitalizeWords("hELLo dARKness");         // "Hello Darkness"
 * strCapitalizeWords("hello_darkness");         // "Hello_Darkness"
 * strCapitalizeWords("hello-darkness");         // "Hello-Darkness"
 * strCapitalizeWords("hello darkness, my old friend."); // "Hello Darkness, My Old Friend."
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function strCapitalizeWords<T>(value: T): string {
    return strLetterCase(strLower(asString(value)));
}

/**
 * Convert the provided value to `camelCased` string, you can optionally specify whether the
 * first character is upper cased (lowercase by default) from kebab `-` or snake `_` case.
 * Words are lowercased before joining. Separators are removed, and camel-case boundaries
 * split after a lowercase word of at least two letters or a digit, and between an acronym and a
 * following capitalized word. A single lowercase letter followed by uppercase letters stays in one word.
 * Unicode word characters use the same rules as {@link strLetterCase}.
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

    if (upperFirst && result) {
        let first = _charAt(result, 0);
        result = strUpper(first) + result.substring(first.length);
    }
    return result;
}

/**
 * Convert the provided value to `kebab-cased` string, you can optionally specify whther the result
 * is all uppercased by passing `true` as the optional `scream` argument, otherwise the entire result
 * will be lowercased. Word boundaries follow {@link strCamelCase}; leading and trailing separators
 * are removed.
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
 * strKebabCase("_hello_darkness"); // "hello-darkness"
 * strKebabCase("hello darkness, my old friend."); // "hello-darkness-my-old-friend"
 *
 * // Add optional SCREAM flag
 * strKebabCase("hello darkness", true);    // "HELLO-DARKNESS"
 * strKebabCase("hello_darkness", true);    // "HELLO-DARKNESS"
 * strKebabCase("_hello_darkness", true);   // "HELLO-DARKNESS"
 * strKebabCase("hello darkness, my old friend.", true); // "HELLO-DARKNESS-MY-OLD-FRIEND"
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
 * will be lowercased. Word boundaries follow {@link strCamelCase}; leading and trailing separators
 * are removed.
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
 * strSnakeCase("_hello_darkness"); // "hello_darkness"
 * strSnakeCase("hello-darkness");  // "hello_darkness"
 * strSnakeCase("-hello-darkness"); // "hello_darkness"
 * strSnakeCase("hello darkness, my old friend."); // "hello_darkness_my_old_friend"
 *
 * // Use optional Scream flag
 * strSnakeCase("hello darkness", true);    // "HELLO_DARKNESS"
 * strSnakeCase("hello_darkness", true);    // "HELLO_DARKNESS"
 * strSnakeCase("_hello_darkness", true);   // "HELLO_DARKNESS"
 * strSnakeCase("hello-darkness", true);    // "HELLO_DARKNESS"
 * strSnakeCase("-hello-darkness", true);   // "HELLO_DARKNESS"
 * strSnakeCase("hello darkness, my old friend.", true); // "HELLO_DARKNESS_MY_OLD_FRIEND"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function strSnakeCase<T>(value: T, scream?: boolean): string {
    let result = _convertCase(value, "_");
    return (scream ? strUpper : strLower)(result);
}
