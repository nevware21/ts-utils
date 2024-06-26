/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { ArrSlice, CALL } from "../internal/constants";
import { objCopyProps, objDeepCopy } from "../object/copy";

/**
 * @internal
 * @ignore
 */
function _doExtend<T>(target: T, theArgs: any[]): any {
    arrForEach(theArgs, (theArg) => {
        objCopyProps(target, theArg);
    });

    return target;
}

/**
 * Create a new object by merging the passed arguments, this is effectively the same as calling `objExtend({}, ...theArgs)` where
 * all of the arguments are added to a new object that is returned.
 * @group Object
 * @param target - The original object to be extended.
 * @param theArgs - The optional number of arguments to be copied
 * @returns - A new object or the original
 */
export function deepExtend<T>(target: T, ...theArgs: any): T & any;

/**
 * Create a new object by merging the passed arguments, this is effectively the same as calling `objExtend({}, ...theArgs)` where
 * all of the arguments are added to a new object that is returned.
 * @group Object
 * @param target - The original object to be extended.
 * @param objN - The optional number of arguments to be copied
 * @returns - A new object or the original
 */
export function deepExtend<T, T1, T2, T3, T4, T5, T6>(target: T, obj1?: T1, obj2?: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6): T & T1 & T2 & T3 & T4 & T5 & T6 {
    return _doExtend(objDeepCopy(target) || {}, ArrSlice[CALL](arguments));
}
 
/**
 * Extend the target object by merging the passed arguments into it
 * @group Object
 * @param target - The object to be extended or overwritten
 * @param theArgs - The optional number of arguments to be copied
 * @returns - A new object or the original
 */
export function objExtend<T>(target: T, ...theArgs: any): T & any;

/**
 * Extend the target object by merging the passed arguments into it
 * @group Object
 * @param target - The object to be extended or overwritten
 * @param objN - The optional number of arguments to be copied
 * @returns - A new object or the original
 */
export function objExtend<T, T1, T2, T3, T4, T5, T6>(target: T, obj1?: T1, obj2?: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6): T & T1 & T2 & T3 & T4 & T5 & T6 {
    return _doExtend(target || {}, ArrSlice[CALL](arguments));
}

 