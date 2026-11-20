/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { FuncCall, NULL_VALUE } from "./constants";

/**
 * @function
 * @internal
 * @ignore
 * Internal helper to run the named function on the passed first argument, this does not support polyfill
 * or prototype fallback, so the function must exist on the provided first argument.
 * If the first argument is null, undefined or the function does not exist an exception will be thrown
 * by the runtime
 * @param funcName - The function name to call on the first argument passed to the wrapped function
 * @returns A function which will call the funcName against the first passed argument and pass on the remaining arguments
 */
export const _unwrapInstFunction:<R, T>(funcName: keyof T) => <T>(this: T, ..._args:any) => R = _unwrapFunctionWithPoly;

/**
 * @function
 * @internal
 * @ignore
 * Internal helper to convert an expanded function back into an instance `this` function call
 * @param funcName - The function name to call on the first argument passed to the wrapped function
 * @param clsProto - The Class or class prototype to fallback to if the instance doesn't have the function.
 * @returns A function which will call the funcName against the first passed argument and pass on the remaining arguments
 */
export const _unwrapFunction:<R, T>(funcName: keyof T, clsProto: T) => <T>(this: T, ..._args:any) => R = _unwrapFunctionWithPoly;

/**
 * @internal
 * @ignore
 * Internal helper to convert an expanded function back into an instance `this` function call
 * @param funcName - The function name to call on the first argument passed to the wrapped function
 * @param clsProto - The Class or class prototype to fallback to if the instance doesn't have the function.
 * @param polyFunc - The function to call if not available on the thisArg, act like the polyfill
 * @returns A function which will call the funcName against the first passed argument and pass on the remaining arguments
 */
/*#__NO_SIDE_EFFECTS__*/
export function _unwrapFunctionWithPoly<T, P extends (...args: any) => any>(funcName: keyof T, clsProto?: T, polyFunc?: P): (thisArg: any) => ReturnType<P> {
    let clsFn = clsProto ? clsProto[funcName] : NULL_VALUE;

    return function(): ReturnType<P> {
        // The function has no named parameters (the value is read from the arguments), as in non-strict code (eg. a
        // bundle without "use strict") a named parameter maps the arguments object to it, which makes passing the
        // arguments to apply() several times slower
        let thisArg = arguments[0];
        let theFunc = (thisArg ? thisArg[funcName] : NULL_VALUE) || clsFn;

        // theFunc.call(thisArg, ...rest) or polyFunc(thisArg, ...rest), passing the arguments object directly
        // to apply() (rather than slicing it) avoids an array allocation on every call. The intrinsic
        // Function.prototype.call is used so this doesn't depend on theFunc's own (overridable) call property.
        // Every wrapped function exists on a supported runtime or has a polyfill, so (rather than including an
        // error message, and dumpObj, in every bundle that uses a wrapper) when there is neither the runtime
        // throws its own TypeError for calling apply on undefined / null (eg. for _unwrapInstFunction when the
        // instance doesn't have the function)
        return ((theFunc ? FuncCall : polyFunc) as Function).apply(theFunc || thisArg, arguments);
    };
}

/**
 * @internal
 * @ignore
 * Internal helper to convert an expanded function back into an instance `this` function call
 * using only the provided class / prototype function or the polyfill. Unlike
 * {@link _unwrapFunctionWithPoly}, this helper does not perform any instance-level lookup.
 * @param funcName - The function name to call on the first argument passed to the wrapped function
 * @param clsProto - The Class or class prototype to use if the function exists.
 * @param polyFunc - The function to call if the class / prototype function is not available
 * @returns A function which will call the resolved function against the first passed argument and pass on the remaining arguments
 */
/*#__NO_SIDE_EFFECTS__*/

export function _unwrapFunctionNoInstWithPoly<T, P extends (...args: any) => any>(funcName: keyof T, clsProto?: T, polyFunc?: P): (thisArg: any) => ReturnType<P> {
    let clsFn = clsProto ? clsProto[funcName] : NULL_VALUE;

    return function(): ReturnType<P> {
        // See _unwrapFunctionWithPoly(), there are no named parameters (non-strict mode). Forwards the arguments
        // without slicing them, using the intrinsic Function.prototype.call, and when there is neither function the
        // runtime throws its own TypeError
        return ((clsFn ? FuncCall : polyFunc) as Function).apply(clsFn || arguments[0], arguments);
    };
}

/**
 * @internal
 * @ignore
 * Internal helper to lookup and return the named property from the first argument (which becomes the this)
 *
 * @since 0.4.2
 * @typeParam T - The type of the object which contains the propName
 * @param propName - The property name
 * @returns The value of the property
 */
/*#__NO_SIDE_EFFECTS__*/
export function _unwrapProp<T>(propName: keyof T) {
    return function (thisArg: T) {
        return thisArg[propName];
    };
}
