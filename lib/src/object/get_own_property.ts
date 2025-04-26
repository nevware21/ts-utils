/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { GET_OWN_PROPERTY_DESCRIPTOR, GET_OWN_PROPERTY_NAMES, GET_OWN_PROPERTY_SYMBOLS, ObjClass } from "../internal/constants";
import { _returnEmptyArray, _returnNothing } from "../internal/stubs";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";
import { polyObjGetOwnPropertyDescriptors } from "../polyfills/object/objGetOwnProperty";

/**
 * The objGetOwnPropertyDescriptor() method returns an object describing the configuration of a specific property on
 * a given object (that is, one directly present on an object and not in the object's prototype chain). The object
 * returned is mutable but mutating it has no effect on the original property's configuration.
 * @function
 * @since 0.4.3
 * @group Object
 * @param target - Object that contains the property.
 * @param prop - Name of the property.
 * @returns A property descriptor of the given property if it exists on the object, otherwise undefined.
 *
 * @example
 * ```ts
 * o = {};
 * objDefineProp(o, 'qux', {
 *   value: 8675309,
 *   writable: false,
 *   enumerable: false
 * });
 * d = objGetOwnPropertyDescriptor(o, 'qux');
 * // d is {
 * //   value: 8675309,
 * //   writable: false,
 * //   enumerable: false,
 * //   configurable: false
 * // }
 *
 * objGetOwnPropertyDescriptor('foo', 0);
 * // TypeError: "foo" is not an object  // ES5 code
 *
 * objGetOwnPropertyDescriptor('foo', 0);
 * // Object returned by ES2015 code: {
 * //   configurable: false,
 * //   enumerable: true,
 * //   value: "f",
 * //   writable: false
 * // }
 * ```
 * Note: In ES5, if the first argument to this method is not an object (a primitive), then it will cause a TypeError. In ES2015, a non-object first argument will be coerced to an object at first.
 */
export const objGetOwnPropertyDescriptor: (target: any, prop: PropertyKey) => PropertyDescriptor | undefined = (/* #__PURE__ */_pureAssign((/* #__PURE__ */_pureRef<typeof Object.getOwnPropertyDescriptor>(ObjClass as any, GET_OWN_PROPERTY_DESCRIPTOR)), _returnNothing));

/**
 * The objGetOwnPropertyDescriptors() method returns all own property descriptors of a given object.
 * @function
 * @since 0.12.0
 * @group Object
 * @param obj - The object for which to get all own property descriptors
 * @returns An object containing all own property descriptors of the given object
 *
 * @example
 * ```ts
 * const obj = {
 *   get foo() { return 17; },
 *   bar: 42
 * };
 *
 * const descriptors = objGetOwnPropertyDescriptors(obj);
 * // descriptors is:
 * // {
 * //   foo: {
 * //     configurable: true,
 * //     enumerable: true,
 * //     get: [Function: get foo],
 * //     set: undefined
 * //   },
 * //   bar: {
 * //     configurable: true,
 * //     enumerable: true,
 * //     value: 42,
 * //     writable: true
 * //   }
 * // }
 *
 * // This method can be used to create a shallow copy including getters and setters
 * const shallowCopy = objCreate(
 *   objGetPrototypeOf(obj),
 *   objGetOwnPropertyDescriptors(obj)
 * );
 * ```
 */
export const objGetOwnPropertyDescriptors: (obj: any) => PropertyDescriptorMap = (/* #__PURE__ */_pureAssign((/* #__PURE__ */_pureRef<typeof Object.getOwnPropertyDescriptors>(ObjClass, "getOwnPropertyDescriptors")), polyObjGetOwnPropertyDescriptors));

/**
 * The objGetOwnPropertyNames() method returns an array of all properties (including non-enumerable properties except for
 * those which use Symbol) found directly in a given object.
 * @function
 * @since 0.12.0
 * @group Object
 * @param obj - The object whose enumerable and non-enumerable properties are to be returned
 * @returns An array of strings that correspond to the properties found directly in the given object
 *
 * @example
 * ```ts
 * objGetOwnPropertyNames({ a: 1, b: 2 }); // ['a', 'b']
 *
 * // Array properties include indices and 'length'
 * objGetOwnPropertyNames(['a', 'b']); // ['0', '1', 'length']
 *
 * // Non-enumerable properties are included
 * const obj = Object.create({}, {
 *   hidden: { value: 'secret', enumerable: false },
 *   visible: { value: 'public', enumerable: true }
 * });
 * objGetOwnPropertyNames(obj); // ['hidden', 'visible']
 * ```
 */
export const objGetOwnPropertyNames: (obj: any) => string[] = (/* #__PURE__ */_pureAssign((/* #__PURE__ */_pureRef<typeof Object.getOwnPropertyNames>(ObjClass, GET_OWN_PROPERTY_NAMES)), _returnEmptyArray));

/**
 * The `objGetOwnPropertySymbols()` method returns an array of all symbol properties found directly upon
 * the given object. Unlike Object.getOwnPropertyNames(), this method returns symbol properties only.
 *
 * @function
 * @since 0.12.0
 * @group Object
 * @param obj - The object whose symbol properties are to be returned.
 * @returns An array of all symbol properties found directly upon the given object.
 * @example
 * ```typescript
 * const obj = {};
 * const a = Symbol('a');
 * const b = Symbol.for('b');
 *
 * obj[a] = 'localSymbol';
 * obj[b] = 'globalSymbol';
 *
 * const symbolProps = objGetOwnPropertySymbols(obj);
 *
 * console.log(symbolProps.length); // 2
 * console.log(symbolProps[0] === a); // true
 * console.log(symbolProps[1] === b); // true
 * ```
 */
export const objGetOwnPropertySymbols: (obj: any) => symbol[] = (/* #__PURE__*/_pureAssign((/* #__PURE__ */_pureRef<typeof Object.getOwnPropertySymbols>(ObjClass, GET_OWN_PROPERTY_SYMBOLS)), _returnEmptyArray));
