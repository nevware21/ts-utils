/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 Nevware21
 * Licensed under the MIT license.
 */

import { _unwrapInstFunction } from "../internal/unwrapFunction";

/**
 * The `fnApply` function calls the specified `fn` function with the given `thisArg` as the `this` value,
 * and the optional `argArray` arguments provided as an array (or an Array-Like Object).
 *
 * Normally, when calling a function, the value of `this` inside the function is the object that the
 * function was accessed on. With `fnApply()`, you can assign an arbitrary value as this when calling an
 * existing function, without first attaching the function to the object as a property. This allows you
 * to use methods of one object as generic utility functions.
 *
 * You can also use any kind of object which is ArrayLike as the second parameter. In practice, this means
 * that it needs to have a length property, and integer ("index") properties in the range (0..length - 1).
 * For example, you could use a NodeList, or a custom object like `{ 'length': 2, '0': 'eat', '1': 'bananas' }`.
 * You can also use `arguments`.
 *
 * @since 0.9.8
 * @group Function
 *
 * @param fn - The function to be called
 * @param thisArg - The value of `this` provided for the call to `fn`. If the function is not in strict mode,
 * `null` and `undefined` will be replaced with the global object, and primitive values will be converted to objects.
 * @param argArray - An array-like object, specifying the arguments with which `fn` should be called, or `null` or
 * `undefined` if no arguments should be provided to the function.
 * @returns The result of calling the function with the specified `this` value and arguments.
 * @example
 * ```ts
 * // min / max number in an array
 * let max = fnApply(Math.max, null, [ 21, 42, 84, 168, 7, 3 ]);
 * // 168
 *
 * let min = fnApply(Math.min, null, [ 21, 42, 84, 168, 7, 3 ]);
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
 * fnApply(module1.getX, module2); // 42
 * fnApply(module1.log, module2, [ "friend" ]); // my friend : 42
 * ```
 */
export const fnApply: <F extends (...args: any) => any, T>(fn: F, thisArg: T, argArray?: ArrayLike<any>) => ReturnType<F> = _unwrapInstFunction("apply");
