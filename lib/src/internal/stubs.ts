/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * Stub function that returns nothing.
 * This is used as a placeholder for polyfills or other functions that do not return a value.
 * @internal
 * @returns undefined
 * @template T - The type of the return value
 */
export function _returnNothing<T>(): T | undefined {
    return;
}

/**
 * Stub function that returns an empty array.
 * This is used as a placeholder for polyfills or other functions that expect an array return value.
 * @internal
 * @returns An empty array of type T
 * @template T - The type of the array elements
 */
export function _returnEmptyArray<T>(): T[] {
    return [];
}

/**
 * Stub function that returns false.
 * @internal
 * @returns false
 */
export function _returnFalse(): boolean {
    return false;
}
