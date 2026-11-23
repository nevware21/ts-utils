/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrIndexOf } from "../../array/indexOf";
import { isArray, isString } from "../../helpers/base";
import { LENGTH, NULL_VALUE, ObjClass, ObjProto, UNDEFINED, UNDEF_VALUE } from "../../internal/constants";
import { _objGetOwnPropertyDescriptor, _objGetOwnPropertyNames, _objGetOwnPropertySymbols } from "../../internal/own_props";
import { _throwIfNullOrUndefined } from "../../internal/throwIf";
import { _pureRef } from "../../internal/treeshake_helpers";
import { _setOwnValue } from "../../object/define";

// The shared _objGetOwnPropertyDescriptor, _objGetOwnPropertyNames and _objGetOwnPropertySymbols are from own_props,
// which has no polyfill dependencies (avoiding tree-shaking issues with the polyfill and circular references). The
// symbols come from the native Object.getOwnPropertySymbols() (none without it): every runtime with a native Symbol
// has it, and without Symbol a polyfill symbol is a string key, so getOwnPropertyNames() already returns it (the
// well-known symbol polyfill, which an earlier version used, isn't needed and would add the Symbol polyfill)

// The native Reflect.ownKeys() (when there is one), which (like the native Object.getOwnPropertyDescriptors()) reads
// every own key (names and symbols) once, eg. a Proxy's ownKeys trap is only called once
const _reflectOwnKeys: (obj: any) => PropertyKey[] = (/* #__PURE__ */_pureRef<any>(typeof Reflect !== UNDEFINED ? Reflect : NULL_VALUE, "ownKeys"));

/**
 * Polyfill implementation of Object.getOwnPropertyDescriptors for environments where it doesn't exist.
 *
 * Like the native function the value is converted to an object (so `null` and `undefined` throw a `TypeError`), its
 * own keys (names and symbols) are read once, and the descriptor of each one is added as an own property of the
 * result (so a `__proto__` key doesn't change the result's prototype, and a setter or read-only property of the same
 * name on `Object.prototype` doesn't stop it being added).
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param obj - The object for which to get all property descriptors
 * @returns An object containing all property descriptors of the given object
 */
export function polyObjGetOwnPropertyDescriptors(obj: any): PropertyDescriptorMap {
    const result: PropertyDescriptorMap = {};

    _throwIfNullOrUndefined(obj);
    let theObj = ObjClass(obj);

    // Every own key, read once with Reflect.ownKeys() when there is one, otherwise the property names (including
    // non-enumerable ones) and the symbols (none without a native Object.getOwnPropertySymbols(), see above)
    // The keys are looped here (rather than with arrForEach), so a replaced Function.prototype.call isn't used
    let keys = _reflectOwnKeys ? _reflectOwnKeys(theObj) : (_objGetOwnPropertyNames(theObj) as PropertyKey[]).concat(_objGetOwnPropertySymbols(theObj));
    for (let idx = 0; idx < keys[LENGTH]; idx++) {
        const descriptor = _objGetOwnPropertyDescriptor(theObj, keys[idx]);
        if (descriptor !== UNDEF_VALUE) {
            _setOwnValue(result, keys[idx], descriptor);
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

