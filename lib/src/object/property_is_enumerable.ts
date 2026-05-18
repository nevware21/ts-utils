/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isStrictNullOrUndefined } from "../helpers/base";
import { safe } from "../helpers/safe";
import { NULL_VALUE, ObjClass, ObjProto } from "../internal/constants";
import { _unwrapFunctionNoInstWithPoly, _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { objHasOwnProperty } from "./has_own_prop";

function _objPropertyIsEnum(obj: any, propKey: PropertyKey): boolean {
    let desc: PropertyDescriptor | null | undefined;
    let fn = ObjClass.getOwnPropertyDescriptor;
    
    if (!isStrictNullOrUndefined(obj) && fn) {
        // Try to call the native getOwnPropertyDescriptor function
        desc = safe(fn, [obj, propKey]).v || NULL_VALUE;
    }

    if (!desc && !isStrictNullOrUndefined(obj)) {
        desc = safe(() => {
            // Check enumerability of the property in the object
            // This is a workaround for the fact that `in` operator does not check for non-enumerable properties
            for (const key in obj) {
                if (key == propKey) {
                    return { enumerable: objHasOwnProperty(obj, key) } as PropertyDescriptor;
                }
            }
        }).v;
    }

    return (desc && desc.enumerable) || false;
}

/**
 * The `objPropertyIsEnumerable()` method returns a Boolean indicating whether the specified property
 * is enumerable and is a property of the specified object. This method is similar to the native
 * `Object.prototype.propertyIsEnumerable()` method, but it is a standalone function that can be used
 * without needing to call it on the object itself. This will attempt to use the native method if it exists
 * and is callable, otherwise it will use a helper implementation that will check for the property on the
 * instance provided, if that instance has a `propertyIsEnumerable` method it will be called, otherwise it
 * will check whether the property is available on the instance and if it is enumerable.
 *
 * @function
 * @since 0.12.0
 * @group Object
 * @param obj - The object on which to check if the property is enumerable
 * @param prop - The property name or symbol to check
 * @returns A Boolean indicating whether the specified property is enumerable
 * @example
 * ```typescript
 * const obj = {};
 * const arr = [];
 * obj.property1 = 42;
 *
 * // Custom property is enumerable
 * console.log(objPropertyIsEnumerable(obj, "property1")); // true
 *
 * // Array length is not enumerable
 * console.log(objPropertyIsEnumerable(arr, "length")); // false
 *
 * // Checking a property that doesn't exist returns false
 * console.log(objPropertyIsEnumerable(obj, "nonExistent")); // false
 * ```
 */
export const objPropertyIsEnumerable: (obj: any, prop: PropertyKey) => boolean = (/*#__PURE__*/_unwrapFunctionWithPoly("propertyIsEnumerable", NULL_VALUE as any, _objPropertyIsEnum));

/**
 * @internal
 * The `_objPropertyIsEnumerable()` method returns a Boolean indicating whether the specified property
 * is enumerable and is a property of the specified object. This method is similar to the native
 * `Object.prototype.propertyIsEnumerable()` method, but it is a standalone function that can be used
 * without needing to call it on the object itself. This uses the native
 * `Object.prototype.propertyIsEnumerable()` implementation when it is available on the prototype
 * captured at module initialization time; otherwise it falls back to the helper polyfill implementation.
 *
 * @function
 * @since 0.14.0
 * @group Object
 * @param obj - The object on which to check if the property is enumerable
 * @param prop - The property name or symbol to check
 * @returns A Boolean indicating whether the specified property is enumerable
 */
export const _objPropertyIsEnumerable: (obj: any, prop: PropertyKey) => boolean = (/*#__PURE__*/_unwrapFunctionNoInstWithPoly("propertyIsEnumerable", ObjProto, _objPropertyIsEnum));