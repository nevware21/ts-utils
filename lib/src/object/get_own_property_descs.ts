/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ObjClass } from "../internal/constants";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";
import { polyObjGetOwnPropertyDescriptors } from "../polyfills/object/objGetOwnPropertyDescriptors";

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
