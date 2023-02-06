/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { dumpObj } from "../helpers/diagnostics";
import { throwTypeError } from "../helpers/throw";
import { EMPTY } from "./constants";
import { _extractArgs } from "./extract_args";

/**
 * @internal
 * @ignore
 * Internal helper to convert an expanded function back into an instance `this` function call
 * @param funcName - The function name to call on the first argument passed to the wrapped function
 * @returns A function which will call the funcName against the first passed argument and pass on the remaining arguments
 */
export function _unwrapFunction<T>(funcName: string) {
    return function(thisArg: any): T {
        let args = _extractArgs(arguments, 1);
        if ((thisArg || thisArg === EMPTY) && thisArg[funcName]) {
            return (thisArg[funcName] as Function).apply(thisArg, args);
        }

        throwTypeError("'" + funcName + "' not defined for " + dumpObj(thisArg));
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