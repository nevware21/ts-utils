/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrIndexOf } from "../../array/indexOf";
import { isArray, isString } from "../../helpers/base";
import { LENGTH, ObjProto } from "../../internal/constants";
import { _throwIfNullOrUndefined } from "../../internal/throwIf";

/**
 * Polyfill implementation of Object.getOwnPropertyNames for environments where it doesn't exist.
 * @since 0.11.9
 * @group Polyfill
 * @group Object
 * @param obj - The object whose enumerable and non-enumerable properties are to be returned
 * @returns An array of strings that correspond to the properties found in the object
 */
export function polyObjGetOwnPropertyNames(obj: any): string[] {
    const result: string[] = [];
    
    _throwIfNullOrUndefined(obj);
    
    // First get all enumerable properties
    for (const key in obj) {
        // Only include own properties, not ones from the prototype chain
        if (ObjProto.hasOwnProperty.call(obj, key)) {
            result.push(key);
        }
    }
    
    if (isArray(obj) || isString(obj)) {
        // If the object is an array or string, we need to add the length property
        if (arrIndexOf(result, LENGTH) === -1) {
            // Only add length if it doesn't already exist in the result array
            result.push(LENGTH);
        }
    }

    // For non-enumerable properties, we can't reliably get them in ES5
    // This is a limitation of the polyfill - native implementations can access non-enumerable properties
    
    return result;
}