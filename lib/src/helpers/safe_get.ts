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
 */
/*#__NO_SIDE_EFFECTS__*/
export function safeGet<T = boolean>(cb: () => T, defValue: T): T {
    let result = safe(cb);
    
    return result.e ? defValue : result.v;
}
