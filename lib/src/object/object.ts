/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { NULL_VALUE, ObjClass, __PROTO__ } from "../internal/constants";
import { isArray, isFunction, isObject } from "../helpers/base";
import { objForEachKey } from "./for_each_key";
import { polyObjEntries, polyObjValues } from "../polyfills/object/objKeys";
import { polyObjIs } from "../polyfills/object/objIs";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";
import { objIsFrozen } from "./object_state";
import { _throwIfNullOrUndefined } from "../internal/throwIf";

const _objFreeze = (/*#__PURE__*/_pureRef<typeof Object.freeze>(ObjClass, "freeze"));

export function _doNothing<T>(value: T) {
    return  value;
}

/**
 * Fallback implementation of Object.getPrototypeOf for environments that do not support it.
 * This function retrieves the prototype of a given object. If the object does not have a prototype, it returns null.
 * @internal
 * @ignore
 * @param value - The object whose prototype is to be returned, which may be null.
 * @returns true if the value is an object, false otherwise.
 */
/*#__NO_SIDE_EFFECTS__*/
export function _getProto(value: any) {
    _throwIfNullOrUndefined(value);
    return value[__PROTO__] || NULL_VALUE;
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
 * @function
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
export const objAssign = (/*#__PURE__*/_pureRef<typeof Object.assign>(ObjClass, "assign"));

/**
 * The `objKeys()` method returns an array of a given object's own enumerable property names, iterated in
 * the same order that a normal loop would.
 *
 * objKeys() returns an array whose elements are strings corresponding to the enumerable properties found
 * directly upon object. The ordering of the properties is the same as that given by looping over the
 * properties of the object manually.
 * @function
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
export const objKeys: (value: any) => string[] = (/*#__PURE__*/_pureRef<typeof Object.keys>(ObjClass, "keys"));

/**
 * Internal helper function with a visited array to track objects we've seen, this is used
 * to prevent infinite recursion when we have circular references in the object graph.
 * @internal
 * @ignore
 * @param val - The object to be frozen.
 * @param visited - An array to track visited objects to prevent infinite recursion.
 */
function _deepFreeze(val: any, visited: any[]): any {
    if ((isArray(val) || isObject(val) || isFunction(val)) && !objIsFrozen(val)) {
        // If already visited, don't process again to prevent infinite recursion
        for (let lp = 0; lp < visited.length; lp++) {
            if (visited[lp] === val) {
                return val;
            }
        }
        
        // Mark this object as visited by adding it to the array
        visited.push(val);
        
        // Freeze properties recursively
        objForEachKey(val, (_key, propValue) => {
            _deepFreeze(propValue, visited);
        });
        
        objFreeze(val);
    }
    
    return val;
}
/**
 * Perform a deep freeze on the object and all of it's contained values / properties by recursively calling
 * `objFreeze()` on all enumerable properties of the object and on each property returned.
 * This implementation handles recursive objects (objects that reference themselves) by tracking visited objects.
 * @group Object
 * @param value - the object to be completly frozen.
 * @returns The originally passed in object.
 */
export function objDeepFreeze<T>(value: T): T {
    return _objFreeze ? _deepFreeze(value, []) : value;
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
 * @function
 * @group Object
 * @param value - The object to freeze.
 * @returns The object that was passed to the function.
 */
export const objFreeze: <T>(value: T) => T = (/*#__PURE__*/_pureAssign(_objFreeze, _doNothing));

/**
 * The `objSeal()` method seals an object, preventing new properties from being added to it and marking all
 * existing properties as non-configurable. Values of present properties can still be changed as long as they
 * are writable.
 * @function
 * @group Object
 * @param value - The object which should be sealed.
 * @returns The object being sealed.
 */
export const objSeal: <T>(value: T) => T = (/*#__PURE__*/_pureAssign((/*#__PURE__*/_pureRef<typeof Object.seal>(ObjClass, "seal")), _doNothing));

/**
 * The objGetPrototypeOf() method returns the prototype (i.e. the value of the internal `Prototype` property)
 * of the specified value.
 * @function
 * @since 0.4.4
 * @group Object
 * @param value - The object whose prototype is to be returned, which may be null.
 */
export const objGetPrototypeOf: (value: any) => any = (/*#__PURE__*/_pureAssign((/*#__PURE__*/_pureRef<typeof Object.getPrototypeOf>(ObjClass, "getPrototypeOf")), _getProto));

/**
 * Returns an array of key/values of the enumerable properties of an object
 * @function
 * @since 0.9.7
 * @group Object
 * @group ArrayLike
 * @param value - Object that contains the properties and methods.
 * @example
 * ```ts
 * objEntries({ Hello: "Darkness", my: "old", friend: "." });
 * // [ [ "Hello", "Darkness" ], [ "my", "old"], [ "friend", "." ] ]
 *
 * // Array-like object
 * objEntries({ 0: "a", 1: "b", 2: "c" }));
 * // [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ]
 *
 * // Array-like object with random key ordering
 * objEntries({ 100: "a", 2: "b", 7: "c" });
 * // [ ['2', 'b'], ['7', 'c'], ['100', 'a'] ]*
 * ```
 */
export const objEntries: <T = any>(value: {} | { [s: string]: T } | ArrayLike<T>) => [string, T][] = (/*#__PURE__*/_pureAssign((/*#__PURE__*/_pureRef<typeof Object.entries>(ObjClass, "entries")), polyObjEntries));

/**
 * The objValues() returns an array whose elements are values of enumerable string-keyed properties found
 * directly upon object. This is the same as iterating with a for...in loop, except that a for...in loop
 * enumerates properties in the prototype chain as well. The order of the array returned by objValues()
 * is the same as that provided by a for...in loop.
 *
 * If you need the property keys, use objKeys() instead. If you need both the property keys and values, use objEntries() instead.
 * @function
 * @since 0.9.7
 * @group Object
 * @group ArrayLike
 * @param value - The object that contains the properties and methods.
 * @returns An array containing the given object's own enumerable string-keyed property values.
 * @example
 * ```ts
 * objValues({ Hello: "Darkness", my: "old", friend: "." });
 * // [ "Darkness", "old", "." ]
 *
 * // Array-like object
 * objValues({ 0: "a", 1: "b", 2: "c" }));
 * // [ 'a', 'b', 'c']
 *
 * // Array-like object with random key ordering
 * objValues({ 100: "a", 2: "b", 7: "c" });
 * // [ 'b', 'c', 'a']
 * ```
 */
export const objValues: <T = any>(value: {} | { [s: string]: T } | ArrayLike<T>) => T[] = (/*#__PURE__*/_pureAssign((/*#__PURE__*/_pureRef<typeof Object.values>(ObjClass, "values")), polyObjValues));

// Add after objValues definition

/**
 * The objIs() method determines whether two values are the same value.
 *
 * Two values are the same if one of the following holds:
 * - both undefined
 * - both null
 * - both true or both false
 * - both strings of the same length with the same characters in the same order
 * - both the same object (meaning both values reference the same object in memory)
 * - both numbers and both +0, both -0, both NaN, or both non-zero and both not NaN and both have the same value
 *
 * This is different from the === operator in that:
 * - NaN is equal to NaN
 * - +0 is not equal to -0
 *
 * @function
 * @since 0.12.0
 * @group Object
 * @param value1 - The first value to compare
 * @param value2 - The second value to compare
 * @returns True if the values are the same value, false otherwise
 * @example
 * ```ts
 * // Case 1: NaN
 * objIs(NaN, NaN);                  // true
 * NaN === NaN;                      // false
 *
 * // Case 2: Signed zeros
 * objIs(0, -0);                     // false
 * objIs(+0, -0);                    // false
 * objIs(-0, -0);                    // true
 * 0 === -0;                         // true
 *
 * // Regular comparison
 * objIs('hello', 'hello');          // true
 * objIs('hello', 'goodbye');        // false
 * objIs(1, 1);                      // true
 * objIs(1, 2);                      // false
 *
 * // Objects
 * const obj = { a: 1 };
 * objIs(obj, obj);                  // true
 * objIs(obj, { a: 1 });             // false (different objects with same content)
 * ```
 */
export const objIs: (value1: any, value2: any) => boolean = (/*#__PURE__*/_pureAssign((/*#__PURE__*/_pureRef<typeof Object.is>(ObjClass, "is")), polyObjIs));
