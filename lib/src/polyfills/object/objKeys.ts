/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isObject } from "../../helpers/base";
import { dumpObj } from "../../helpers/diagnostics";
import { throwTypeError } from "../../helpers/throw";
import { _throwIfNullOrUndefined } from "../../internal/throwIf";
import { objHasOwn } from "../../object/has_own";

/**
 * Returns the names of the enumerable string properties and methods of an object. This helper exists to avoid adding a polyfil for older browsers
 * that do not define Object.keys eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
 * Note: For consistency this will not use the Object.keys implementation if it exists as this would cause a testing requirement to test with and without the implementations
 * @group Polyfill
 * @group Object
 * @param obj - Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyObjKeys(obj: any): string[] {
    _throwIfNullOrUndefined(obj);
    if (!isObject(obj)) {
        throwTypeError("non-object " + dumpObj(obj));
    }

    const result: string[] = [];
    for (const prop in obj) {
        if (objHasOwn(obj, prop)) {
            result.push(prop);
        }
    }

    return result;
}