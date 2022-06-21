/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isObject } from "../helpers/base";
import { objHasOwnProperty } from "../object/has_own_prop";

/**
 * Returns the names of the enumerable string properties and methods of an object. This helper exists to avoid adding a polyfil for older browsers
 * that do not define Object.keys eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
 * Note: For consistency this will not use the Object.keys implementation if it exists as this would cause a testing requirement to test with and without the implementations
 * @param obj Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
 */
export function polyObjKeys(obj: any): string[] {
    if (!isObject(obj) || obj === null) {
        throw new TypeError("polyObjKeys called on non-object");
    }

    const result: string[] = [];
    for (const prop in obj) {
        if (objHasOwnProperty(obj, prop)) {
            result.push(prop);
        }
    }

    return result;
}
