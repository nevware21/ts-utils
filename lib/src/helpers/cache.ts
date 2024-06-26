/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2024 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { NULL_VALUE } from "../internal/constants";
import { objDefineProp } from "../object/define";

/**
 * A generic interface for holding a cached value
 * @since 0.10.5
 * @group Helpers
 * @group Cache
 * @typeparam T - The type of the value to be cached
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
 * @typeparam T - The type of the value to be cached
 * @param value
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
 * @since 0.10.5
 * @group Helpers
 * @group Cache
 * @typeparam T - The type of the value to be cached
 * @param cb - The callback function to fetch the value to be lazily evaluated and cached
 * @returns
 */
/*#__NO_SIDE_EFFECTS__*/
export function createDeferredCachedValue<T>(cb: () => T): ICachedValue<T> {
    let theValue: any = {
        toJSON: () => theValue.v
    };

    return objDefineProp(theValue as ICachedValue<T>, "v", {
        get: () => {
            let result = cb();
            cb = NULL_VALUE;
            objDefineProp(theValue, "v", { value: result });
            return result;
        },
        configurable: true
    });
}
