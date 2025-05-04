/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2024 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnApply } from "../funcs/funcs";
import { NULL_VALUE } from "../internal/constants";
import { objDefineProp } from "../object/define";

/**
 * A generic interface for holding a cached value
 * @since 0.10.5
 * @group Helpers
 * @group Cache
 * @typeParam T - The type of the value to be cached
 * @example
 * ```ts
 * let cachedValue: ICachedValue<string> = {
 *    v: "some value"
 * };
 * ```
 */
export interface ICachedValue<T> {
    /**
     * Returns the current cached value
     */
    v: T,

    /**
     * Returns the current cached value
     */
    toJSON(): T;
}

/**
 * Create and return a readonly {@link ICachedValue} instance that is populated with the provided value.
 * This is useful when you want to cache a previously fetched value and return it without having to re-fetch
 * it again.
 * This is a lightweight version of {@link getLazy} which does not support any expiration or invalidation,
 * it also will not honor the {@link setBypassLazyCache} setting and will always return the provided value.
 * @since 0.10.5
 * @group Helpers
 * @group Cache
 * @typeParam T - The type of the value to be cached
 * @param value - The value to cache
 * @returns A new {@link ICachedValue} instance which wraps the provided value
 * @example
 * ```ts
 * let cachedValue = createCachedValue("some value");
 * // cachedValue.v === "some value"
 *
 * JSON.stringify(cachedValue) === '{"v":"some value"}';
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function createCachedValue<T>(value: T): ICachedValue<T> {
    return objDefineProp({
        toJSON: () => value
    }, "v", { value }) as ICachedValue<T>;
}

/**
 * Create and return a readonly {@link ICachedValue} instance which will cache and return the value returned
 * by the callback function. The callback function will only be called once, multiple access of the value
 * will not cause re-execution of the callback as the result from the first call is cached internally.
 * This is a lightweight version of {@link getLazy} which does not support any expiration or invalidation,
 * it also will not honor the {@link setBypassLazyCache} setting and will always return the provided value.
 * @remarks Since 0.12.3 this is now an alias for {@link getDeferred}, it is recommended to use that function
 * directly instead of this one.
 * @since 0.10.5
 * @group Helpers
 * @group Cache
 * @function
 * @typeParam T - The type of the value to be cached
 * @param cb - The callback function to fetch the value to be lazily evaluated and cached
 * @returns
 */
export const createDeferredCachedValue: <T>(cb: () => T) => ICachedValue<T> = getDeferred;

/**
 * Create and return a readonly {@link ICachedValue} instance which will cache and return the value returned
 * by the callback function. The callback function will only be called once, multiple access of the value
 * will not cause re-execution of the callback as the result from the first call is cached internally.
 * This version supports passing arguments to the callback function.
 * This is a lightweight version of {@link getLazy} which does not support any expiration or invalidation,
 * it also will not honor the {@link setBypassLazyCache} setting and will always return the provided value.
 * This is the same as {@link createDeferredCachedValue} but allows passing an array of arguments to the
 * callback function.
 * @since 0.12.3
 * @group Helpers
 * @group Cache
 * @typeParam R - The type of the value to be cached
 * @typeParam F - The type of the callback function, defaults to () =&gt; T if not specified
 * @param cb - The callback function to fetch the value to be lazily evaluated and cached
 * @param argArray - Optional array of arguments to be passed to the callback function
 * @returns A new readonly {@link ICachedValue} instance which wraps the callback and will be used to cache
 * the result of the callback
 * @example
 * ```ts
 * // This does not cause the evaluation to occur
 * let cachedValue = getDeferred(() => callSomeExpensiveFunction());
 * let theValue;
 *
 * // With arguments - the argument types are inferred from the callback
 * let cachedValueWithArgs = getDeferred(
 *   (id: number, name: string) => callSomeExpensiveFunction(id, name),
 *   [123, "test"]
 * );
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
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function getDeferred<R, F extends (...args: any[]) => R>(cb: F, argArray?: Parameters<F>): ICachedValue<R> {
    let theValue: any = {
        toJSON: () => theValue.v
    };

    return objDefineProp(theValue as ICachedValue<R>, "v", {
        get: () => {
            // Use apply to call the callback with the provided arguments
            let result: R = fnApply(cb, null, argArray);
            cb = NULL_VALUE;
            objDefineProp(theValue, "v", { value: result });
            return result;
        },
        configurable: true
    });
}

/**
 * Create and return a writable {@link ICachedValue} instance which will cache and return the value returned
 * by the callback function. The callback function will only be called once, multiple access of the value
 * will not cause re-execution of the callback as the result from the first call is cached internally.
 * Unlike {@link getDeferred}, this version allows the cached value to be changed after it's been evaluated.
 * This is a lightweight version that does not support any expiration or invalidation.
 * @since 0.12.3
 * @group Helpers
 * @group Cache
 * @typeParam R - The type of the value to be cached
 * @typeParam F - The type of the callback function, defaults to () =&gt; T if not specified
 * @param cb - The callback function to fetch the value to be lazily evaluated and cached
 * @param argArray - Optional array of arguments to be passed to the callback function
 * @returns A new writable {@link ICachedValue} instance which wraps the callback and will be used to cache
 * the result of the callback
 * @example
 * ```ts
 * // This does not cause the evaluation to occur
 * let cachedValue = getWritableDeferred(() => callSomeExpensiveFunction());
 * let theValue;
 *
 * // With arguments - the argument types are inferred from the callback
 * let cachedValueWithArgs = getWritableDeferred(
 *   (id: number, name: string) => callSomeExpensiveFunction(id, name),
 *   [123, "test"]
 * );
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
 * // The cached value can be changed
 * cachedValue.v = "new value";
 * theValue = cachedValue.v;  // "new value"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function getWritableDeferred<R, F extends (...args: any[]) => R = () => R>(cb: F, argArray?: Parameters<F>): ICachedValue<R> {
    let theValue: any = {
        toJSON: () => theValue.v
    };

    let _setValue = (newValue: R) => {
        // Just replace the value
        objDefineProp(theValue, "v", {
            value: newValue,
            writable: true
        });
    };

    return objDefineProp(theValue as ICachedValue<R>, "v", {
        get: () => {
            let result = fnApply(cb, null, argArray);
            _setValue(result);
            cb = NULL_VALUE;
            
            return result;
        },
        set: _setValue,
        configurable: true
    });
}
