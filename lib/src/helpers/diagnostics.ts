/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { EMPTY, UNDEF_VALUE } from "../internal/constants";
import { isError, isNumber, objToString } from "./base";

/**
 * Returns string representation of an object suitable for diagnostics logging.
 * @group Error
 * @group Diagnostic
 * @param object - The object to be converted to a diagnostic string value
 * @param format - Identifies whether the JSON value should be formated
 * - `true` - Format with 4 spaces
 * - 'number' - The number of spaces to format with
 * - `false` (or not Truthy) - Do not format
 */
export function dumpObj(object: any, format?: boolean | number): string {
    let propertyValueDump = EMPTY;
    if (isError(object)) {
        propertyValueDump = "{ stack: '" + object.stack + "', message: '" + object.message + "', name: '" + object.name + "'";
    } else {
        try {
            propertyValueDump = JSON.stringify(object, null, format ? (isNumber(format) ? format : 4) : UNDEF_VALUE);
        } catch(e) {
            // Unable to convert object (probably circular)
            propertyValueDump = " - " + dumpObj(e, format);
        }
    }

    return objToString(object) + ": " + propertyValueDump;
}
