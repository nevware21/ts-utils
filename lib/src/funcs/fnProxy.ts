/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 Nevware21
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { isArray, isFunction } from "../helpers/base";
import { ArrSlice, CALL } from "../internal/constants";
import { fnApply, fnBind } from "./funcs";
import { ProxyFunctionDef, TypeFuncNames } from "./types";

/**
 * Create a deferred proxy function which will call the named function of the result of the hostFn, this enables
 * creating bound functions which when called call the proxy the function to a different host (this) instance.
 *
 * This is different from `fnBind` which is provided with the concrete function and `this` instances, while the proxy
 * will lazily obtain the `this` and the function is obtained by looking up the named function from the returned
 * host (`this`) instance.
 *
 * @since 0.9.8
 * @group Function
 * @param hostFn - A function to get the current host and thisArg that will be called
 * @param funcName - The name of the function to call on the host
 * @returns The result of calling the function with the specified `this` value and arguments.
 * @example
 * ```ts
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
 * let getHost = () => {
 *     return module1;
 * };
 *
 * let deferredFn = createFnDeferredProxy(getHost, "getX");
 *
 * deferredFn();   // 21
 *
 * module2.defX = deferredFn;
 *
 * module2.defX();  // 21
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function createFnDeferredProxy<H, F extends (...args:any) => any>(hostFn: () => H, funcName: TypeFuncNames<H>): F {

    return function() {
        // Capture the original arguments passed to the method
        var theArgs = ArrSlice[CALL](arguments);
        let theHost = hostFn();

        return fnApply(theHost[funcName] as (...args: any) => any, theHost, theArgs);
    } as unknown as F;
}

/**
 * Creates proxy functions on the target which internally will call the source version with all arguments passed to the target method.
 *
 * @since 0.9.8
 * @group Function
 * @param target - The target object to be assigned with the source properties and functions
 * @param host - The host instance or a function to return the host instance which contains the
 * functions and will be assigned as the `this` for the function being called.
 * @param funcDefs - An array of function definitions on how each named function will be
 * proxied onto the target.
 * @return The original target after all proxies have been assigned
 * @example
 * ```ts
 * let test = {
 *     x: 21,
 *     func1() {
 *         return this.x;
 *     }
 * };
 *
 * test.func1();        // 21
 * let newTarget = createProxyFuncs({} as any, test, [
 *     { n: "func1" },
 *     { n: "func1", as: "aliasFn" }
 * ]);
 *
 * newTarget.func1();   // 21
 * newTarget.aliasFn();   // 21
 *
 * newTarget.x = 42;
 *
 * // The return is still using the `this.x` from the original `test` as it's proxied
 * newTarget.func1();   // 21
 * newTarget.aliasFn();   // 21
 *
 * let getHostFn = () => {
 *    return test;
 * };
 *
 * newTarget = createProxyFuncs({} as any, getHostFn, [
 *     { n: "func1" },
 *     { n: "func1", as: "aliasFn" }
 * ]);
 *
 * newTarget.func1();   // 21
 * newTarget.aliasFn();   // 21
 *
 * newTarget.x = 42;
 *
 * // The return is still using the `this.x` from the original `test` as it's proxied
 * newTarget.func1();   // 21
 * newTarget.aliasFn();   // 21
 * ```
 */
export function createProxyFuncs<T, H>(target: T, host: H | (() => H), funcDefs: ProxyFunctionDef<T, H>[]): T {
    if (target && host && isArray(funcDefs)) {
        let isDeferred = isFunction(host);

        arrForEach(funcDefs, (funcDef) => {
            let targetName = (funcDef.as || funcDef.n) as any;
            if (funcDef.rp === false && target[targetName]) {
                return;
            }

            target[targetName] = isDeferred ?
                createFnDeferredProxy(host as () => H, funcDef.n) :
                fnBind((host as H)[funcDef.n] as Function, host);
        });
    }

    return target;
}