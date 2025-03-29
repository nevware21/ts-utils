/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArray, isNumber, isString } from "../../helpers/base";
import { GETTER_NAME, LENGTH, ObjProto, SETTER_NAME } from "../../internal/constants";
import { _throwIfNullOrUndefined } from "../../internal/throwIf";
import { objHasOwnProperty } from "../../object/has_own_prop";
import { objPropertyIsEnumerable } from "../../object/property_is_enumerable";

/**
 * Determines if a property on an object is writable without using Object.getOwnPropertyDescriptor.
 * This is useful in environments where Object.getOwnPropertyDescriptor isn't available.
 *
 * The function uses several techniques to check writability:
 * 1. If the object is frozen, no properties are writable
 * 2. If the property is special (like 'length' on arrays and strings), it may have special writability rules
 * 3. Otherwise, attempts to modify the property and checks if the modification succeeded
 *
 * @internal
 * @since 0.12.0
 * @group Object
 * @param obj - The object whose property is to be checked
 * @param prop - The name or Symbol of the property to check
 * @returns true if the property is writable, false otherwise
 */
function _isPropertyWritable(obj: any, prop: PropertyKey): boolean {
    let result = false;
        
    // Special case for string indices and array/string length
    if (!(isString(obj) && (prop === LENGTH || isNumber(prop) || (isString(prop) && !isNaN(Number(prop)))))) {
        // Use a try/catch approach to determine writability
        const originalValue = obj[prop];
        
        try {
            // Try to assign the same value back to the property
            obj[prop] = originalValue;
            result = true; // If no error, the property is writable
        } catch (e) {
            // If error (TypeError), the property is not writable
        }
    }

    return result;
}

/**
 * Polyfill implementation of Object.getOwnPropertyDescriptor for environments where it doesn't exist.
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param obj - The object whose property descriptor is to be returned
 * @param prop - The name or Symbol of the property whose description is to be retrieved
 * @returns A property descriptor of the given property if it exists on the object, otherwise undefined
 */
export function polyObjGetOwnPropertyDescriptor(obj: any, prop: PropertyKey): PropertyDescriptor | undefined {
    let descriptor: PropertyDescriptor | undefined;

    // Ensure we're working with an object
    _throwIfNullOrUndefined(obj);
    
    //Enumerable flag should match for property 'lastIndex' for
    // [object RegExp]: {}: [[object Object]: {value: 0,writable: true,enumerable: false,configurable: false}];
    // [[object Object]: {configurable: true,enumerable: true,value: 0,writable: true}]: expected true to equal false

    let isLength = (prop === LENGTH && (isArray(obj) || isString(obj)));

    // Check if the property exists on the object
    if (isLength || objHasOwnProperty(obj, prop)) {
        // Create a default descriptor for the property
        descriptor = {
            configurable: !isLength,
            enumerable: !isLength ? objPropertyIsEnumerable(obj, prop) : false
        };
    
        let isData = true; // Assume it's a data property by default
        
        // Try to identify if it's a data property or accessor property
        // This is a limitation of the polyfill as we can't reliably detect non-writable or non-configurable properties
        if (GETTER_NAME in ObjProto && SETTER_NAME in ObjProto) {
            const getter = obj[GETTER_NAME](prop);
            const setter = obj[SETTER_NAME](prop);
            
            if (getter || setter) {
                isData = false; // It's an accessor property
                // It's an accessor property
                if (getter) {
                    descriptor.get = getter;
                }
                if (setter) {
                    descriptor.set = setter;
                }
            }
        }
        
        if (isData) {
            // It's a data property (we can't detect if it's non-writable in older environments)
            descriptor.value = obj[prop];
            descriptor.writable = _isPropertyWritable(obj, prop); // Check if the property is writable
        }
    }

    return descriptor;
}
