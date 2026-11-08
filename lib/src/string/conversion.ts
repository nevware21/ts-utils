/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { EMPTY, SUBSTRING, TO_LOWER_CASE, TO_UPPER_CASE } from "../internal/constants";
import { asString } from "./as_string";
import { strReplace } from "./replace";

/**
 * @internal
 * @ignore
 * Word tokenizer used by {@link strCamelCase}, {@link strKebabCase} and {@link strSnakeCase}, every
 * match is `whitespace* (separators*) (word)` or only the trailing separators (with an empty word). As the
 * matches are contiguous the replacer can use the match offset to identify the first word (any leading
 * separators are part of its match), and the leading `(?!$)` stops an empty match at the end of the string.
 * The greedy `\s*` means the captured separators are only empty when the separators are all whitespace,
 * which is used to trim leading / trailing whitespace while retaining any other leading / trailing separator.
 *
 * Words are either:
 * - An uppercase run followed by a capitalized word, eg. `"XML"` from `"XMLHttp"`; or
 * - An optional uppercase run followed by any other word characters, eg. `"Http"`, `"bar2"`, `"ABC123"`, `"ABC"`
 *
 * So words are split at separators, where a lowercase letter or number is followed by an uppercase letter
 * (`"fooBar"`, `"bar2Baz"`) and before the last letter of an uppercase run followed by a lowercase letter.
 *
 * The character classes are fixed code unit ranges so the result is the same on every runtime, Unicode
 * property escapes (`\p{L}`) require ES2018 and a `u` regular expression literal is a SyntaxError on
 * older runtimes (even within a try / catch), they are:
 * - Separators: whitespace and the punctuation and symbols (not the letters, numbers or marks) of ASCII,
 *   Latin-1 (so not `ª²³µ¹º¼½¾`), General Punctuation, Currency Symbols, Arrows to Miscellaneous Symbols and
 *   Arrows (not Enclosed Alphanumerics, eg. `①Ⓐⓐ`, or the Dingbat numbers `❶➀➊`) and CJK Symbols and
 *   Punctuation (not `々〆〇〡〪〱〸〻〼` etc)
 *   `\s\0-\x2F\x3A-\x40\x5B-\x60\x7B-\xA9\xAB-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u2000-\u206F\u20A0-\u20CF\u2190-\u245F\u2500-\u2775\u2794-\u2BFF\u3000-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u303F`
 * - Uppercase: Basic Latin, Latin-1, Greek and Cyrillic `A-Z\xC0-\xD6\xD8-\xDE\u0386\u0388-\u038F\u0391-\u03AB\u0400-\u042F`,
 *   each followed by any combining diacritical marks `\u0300-\u036F` (so decomposed letters are not split)
 * - Lowercase (only used to detect the end of an uppercase run): `a-z\xDF-\xF6\xF8-\xFF\u0390\u03AC-\u03CE\u0430-\u045F`
 * - Other word characters: every other character (lowercase and caseless letters, numbers, marks, etc)
 *
 * So the precomposed and decomposed (NFC / NFD) forms of the letters within these ranges produce the same
 * words, the letters of the other blocks that alternate between upper and lower case (Latin Extended,
 * Cyrillic Supplement, Greek Extended, etc) are not listed as that would require each letter individually,
 * so a precomposed letter from those blocks (eg. `Č`) doesn't start a new word while its decomposed form
 * (`C` followed by a combining caron) does.
 */
// Each uppercase unit must start with an uppercase letter (marks are never uppercase) so there is only one
// way to split a run, and the last alternative always matches, so this can't backtrack catastrophically
// eslint-disable-next-line security/detect-unsafe-regex
const CASE_WORDS = /(?!$)\s*([\s\0-\x2F\x3A-\x40\x5B-\x60\x7B-\xA9\xAB-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u2000-\u206F\u20A0-\u20CF\u2190-\u245F\u2500-\u2775\u2794-\u2BFF\u3000-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u303F]*)((?:[A-Z\xC0-\xD6\xD8-\xDE\u0386\u0388-\u038F\u0391-\u03AB\u0400-\u042F][\u0300-\u036F]*)+(?=[A-Z\xC0-\xD6\xD8-\xDE\u0386\u0388-\u038F\u0391-\u03AB\u0400-\u042F][\u0300-\u036F]*[a-z\xDF-\xF6\xF8-\xFF\u0390\u03AC-\u03CE\u0430-\u045F])|(?:[A-Z\xC0-\xD6\xD8-\xDE\u0386\u0388-\u038F\u0391-\u03AB\u0400-\u042F][\u0300-\u036F]*)*[^\s\0-\x2F\x3A-\x40\x5B-\x60\x7B-\xA9\xAB-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u2000-\u206F\u20A0-\u20CF\u2190-\u245F\u2500-\u2775\u2794-\u2BFF\u3000-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u303FA-Z\xC0-\xD6\xD8-\xDE\u0386\u0388-\u038F\u0391-\u03AB\u0400-\u042F]*)/g;

/**
 * @internal
 * @ignore
 * Each run of word characters (anything that is not a separator, see {@link CASE_WORDS}) used by
 * {@link strLetterCase} and {@link strCapitalizeWords}
 */
const WORD_RUNS = /[^\s\0-\x2F\x3A-\x40\x5B-\x60\x7B-\xA9\xAB-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u2000-\u206F\u20A0-\u20CF\u2190-\u245F\u2500-\u2775\u2794-\u2BFF\u3000-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u303F]+/g;

/**
 * @internal
 * @ignore
 * Lowercase the provided word. The words are always non-empty strings, so the native methods are
 * called directly via the (minifiable) name constants, as the per-call overhead of the strLower()
 * style helpers (argument slicing and apply) is significant in the per-word replacer callbacks.
 */
/*#__NO_SIDE_EFFECTS__*/
function _lowerWord(word: string): string {
    return word[TO_LOWER_CASE]();
}

/**
 * @internal
 * @ignore
 * Uppercase the provided word
 */
/*#__NO_SIDE_EFFECTS__*/
function _upperWord(word: string): string {
    return word[TO_UPPER_CASE]();
}

/**
 * @internal
 * @ignore
 * Returns the number of code units of the first character of the (non-empty) word, this is 2 for a
 * supplementary plane character (a high surrogate `0xD800 - 0xDBFF` followed by a low surrogate
 * `0xDC00 - 0xDFFF`) so the complete character is case converted, otherwise 1. The low surrogate is
 * only checked after a high surrogate, so this is a single `charCodeAt()` for all other characters.
 */
/*#__NO_SIDE_EFFECTS__*/
function _firstLen(word: string): number {
    return ((word.charCodeAt(0) & 0xFC00) === 0xD800 && (word.charCodeAt(1) & 0xFC00) === 0xDC00) ? 2 : 1;
}

/**
 * @internal
 * @ignore
 * Uppercase the first character of the word and retain the case of the remaining characters
 */
/*#__NO_SIDE_EFFECTS__*/
function _letterWord(word: string): string {
    let len = _firstLen(word);
    return word[SUBSTRING](0, len)[TO_UPPER_CASE]() + word[SUBSTRING](len);
}

/**
 * @internal
 * @ignore
 * Lowercase the first character of the word and retain the case of the remaining characters
 */
/*#__NO_SIDE_EFFECTS__*/
function _lowerFirst(word: string): string {
    let len = _firstLen(word);
    return word[SUBSTRING](0, len)[TO_LOWER_CASE]() + word[SUBSTRING](len);
}

/**
 * @internal
 * @ignore
 * Uppercase the first character of the word and lowercase the remaining characters. The whole word is
 * lowercased first as some lowercase mappings depend on the preceding letters, eg. the Greek final sigma
 * (`"ΟΣ"` becomes `"Ος"` not `"Οσ"`)
 */
/*#__NO_SIDE_EFFECTS__*/
function _capitalWord(word: string): string {
    return _letterWord(word[TO_LOWER_CASE]());
}

/**
 * @internal
 * @ignore
 * Internal function to split the value into words and convert the case of each word in a single pass.
 * Each run of separators between words is replaced with a single `newPrefix`, leading and trailing
 * whitespace is removed and any other leading / trailing separators are also replaced with a single
 * `newPrefix`, so the conversions remain reversible (eg. `"_a_b_"` to `"-a-b-"` and back to `"_a_b_"`).
 * @param value - The value to be converted
 * @param newPrefix - The separator to add between words
 * @param firstFn - The function used to convert the case of the first word
 * @param wordFn - The function used to convert the case of the remaining words
 * @returns The converted string
 */
/*#__NO_SIDE_EFFECTS__*/
function _convertCase<T>(value: T, newPrefix: string, firstFn: (word: string) => string, wordFn: (word: string) => string): string {
    return strReplace(asString(value), CASE_WORDS, (_match: string, sep: string, word: string, offset: number) => {
        // The first word is always at offset 0 (any leading separators are part of its match), a match without
        // a word is the trailing separators. The leading whitespace is not part of sep, so sep is only empty when
        // the separators are all whitespace (or there are none), which (like trimming) doesn't add a newPrefix
        return word ? ((offset || sep) ? newPrefix : EMPTY) + (offset ? wordFn(word) : firstFn(word)) : (sep ? newPrefix : EMPTY);
    });
}

/**
 * Convert the provided value to a `Letter Cased` string, where the start of each word is
 * capitalized, all non-word character and spaces are retained.
 *
 * A word is a run of any characters other than whitespace, punctuation and symbols (`_` and `-` are
 * separators), so non-ASCII letters are part of words.
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
 * strLetterCase("hello darkness, my old friend."); // "Hello Darkness, My Old Friend."
 * strLetterCase("café crème");     // "Café Crème"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function strLetterCase<T>(value: T): string {
    return strReplace(asString(value), WORD_RUNS, _letterWord);
}

/**
 * Convert the provided value to `Capitalized Words`, where each detected word starts with an
 * uppercase character and the remaining characters of that word are lowercased.
 *
 * A word is a run of any characters other than whitespace, punctuation and symbols (including non-ASCII
 * letters), so existing separators (spaces, punctuation, `_`, and `-`) are retained. Words are only split at separators,
 * so camelCase boundaries are not retained (`"fooBarBaz"` becomes `"Foobarbaz"`), use
 * {@link strCamelCase} or {@link strKebabCase} with {@link strLetterCase} to retain them.
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
 * strCapitalizeWords("café crème");             // "Café Crème"
 * strCapitalizeWords("fooBarBaz");              // "Foobarbaz"
 * strLetterCase(strKebabCase("fooBarBaz"));     // "Foo-Bar-Baz"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function strCapitalizeWords<T>(value: T): string {
    return strReplace(asString(value), WORD_RUNS, _capitalWord);
}

/**
 * Convert the provided value to `camelCased` string, you can optionally specify whether the
 * first character is upper cased (lowercase by default).
 *
 * All separators (whitespace, punctuation and symbols, eg. spaces, `_` and `-`) are removed and the first
 * letter of each following word is uppercased, the first letter of the result is lowercased (or uppercased
 * when `upperFirst` is `true`). The case of all other letters is retained, so the conversion is reversible
 * with {@link strKebabCase} / {@link strSnakeCase} (eg. `"helloDarkness"` to `"hello-darkness"` and back to `"helloDarkness"`)
 * and an existing camelCase (or PascalCase with `upperFirst`) value is returned unchanged.
 * Non-ASCII letters are retained, using the same fixed character ranges on every runtime.
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
 * strCamelCase("helloDarkness");       // "helloDarkness"
 * strCamelCase("HelloDarkness");       // "helloDarkness"
 * strCamelCase("café crème");          // "caféCrème"
 *
 * // The case of the other letters is retained, so normalize the value first when required
 * strCamelCase("HELLO WORLD");                  // "hELLOWORLD"
 * strCamelCase(strLower("HELLO WORLD"));        // "helloWorld"
 * strCamelCase("XMLHttpRequest");               // "xMLHttpRequest"
 * strKebabCase("XMLHttpRequest");               // "xml-http-request"
 * strCamelCase(strKebabCase("XMLHttpRequest")); // "xmlHttpRequest"
 *
 * // Uppercase first character
 * strCamelCase("hello darkness", true); // "HelloDarkness"
 * strCamelCase("hello_darkness", true); // "HelloDarkness"
 * strCamelCase("_hello_darkness", true); // "HelloDarkness"
 * strCamelCase("hello-darkness", true); // "HelloDarkness"
 * strCamelCase("-hello-darkness", true); // "HelloDarkness"
 * strCamelCase("hello darkness, my old friend.", true); // "HelloDarknessMyOldFriend"
 * strCamelCase("XMLHttpRequest", true); // "XMLHttpRequest"
 * strCamelCase(strLower("HELLO WORLD"), true);        // "HelloWorld"
 * strCamelCase(strKebabCase("XMLHttpRequest"), true); // "XmlHttpRequest"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function strCamelCase<T>(value: T, upperFirst?: boolean): string {
    return _convertCase(value, EMPTY, upperFirst ? _letterWord : _lowerFirst, _letterWord);
}

/**
 * Convert the provided value to `kebab-cased` string, you can optionally specify whther the result
 * is all uppercased by passing `true` as the optional `scream` argument, otherwise the entire result
 * will be lowercased.
 *
 * Words are split at any separator (whitespace, punctuation and symbols, eg. spaces, `_` and `-`), where a
 * lowercase letter or number is followed by an uppercase letter (`"fooBar"`, `"bar2Baz"`) and before the last
 * letter of an uppercase run that is followed by a lowercase letter (`"XMLHttp"`), then joined with a single
 * `-`. Leading and trailing whitespace is removed, any other leading or trailing separators are replaced with
 * a single `-` so the conversion is reversible with {@link strSnakeCase} (eg. `"_a_b_"` to `"-a-b-"` and back to `"_a_b_"`).
 * Non-ASCII letters are retained, uppercase letters (word boundaries) are detected for the Latin, Latin-1,
 * Greek and Cyrillic ranges (in both precomposed and decomposed forms, eg. `"Έ"` and `"Ε"` followed by a combining
 * acute accent), other cased letters (eg. `"Ł"` and `"Č"`) are case converted but don't start a new word, while
 * a decomposed letter whose base letter is within those ranges (eg. `"C"` followed by a combining caron) does, so
 * normalize the value first (eg. with `String.prototype.normalize()` where supported) when it may contain both forms.
 * The same fixed character ranges are used on every runtime.
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
 * strKebabCase("helloDarkness");   // "hello-darkness"
 * strKebabCase("XMLHttpRequest");  // "xml-http-request"
 * strKebabCase("fooBar2Baz");      // "foo-bar2-baz"
 * strKebabCase("café crème");      // "café-crème"
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
    let caseFn = scream ? _upperWord : _lowerWord;
    return _convertCase(value, "-", caseFn, caseFn);
}

/**
 * Convert the provided value to `snake_cased` string, you can optionally specify whther the result
 * is all uppercased by passing `true` as the optional `scream` argument, otherwise the entire result
 * will be lowercased.
 *
 * Words are detected using the same rules as {@link strKebabCase}, and are joined with a single `_`.
 * Leading and trailing whitespace is removed, any other leading or trailing separators are replaced with
 * a single `_` so the conversion is reversible with {@link strKebabCase} (eg. `"-a-b-"` to `"_a_b_"` and back to `"-a-b-"`).
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
 * strSnakeCase("XMLHttpRequest");  // "xml_http_request"
 * strSnakeCase("O'Brien & Sons, Ltd."); // "o_brien_sons_ltd_"
 *
 * // Use optional Scream flag
 * strSnakeCase("hello darkness", true);    // "HELLO_DARKNESS"
 * strSnakeCase("hello_darkness", true);    // "HELLO_DARKNESS"
 * strSnakeCase("_hello_darkness", true);   // "_HELLO_DARKNESS"
 * strSnakeCase("hello-darkness", true);    // "HELLO_DARKNESS"
 * strSnakeCase("-hello-darkness", true);   // "_HELLO_DARKNESS"
 * strSnakeCase("hello darkness, my old friend.", true); // "HELLO_DARKNESS_MY_OLD_FRIEND_"
 * strSnakeCase("maxSafeInteger", true);    // "MAX_SAFE_INTEGER"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function strSnakeCase<T>(value: T, scream?: boolean): string {
    let caseFn = scream ? _upperWord : _lowerWord;
    return _convertCase(value, "_", caseFn, caseFn);
}
