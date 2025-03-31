/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { throwTypeError } from "../helpers/throw";
import { ObjClass, ObjProto } from "../internal/constants";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";
import { asString } from "../string/as_string";
import { objHasOwnProperty } from "./has_own_prop";

/**
 * The objGetOwnPropertyDescriptor() method returns an object describing the configuration of a specific property on
 * a given object (that is, one directly present on an object and not in the object's prototype chain). The object
 * returned is mutable but mutating it has no effect on the original property's configuration.
 * @since 0.4.3
 * @group Object
 * @param target - Object that contains the property.
 * @param prop - Name of the property.
 * @returns A property descriptor of the given property if it exists on the object, otherwise undefined.
 *
 * @example
 * ```ts
 * o = {};
 * objDefineProp(o, 'qux', {
 *   value: 8675309,
 *   writable: false,
 *   enumerable: false
 * });
 * d = objGetOwnPropertyDescriptor(o, 'qux');
 * // d is {
 * //   value: 8675309,
 * //   writable: false,
 * //   enumerable: false,
 * //   configurable: false
 * // }
 *
 * objGetOwnPropertyDescriptor('foo', 0);
 * // TypeError: "foo" is not an object  // ES5 code
 *
 * objGetOwnPropertyDescriptor('foo', 0);
 * // Object returned by ES2015 code: {
 * //   configurable: false,
 * //   enumerable: true,
 * //   value: "f",
 * //   writable: false
 * // }
 * ```
 * Note: In ES5, if the first argument to this method is not an object (a primitive), then it will cause a TypeError. In ES2015, a non-object first argument will be coerced to an object at first.
 */
export const objGetOwnPropertyDescriptor: (target: any, prop: PropertyKey) => PropertyDescriptor | undefined = (/* #__PURE__ */_pureAssign((/* #__PURE__ */_pureRef<typeof Object.getOwnPropertyDescriptor>(ObjClass as any, "getOwnPropertyDescriptor")), polyObjGetOwnPropertyDescriptor));

/**
 * Polyfill implementation of Object.getOwnPropertyDescriptor for environments where it doesn't exist.
 * @param obj - The object whose property descriptor is to be returned
 * @param prop - The name or Symbol of the property whose description is to be retrieved
 * @returns A property descriptor of the given property if it exists on the object, otherwise undefined
 */
export function polyObjGetOwnPropertyDescriptor(obj: any, prop: PropertyKey): PropertyDescriptor | undefined {
    let descriptor: PropertyDescriptor | undefined;

    // Ensure we're working with an object
    if (obj === null || obj === undefined) {
        throwTypeError("Cannot convert undefined or null to object");
    }
    
    obj = Object(obj);
    
    // Handle non-string property keys
    const propStr = asString(prop);
    
    // Check if the property exists on the object
    if (objHasOwnProperty(obj, propStr)) {
        
        // Create a default descriptor for the property
        descriptor = {
            configurable: true,
            enumerable: true
        };
        
        // Check if getter or setter exists (very limited detection)
        const getterName = "__lookupGetter__";
        const setterName = "__lookupSetter__";
        
        if (getterName in ObjProto && setterName in ObjProto) {
            const getter = obj[getterName](propStr);
            const setter = obj[setterName](propStr);
            
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
    }

    return descriptor;
}