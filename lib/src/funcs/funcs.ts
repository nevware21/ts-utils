/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { FuncApply, FuncBind, FuncCall } from "../internal/constants";
import { BoundFunction } from "./types";

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
 * `fnApply` is the intrinsic `Function.prototype.call` bound to the intrinsic `Function.prototype.apply`, so
 * `fnApply(fn, thisArg, argArray)` is `fn.apply(thisArg, argArray)` without any wrapper function, and it doesn't
 * depend on the `call` or `apply` properties of `fn` (which may have been overridden).
 *
 * @function
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
export const fnApply: <F extends (...args: any) => any, T>(fn: F, thisArg: T, argArray?: ArrayLike<any>) => ReturnType<F> = (/*#__PURE__*/FuncCall.bind(FuncApply));

/**
 * The `fnCall` function calls the function with the given `thisArg` as the `this` value and with
 * all of the `args` provided as it's `arguments`.
 *
 * Note: This is almost identical to `fnApply`, except that the function arguments are passed to `fnCall`
 * individually as a list, while with `fnApply` that are combined into a single array argument.
 *
 * Normally, when calling a function, the value of `this` inside the function is the object that the
 * function was accessed on. With `fnCall()`, you can pass an arbitrary value as the `this` when calling an
 * existing function, without first attaching the function to the object as a property. This allows you
 * to use methods of one object as generic utility functions.
 *
 * `fnCall` is the intrinsic `Function.prototype.call` bound to itself, so `fnCall(fn, thisArg, ...args)` is
 * `fn.call(thisArg, ...args)` without any wrapper function or copying of the arguments, and it doesn't depend
 * on the `call` or `apply` properties of `fn` (which may have been overridden).
 *
 * @function
 * @since 0.9.8
 * @group Function
 *
 * @param fn - The function to be called
 * @param thisArg - The value of `this` provided for the call to `fn`. If the function is not in strict mode,
 * `null` and `undefined` will be replaced with the global object, and primitive values will be converted to objects.
 * @param args - The zero or more arguments to be passed to the `fn` function.
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
export const fnCall: <F extends (...args: any) => any, T>(fn: F, thisArg: T, ...args: Parameters<F>) => ReturnType<F> = (/*#__PURE__*/FuncCall.bind(FuncCall));

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
/*#__NO_SIDE_EFFECTS__*/
export function fnBind<F extends (...args: any[]) => any, T>(fn: F, thisArg: T): F;

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
/*#__NO_SIDE_EFFECTS__*/
export function fnBind<F extends (...args: any[]) => any, T, TArgs extends any[]>(fn: F, thisArg: T, ...argArray: TArgs): BoundFunction<F, TArgs>;

/**
 * Fallback overload for less-specific `Function`-typed call sites where the concrete parameter
 * list is not available, such as dynamic proxy wiring.
 * @param fn - The function instance to be called.
 * @param thisArg - The value to be used as the `this` when calling the `fn`.
 * @param argArray - Zero or more arguments to pre-bind to the function.
 * @returns The original function type with the bound `this` value and any provided arguments.
 * @since 0.9.8
 * @group Function
 * @example
 * ```ts
 * const host = {
 *     prefix: "Hello",
 *     log(value: string) {
 *         return this.prefix + " " + value;
 *     }
 * };
 *
 * const dynamicLog: Function = host.log;
 * const bound = fnBind(dynamicLog, host);
 *
 * bound("friend"); // "Hello friend"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function fnBind<F extends Function, T>(fn: F, thisArg: T, ...argArray: any[]): F;

/*#__NO_SIDE_EFFECTS__*/
export function fnBind<F extends (...args: any[]) => any, T>(fn: F, thisArg: T): any {
    // The arguments are [fn, thisArg, ...args], so this invokes the intrinsic Function.prototype.bind with fn
    // as its `this`, which is fn.bind(thisArg, ...args). Passing the arguments object directly to apply()
    // avoids slicing them into a new array, and using the intrinsic means this doesn't depend on the fn's own
    // (overridable) bind / call / apply properties. This remains a function (rather than an alias like fnCall)
    // to retain the overloads, and no other code runs before arguments is read.
    return FuncCall.apply(FuncBind, arguments);
}
