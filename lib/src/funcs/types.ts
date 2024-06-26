/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

export type TypeFuncNames<T> = {
    [key in keyof T]: T[key] extends Function ? key : never
}[keyof T];

/**
 * The Definition of how proxy functions should be applied to target objects
 */
export type ProxyFunctionDef<T, H> = {
    /**
     * Identifies the host function name
     */
    n: TypeFuncNames<H>,

    /**
     * Use this name as on the target for the proxied function, defaults to the same
     * as the host function when not defined.
     */
    as?: TypeFuncNames<T>,

    /**
     * If the target already includes the function should it be replaced, defaults to false.
     */
    rp?: boolean
}
