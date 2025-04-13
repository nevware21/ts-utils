/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction, isObject } from "../../helpers/base";
import { throwTypeError } from "../../helpers/throw";
import { _throwIfNullOrUndefined } from "../../internal/throwIf";

/**
 * Polyfill implementation for Object.preventExtensions
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @typeParam T - The type of the object to be made non-extensible
 * @param obj - The object which should be made non-extensible
 * @returns The object that was passed to the function
 */
export function polyObjPreventExtensions<T>(obj: T): T {
    // Basic implementation if native method is not available
    _throwIfNullOrUndefined(obj);
    if (!isObject(obj) && !isFunction(obj)) {
        throwTypeError("objPreventExtensions can only be called on Objects");
    }

    // If we can't make the object non-extensible, just return it
    // We do not throw to maintain backward compatibility
    return obj;
}