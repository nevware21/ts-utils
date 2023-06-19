/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 Nevware21
 * Licensed under the MIT license.
 */

import { _unwrapInstFunction } from "../internal/unwrapFunction";

/**
 * The `fnCall` function calls the function with the given `thisArg` as the `this` value and with
 * al of the `_args` provided as it's `arguments.
 *
 * > This is almost identical to `fnApply`, except that the function arguments are passed to `fnCall`
 * individually as a list, while with `fnApply` that are combined into a single array argument.
 *
 * Normally, when calling a function, the value of `this` inside the function is the object that the
 * function was accessed on. With `fnCall()`, you can pass an arbitrary value as the `this` when calling an
 * existing function, without first attaching the function to the object as a property. This allows you
 * to use methods of one object as generic utility functions.
 *
 * @since 0.9.8
 * @group Function
 *
 * @param fn - The function to be called
 * @param thisArg - The value of `this` provided for the call to `fn`. If the function is not in strict mode,
 * `null` and `undefined` will be replaced with the global object, and primitive values will be converted to objects.
 * @param _args - The zero or more arguments to be passed to the `fn` function.
 * @returns The result of calling the function with the specified `this` value and arguments.
 * @example
 * ```ts
 * // min / max number in an array
 * let max = fnCall(Math.max, null, 21, 42, 84, 168, 7, 3);
 * // 168
 *
 * let min = fnCall(Math.min, null, 21, 42, 84, 168, 7, 3);
 * // 3
 *
 * const module1 = {
 *     prefix: "Hello",
 *     x: 21,
 *     getX() {
 *         return this.x;
 *     },
 *     log(value: string) {
 *         return this.prefix + " " + value + " : " + this.x
 *     }
 * };
 *
 * // The 'this' parameter of 'getX' is bound to 'module'.
 * module1.getX(); // 21
 * module1.log("Darkness"); // Hello Darkness : 21
 *
 * // Create a new function 'boundGetX' with the 'this' parameter bound to 'module'.
 * let module2 = {
 *     prefix: "my",
 *     x: 42
 * };
 *
 * // Call the function of module1 with module2 as it's this
 * fnCall(module1.getX, module2); // 42
 * fnCall(module1.log, module2, "friend"); // my friend : 42
 * ```
 */
export const fnCall: <F extends (...args: any) => any, T>(fn: F, thisArg: T, ..._args: any[]) => ReturnType<F> = _unwrapInstFunction("call");
