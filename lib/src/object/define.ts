/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { EMPTY, ObjClass, VALUE } from "../internal/constants";
import { isFunction, isUndefined, objToString } from "../helpers/base";
import { throwUnsupported } from "../helpers/customError";
import { dumpObj } from "../helpers/diagnostics";

const _objDefineProperty = ObjClass["defineProperty"];

/**
 * Defines a new property directly on an object, or modifies an existing property on an object, and returns the object.
 * @group Object
 * @param target - The object on which to define the property.
 * @param key - The name or Symbol of the property to be defined or modified.
 * @param descriptor - The descriptor for the property being defined or modified.
 */
export function objDefineProp<T>(target: T, key: PropertyKey, descriptor: PropertyDescriptor & ThisType<any>): T {
    let error: string = EMPTY;
    if (_objDefineProperty) {
        try {
            _objDefineProperty(target, key, descriptor);
            return target;
        } catch (e) {
            // IE8 Defines a defineProperty on Object but it's only supported for DOM elements so it will throw
            // We will just ignore this here.
            error = " - " + dumpObj(e);
        }
    }

    throwUnsupported("Unable to define property [" + objToString(key) + "] on " + dumpObj(target) + error);
}

/**
 * Try to define a get object property accessor for the target object.
 * @group Object
 * @param target - The object on which to define the property.
 * @param key - The name of the property to be defined or modified
 * @param value - The value or a function that returns the value
 * @param configurable - Can the value be changed, defaults to true.
 * @param enumerable - Should this get property be enumerable, defaults to true.
 * @returns The object that was passed to the function
 */
export function objDefineGet<T, V = any>(target: T, key: PropertyKey, value: (() => V) | V, configurable?: boolean, enumerable?: boolean): T {
    const desc: PropertyDescriptor = {
        enumerable: isUndefined(enumerable) ? true : enumerable,
        configurable: isUndefined(configurable) ? true : configurable
    }

    if (isFunction(value)) {
        desc.get = value;
    } else {
        desc[VALUE] = value;
    }

    return objDefineProp(target, key, desc);
}

/**
 * Try to define get/set object property accessors for the target object/prototype, this will provide compatibility with
 * existing API definition when run within an ES5+ container that supports accessors but still enable the code to be loaded
 * and executed in an ES3 container, providing basic IE8 compatibility.
 * @group Object
 * @param target - The object on which to define the property.
 * @param prop - The name of the property to be defined or modified.
 * @param getProp - The getter function to wire against the getter.
 * @param setProp - The setter function to wire against the setter.
 * @param configurable - Can the value be changed, defaults to true
 * @param enumerable - Should this get property be enumerable, defaults to true.
 * @returns The object that was passed to the function
 */
export function objDefineAccessors<T, V = any>(target: T, prop: PropertyKey, getProp?: (() => V) | null, setProp?: ((v: V) => void) | null, configurable?: boolean, enumerable?: boolean): T {
    if (_objDefineProperty) {
        const descriptor: PropertyDescriptor = {
            enumerable: isUndefined(enumerable) ? true : enumerable,
            configurable: isUndefined(configurable) ? true : configurable
        }

        if (getProp) {
            descriptor.get = getProp;
        }
        if (setProp) {
            descriptor.set = setProp;
        }

        return objDefineProp(target, prop, descriptor);
    }
}
