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
import { strSubstr } from "../string/substring";
import { strUpper } from "../string/upper_lower";
import { isNumber, isStrictNullOrUndefined, isString, isUndefined } from "./base";
import { getInst } from "./environment";
import { throwError } from "./throw";
import { dumpObj } from "./diagnostics";

const DBL_QUOTE = "\"";
const INVALID_JS_NAME = /([^\w\d_$])/g;
const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const HEX_CHARS = "0123456789abcdef";
const _fromCharCode = (/*#__PURE__*/_pureRef<typeof String.fromCharCode>(StrCls, "fromCharCode"));
// The UTF-8 byte order mark, used to identify an encoded value as containing UTF-8 text
const UTF8_BOM = "\xEF\xBB\xBF";
const NON_LATIN1 = /[^\0-\xFF]/;
const SURROGATES = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDFFF]/g;
const _btoa = (/*#__PURE__*/_createBase64Fn("btoa", _encodeBase64Polyfill));
const _atob = (/*#__PURE__*/_createBase64Fn("atob", _decodeBase64Polyfill));
let _htmlEntityCache: { [key: string]: string};
let _base64Cache: { [key: string]: number };

/**
 * @internal
 * @ignore
 * Creates the function which calls the named native function when available, otherwise the polyfill (the decoding
 * polyfill follows the same rules as atob(), so it also throws for a value which isn't valid). The native function is
 * called without a `this`, as it fails in a browser when called as a member of another object.
 */
/*#__NO_SIDE_EFFECTS__*/
function _createBase64Fn(name: string, polyFn: (value: string) => string) {
    let theFn: (value: string) => string;

    return (value: string) => (theFn || (theFn = getInst<(value: string) => string>(name) || polyFn))(value);
}

/**
 * @internal
 * @ignore
 * Identifies whether the value starts with the marker, checking the first byte first as very few values will have it
 */
function _hasUtf8Bom(value: string): boolean {
    return value.charCodeAt(0) === 0xEF && value.substring(0, 3) === UTF8_BOM;
}

/**
 * @internal
 * @ignore
 * Converts the text into a string of bytes (one per character) to be encoded. Text which only contains Latin-1
 * characters already fits, otherwise (or if it would be mistaken for marked text) it becomes the UTF-8 byte order
 * mark followed by the UTF-8 bytes, so that it can be identified and restored by {@link _fromBinary}.
 */
function _toBinary(value: string): string {
    // An unpaired surrogate is not valid text and encodeURIComponent() rejects it, so like TextEncoder it becomes U+FFFD
    return NON_LATIN1.test(value) || _hasUtf8Bom(value) ?
        UTF8_BOM + strReplace(encodeURIComponent(strReplace(value, SURROGATES, (match) => match[1] ? match : "\uFFFD")), /%../g, (match) => _fromCharCode(parseInt(match.substring(1), 16))) :
        value;
}

/**
 * @internal
 * @ignore
 * Decodes the base64 value, returning undefined when it isn't valid
 */
function _decodeBase64(value: string): string {
    let result: string;

    try {
        result = _fromBinary(_atob(value));
    } catch (e) {
        // Not a valid base64 value
    }

    return result;
}

/**
 * @internal
 * @ignore
 * Converts decoded bytes back into text, the bytes are returned as-is unless they are the UTF-8 byte order mark
 * followed by valid UTF-8.
 */
function _fromBinary(value: string): string {
    if (value.length > 3 && _hasUtf8Bom(value)) {
        try {
            return decodeURIComponent(strReplace(value.substring(3), /[%\x80-\xFF]/g, (match) => "%" + match.charCodeAt(0)[TO_STRING](16)));
        } catch (e) {
            // Not valid UTF-8, so the bytes are returned as-is
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
        result = _btoa(_toBinary(asString(value)));
    }

    return result || EMPTY;
}

/**
 * Decode a Base64 encoded string.
 * A value that starts with the UTF-8 byte order mark and contains valid UTF-8 is decoded as UTF-8 text, all other
 * values are decoded as one character per byte. Like `atob()`, ASCII whitespace is ignored and the padding is optional,
 * a value which isn't valid Base64 is returned as-is.
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
        result = _decodeBase64(asString(value));
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
 * values are decoded as one character per byte. Like `atob()`, ASCII whitespace is ignored and the padding is optional,
 * a value which isn't valid Base64 is returned as-is.
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
        // Like atob() the padding is optional, so only the URL-safe characters need to be converted back
        result = _decodeBase64(strReplace(strReplace(asString(value), /-/g, "+"), /_/g, "/"));
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

            hex.push(HEX_CHARS[(code >> 4) & 0xf], HEX_CHARS[code & 0xf]);
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

            result.push(
                BASE64_CHARS[(bitmap >> 18) & 63],
                BASE64_CHARS[(bitmap >> 12) & 63],
                hasB ? BASE64_CHARS[(bitmap >> 6) & 63] : "=",
                hasC ? BASE64_CHARS[bitmap & 63] : "="
            );
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
        // Like atob(), ASCII whitespace is ignored and the padding is optional
        str = strReplace(asString(str), /[\t\n\f\r ]+/g, EMPTY);
        if (!(str.length % 4)) {
            str = strReplace(str, /==?$/, EMPTY);
        }

        if (str.length % 4 === 1 || /[^A-Za-z0-9+\/]/.test(str)) {
            throwError("Invalid character");
        }

        // Build the Base64 character cache if it doesn't exist
        if (!_base64Cache) {
            _base64Cache = {};
            for (let i = 0; i < BASE64_CHARS.length; i++) {
                _base64Cache[BASE64_CHARS[i]] = i;
            }
        }

        // Each character is 6 bits, every 8 bits is a byte and any remaining bits are discarded (like atob())
        let bits = 0;
        let bitCount = 0;
        for (let idx = 0; idx < str.length; idx++) {
            bits = (bits << 6) | _base64Cache[str[idx]];
            bitCount += 6;

            if (bitCount >= 8) {
                bitCount -= 8;
                result.push(_fromCharCode((bits >> bitCount) & 255));
            }
        }
    }

    return result.join("");
}
