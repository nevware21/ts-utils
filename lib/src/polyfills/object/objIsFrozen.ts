/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction, isObject, isStrictNullOrUndefined } from "../../helpers/base";
import { objGetOwnPropertyDescriptor } from "../../object/get_own_property_desc";

/**
 * Polyfill implementation for Object.isFrozen
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param obj - The object to check if it is frozen
 * @returns A Boolean indicating whether or not the object is frozen
 */
export function polyObjIsFrozen(obj: any): boolean {
    // In ES5, if the object is not an object (primitive), then it is frozen
    if (isStrictNullOrUndefined(obj) || (!isObject(obj) && !isFunction(obj))) {
        return true;
    }

    // First check if the object is extensible
    if (isFunction(obj)) {
        return false;
    }

    // Then check if all properties are non-configurable and non-writable
    for (const prop in obj) {
        const desc = objGetOwnPropertyDescriptor(obj, prop);
        // If the property descriptor is configurable or writable, the object is not frozen
        if (desc && (desc.configurable || (desc.writable !== false && "value" in desc))) {
            return false;
        }
    }

    return true;
}