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
 * Polyfill implementation for Object.isSealed
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param obj - The object to check if it is sealed
 * @returns A Boolean indicating whether or not the object is sealed
 */
export function polyObjIsSealed(obj: any): boolean {
    // In ES5, if the object is not an object (primitive), then it is sealed
    if (isStrictNullOrUndefined(obj) || (!isObject(obj) && !isFunction(obj))) {
        return true;
    }

    // First check if the object is extensible
    if (isFunction(obj)) {
        return false;
    }

    // Then check if all properties are non-configurable
    for (const prop in obj) {
        const desc = objGetOwnPropertyDescriptor(obj, prop);
        // If the property descriptor is configurable, the object is not sealed
        if (desc && desc.configurable) {
            return false;
        }
    }

    return true;
}