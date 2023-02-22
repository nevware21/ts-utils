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
import { EMPTY } from "./constants";
import { _extractArgs } from "./extract_args";

/**
 * @internal
 * @ignore
 * Internal helper to convert an expanded function back into an instance `this` function call
 * @param funcName - The function name to call on the first argument passed to the wrapped function
 * @param clsProto - The Class or class prototype to fallback to if the instance doesn't have the function.
 * @param polyFunc - The function to call if not available on the thisArg, act like the polyfill
 * @returns A function which will call the funcName against the first passed argument and pass on the remaining arguments
 */
export function _unwrapFunction<R, T>(funcName: T extends null | undefined ? string : keyof T, target?: T, polyFunc?: Function) {
    return function(thisArg: any): R {
        if ((thisArg || thisArg === EMPTY)) {
            let theFunc = thisArg[funcName] || (target && target[funcName as keyof T]);
            if (theFunc) {
                return (theFunc as Function).apply(thisArg, _extractArgs(arguments, 1));
            }

            if (polyFunc) {
                return polyFunc.apply(thisArg, arguments);
            }
        }

        throwTypeError("'" + asString(funcName) + "' not defined for " + dumpObj(thisArg));
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