/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { ObjClass } from "../internal/constants";
import { isArray, isObject } from "../helpers/base";
import { throwTypeError } from "../helpers/throw";
import { objForEachKey } from "./for_each_key";

const _objFreeze = ObjClass["freeze"];

function _doNothing<T>(value: T): T {
    return value;
}

/**
 * The `objAssign()` method copies all enumerable own properties from one or more source objects
 * to a target object. It returns the modified target object.
 *
 * Properties in the target object are overwritten by properties in the sources if they have the
 * same key. Later sources' properties overwrite earlier ones.
 *
 * The objAssign() method only copies enumerable and own properties from a source object to a
 * target object. It uses `Get` on the source and `Set` on the target, so it will invoke
 * [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) and
 * [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set).
 * Therefore it assigns properties, versus copying or defining new properties. This may make it
 * unsuitable for merging new properties into a prototype if the merge sources contain getters.
 *
 * For copying property definitions (including their enumerability) into prototypes, use
 * {@link objGetOwnPropertyDescriptor} and {@link objDefineProp} instead.
 *
 * Both String and Symbol properties are copied.
 *
 * In case of an error, for example if a property is non-writable, a TypeError is raised, and
 * the target object is changed if any properties are added before the error is raised.
 * @group Object
 * @example
 * ```ts
 * const obj = { a: 1 };
 * const copy = objAssign({}, obj);
 * console.log(copy); // { a: 1 }
 *
 * const o1 = { a: 1 };
 * const o2 = { b: 2 };
 * const o3 = { c: 3 };
 *
 * const obj = objAssign(o1, o2, o3);
 * console.log(obj); // { a: 1, b: 2, c: 3 }
 * console.log(o1);  // { a: 1, b: 2, c: 3 }, target object itself is changed.
 * ```
 */
export const objAssign = ObjClass["assign"];

/**
 * The `objKeys()` method returns an array of a given object's own enumerable property names, iterated in
 * the same order that a normal loop would.
 *
 * objKeys() returns an array whose elements are strings corresponding to the enumerable properties found
 * directly upon object. The ordering of the properties is the same as that given by looping over the
 * properties of the object manually.
 * @group Object
 * @param value - The object to obtain a copy of the keys from
 * @returns An array of the properties names for the value object.
 * @example
 * ```ts
 * // simple array
 * const arr = ['a', 'b', 'c'];
 * console.log(objKeys(arr)); // console: ['0', '1', '2']
 *
 * // array-like object
 * const obj = { 0: 'a', 1: 'b', 2: 'c' };
 * console.log(objKeys(obj)); // console: ['0', '1', '2']
 *
 * // array-like object with random key ordering
 * const anObj = { 100: 'a', 2: 'b', 7: 'c' };
 * console.log(objKeys(anObj)); // console: ['2', '7', '100']
 *
 * // getFoo is a property which isn't enumerable
 * const myObj = objCreate({}, {
 *   getFoo: {
 *     value() { return this.foo; }
 *   }
 * });
 * myObj.foo = 1;
 * console.log(objKeys(myObj)); // console: ['foo']
 * ```
 */
export function objKeys(value: any): string[] {
    if (!isObject(value) || value === null) {
        throwTypeError("objKeys called on non-object");
    }

    return ObjClass.keys(value);
}

/**
 * Perform a deep freeze on the object and all of it's contained values / properties by recursively calling
 * `objFreeze()` on all enumerable properties of the object and on each property returned.
 * @group Object
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
 * @group Object
 * @param value - The object to freeze.
 * @returns The object that was passed to the function.
 */
export const objFreeze: <T>(value: T) => T = _objFreeze || _doNothing;

/**
 * The `objSeal()` method seals an object, preventing new properties from being added to it and marking all
 * existing properties as non-configurable. Values of present properties can still be changed as long as they
 * are writable.
 * @group Object
 * @param value - The object which should be sealed.
 * @returns The object being sealed.
 */
export const objSeal: <T>(value: T) => T = ObjClass["seal"] || _doNothing;

/**
 * The objGetPrototypeOf() method returns the prototype (i.e. the value of the internal [[Prototype]] property)
 * of the specified value.
 * @since 0.4.4
 * @group Object
 * @param value = The object whose prototype is to be returned
 */
export const objGetPrototypeOf: (value: any) => any = ObjClass["getPrototypeOf"] || _doNothing;