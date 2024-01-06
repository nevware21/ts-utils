/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 Nevware21
 * Licensed under the MIT license.
 */

import { _unwrapInstFunction } from "../internal/unwrapFunction";

/**
 * Creates a new function that when called will set the value of `thisArg` as the `this` keyword
 * value whrn calling the provided `fn` instance, and all of the arguments passed to the new
 * function will be passed along to the original provided instance.
 * @param fn - The function instance to be called
 * @param thisArg - The value to be used as the `this` when calling the `fn`
 * @returns The value returned by the original `fn` after executing with the provided `thisArg`.
 * @since 0.9.8
 * @group Function
 * @example
 * ```ts
 * const module1 = {
 *     x: 21,
 *     getX() {
 *         return this.x;
 *     },
 * };
 *
 * // The 'this' parameter of 'getX' is bound to 'module'.
 * console.log(module1.getX()); // 21
 *
 * // Create a new function 'boundGetX' with the 'this' parameter bound to 'module'.
 * let module2 = {
 *     x: 42
 * };
 *
 * module2.getX = fnBind(module1.getX, module2);
 * module2.getX(); // 42
 *
 * // It can also be used to proxy to the original function from the new one
 * module2.getX = fnBind(module1.getX, module1);
 * module2.getX(); // 21
 * ```
 */
export const fnBind: <F extends Function, T>(fn: F, thisArg: T) => F = (/*#__PURE__*/_unwrapInstFunction("bind"));
