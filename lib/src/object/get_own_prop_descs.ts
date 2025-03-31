/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ObjClass } from "../internal/constants";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";
import { objGetOwnPropertyNames } from "./get_own_prop_names";

/**
 * The objGetOwnPropertyDescriptors() method returns all own property descriptors of a given object.
 * @since 0.12.0
 * @group Object
 * @param obj - The object for which to get all own property descriptors
 * @returns An object containing all own property descriptors of the given object
 *
 * @example
 * ```ts
 * const obj = {
 *   get foo() { return 17; },
 *   bar: 42
 * };
 *
 * const descriptors = objGetOwnPropertyDescriptors(obj);
 * // descriptors is:
 * // {
 * //   foo: {
 * //     configurable: true,
 * //     enumerable: true,
 * //     get: [Function: get foo],
 * //     set: undefined
 * //   },
 * //   bar: {
 * //     configurable: true,
 * //     enumerable: true,
 * //     value: 42,
 * //     writable: true
 * //   }
 * // }
 *
 * // This method can be used to create a shallow copy including getters and setters
 * const shallowCopy = objCreate(
 *   objGetPrototypeOf(obj),
 *   objGetOwnPropertyDescriptors(obj)
 * );
 * ```
 */
export const objGetOwnPropertyDescriptors: (obj: any) => PropertyDescriptorMap = (/* #__PURE__ */_pureAssign((/* #__PURE__ */_pureRef<typeof Object.getOwnPropertyDescriptors>(ObjClass, "getOwnPropertyDescriptors")), polyObjGetOwnPropertyDescriptors));


/**
 * Polyfill implementation of Object.getOwnPropertyDescriptors for environments where it doesn't exist.
 * @param obj - The object for which to get all property descriptors
 * @returns An object containing all property descriptors of the given object
 */
export function polyObjGetOwnPropertyDescriptors(obj: any): PropertyDescriptorMap {
    // Ensure we're working with an object
    obj = Object(obj);
    
    const result: PropertyDescriptorMap = {};
    
    // Get all property names, including non-enumerable ones if the environment supports it
    const ownProps = objGetOwnPropertyNames(obj);
    
    for (let i = 0; i < ownProps.length; i++) {
        const propName = ownProps[i];
        // Add descriptor for each property
        const descriptor = Object.getOwnPropertyDescriptor(obj, propName);
        if (descriptor !== undefined) {
            result[propName] = descriptor;
        }
    }
    
    // Handle symbol properties if supported in the environment
    if (typeof Symbol !== "undefined" && Object.getOwnPropertySymbols) {
        const ownSymbols = Object.getOwnPropertySymbols(obj);
        for (let i = 0; i < ownSymbols.length; i++) {
            const symbol = ownSymbols[i];
            const descriptor = Object.getOwnPropertyDescriptor(obj, symbol);
            if (descriptor !== undefined) {
                result[symbol as any] = descriptor;
            }
        }
    }
    
    return result;
}