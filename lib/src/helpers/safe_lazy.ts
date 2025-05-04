/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { getLazy, getWritableLazy, ILazyValue } from "./lazy";
import { getDeferred, getWritableDeferred, ICachedValue } from "./cache";
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
 * @param argArray - An optional array of arguments to be passed to the callback function (since 0.12.3)
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
export function safeGetLazy<T = boolean, F extends (...args: any[]) => T = () => T>(cb: F, defValue: T, argArray?: Parameters<F>): ILazyValue<T> {
    return getLazy<T>(() => {
        let result = safe(cb, argArray);
        return result.e ? defValue : result.v;
    });
}

/**
 * Create and return an writable {@link ILazyValue} instance which will cache and return the value returned
 * by the callback function. The callback function will only be called once, multiple access of the value
 * does not cause re-execution of the callback as the result from the first call is cached internally.
 * If the callback throws the default value will be returned.
 * @since 0.11.7
 * @group Lazy
 * @group Safe
 * @param cb - The callback function to fetch the value to be lazily evaluated and cached
 * @param defValue - The default value to return when an exception is thrown
 * @param argArray - An optional array of arguments to be passed to the callback function (since 0.12.3)
 * @returns A new writable {@link ILazyValue} instance which wraps the callback and will be used to cache
 * the result of the callback
 * @example
 * ```ts
 * // This does not cause the evaluation to occur
 * let cachedValue = safeGetWritableLazt(() => callSomeExpensiveFunctionWhichMightThrow(), "someDefaultValue");
 * let theValue;
 *
 * // Just checking if there is an object still does not cause the evaluation
 * if (cachedValue) {
 *    // This will cause the evaluation to occur and the result will be cached
 *   theValue = cachedValue.v;
 * }
 *
 * // Accessing the value again will not cause the re-evaluation to occur, it will just return the same
 * // result value again.
 * theValue === cachedValue.v;  // true
 *
 * // Changing the value is allowed
 * cachedValue.v = "new value";
 *
 * // Accessing the value again will return the new value
 * theValue === cachedValue.v;  // true
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function safeGetWritableLazy<T = boolean, F extends (...args: any[]) => T = () => T>(cb: F, defValue: T, argArray?: Parameters<F>): ILazyValue<T> {
    return getWritableLazy<T>(() => {
        let result = safe(cb, argArray);
        return result.e ? defValue : result.v;
    });
}

/**
 * Create and return a readonly {@link ICachedValue} instance which will cache and return the value returned
 * by the callback function. The callback function will only be called once, multiple access of the value
 * will not cause re-execution of the callback as the result from the first call is cached internally.
 * If the callback throws the default value will be returned.
 * This is a lightweight version that does not support any expiration or invalidation.
 * @since 0.12.3
 * @group Cache
 * @group Safe
 * @typeParam T - The type of the value to be cached
 * @typeParam F - The type of the callback function, defaults to () =&gt; T if not specified
 * @param cb - The callback function to fetch the value to be lazily evaluated and cached
 * @param defValue - The default value to return when an exception is thrown
 * @param argArray - An optional array of arguments to be passed to the callback function
 * @returns A new readonly {@link ICachedValue} instance which wraps the callback and will be used to cache
 * the result of the callback
 * @example
 * ```ts
 * // This does not cause the evaluation to occur
 * let cachedValue = safeGetDeferred(
 *   () => JSON.parse(potentiallyInvalidJson),
 *   { defaultValue: true }
 * );
 *
 * // With arguments
 * let cachedValueWithArgs = safeGetDeferred(
 *   (id, name) => fetchDataThatMightFail(id, name),
 *   { defaultValue: "Not Found" },
 *   [123, "test"]
 * );
 *
 * // This will cause the evaluation to occur and the result will be cached
 * // If the evaluation throws, the default value will be returned
 * let theValue = cachedValue.v;
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function safeGetDeferred<T, F extends (...args: any[]) => T = () => T>(cb: F, defValue: T, argArray?: Parameters<F>): ICachedValue<T> {
    return getDeferred<T, () => T>(() => {
        let result = safe(cb, argArray);
        return result.e ? defValue : result.v;
    });
}

/**
 * Create and return a writable {@link ICachedValue} instance which will cache and return the value returned
 * by the callback function. The callback function will only be called once, multiple access of the value
 * will not cause re-execution of the callback as the result from the first call is cached internally.
 * If the callback throws the default value will be returned.
 * Unlike {@link safeGetDeferred}, this version allows the cached value to be changed after it's been evaluated.
 * This is a lightweight version that does not support any expiration or invalidation.
 * @since 0.12.3
 * @group Cache
 * @group Safe
 * @typeParam T - The type of the value to be cached
 * @typeParam F - The type of the callback function, defaults to () =&gt; T if not specified
 * @param cb - The callback function to fetch the value to be lazily evaluated and cached
 * @param defValue - The default value to return when an exception is thrown
 * @param argArray - An optional array of arguments to be passed to the callback function
 * @returns A new writable {@link ICachedValue} instance which wraps the callback and will be used to cache
 * the result of the callback
 * @example
 * ```ts
 * // This does not cause the evaluation to occur
 * let cachedValue = safeGetWritableDeferred(
 *   () => JSON.parse(potentiallyInvalidJson),
 *   { defaultValue: true }
 * );
 *
 * // With arguments
 * let cachedValueWithArgs = safeGetWritableDeferred(
 *   (id, name) => fetchDataThatMightFail(id, name),
 *   { defaultValue: "Not Found" },
 *   [123, "test"]
 * );
 *
 * // This will cause the evaluation to occur and the result will be cached
 * // If the evaluation throws, the default value will be returned
 * let theValue = cachedValue.v;
 *
 * // The cached value can be changed
 * cachedValue.v = { newValue: true };
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function safeGetWritableDeferred<T, F extends (...args: any[]) => T = () => T>(cb: F, defValue: T, argArray?: Parameters<F>): ICachedValue<T> {
    return getWritableDeferred<T, () => T>(() => {
        let result = safe(cb, argArray);
        return result.e ? defValue : result.v;
    });
}