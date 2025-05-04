/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { safe } from "./safe";

/**
 * Function to safely execute a callback function, if the function throws the provided default
 * value will be returned.
 * @since 0.9.5
 * @group Safe
 * @param cb - Callback function be wrapped with an exception
 * @param defValue - The default value to return when an exception is thrown
 * @param argArray - An optional array of arguments to be passed to the callback function (since 0.12.3)
 * @returns The result of the callback function or the default if an exception occurred calling the callback
 * function.
 * @example
 * ```ts
 * let theExpression = "{ invalid: json value";
 *
 * let result = safeGet(() => {
 *     return JSON.parse(theExpression);
 * }, {});
 *
 * // result === {};
 * ```
 *
 * // Example with arguments
 * ```ts
 * let result = safeGet((id: number, name: string) => {
 *     if (id <= 0) {
 *         throw new Error("Invalid ID");
 *     }
 *     return { id, name };
 * }, { id: 0, name: "default" }, [-1, "test"]);
 *
 * // result === { id: 0, name: "default" };
 * ```
 *
 * // Example with arguments successfully used
 * ```ts
 * const result = safeGet((a: number, b: number) => {
 *     return a + b;
 * }, 0, [5, 10]);
 *
 * // result === 15
 * ```
 *
 * // Example accessing nested properties safely
 * ```ts
 * const config = { database: null };
 *
 * const connectionString = safeGet(() => {
 *     return config.database.connectionString;
 * }, "default_connection");
 *
 * // Since config.database is null, accessing connectionString would throw
 * // connectionString === "default_connection"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function safeGet<T = boolean, F extends (...args: any[]) => T = () => T>(cb: F, defValue: T, argArray?: Parameters<F>): T {
    let result = safe(cb, argArray);
    
    return result.e ? defValue : result.v;
}
