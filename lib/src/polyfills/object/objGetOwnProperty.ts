/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../../array/forEach";
import { arrIndexOf } from "../../array/indexOf";
import { isArray, isString } from "../../helpers/base";
import { GET_OWN_PROPERTY_NAMES, GET_OWN_PROPERTY_SYMBOLS, LENGTH, ObjClass, ObjProto } from "../../internal/constants";
import { _objGetOwnPropertyDescriptor } from "../../internal/own_props";
import { _returnEmptyArray } from "../../internal/stubs";
import { _throwIfNullOrUndefined } from "../../internal/throwIf";
import { _pureAssign, _pureRef } from "../../internal/treeshake_helpers";
import { polyObjHasOwn } from "../../object/has_own";
import { getKnownSymbol } from "../../symbol/symbol";
import { WellKnownSymbols } from "../../symbol/well_known";

/**
 * An internal flag to prevent recursion when calling polyObjGetOwnPropertyDescriptors
 * from within itself. This is necessary to avoid infinite loops in certain environments.
 */
let _recursionCheckOwnDescriptors: boolean;

/**
 * An internal flag to prevent recursion when calling polyObjGetOwnPropertySymbols
 * from within itself. This is necessary to avoid infinite loops in certain environments.
 */
let _recursionCheckOwnSymbols: boolean;

// Defining these locally to avoid tree-shaking issues with the polyfill and circular references (the shared
// _objGetOwnPropertyDescriptor is from own_props, which has no polyfill dependencies). Unlike the shared one, a
// runtime without Object.getOwnPropertySymbols() uses the polyfill, which finds the well-known symbols
const _objGetOwnPropertyNames: (obj: any) => string[] = (/* #__PURE__ */_pureAssign((/* #__PURE__ */_pureRef<typeof Object.getOwnPropertyNames>(ObjClass, GET_OWN_PROPERTY_NAMES)), _returnEmptyArray));
const _objGetOwnPropertySymbols: (obj: any) => symbol[] = (/* #__PURE__ */_pureAssign((/* #__PURE__ */_pureRef<typeof Object.getOwnPropertySymbols>(ObjClass, GET_OWN_PROPERTY_SYMBOLS)), _polyObjGetOwnPropertySymbols));

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

    if (!_recursionCheckOwnDescriptors) {
        // Add the descriptor for each property
        const _addDescriptor = (key: PropertyKey) => {
            const descriptor = _objGetOwnPropertyDescriptor(obj, key);
            if (descriptor !== undefined) {
                result[key as any] = descriptor;
            }
        };

        try {
            _recursionCheckOwnDescriptors = true;

            // Get all property names, including non-enumerable ones if the environment supports it, and the
            // symbol properties, every symbol when there is a native Object.getOwnPropertySymbols() (eg. a runtime
            // with Symbol but without Object.getOwnPropertyDescriptors()), otherwise only the well-known symbols
            arrForEach(_objGetOwnPropertyNames(obj), _addDescriptor);
            arrForEach(_objGetOwnPropertySymbols(obj), _addDescriptor);
        } finally {
            _recursionCheckOwnDescriptors = false;
        }
    }

    return result;
}

/**
 * Polyfill implementation for Object.getOwnPropertySymbols, this only returns the well known symbols
 * and not any user defined or unique (non-registered) symbols.
 * @internal Not directly exported, only used for polyfillling
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param obj - The object whose symbol properties are to be returned
 * @returns An array of all symbol properties found directly upon the given object
 */
export function _polyObjGetOwnPropertySymbols(obj: any): symbol[] {
    let result: any = [];
    let objHasOwn = (ObjClass as any).hasOwn || polyObjHasOwn;

    if (!_recursionCheckOwnSymbols) {
        // Custom implementation for environments without native support but with Symbol
        try {
            _recursionCheckOwnSymbols = true;

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
            _recursionCheckOwnSymbols = false;
        }
    }
    
    return result;
}


/**
 * Polyfill implementation of Object.getOwnPropertyNames for environments where it doesn't exist.
 * @internal Not directly exported, now only used for polyfillling
 * @since 0.11.9
 * @group Polyfill
 * @group Object
 * @param obj - The object whose enumerable and non-enumerable properties are to be returned
 * @returns An array of strings that correspond to the properties found in the object
 */
export function _polyObjGetOwnPropertyNames(obj: any): string[] {
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

