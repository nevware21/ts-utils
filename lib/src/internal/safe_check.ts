/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

/**
 * @ignore
 * @internal
 * Internal helper for safely checking whether types exist
 * @param cb - Callback function be wrapped with an exception
 * @param defValue - The default value to return when an exception is thrown
 * @returns The value from the `cb` or the default value
 */
export function _safeCheck<T = boolean>(cb: () => T, defValue: T) {
    let result = defValue;
    try {
        result = cb();
    } catch (e) {
        // Do nothing
    }
    return result;
}
