/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { BoundFunction } from "./types";

/**
 * Creates a new bound function using `fn.bind()` where the pre-bound arguments are supplied as an
 * array or tuple value, similar to how {@link fnApply} supplies arguments to invocation.
 *
 * This is useful when the argument list is already available as an array or tuple value,
 * but you want to return a reusable bound function rather than invoke immediately.
 * @param fn - The function instance to bind.
 * @param thisArg - The value to be used as the `this` when calling `fn`.
 * @param argArray - Optional array or tuple value containing arguments to pre-bind to `fn`.
 * @returns A new bound function.
 * @since 0.15.0
 * @group Function
 * @example
 * ```ts
 * const module1 = {
 *     prefix: "Hello",
 *     log(value: string, punctuation: string) {
 *         return this.prefix + " " + value + punctuation;
 *     }
 * };
 *
 * const module2 = {
 *     prefix: "Hi"
 * };
 *
 * const bound = fnBindArgs(module1.log, module2, ["friend"]);
 * bound("!"); // "Hi friend!"
 * ```
 */
export function fnBindArgs<F extends (...args: any[]) => any, T, TArgs extends any[]>(fn: F, thisArg: T, argArray: TArgs): BoundFunction<F, TArgs>;
export function fnBindArgs<F extends (...args: any[]) => any, T>(fn: F, thisArg: T): F;
export function fnBindArgs<F extends (...args: any[]) => any, T>(fn: F, thisArg: T, argArray?: any[]): any {
    return fn.bind.apply(fn, (argArray ? [ thisArg ].concat(argArray) : [ thisArg ]) as any);
}
