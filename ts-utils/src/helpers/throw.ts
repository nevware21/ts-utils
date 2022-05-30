/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

/**
 * Throw an error exception with the specified optional message
 * @param message
 */
export function throwError(message?: string): never {
    throw new Error(message);
}

/**
 * Throw a type error with the specified optional message
 * @param message
 */
export function throwTypeError(message?: string): never {
    throw new TypeError(message);
}