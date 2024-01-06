/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { dumpObj } from "../helpers/diagnostics";
import { throwTypeError } from "../helpers/throw";
import { asString } from "../string/as_string";
import { ArrProto, CALL, SLICE } from "./constants";

let _slice: typeof ArrProto.slice;

function _throwMissingFunction<T>(funcName:  keyof T, thisArg: T): never {
    throwTypeError("'" + asString(funcName) + "' not defined for " + dumpObj(thisArg));
}

/**
 * @internal
 * @ignore
 * Internal helper to run the named function on the passed first argument, this does not support polyfill
 * or prototype fallback, so the function must exist on the provided first argument.
 * If the first argument is null, undefined or the function does not exist an exception will be thrown
 * by the runtime
 * @param funcName - The function name to call on the first argument passed to the wrapped function
 * @returns A function which will call the funcName against the first passed argument and pass on the remaining arguments
 */
/*#__NO_SIDE_EFFECTS__*/
export function _unwrapInstFunction<R, T>(funcName: keyof T) {
    _slice = _slice || ArrProto[SLICE];
    return function(thisArg: any): R {
        return (thisArg[funcName] as Function).apply(thisArg, _slice[CALL](arguments, 1));
    };
}

/**
 * @internal
 * @ignore
 * Internal helper to convert an expanded function back into an instance `this` function call
 * @param funcName - The function name to call on the first argument passed to the wrapped function
 * @param clsProto - The Class or class prototype to fallback to if the instance doesn't have the function.
 * @returns A function which will call the funcName against the first passed argument and pass on the remaining arguments
 */
/*#__NO_SIDE_EFFECTS__*/
export function _unwrapFunction<R, T>(funcName: keyof T, clsProto?: T) {
    _slice = _slice || ArrProto[SLICE];
    let clsFn = clsProto && clsProto[funcName];

    return function(thisArg: any): R {
        let theFunc = (thisArg && thisArg[funcName]) || clsFn;
        if (theFunc) {
            return (theFunc as Function).apply(thisArg, _slice[CALL](arguments, 1));
        }

        _throwMissingFunction(funcName, thisArg);
    };
}

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
export function _unwrapFunctionWithPoly<T, P extends (...args: any) => any>(funcName: keyof T, clsProto: T, polyFunc: P) {
    _slice = _slice || ArrProto[SLICE];
    let clsFn = clsProto && clsProto[funcName];

    return function(thisArg: any): ReturnType<P> {
        let theFunc = (thisArg && thisArg[funcName]) || clsFn;
        if (theFunc || polyFunc) {
            let theArgs = arguments;
            return ((theFunc || polyFunc) as Function).apply(thisArg, theFunc ? _slice[CALL](theArgs, 1) : theArgs);
        }

        _throwMissingFunction(funcName, thisArg);
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
export function _unwrapProp<T>(propName: keyof T) {
    return function (thisArg: T) {
        return thisArg[propName];
    };
}