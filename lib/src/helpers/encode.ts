/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { NULL_VALUE, UNDEF_VALUE } from "../internal/constants";
import { asString } from "../string/as_string";
import { strCamelCase } from "../string/conversion";
import { strPadStart } from "../string/pad";
import { strUpper } from "../string/upper_lower";
import { isNumber, isString, isUndefined } from "./base";
import { dumpObj } from "./diagnostics";
import { getLazy, ILazyValue } from "./lazy";

const DBL_QUOTE = "\"";
const INVALID_JS_NAME = /([^\w\d_$])/g;
let _htmlEntityCache: ILazyValue<{ [key: string]: string}>;

/**
 * Validates that the string name conforms to the JS IdentifierName specification and if not
 * normalizes the name so that it would. This method does not identify or change any keywords
 * meaning that if you pass in a known keyword the same value will be returned.
 * @since 0.9.0
 * @group Conversion
 * @group Value
 * @param jsName - The string value to validate
 * @param camelCase - Optionally (see [1]) convert into CamelCase with the leading character either
 * - `true` => lowercase
 * - 'false' => uppercase
 * - undefined => not converted
 * @return The original string name, if it conforms to the JS naming convention otherwise an encoded version.
 *
 * > **[1]**: Camel casing the name will remove all non-word characters from the result
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

            var hex = match.charCodeAt(0).toString(16);
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
    !_htmlEntityCache && (_htmlEntityCache = getLazy(() => {
        return {
            "&": "amp",
            "<": "lt",
            ">": "gt",
            [DBL_QUOTE]: "quot",
            "'": "#39"
        }
    }));
    
    return asString(value).replace(/[&<>"']/g, match => "&" + _htmlEntityCache.v[match] + ";");
}
