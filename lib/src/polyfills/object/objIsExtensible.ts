/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction, isObject, isStrictNullOrUndefined } from "../../helpers/base";

/**
 * Polyfill implementation for Object.isExtensible
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param obj - The object to check if it is extensible
 * @returns A Boolean indicating whether or not the object is extensible
 */
export function polyObjIsExtensible(obj: any): boolean {
    // In ES5, if the object is not an object (primitive), then it is not extensible
    if (isStrictNullOrUndefined(obj) || (!isObject(obj) && !isFunction(obj))) {
        return false;
    }
    
    // Default objects are extensible in ES5
    return true;
}