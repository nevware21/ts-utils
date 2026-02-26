/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { EMPTY, NULL_VALUE, TO_STRING, UNDEF_VALUE } from "../internal/constants";
import { asString } from "../string/as_string";
import { strCamelCase } from "../string/conversion";
import { strPadStart } from "../string/pad";
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
let _btoa: ICachedValue<(value: string) => string>;
let _atob: ICachedValue<(value: string) => string>;
let _htmlEntityCache: { [key: string]: string};
let _base64Cache: { [key: string]: number };

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
    let result = asString(jsName).replace(INVALID_JS_NAME, "_");

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
        result = DBL_QUOTE + value.replace(/[^\w .,\-!@#$%\^&*\(\)_+={}\[\]:;|<>?]/g, (match) => {
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
    
    return asString(value).replace(/[&<>"']/g, match => "&" + _htmlEntityCache[match] + ";");
}

/**
 * Encode a string value as Base64
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
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function encodeAsBase64(value: string): string {
    let result: string;

    if (value || !isStrictNullOrUndefined(value)) {
        result = asString(value);

        try {
            // Use native btoa if available
            !_btoa && (_btoa = safeGetDeferred(() => !isUndefined(btoa) ? btoa : _encodeBase64Polyfill, _encodeBase64Polyfill));
            result = _btoa.v(result);
        } catch (e) {
            // Use polyfill on error
            result = _encodeBase64Polyfill(result);
        }
    }

    return result || EMPTY;
}

/**
 * Decode a Base64 encoded string
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
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function decodeBase64(value: string): string {
    let result: string;

    if (value || !isStrictNullOrUndefined(value)) {
        result = asString(value);

        try {
            // Use native atob if available
            !_atob && (_atob = safeGetDeferred(() => !isUndefined(atob) ? atob : _decodeBase64Polyfill, _decodeBase64Polyfill));
            result = _atob.v(result);
        } catch (e) {
            // Use polyfill on error
            result = _decodeBase64Polyfill(result);
        }
    }

    return result || value || EMPTY;
}

/**
 * Encode a string as URL-safe Base64
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
        encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    }

    return encoded || EMPTY;
}

/**
 * Decode a URL-safe Base64 encoded string
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

        result = decodeBase64(result.replace(/-/g, "+").replace(/_/g, "/")) || EMPTY;
    }

    return result || value || EMPTY;
}

/**
 * Encode a string as hexadecimal
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
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function encodeAsHex(value: string): string {
    let result: string;

    if (value || !isStrictNullOrUndefined(value)) {
        result = asString(value);

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
 * Decode a hexadecimal encoded string
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
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function decodeHex(value: string): string {
    let result = [];

    if (value || !isStrictNullOrUndefined(value)) {
        let theValue = asString(value);

        for (let idx = 0; idx < theValue.length; idx += 2) {
            result.push(String.fromCharCode(parseInt(strSubstr(theValue, idx, 2), 16)));
        }
    }

    return result.join("");
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

            result.push(String.fromCharCode((bitmap >> 16) & 255));

            if (str[idx - 2] !== "=") {
                result.push(String.fromCharCode((bitmap >> 8) & 255));
            }

            if (str[idx - 1] !== "=") {
                result.push(String.fromCharCode(bitmap & 255));
            }
        }
    }

    return result.join("");
}
