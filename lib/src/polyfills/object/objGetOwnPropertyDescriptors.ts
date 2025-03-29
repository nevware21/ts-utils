/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../../array/forEach";
import { ObjClass } from "../../internal/constants";
import { _throwIfNullOrUndefined } from "../../internal/throwIf";
import { objGetOwnPropertyNames } from "../../object/get_own_property_names";
import { getKnownSymbol } from "../../symbol/symbol";
import { WellKnownSymbols } from "../../symbol/well_known";
import { polyObjGetOwnPropertyDescriptor } from "./objGetOwnPropertyDescriptor";
import { polyObjHasOwn } from "./objHasOwn";

let recursionCheckOwnDescriptors: boolean;

/**
 * Polyfill implementation of Object.getOwnPropertyDescriptors for environments where it doesn't exist.
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param obj - The object for which to get all property descriptors
 * @returns An object containing all property descriptors of the given object
 */
export function polyObjGetOwnPropertyDescriptors(obj: any): PropertyDescriptorMap {
    const result: PropertyDescriptorMap = {};
        
    // Ensure we're working with an object
    _throwIfNullOrUndefined(obj);

    if (!recursionCheckOwnDescriptors) {
        try {
            recursionCheckOwnDescriptors = true;
            
            // Get all property names, including non-enumerable ones if the environment supports it
            arrForEach(objGetOwnPropertyNames(obj), (propName) => {
                // Add descriptor for each property
                const descriptor = polyObjGetOwnPropertyDescriptor(obj, propName);
                if (descriptor !== undefined) {
                    result[propName] = descriptor;
                }
            });
            
            // Handle symbol properties if supported in the environment
            arrForEach(polyObjGetOwnPropertySymbols(obj), (sym) => {
                const descriptor = polyObjGetOwnPropertyDescriptor(obj, sym);
                    
                if (descriptor !== undefined) {
                    result[sym as any] = descriptor;
                }
            });
        } finally {
            recursionCheckOwnDescriptors = false;
        }
    }

    return result;
}

let recursionCheckOwnSymbols: boolean;

/**
 * Polyfill implementation for Object.getOwnPropertySymbols, this only returns the well known symbols
 * and not any user defined or unique (non-registered) symbols.
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param obj - The object whose symbol properties are to be returned
 * @returns An array of all symbol properties found directly upon the given object
 */
export function polyObjGetOwnPropertySymbols(obj: any): symbol[] {
    let result: any = [];
    let objHasOwn = (ObjClass as any).hasOwn || polyObjHasOwn;

    if (!recursionCheckOwnSymbols) {
        // Custom implementation for environments without native support but with Symbol
        try {
            recursionCheckOwnSymbols = true;

            // First check all well-known symbols
            let symEnum: WellKnownSymbols = WellKnownSymbols.asyncIterator;
            while (symEnum <= WellKnownSymbols.unscopables) {
                var sym = getKnownSymbol(symEnum);
                
                // Check if this symbol exists as an own property on the object
                // using objHasOwn instead of objHasOwnProperty to catch non-enumerable symbols
                if (sym && objHasOwn(obj, sym)) {
                    result.push(sym);
                }

                symEnum++;
            }
        } finally {
            recursionCheckOwnSymbols = false;
        }
    }
    
    return result;
}
