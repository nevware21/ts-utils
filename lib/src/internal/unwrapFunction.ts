/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { dumpObj } from "../helpers/diagnostics";
import { throwTypeError } from "../helpers/throw";

/**
 * @internal
 * @ignore
 * Internal helper to convert an expanded function back into an instance `this` function call
 * @param funcName - The function name to call on the first argument passed to the wrapped function
 * @param throwError - Boolean flag to indicate whether a TypeError should be thrown if the function does not exist, defaults to true
 * @param defValue - The default value to return if the function is not present
 * @returns A function which will call the funcName against the first passed argument and pass on the remaining arguments
 */
export function _unwrapFunction<T>(funcName: string, throwError?: boolean, defValue?: any) {
    return function(): T {
        let theArgs = arguments;
        if (theArgs.length >= 1) {
            let thisArg: any = theArgs[0];
            if (thisArg[funcName]) {
                let args = [];

                for (let lp = 1; lp < theArgs.length; lp++) {
                    args.push(theArgs[lp]);
                }
    
                return (thisArg[funcName] as Function).apply(thisArg, args);
            }
        }

        if (throwError !== false) {
            throwTypeError("'" + funcName + "' not defined for " + dumpObj(theArgs[0]));
        }
        
        return defValue;
    };
}