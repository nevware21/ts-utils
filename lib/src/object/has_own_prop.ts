/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { ObjProto } from "../internal/constants";

/**
 * The objHasOwnProperty() method returns a boolean indicating whether the object
 * has the specified property as its own property (as opposed to inheriting it).
 *
 * The objHasOwnProperty() method returns true if the specified property is a direct
 * property of the object — even if the value is null or undefined. The method returns
 * false if the property is inherited, or has not been declared at all. Unlike the in
 * operator, this method does not check for the specified property in the object's
 * prototype chain.
 *
 * The method can be called on most JavaScript objects, because most objects descend
 * from Object, and hence inherit its methods. For example Array is an Object, so you
 * can use objHasOwnProperty() method to check whether an index exists:
 * @group Object
 * @param obj - The object being evaluated
 * @param prop - The String or Symbol of the property to test
 * @returns `true` if the object has the specified property as own property; otherwise `false`
 * @example
 * ```ts
 * let example = {};
 * objHasOwnProperty(example, 'prop');   // false
 *
 * example.prop = 'exists';
 * objHasOwnProperty(example, 'prop');   // true - 'prop' has been defined
 *
 * example.prop = null;
 * objHasOwnProperty(example, 'prop');   // true - own property exists with value of null
 *
 * example.prop = undefined;
 * objHasOwnProperty(example, 'prop');   // true - own property exists with value of undefined
 * ```
 */
export function objHasOwnProperty<T = any>(obj: T, prop: PropertyKey): boolean {
    return obj && ObjProto.hasOwnProperty.call(obj, prop);
}
