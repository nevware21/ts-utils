/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { getLazy, ILazyValue } from "./lazy";
import { safe } from "./safe";

/**
 * Create and return an readonly {@link ILazyValue} instance which will cache and return the value returned
 * by the callback function. The callback function will only be called once, multiple access of the value
 * does not cause re-execution of the callback as the result from the first call is cached internally.
 * If the callback throws the default value will be returned.
 * @since 0.9.5
 * @group Lazy
 * @group Safe
 * @param cb - The callback function to fetch the value to be lazily evaluated and cached
 * @param defValue - The default value to return when an exception is thrown
 * @returns A new readonly {@link ILazyValue} instance which wraps the callback and will be used to cache
 * the result of the callback
 * @example
 * ```ts
 * // This does not cause the evaluation to occur
 * let cachedValue = safeGetLazy(() => callSomeExpensiveFunctionWhichMightThrow(), "someDefaultValue");
 * let theValue;
 *
 * // Just checking if there is an object still does not cause the evaluation
 * if (cachedValue) {
 *     // This will cause the evaluation to occur and the result will be cached
 *     theValue = cachedValue.v;
 * }
 *
 * // Accessing the value again will not cause the re-evaluation to occur, it will just return the same
 * // result value again.
 * theValue === cachedValue.v;  // true
 *
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function safeGetLazy<T = boolean>(cb: () => T, defValue: T): ILazyValue<T> {
    return getLazy<T>(() => {
        let result = safe(cb);
        return result.e ? defValue : result.v;
    });
}
