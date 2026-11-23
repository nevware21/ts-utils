/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction, isStrictNullOrUndefined } from "../helpers/base";
import { throwTypeError } from "../helpers/throw";
import { ObjClass } from "./constants";

/**
 * Throws a TypeError if the provided object is null or undefined.
 * This is a utility function to ensure that the object is valid before performing operations on it.
 * @param obj - The object to check
 * @internal
 * @since 0.12.0
 */
export function _throwIfNullOrUndefined(obj: any): void {
    // Ensure we're working with an object
    if (isStrictNullOrUndefined(obj)) {
        throwTypeError("Cannot convert undefined or null to object");
    }
}

/**
 * Converts the value into an object like the native functions (ToObject), so a primitive value is returned as its
 * wrapper object (eg. a `String` object for a string) and an object is returned as-is.
 * @param value - The value to convert
 * @returns The value as an object
 * @throws TypeError if the value is `null` or `undefined`
 * @internal
 * @ignore
 */
export function _toObject<T>(value: T): T {
    _throwIfNullOrUndefined(value);
    return ObjClass(value);
}

/**
 * Throws a TypeError for a value which isn't the type a polyfill expects (eg. "is not a function"), like the native
 * functions the value isn't converted or read (so none of its code, eg. a getter, a `toJSON()` or a Proxy trap, is run
 * and a large value doesn't create a large message), only its type (`typeof`) is included in the message.
 * @param value - The value which isn't the expected type
 * @param message - The rest of the message, eg. " is not a function"
 * @internal
 * @ignore
 */
export function _throwTypeOf(value: any, message: string): never {
    return throwTypeError(typeof value + message);
}

/**
 * Throws a TypeError if the callback is not a function, like the native array functions which check it before any
 * value is processed (so an empty array still throws).
 * @param callbackFn - The callback function to check
 * @internal
 * @ignore
 */
export function _throwIfNotCallbackFn(callbackFn: any): void {
    if (!isFunction(callbackFn)) {
        throwTypeError("callbackFn must be a function");
    }
}
