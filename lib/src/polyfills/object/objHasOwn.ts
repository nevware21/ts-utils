/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { _throwIfNullOrUndefined } from "../../internal/throwIf";
import { objGetOwnPropertyDescriptor } from "../../object/get_own_property_desc";
import { objHasOwnProperty } from "../../object/has_own_prop";

/**
 * The polyObjHasOwn() method is a polyfill for {@link objHasOwn} when the native
 * [Object.hasOwnreturns](https://caniuse.com/?search=hasOwn) is not supported, it returns a
 * boolean indicating whether the object has the specified property as its own property (as
 * opposed to inheriting it). If the property is inherited, or does not exist, the method
 * returns false.
 *
 * The objHasOwn() method returns true if the specified property is a direct property
 * of the object — even if the property value is null or undefined. The method returns
 * false if the property is inherited, or has not been declared at all. Unlike the in operator,
 * this method does not check for the specified property in the object's prototype chain.
 *
 * It is recommended over objHasOwnProperty() because it works for objects created using
 * objCreate(null) and with objects that have overridden the inherited hasOwnProperty() method.
 * While it is possible to workaround these problems by calling Object.prototype.hasOwnProperty()
 * on an external object, Object.hasOwn() is more intuitive.
 *
 * @since 0.4.3
 * @group Object
 * @group Polyfill
 * @param obj - The object being evaluated
 * @param prop - The String or Symbol of the property to test
 * @returns `true` if the object has the specified property as own property; otherwise `false`
 * @example
 * ```ts
 * let example = {};
 * polyObjHasOwn(example, 'prop');   // false
 *
 * example.prop = 'exists';
 * polyObjHasOwn(example, 'prop');   // true - 'prop' has been defined
 *
 * example.prop = null;
 * polyObjHasOwn(example, 'prop');   // true - own property exists with value of null
 *
 * example.prop = undefined;
 * polyObjHasOwn(example, 'prop');   // true - own property exists with value of undefined
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyObjHasOwn<T = any>(obj: T, prop: PropertyKey): boolean {
    // Ensure we're working with an object
    _throwIfNullOrUndefined(obj);
        
    return objHasOwnProperty(obj, prop) || !!objGetOwnPropertyDescriptor(obj, prop)
}
