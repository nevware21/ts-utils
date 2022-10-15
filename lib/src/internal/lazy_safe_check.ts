/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { getLazy, ILazyValue } from "../helpers/lazy";
import { _safeGet } from "./safe_check";

/**
 * @ignore
 * @internal
 * Internal helper for lazily safely checking whether types exist
 * @param cb - Callback function be wrapped with an exception
 * @param defValue - The default value to return when an exception is thrown
 * @returns The an ILazyValue instance that will call the `cb` when accessed and will return the resulting value or the default value
 */
export function _lazySafeGet<T = boolean>(cb: () => T, defValue: T): ILazyValue<T> {
    return getLazy<T>(() => _safeGet<T>(cb, defValue));
}
