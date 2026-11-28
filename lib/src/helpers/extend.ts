/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { LENGTH } from "../internal/constants";
import { objCopyProps, objDeepCopy } from "../object/copy";

/**
 * @internal
 * @ignore
 * Copies the properties of each of the arguments after the first onto the target. The first argument is the caller's
 * target, which is the target itself (objExtend, or deepExtend for a value objDeepCopy doesn't copy), was already
 * copied into it by objDeepCopy (deepExtend) or is falsy (the target is then a new object), so it isn't copied again
 * and the target's own values are kept unless an argument replaces them. The callers pass their arguments object
 * directly rather than a copy, as (ES5+) each call has its own arguments object, the callers never reassign their
 * named parameters (which would change a mapped arguments object in non-strict mode) and the arguments are only read
 * during the call.
 */
function _doExtend<T>(target: T, theArgs: ArrayLike<any>): any {
    for (let idx = 1; idx < theArgs[LENGTH]; idx++) {
        objCopyProps(target, theArgs[idx]);
    }

    return target;
}

/**
 * Create a new object by merging the passed arguments, this is effectively the same as calling
 * `objExtend({}, target, ...theArgs)` for a plain object target, where all of the arguments are added to a new object
 * that is returned. A target which {@link objDeepCopy} doesn't copy (eg. a class instance or a function) is itself
 * extended and returned. Since 0.20.0 the target isn't copied onto the result again, previously each of its getters
 * was read twice and the own plain objects, arrays and dates of a target which objDeepCopy doesn't copy were replaced
 * by deep copies.
 * Only own enumerable properties are copied, inherited properties and properties named `__proto__`, `constructor` or
 * `prototype` are not.
 * @group Object
 * @param target - The original object to be extended.
 * @param theArgs - The optional number of arguments to be copied
 * @returns - A deep copy of the target with the arguments merged into it, a new object when the target is falsy
 * (eg. null or undefined), or the target itself when {@link objDeepCopy} doesn't copy it (eg. a class instance)
 */
export function deepExtend<T>(target: T, ...theArgs: any): T & any;

/**
 * Create a new object by merging the passed arguments, this is effectively the same as calling
 * `objExtend({}, target, ...theArgs)` for a plain object target, where all of the arguments are added to a new object
 * that is returned. A target which {@link objDeepCopy} doesn't copy (eg. a class instance or a function) is itself
 * extended and returned. Since 0.20.0 the target isn't copied onto the result again, previously each of its getters
 * was read twice and the own plain objects, arrays and dates of a target which objDeepCopy doesn't copy were replaced
 * by deep copies.
 * Only own enumerable properties are copied, inherited properties and properties named `__proto__`, `constructor` or
 * `prototype` are not.
 * @group Object
 * @param target - The original object to be extended.
 * @param objN - The optional number of arguments to be copied
 * @returns - A deep copy of the target with the arguments merged into it, a new object when the target is falsy
 * (eg. null or undefined), or the target itself when {@link objDeepCopy} doesn't copy it (eg. a class instance)
 */
export function deepExtend<T, T1, T2, T3, T4, T5, T6>(target: T, obj1?: T1, obj2?: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6): T & T1 & T2 & T3 & T4 & T5 & T6 {
    return _doExtend(objDeepCopy(target) || {}, arguments);
}
 
/**
 * Extend the target object by merging the passed arguments into it. The target itself is updated and returned (it
 * isn't copied): its existing properties (and the objects they reference) are kept, unless an argument has a property
 * with the same key, whose value (copied with {@link objDeepCopy}) replaces it. When the target is falsy (eg. null
 * or undefined) a new object is extended and returned. A built-in prototype (eg. `Object.prototype`) is not changed.
 * Since 0.20.0 the target isn't also copied onto itself, previously each of its own plain objects, arrays and dates
 * was replaced by a deep copy, each of its getters was read and a read-only property threw a TypeError.
 * Only own enumerable properties are copied, inherited properties and properties named `__proto__`, `constructor` or
 * `prototype` are not.
 * @group Object
 * @param target - The object to be extended or overwritten
 * @param theArgs - The optional number of arguments to be copied
 * @returns - The target, or a new object when the target is falsy (eg. null or undefined)
 */
export function objExtend<T>(target: T, ...theArgs: any): T & any;

/**
 * Extend the target object by merging the passed arguments into it. The target itself is updated and returned (it
 * isn't copied): its existing properties (and the objects they reference) are kept, unless an argument has a property
 * with the same key, whose value (copied with {@link objDeepCopy}) replaces it. When the target is falsy (eg. null
 * or undefined) a new object is extended and returned. A built-in prototype (eg. `Object.prototype`) is not changed.
 * Since 0.20.0 the target isn't also copied onto itself, previously each of its own plain objects, arrays and dates
 * was replaced by a deep copy, each of its getters was read and a read-only property threw a TypeError.
 * Only own enumerable properties are copied, inherited properties and properties named `__proto__`, `constructor` or
 * `prototype` are not.
 * @group Object
 * @param target - The object to be extended or overwritten
 * @param objN - The optional number of arguments to be copied
 * @returns - The target, or a new object when the target is falsy (eg. null or undefined)
 */
export function objExtend<T, T1, T2, T3, T4, T5, T6>(target: T, obj1?: T1, obj2?: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6): T & T1 & T2 & T3 & T4 & T5 & T6 {
    return _doExtend(target || {}, arguments);
}

 