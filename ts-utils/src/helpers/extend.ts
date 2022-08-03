/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { arrForEach } from "./array";
import { objCopyProps, objDeepCopy } from "../object/object";

/**
 * @internal
 * @ignore
 */
function _doExtend<T>(target: T, theArgs: any[]) {
    arrForEach(theArgs, (theArg) => {
        objCopyProps(target, theArg);
    });

    return target;
}

/**
 * Create a new object by merging the passed arguments, this is effectively the same as calling `objExtend({}, ...theArgs)` where
 * all of the arguments are added to a new object that is returned.
 * @param target - The original object to be extended.
 * @param theArgs - The optional number of arguments to be copied
 * @returns - A new object or the original
 */
export function deepExtend<T, T1, T2, T3, T4, T5, T6>(target: T, obj1?: T1, obj2?: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6): T & T1 & T2 & T3 & T4 & T5 & T6
export function deepExtend<T>(target: T, ...theArgs: any): any {
    return _doExtend(objDeepCopy(target) || {}, theArgs);
}
 
/**
 * Extend the target object by merging the passed arguments into it
 * @param target - The object to be extended or overwritten
 * @param theArgs - The optional number of arguments to be copied
 * @returns - A new object or the original
 */
export function objExtend<T, T1, T2, T3, T4, T5, T6>(target: T, obj1?: T1, obj2?: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6): T & T1 & T2 & T3 & T4 & T5 & T6
export function objExtend<T>(target: T, ...theArgs: any): any {
    return _doExtend(target || {}, theArgs);
}

 