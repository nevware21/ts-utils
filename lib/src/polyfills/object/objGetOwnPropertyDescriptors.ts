/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { polyObjGetOwnPropertyNames } from "./objGetOwnPropertyNames";
import { polyObjGetOwnPropertyDescriptor } from "./objGetOwnPropertyDescriptor";

/**
 * Polyfill implementation of Object.getOwnPropertyDescriptors for environments where it doesn't exist.
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param obj - The object for which to get all property descriptors
 * @returns An object containing all property descriptors of the given object
 * @internal
 */
export function polyObjGetOwnPropertyDescriptors(obj: any): PropertyDescriptorMap {
    // Ensure we're working with an object
    obj = Object(obj);
    
    const result: PropertyDescriptorMap = {};
    
    // Get all property names, including non-enumerable ones if the environment supports it
    const ownProps = Object.getOwnPropertyNames ?
        Object.getOwnPropertyNames(obj) :
        polyObjGetOwnPropertyNames(obj);
    
    for (let i = 0; i < ownProps.length; i++) {
        const propName = ownProps[i];
        // Add descriptor for each property
        const descriptor = Object.getOwnPropertyDescriptor ?
            Object.getOwnPropertyDescriptor(obj, propName) :
            polyObjGetOwnPropertyDescriptor(obj, propName);
            
        if (descriptor !== undefined) {
            result[propName] = descriptor;
        }
    }
    
    // Handle symbol properties if supported in the environment
    if (typeof Symbol !== "undefined" && Object.getOwnPropertySymbols) {
        const ownSymbols = Object.getOwnPropertySymbols(obj);
        for (let i = 0; i < ownSymbols.length; i++) {
            const symbol = ownSymbols[i];
            const descriptor = Object.getOwnPropertyDescriptor ?
                Object.getOwnPropertyDescriptor(obj, symbol) :
                polyObjGetOwnPropertyDescriptor(obj, symbol);
                
            if (descriptor !== undefined) {
                result[symbol as any] = descriptor;
            }
        }
    }
    
    return result;
}