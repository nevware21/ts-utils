/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ObjClass, UNDEF_VALUE } from "../internal/constants";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";

function _returnNothing(): PropertyDescriptor | undefined {
    return UNDEF_VALUE;
}

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
export const objGetOwnPropertyDescriptor: (target: any, prop: PropertyKey) => PropertyDescriptor | undefined = (/* #__PURE__ */_pureAssign((/* #__PURE__ */_pureRef<typeof Object.getOwnPropertyDescriptor>(ObjClass as any, "getOwnPropertyDescriptor")), _returnNothing));
