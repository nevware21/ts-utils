/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * Polyfill implementation for Object.preventExtensions, which can't make an object non-extensible, so (like the native
 * function, ES2015+) it returns the value it is passed, including a primitive value, `null` or `undefined`
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @typeParam T - The type of the object to be made non-extensible
 * @param obj - The object which should be made non-extensible
 * @returns The object that was passed to the function
 */
export function polyObjPreventExtensions<T>(obj: T): T {
    // An object can't be made non-extensible without the native function, so (like the native function for a value which
    // isn't an object) the value is returned
    return obj;
}