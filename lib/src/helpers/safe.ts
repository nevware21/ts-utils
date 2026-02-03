/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * Infers the return type of the specified function
 * @since 0.10.5
 * @group Safe
 * @typeParam T - The type of the function which to infer the return type
 */
export type SafeReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any

/**
 * Defines the return value of the {@link safe} function, which is an object with either a value or an error
 * @since 0.10.5
 * @group Safe
 * @typeParam T - The type of the function to call
 * @typeParam R - The return type of the function
 */
export interface ISafeReturn<T extends (...args: any) => R, R = SafeReturnType<T>> {
    /**
     * The value returned by the function call
     */
    v?: R;

    /**
     * The error thrown by the function call
     */
    e?: Error;
}

/**
 * Call the specified function with zero or more individual arguments, the call will be wrapped in a try / catch
 * block and the result returned wrapped in an {@link ISafeReturn} instance. If the function call throws an
 * exception the {@link ISafeReturn.e | error} property will contain the exception otherwise the {@link ISafeReturn.v | value}
 * property will contain the value returned from the function.
 * @since 0.10.5
 * @group Safe
 * @typeParam F - The type of the function to call
 * @typeParam R - The return type of the function to call
 * @param func - The function to call
 * @param argArray - An array of the arguments to pass to the function
 * @returns The return value of the function or undefined if an exception is thrown
 * @example
 * ```ts
 * let result = safe((value: string) => {
 *    return JSON.parse(value);
 * }, ["{ invalid: json value"]);
 *
 * // result.e instanceof SyntaxError
 *
 * let result2 = safe((value: string) => {
 *   return JSON.parse(value);
 * }, ["{ valid: 'json value' }"]);
 *
 * // result2.v === { valid: "json value" }
 * ```
 */
export function safe<F extends (...args: unknown[]) => R, R = ReturnType<F>>(func: F, argArray?: any[]): ISafeReturn<F, R> {
    try {
        return {
            v: func.apply(this, argArray)
        };
    } catch (e) {
        return { e };
    }
}
