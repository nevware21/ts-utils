/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { EMPTY, NULL_VALUE, StrCls, TO_STRING, UNDEF_VALUE } from "../internal/constants";
import { _pureRef } from "../internal/treeshake_helpers";
import { asString } from "../string/as_string";
import { strCamelCase } from "../string/conversion";
import { strPadStart } from "../string/pad";
import { strReplace } from "../string/replace";
import { strRepeat } from "../string/repeat";
import { strSubstr } from "../string/substring";
import { strUpper } from "../string/upper_lower";
import { isNumber, isStrictNullOrUndefined, isString, isUndefined } from "./base";
import { ICachedValue } from "./cache";
import { safeGetDeferred } from "./safe_lazy";
import { dumpObj } from "./diagnostics";

const DBL_QUOTE = "\"";
const INVALID_JS_NAME = /([^\w\d_$])/g;
const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const HEX_CHARS = "0123456789abcdef";
const _fromCharCode = (/*#__PURE__*/_pureRef<typeof String.fromCharCode>(StrCls, "fromCharCode"));
// The UTF-8 byte order mark, used to identify an encoded value as containing UTF-8 text
const UTF8_BOM = "\xEF\xBB\xBF";
const NON_LATIN1 = /[^\0-\xFF]/;
const NON_ASCII_CHAR = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\x80-\uFFFF]/g;
const UTF8_SEQUENCE = /[\xC2-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}|[\x80-\xFF]/g;
let _btoa: ICachedValue<(value: string) => string>;
let _atob: ICachedValue<(value: string) => string>;
let _htmlEntityCache: { [key: string]: string};
let _base64Cache: { [key: string]: number };

/**
 * @internal
 * @ignore
 * Returns the UTF-8 bytes (one per character) of the matched character or surrogate pair. A lone surrogate
 * is encoded like any other 3 byte character, so that it is also reversible.
 */
function _utf8Encode(match: string): string {
    let code = match.charCodeAt(0);
    if (match.length > 1) {
        code = 0x10000 + ((code - 0xD800) << 10) + match.charCodeAt(1) - 0xDC00;
    }

    const count = code < 0x800 ? 1 : (code < 0x10000 ? 2 : 3);
    let result = _fromCharCode(((0xF0 << (3 - count)) & 0xFF) | (code >> (count * 6)));
    for (let lp = count - 1; lp >= 0; lp--) {
        result += _fromCharCode(0x80 | ((code >> (lp * 6)) & 0x3F));
    }

    return result;
}

/**
 * @internal
 * @ignore
 * Identifies whether the value starts with the marker, checking the first byte first as very few values will have it
 */
function _hasUtf8Bom(value: string): boolean {
    return value.charCodeAt(0) === 0xEF && strSubstr(value, 0, 3) === UTF8_BOM;
}

/**
 * @internal
 * @ignore
 * Converts the text into a string of bytes (one per character) to be encoded. Text which only contains Latin-1
 * characters already fits, otherwise (or if it would be mistaken for marked text) it becomes the UTF-8 byte order
 * mark followed by the UTF-8 bytes, so that it can be identified and restored by {@link _fromBinary}.
 */
function _toBinary(value: string): string {
    return NON_LATIN1.test(value) || _hasUtf8Bom(value) ? UTF8_BOM + strReplace(value, NON_ASCII_CHAR, _utf8Encode) : value;
}

/**
 * @internal
 * @ignore
 * Converts decoded bytes back into text, the bytes are returned as-is unless they are the UTF-8 byte order mark
 * followed by valid UTF-8.
 */
function _fromBinary(value: string): string {
    if (value.length > 3 && _hasUtf8Bom(value)) {
        let isValid = true;

        const result = strReplace(strSubstr(value, 3), UTF8_SEQUENCE, (match) => {
            const count = match.length - 1;
            let code = match.charCodeAt(0) & (0x3F >> count);

            for (let lp = 1; lp <= count; lp++) {
                code = (code << 6) | (match.charCodeAt(lp) & 0x3F);
            }

            // Reject stray bytes, overlong sequences and values which are not valid code points
            if (!count || code < (1 << (count * 5 + 1)) || code > 0x10FFFF) {
                isValid = false;
                return match;
            }

            return code < 0x10000 ? _fromCharCode(code) : _fromCharCode(0xD800 + ((code - 0x10000) >> 10), 0xDC00 + ((code - 0x10000) & 0x3FF));
        });

        if (isValid) {
            return result;
        }
    }

    return value;
}

/**
 * Validates that the string name conforms to the JS IdentifierName specification and if not
 * normalizes the name so that it would. This method does not identify or change any keywords
 * meaning that if you pass in a known keyword the same value will be returned.
 * @since 0.9.0
 * @group Conversion
 * @group Value
 * @param jsName - The string value to validate
 * @param camelCase - Optionally (see [1]) convert into CamelCase with the leading character either
 * - `true` =\> lowercase
 * - 'false' =\> uppercase
 * - undefined =\> not converted
 * @return The original string name, if it conforms to the JS naming convention otherwise an encoded version.
 *
 * **[1]**: Camel casing the name will remove all non-word characters from the result
 * so you will NOT end up with any leading, embedded or trailing `_` characters which may cause
 * duplicate results for different string values.
 * @example
 * ```ts
 * normalizeJsName("HelloDarkness"); // "HelloDarkness"
 * normalizeJsName("Hello Darkness"); // "Hello_Darkness"
 * normalizeJsName("hello Darkness"); // "hello_Darkness"
 * normalizeJsName("hello Darkness"); // "hello_Darkness"
 * normalizeJsName("hello.Darkness"); // "hello_Darkness"
 * normalizeJsName("hello-Darkness"); // "hello_Darkness"
 * normalizeJsName("hello_Darkness"); // "hello_Darkness"
 * normalizeJsName("abc-123"); // "abc_123"
 * normalizeJsName("0abc0"); // "0abc0"
 * normalizeJsName("\"HelloDarkness\""); // "_HelloDarkness_"
 * normalizeJsName("\"Hello Darkness\""); // "_Hello_Darkness_"
 * normalizeJsName("\"hello Darkness\""); // "_hello_Darkness_"
 * normalizeJsName("\"hello Darkness\""); // "_hello_Darkness_"
 * normalizeJsName("\"hello .,#[]Darkness\""); // "_hello______Darkness_"
 *
 * normalizeJsName("HelloDarkness", true); // "helloDarkness"
 * normalizeJsName("Hello Darkness", true); // "helloDarkness"
 * normalizeJsName("hello Darkness", true); // "helloDarkness"
 * normalizeJsName("hello Darkness", true); // "helloDarkness"
 * normalizeJsName("hello.Darkness", true); // "helloDarkness"
 * normalizeJsName("hello-Darkness", true); // "helloDarkness"
 * normalizeJsName("hello_Darkness", true); // "helloDarkness"
 * normalizeJsName("abc-123", true); // "abc123"
 * normalizeJsName("0abc0", true); // "0abc0"
 * normalizeJsName("\"HelloDarkness\"", true); // "helloDarkness"
 * normalizeJsName("\"Hello Darkness\"", true); // "helloDarkness"
 * normalizeJsName("hello \"Darkness\"", true); // "helloDarkness"
 * normalizeJsName("hello \"Darkness\"", true); // "helloDarkness"
 * normalizeJsName("\"hello .,#[]Darkness\"", true); // "helloDarkness"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function normalizeJsName(jsName: string, camelCase?: boolean): string {
    let result = strReplace(asString(jsName), INVALID_JS_NAME, "_");

    return !isUndefined(camelCase) ? strCamelCase(result, !camelCase) : result;
}

/**
 * Encode the value into a JSON string, if the provided value is a string this will encode
 * any character that is not an alpha, numeric, space or some special characters as `\uXXXX`
 * and will always be returned wrapped in double quotes `"xxx"`, if the value is any other
 * object it will be encoded using JSON.stringify() and if there is an exception encoding
 * with JSON.stringify() it will return the exception as a string using {@link dumpObj}().
 * @since 0.9.0
 * @group Conversion
 * @group Value
 * @param value - The value to be encoded as JSON
 * @param format - Identifies whether the JSON value should be formatted when an object
 * - `true` - Format with 4 spaces
 * - 'number' - The number of spaces to format with
 * - `false` (or not Truthy) - Do not format*
 * @returns A JSON encoded string representation of the value.
 * @example
 * ```ts
 * // String values
 * encodeAsJson("abc.123"); // "\"abc.123\""
 * encodeAsJson("321-abc"); // "\"321-abc\""
 * encodeAsJson("Hello darkness, my \"old\" friend..."); // "\"Hello darkness, my \\\"old\\\" friend...\""
 * encodeAsJson("Hello: Darkness"); // "\"Hello: Darkness\""
 * encodeAsJson("Hello\\u003A Darkness"); // "\"Hello\\\\u003A Darkness\""
 * encodeAsJson("`!@#$%^&*()_-+=[]{}:;'<>?"); // "\"\\u0060!@#$%^&*()_-+=[]{}:;\\u0027<>?\""
 * encodeAsJson("0"); // "\"0\""
 * encodeAsJson("1"); // "\"1\""
 *
 * encodeAsJson([]); // "[]"
 * encodeAsJson(["A"]); // "[\"A\"]"
 * encodeAsJson([0]); // "[0]"
 * encodeAsJson([false]); // "[false]"
 * encodeAsJson(new Array(1)); // "[null]"
 * encodeAsJson(true); // "true",
 * encodeAsJson(false); // "false"
 *
 * encodeAsJson({}); // "{}"
 * encodeAsJson({ Hello: "Darkness" }); // "{\"Hello\":\"Darkness\"}");
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function encodeAsJson<T>(value: T, format?: boolean | number): string {
    let result: string;

    if (isString(value)) {
        // encode if a character is not an alpha, numeric, space or some special characters
        result = DBL_QUOTE + strReplace(value, /[^\w .,\-!@#$%\^&*\(\)_+={}\[\]:;|<>?]/g, (match) => {
            if(match === DBL_QUOTE || match === "\\") {
                return "\\" + match;
            }

            var hex = match.charCodeAt(0)[TO_STRING](16);
            return "\\u" + strPadStart(strUpper(hex), 4, "0");
        }) + DBL_QUOTE;
    } else {
        try {
            result = JSON.stringify(value, NULL_VALUE, format ? (isNumber(format) ? format : 4) : UNDEF_VALUE);
        } catch (e) {
            // Unable to convert to JSON
            result = DBL_QUOTE + dumpObj(e) + DBL_QUOTE;
        }
    }

    return result;
}

/**
 * Encode the provided string to a safe HTML form, converting the base `&`, `<`, `>`, `\"` and `'`
 * characters into their HTML encoded representations
 * @since 0.9.0
 * @group Conversion
 * @group Value
 * @param value - The string value to be converted into a HTML safe form
 * @returns The converted string as HTML
 * @example
 * ```ts
 * encodeAsHtml("HelloDarkness"); // "HelloDarkness"
 * encodeAsHtml("Hello Darkness"); // "Hello Darkness"
 * encodeAsHtml("hello.Darkness"); // "hello.Darkness"
 * encodeAsHtml("hello-Darkness"); // "hello-Darkness"
 * encodeAsHtml("hello_Darkness"); // "hello_Darkness"
 * encodeAsHtml("abc-123"); // "abc-123"
 * encodeAsHtml("0abc0"); // "0abc0"
 * encodeAsHtml("\"HelloDarkness\""); // "&quot;HelloDarkness&quot;"
 * encodeAsHtml("\"Hello Darkness\""); // "&quot;Hello Darkness&quot;"
 * encodeAsHtml("\"hello Darkness\""); // "&quot;hello Darkness&quot;"
 * encodeAsHtml("\"hello Darkness\""); // "&quot;hello Darkness&quot;"
 * encodeAsHtml("\"hello .,#<[]>Darkness\""); // "&quot;hello .,#&lt;[]&gt;Darkness&quot;"
 * encodeAsHtml("<script src=\"javascript:alert('Hello');\"></script>"); // "&lt;script src=&quot;javascript:alert(&#39;Hello&#39;);&quot;&gt;&lt;/script&gt;"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function encodeAsHtml(value: string) {
    !_htmlEntityCache && (_htmlEntityCache = {
        "&": "amp",
        "<": "lt",
        ">": "gt",
        "\"": "quot",
        "'": "#39"
    });
    
    return strReplace(asString(value), /[&<>"']/g, match => "&" + _htmlEntityCache[match] + ";");
}

/**
 * Encode a string value as Base64.
 * Text containing characters above `U+00FF` is encoded as the UTF-8 byte order mark followed by its UTF-8 bytes, so
 * it can be restored by the matching decode function. All other text is encoded as one byte per character.
 * @since 0.13.0
 * @group Encoding
 * @group Conversion
 * @param value - The string value to encode
 * @returns The Base64 encoded string
 * @example
 * ```ts
 * encodeAsBase64("Hello"); // "SGVsbG8="
 * encodeAsBase64("Hello World"); // "SGVsbG8gV29ybGQ="
 * encodeAsBase64(""); // ""
 * encodeAsBase64("€"); // "77u/4oKs"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function encodeAsBase64(value: string): string {
    let result: string;

    if (value || !isStrictNullOrUndefined(value)) {
        result = _toBinary(asString(value));

        try {
            // Use native btoa if available, wrapped as it can't be called with the cached value as `this` in a browser
            !_btoa && (_btoa = safeGetDeferred(() => !isUndefined(btoa) ? (theValue: string) => btoa(theValue) : _encodeBase64Polyfill, _encodeBase64Polyfill));
            result = _btoa.v(result);
        } catch (e) {
            // Use polyfill on error
            result = _encodeBase64Polyfill(result);
        }
    }

    return result || EMPTY;
}

/**
 * Decode a Base64 encoded string.
 * A value that starts with the UTF-8 byte order mark and contains valid UTF-8 is decoded as UTF-8 text, all other
 * values are decoded as one character per byte.
 * @since 0.13.0
 * @group Encoding
 * @group Conversion
 * @param value - The Base64 encoded string to decode
 * @returns The decoded string
 * @example
 * ```ts
 * decodeBase64("SGVsbG8="); // "Hello"
 * decodeBase64("SGVsbG8gV29ybGQ="); // "Hello World"
 * decodeBase64(""); // ""
 * decodeBase64("77u/4oKs"); // "€"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function decodeBase64(value: string): string {
    let result: string;

    if (value || !isStrictNullOrUndefined(value)) {
        result = asString(value);

        try {
            // Use native atob if available, wrapped as it can't be called with the cached value as `this` in a browser
            !_atob && (_atob = safeGetDeferred(() => !isUndefined(atob) ? (theValue: string) => atob(theValue) : _decodeBase64Polyfill, _decodeBase64Polyfill));
            result = _atob.v(result);
        } catch (e) {
            // Use polyfill on error
            result = _decodeBase64Polyfill(result);
        }

        result = _fromBinary(result);
    }

    return result || value || EMPTY;
}

/**
 * Encode a string as URL-safe Base64.
 * Text containing characters above `U+00FF` is encoded as the UTF-8 byte order mark followed by its UTF-8 bytes, so
 * it can be restored by the matching decode function. All other text is encoded as one byte per character.
 * @since 0.13.0
 * @group Encoding
 * @group Conversion
 * @param value - The string value to encode
 * @returns The URL-safe Base64 encoded string (replaces + with -, / with _, removes padding)
 * @example
 * ```ts
 * encodeAsBase64Url("Hello"); // "SGVsbG8"
 * encodeAsBase64Url("+++///"); // "LSsvLw"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function encodeAsBase64Url(value: string): string {
    let encoded = encodeAsBase64(value);

    if (encoded) {
        encoded = strReplace(strReplace(strReplace(encoded, /\+/g, "-"), /\//g, "_"), /=/g, "");
    }

    return encoded || EMPTY;
}

/**
 * Decode a URL-safe Base64 encoded string.
 * A value that starts with the UTF-8 byte order mark and contains valid UTF-8 is decoded as UTF-8 text, all other
 * values are decoded as one character per byte.
 * @since 0.13.0
 * @group Encoding
 * @group Conversion
 * @param value - The URL-safe Base64 encoded string to decode
 * @returns The decoded string
 * @example
 * ```ts
 * decodeBase64Url("SGVsbG8"); // "Hello"
 * decodeBase64Url("LSsvLw"); // "+++///"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function decodeBase64Url(value: string): string {
    let result: string;

    if (value || !isStrictNullOrUndefined(value)) {
        result = asString(value);
        let pad = 4 - (result.length % 4);      // Add padding back

        if (pad && pad !== 4) {
            result = result + strRepeat("=", pad);
        }

        result = decodeBase64(strReplace(strReplace(result, /-/g, "+"), /_/g, "/")) || EMPTY;
    }

    return result || value || EMPTY;
}

/**
 * Encode a string as hexadecimal.
 * Text containing characters above `U+00FF` is encoded as the UTF-8 byte order mark followed by its UTF-8 bytes, so
 * it can be restored by the matching decode function. All other text is encoded as one byte per character.
 * @since 0.13.0
 * @group Encoding
 * @group Conversion
 * @param value - The string value to encode
 * @returns The hexadecimal encoded string
 * @example
 * ```ts
 * encodeAsHex("Hello"); // "48656c6c6f"
 * encodeAsHex("A"); // "41"
 * encodeAsHex(""); // ""
 * encodeAsHex("€"); // "efbbbfe282ac"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function encodeAsHex(value: string): string {
    let result: string;

    if (value || !isStrictNullOrUndefined(value)) {
        result = _toBinary(asString(value));

        let hex = [];
        for (let idx = 0; idx < result.length; idx++) {
            let code = result.charCodeAt(idx);

            hex.push(HEX_CHARS[(code >> 4) & 0xf]);
            hex.push(HEX_CHARS[code & 0xf]);
        }

        result = hex.join("");
    }

    return result || value || EMPTY;
}

/**
 * Decode a hexadecimal encoded string.
 * A value that starts with the UTF-8 byte order mark and contains valid UTF-8 is decoded as UTF-8 text, all other
 * values are decoded as one character per byte.
 * @since 0.13.0
 * @group Encoding
 * @group Conversion
 * @param value - The hexadecimal encoded string to decode
 * @returns The decoded string
 * @example
 * ```ts
 * decodeHex("48656c6c6f"); // "Hello"
 * decodeHex("41"); // "A"
 * decodeHex(""); // ""
 * decodeHex("efbbbfe282ac"); // "€"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function decodeHex(value: string): string {
    let result = [];

    if (value || !isStrictNullOrUndefined(value)) {
        let theValue = asString(value);

        for (let idx = 0; idx < theValue.length; idx += 2) {
            result.push(_fromCharCode(parseInt(strSubstr(theValue, idx, 2), 16)));
        }
    }

    return _fromBinary(result.join(""));
}

/**
 * Encode a string using URI encoding
 * @since 0.13.0
 * @group Encoding
 * @group Conversion
 * @param value - The string value to encode
 * @returns The URI encoded string
 * @example
 * ```ts
 * encodeAsUri("Hello World"); // "Hello%20World"
 * encodeAsUri("a+b=c"); // "a%2Bb%3Dc"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function encodeAsUri(value: string): string {
    let result: string;

    if (value || !isStrictNullOrUndefined(value)) {
        try {
            result = encodeURIComponent(asString(value));
        } catch (e) {
            // Use original string on error
        }
    }
    
    return result || value || EMPTY;
}

/**
 * Decode a URI encoded string
 * @since 0.13.0
 * @group Encoding
 * @group Conversion
 * @param value - The URI encoded string to decode
 * @returns The decoded string
 * @example
 * ```ts
 * decodeUri("Hello%20World"); // "Hello World"
 * decodeUri("a%2Bb%3Dc"); // "a+b=c"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function decodeUri(value: string): string {
    let result: string;

    if (value || !isStrictNullOrUndefined(value)) {
        try {
            result = decodeURIComponent(asString(value));
        } catch (e) {
            // Use original string on error
        }
    }

    return result || value || EMPTY;
}

/**
 * Internal Base64 encoding polyfill for ES5 environments without btoa
 * @internal
 * @ignore
 */
export function _encodeBase64Polyfill(str: string): string {
    let result = [];

    if (str || !isStrictNullOrUndefined(str)) {
        str = asString(str);

        let len = str.length;
        let lp = 0;

        while (lp < len) {
            let a = str.charCodeAt(lp++);

            let hasB = lp < len;
            let b = hasB ? str.charCodeAt(lp++) : 0;

            let hasC = lp < len;
            let c = hasC ? str.charCodeAt(lp++) : 0;

            let bitmap = (a << 16) | (b << 8) | c;

            result.push(BASE64_CHARS[(bitmap >> 18) & 63]);
            result.push(BASE64_CHARS[(bitmap >> 12) & 63]);

            if (hasB) {
                result.push(BASE64_CHARS[(bitmap >> 6) & 63]);
            } else {
                result.push("=");
            }

            if (hasC) {
                result.push(BASE64_CHARS[bitmap & 63]);
            } else {
                result.push("=");
            }
        }
    }

    return result.join("");
}

/**
 * Internal Base64 decoding polyfill for ES5 environments without atob
 * @internal
 * @ignore
 */
export function _decodeBase64Polyfill(str: string): string {
    let result = [];

    if (str || !isStrictNullOrUndefined(str)) {
        str = asString(str);
        let len = str.length;

        // Build the Base64 character cache if it doesn't exist
        !_base64Cache && (_base64Cache = {});
        if (!_base64Cache["A"]) {
            for (let i = 0; i < BASE64_CHARS.length; i++) {
                _base64Cache[BASE64_CHARS[i]] = i;
            }
        }
        
        let idx = 0;
        while (idx < len) {
            let a = _base64Cache[str[idx++]] || 0;
            let b = _base64Cache[str[idx++]] || 0;
            let c = _base64Cache[str[idx++]] || 0;
            let d = _base64Cache[str[idx++]] || 0;
            let bitmap = (a << 18) | (b << 12) | (c << 6) | d;

            result.push(_fromCharCode((bitmap >> 16) & 255));

            if (str[idx - 2] !== "=") {
                result.push(_fromCharCode((bitmap >> 8) & 255));
            }

            if (str[idx - 1] !== "=") {
                result.push(_fromCharCode(bitmap & 255));
            }
        }
    }

    return result.join("");
}
