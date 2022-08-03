/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { ObjClass } from "../internal/constants";
import { arrForEach } from "../helpers/array";
import { isArray, isNullOrUndefined, isObject } from "../helpers/base";
import { throwTypeError } from "../helpers/throw";
import { objForEachKey } from "./for_each_key";

const ObjAssign = ObjClass["assign"];
const _objFreeze = ObjClass["freeze"];

function _doNothing<T>(value: T): T {
    return value;
}

export const objAssign = ObjAssign;

export function objKeys(value: any): string[] {
    if (!isObject(value) || value === null) {
        throwTypeError("objKeys called on non-object");
    }

    return ObjClass.keys(value);
}

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
        objForEachKey(source, (key, value) => {
            // Perform a deep copy of the object
            target[key] = objDeepCopy(value);
        });
    }

    return target;
}

/**
 * Perform a deep freeze on the object and all of it's contained values / properties by recursively calling
 * `objFreeze()` on all enumerable properties of the object and on each property returned.
 *
 * @param value - the object to be completly frozen.
 * @returns The originally passed in object.
 */
export function objDeepFreeze<T>(value: T): T {
    if (_objFreeze) {
        objForEachKey(value, (key, value) => {
            if (isArray(value) || isObject(value)) {
                _objFreeze(value);
            }
        });
    }

    return objFreeze(value);
}

/**
 * The `objFreeze()` method freezes an object. A frozen object can no longer be changed; freezing an object
 * prevents new properties from being added to it, existing properties from being removed, prevents changing the
 * enumerability, configurability, or writability of existing properties, and prevents the values of existing
 * properties from being changed. In addition, freezing an object also prevents its prototype from being changed.
 * `objFreeze()` returns the same object that was passed in.
 *
 * Nothing can be added to or removed from the properties set of a frozen object. Any attempt to do so will fail,
 * either silently or by throwing a TypeError exception (most commonly, but not exclusively, when in strict mode).
 *
 * For data properties of a frozen object, values cannot be changed, the writable and configurable attributes are
 * set to false. Accessor properties (getters and setters) work the same (and still give the illusion that you are
 * changing the value). Note that values that are objects can still be modified, unless they are also frozen. As
 * an object, an array can be frozen; after doing so, its elements cannot be altered and no elements can be added
 * to or removed from the array.
 *
 * `objFreeze()` returns the same object that was passed into the function. It does not create a frozen copy.
 *
 * @param value - The object to freeze.
 * @returns The object that was passed to the function.
 */
export const objFreeze: <T>(value: T) => T = _objFreeze || _doNothing;

/**
 * The `objSeal()` method seals an object, preventing new properties from being added to it and marking all
 * existing properties as non-configurable. Values of present properties can still be changed as long as they
 * are writable.
 * @param value - The object which should be sealed.
 * @returns The object being sealed.
 */
export const objSeal: <T>(value: T) => T = ObjClass["seal"] || _doNothing;
