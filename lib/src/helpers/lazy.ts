/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { objDefineGet, objDefineProp } from "../object/define";

/**
 * Interface of the object returned by the {@link getLazy} instance
 * @since 0.4.5
 * @group Lazy
 */
export interface ILazyValue<T> {
    /**
     * Returns the current cahced value from the lazy lookup, if the callback function has not yet occurred
     * accessing the value will cause the lazy evaluation to occur and the result will be returned.
     */
    v: T
}

/**
 * Create and return an {@link ILazyValue} instance which will cache and return the value returned
 * by the callback function. The callback function will only be called once, multiple access of the value
 * does not cause re-execution of the callback as the result from the first call is cached internally.
 * @since 0.4.5
 * @group Lazy
 * @param cb - The callback function to fetch the value to be lazily evaluated and cached
 * @returns A new {@link ILazyValue} instance which wraps the callback and will be used to cache the result of the callback
 * @example
 * ```ts
 * // This does not cause the evaluation to occur
 * let cachedValue = getLazy(() => callSomeExpensiveFunction());
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
export function getLazy<T>(cb: () => T): ILazyValue<T> {
    let lazyValue = { } as ILazyValue<T>;
    objDefineGet(lazyValue, "v", function () {
        let result = cb();
        // Just replace the value
        objDefineProp(lazyValue, "v", {
            enumerable: true,
            configurable: true,
            writable: false,
            value: result
        });

        return result;
    }, true);

    return lazyValue;
}
