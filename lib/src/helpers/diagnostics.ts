/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { CALL, EMPTY, NULL_VALUE, ObjProto, TO_STRING, UNDEF_VALUE } from "../internal/constants";
import { asString } from "../string/as_string";

const ERROR_TYPE = "[object Error]";

/**
 * Returns string representation of an object suitable for diagnostics logging.
 * @group Error
 * @group Diagnostic
 * @param object - The object to be converted to a diagnostic string value
 * @param format - Identifies whether the JSON value should be formated
 * - `true` - Format with 4 spaces
 * - 'number' - The number of spaces to format with
 * - `false` (or not Truthy) - Do not format
 * @returns A string representation of the object suitable for diagnostics logging
 * @example
 * ```ts
 * let obj = { a: 1, b: "Hello", c: { d: 2, e: "Darkness" } };
 *
 * let objStr = dumpObj(obj);
 * // objStr === "[object Object]: { a: 1, b: "Hello", c: { d: 2, e: "Darkness" } }"
 *
 * let objStrFmt = dumpObj(obj, true);
 * // objStrFmt === "[object Object]: {\n    a: 1,\n    b: "Hello",\n    c: {\n        d: 2,\n        e: "Darkness"\n    }\n}"
 *
 * let objStrFmt2 = dumpObj(obj, 2);
 * // objStrFmt2 === "[object Object]: {\n  a: 1,\n  b: "Hello",\n  c: {\n    d: 2,\n    e: "Darkness"\n  }\n}"
 *
 * let objStrFmt3 = dumpObj(obj, 0);
 * // objStrFmt3 === "[object Object]: { a: 1, b: "Hello", c: { d: 2, e: "Darkness" } }"
 *
 * let objStrFmt4 = dumpObj(obj, false);
 * // objStrFmt4 === "[object Object]: { a: 1, b: "Hello", c: { d: 2, e: "Darkness" } }"
 *
 * let objStrFmt5 = dumpObj(obj, null);
 * // objStrFmt5 === "[object Object]: { a: 1, b: "Hello", c: { d: 2, e: "Darkness" } }"
 *
 * let objStrFmt6 = dumpObj(obj, undefined);
 * // objStrFmt6 === "[object Object]: { a: 1, b: "Hello", c: { d: 2, e: "Darkness" } }"
 *
 * let objStrFmt7 = dumpObj(obj, "");
 * // objStrFmt7 === "[object Object]: { a: 1, b: "Hello", c: { d: 2, e: "Darkness" } }"
 *
 * let err = new Error("Hello Darkness");
 * let errStr = dumpObj(err);
 * // errStr === "[object Error]: { stack: 'Error: Hello Darkness\n    at <anonymous>:1:13', message: 'Hello Darkness', name: 'Error'"
 *
 * let errStrFmt = dumpObj(err, true);
 * // errStrFmt === "[object Error]: {\n    stack: "Error: Hello Darkness\n    at <anonymous>:1:13",\n    message: "Hello Darkness",\n    name: "Error"\n}"
 *
 * let errStrFmt2 = dumpObj(err, 2);
 * // errStrFmt2 === "[object Error]: {\n  stack: "Error: Hello Darkness\n    at <anonymous>:1:13",\n  message: "Hello Darkness",\n  name: "Error"\n}"
 *
 * let errStrFmt3 = dumpObj(err, 0);
 * // errStrFmt3 === "[object Error]: { stack: "Error: Hello Darkness\n    at <anonymous>:1:13", message: "Hello Darkness", name: "Error" }"
 *
 * ```
 * @see {@link dumpObj}
 */
/*#__NO_SIDE_EFFECTS__*/
export function dumpObj(object: any, format?: boolean | number): string {
    let propertyValueDump = EMPTY;
    const objType = ObjProto[TO_STRING][CALL](object);
    if (objType === ERROR_TYPE) {
        object = { stack: asString(object.stack), message: asString(object.message), name: asString(object.name) };
    }

    try {
        propertyValueDump = JSON.stringify(object, NULL_VALUE, format ? (((typeof format as unknown) === "number") ? format as number : 4) : UNDEF_VALUE);
        propertyValueDump = (propertyValueDump && propertyValueDump.replace(/"(\w+)"\s*:\s{0,1}/g, "$1: ")) || asString(object);
    } catch(e) {
        // Unable to convert object (probably circular)
        propertyValueDump = " - " + dumpObj(e, format);
    }

    return objType + ": " + propertyValueDump;
}
