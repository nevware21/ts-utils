/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction, isObject } from "../../helpers/base";

/**
 * Polyfill implementation for Object.isExtensible
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param obj - The object to check if it is extensible
 * @returns A Boolean indicating whether or not the object is extensible
 */
export function polyObjIsExtensible(obj: any): boolean {
    // Without the native function an object can't be made non-extensible, so every object (or function) is
    // extensible and a primitive (including null and undefined, which isObject() doesn't match) is not
    return isObject(obj) || isFunction(obj);
}