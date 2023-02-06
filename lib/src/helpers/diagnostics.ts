/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { UNDEF_VALUE } from "../internal/constants";
import { isError, isNumber, objToString } from "./base";

/**
 * Returns string representation of an object suitable for diagnostics logging.
 * @group Error
 * @group Diagnostic
 */
export function dumpObj(object: any, format?: boolean | number): string {
    let propertyValueDump = "";
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
