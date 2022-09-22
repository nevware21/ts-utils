/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isNumber, objToString } from "./base";

/**
 * Returns string representation of an object suitable for diagnostics logging.
 * @group Error
 * @group Diagnostic
 */
export function dumpObj(object: any, format?: boolean | number): string {
    const objectTypeDump: string = objToString(object);
    let propertyValueDump = "";
    if (objectTypeDump === "[object Error]") {
        propertyValueDump = "{ stack: '" + object.stack + "', message: '" + object.message + "', name: '" + object.name + "'";
    } else {
        try {
            if (format) {
                if (isNumber(format)) {
                    propertyValueDump = JSON.stringify(object, null, format);
                } else {
                    propertyValueDump = JSON.stringify(object, null, 4);
                }
            } else {
                propertyValueDump = JSON.stringify(object);
            }
        } catch(e) {
            // Unable to convert object (probably circular)
            propertyValueDump = objToString(object) + " - " + dumpObj(e, format);
        }
    }

    return objectTypeDump + ": " + propertyValueDump;
}
