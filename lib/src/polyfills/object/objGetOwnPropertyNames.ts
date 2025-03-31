/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * Polyfill implementation of Object.getOwnPropertyNames for environments where it doesn't exist.
 * @since 0.11.9
 * @group Polyfill
 * @group Object
 * @param obj - The object whose enumerable and non-enumerable properties are to be returned
 * @returns An array of strings that correspond to the properties found in the object
 * @internal
 */
export function polyObjGetOwnPropertyNames(obj: any): string[] {
    // Ensure we're working with an object
    obj = Object(obj);
    
    const result: string[] = [];
    
    // First get all enumerable properties
    for (const key in obj) {
        // Only include own properties, not ones from the prototype chain
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result.push(key);
        }
    }
    
    // For non-enumerable properties, we can't reliably get them in ES5
    // This is a limitation of the polyfill - native implementations can access non-enumerable properties
    
    return result;
}