/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * Polyfill implementation of Object.getOwnPropertyDescriptor for environments where it doesn't exist.
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param obj - The object whose property descriptor is to be returned
 * @param prop - The name or Symbol of the property whose description is to be retrieved
 * @returns A property descriptor of the given property if it exists on the object, otherwise undefined
 * @internal
 */
export function polyObjGetOwnPropertyDescriptor(obj: any, prop: PropertyKey): PropertyDescriptor | undefined {
    // Ensure we're working with an object
    if (obj === null || obj === undefined) {
        throw new TypeError("Cannot convert undefined or null to object");
    }
    
    obj = Object(obj);
    
    // Handle non-string property keys
    const propStr = String(prop);
    
    // Check if the property exists on the object
    if (!Object.prototype.hasOwnProperty.call(obj, propStr)) {
        return undefined;
    }
    
    // Create a default descriptor for the property
    let descriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: true
    };
    
    // Try to identify if it's a data property or accessor property
    // This is a limitation of the polyfill as we can't reliably detect non-writable or non-configurable properties
    const prototype = Object.prototype;
    const getOwnPropertyNames = Object.getOwnPropertyNames;
    
    // Check if getter or setter exists (very limited detection)
    const getterName = "__lookupGetter__";
    const setterName = "__lookupSetter__";
    
    if (getterName in prototype && setterName in prototype) {
        const getter = obj.__lookupGetter__(propStr);
        const setter = obj.__lookupSetter__(propStr);
        
        if (getter || setter) {
            // It's an accessor property
            if (getter) {
                descriptor.get = getter;
            }
            if (setter) {
                descriptor.set = setter;
            }
        } else {
            // It's a data property
            descriptor.value = obj[propStr];
            descriptor.writable = true;
        }
    } else {
        // It's a data property (we can't detect if it's non-writable in older environments)
        descriptor.value = obj[propStr];
        descriptor.writable = true;
    }
    
    return descriptor;
}