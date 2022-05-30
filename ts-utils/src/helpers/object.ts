/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { FUNCTION, OBJECT } from "../internal/constants";
import { arrForEach } from "./array";
import { isArray, isFunction, isNullOrUndefined, isObject, isUndefined, ObjClass, ObjProto } from "./base";
import { throwTypeError } from "./throw";

const ObjAssign = ObjClass["assign"];
const ObjCreate = ObjClass["create"];
const _objDefineProperty = ObjClass["defineProperty"];
const _objFreeze = ObjClass["freeze"];

function _doNothing<T>(value: T): T {
    return value;
}

export function objHasOwnProperty(obj: any, prop: string): boolean {
    return obj && ObjProto.hasOwnProperty.call(obj, prop);
}

export function objKeys(value: any): string[] {
    const valueType = typeof value;

    if (valueType !== FUNCTION && (valueType !== OBJECT || value === null)) {
        throwTypeError("objKeys called on non-object");
    }

    return ObjClass.keys(value);
}

/**
 * Calls the provided `callbackFn` function once for each key in an object. This is equivelent to `arrForEach(Object.keys(theObject), callbackFn)` or
 * if not using the array helper `Object.keys(theObject).forEach(callbackFn)` except that this helper avoid creating a temporary of the object
 * keys before iterating over them and like the `arrForEach` helper you CAN stop or break the iteration by returning -1 from the `callbackFn` function.
 * @param callbackfn  A function that accepts up to two arguments, the key name and the current value of the property represented by the key.
 * @param thisArg  [Optional] An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, null or undefined
 * the object will be used as the this value.
 */

export function objForEachKey(theObject: any, callbackfn: (key: string, value: any) => void | number, thisArg?: any): void {
    if (theObject && isObject(theObject)) {
        for (const prop in theObject) {
            if (objHasOwnProperty(theObject, prop)) {
                if (callbackfn.call(thisArg || theObject, prop, theObject[prop]) === -1) {
                    break;
                }
            }
        }
    }
}

export const objAssign = ObjAssign;

/**
 * Performs a deep copy of the source object
 * @param source
 */
export function objDeepCopy<T>(source: T): T {

    if (isArray(source)) {
        const result: any[] = [];
        arrForEach(source, (value) => {
            result.push(objDeepCopy(value));
        });

        return <any>result;
    }

    if (isObject(source)) {
        return objCopyProps<T>({} as T, source);
    }

    return source;
}

export function objCopyProps<T>(target: T, source: any) {
    if (!isNullOrUndefined(source)) {
        objForEachKey(source, (key) => {
            // Perform a deep copy of the object
            target[key] = objDeepCopy(source[key]);
        });
    }

    return target;
}

export function objExtend(target: any, ...theArgs: any): any {
    const to = objDeepCopy(target);

    if (!isNullOrUndefined(target)) {
        for (let lp = 0; lp < theArgs.length; lp++) {
            objCopyProps(to, theArgs[lp]);
        }
    }

    return to;
}

/**
 * Defines a new property directly on an object, or modifies an existing property on an object, and returns the object.
 * @param target - The object on which to define the property.
 * @param key - The name or Symbol of the property to be defined or modified.
 * @param descriptor - The descriptor for the property being defined or modified.
 */
export function objDefineProp(target: any, key: PropertyKey, descriptor: PropertyDescriptor & ThisType<any>) {
    const objDefine = _objDefineProperty;
    if (objDefine) {
        return objDefine(target, key, descriptor);
    }

    if (!isUndefined(descriptor.value)) {
        target[key] = descriptor.value;
    } else if (!isUndefined(descriptor.get)) {
        target[key] = descriptor.get();
    }
}

export function objDefineGet(target: any, key: PropertyKey, value: any) {
    const desc: PropertyDescriptor = {
        enumerable: true
    }

    if (isFunction(value)) {
        desc.get = value;
    } else {
        desc.value = value;
    }

    objDefineProp(target, key, desc);
}

/**
 * Try to define get/set object property accessors for the target object/prototype, this will provide compatibility with
 * existing API definition when run within an ES5+ container that supports accessors but still enable the code to be loaded
 * and executed in an ES3 container, providing basic IE8 compatibility.
 * @param target The object on which to define the property.
 * @param prop The name of the property to be defined or modified.
 * @param getProp The getter function to wire against the getter.
 * @param setProp The setter function to wire against the setter.
 * @returns True if it was able to create the accessors otherwise false
 */
export function objDefineAccessors<T>(target: any, prop: PropertyKey, getProp?: () => T, setProp?: (v: T) => void): boolean {
    if (_objDefineProperty) {
        try {
            const descriptor: PropertyDescriptor = {
                enumerable: true,
                configurable: true
            }

            if (getProp) {
                descriptor.get = getProp;
            }
            if (setProp) {
                descriptor.set = setProp;
            }

            objDefineProp(target, prop, descriptor);
            return true;
        } catch (e) {
            // IE8 Defines a defineProperty on Object but it's only supported for DOM elements so it will throw
            // We will just ignore this here.
        }
    }

    return false;
}

export function objDeepFreeze<T>(obj: T): T {
    if (_objFreeze) {
        objForEachKey(obj, (name, value) => {
            if (isArray(value) || isObject(value)) {
                _objFreeze(value);
            }
        });
    }

    return objFreeze(obj);
}

export const objFreeze: <T>(value: T) => T = _objFreeze || _doNothing;
export const objSeal: <T>(value: T) => T = ObjClass["seal"] || _doNothing;