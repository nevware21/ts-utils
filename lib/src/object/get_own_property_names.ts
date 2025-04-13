/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ObjClass } from "../internal/constants";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";
import { polyObjGetOwnPropertyNames } from "../polyfills/object/objGetOwnPropertyNames";

/**
 * The objGetOwnPropertyNames() method returns an array of all properties (including non-enumerable properties except for
 * those which use Symbol) found directly in a given object.
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
export const objGetOwnPropertyNames: (obj: any) => string[] = (/* #__PURE__ */_pureAssign((/* #__PURE__ */_pureRef<typeof Object.getOwnPropertyNames>(ObjClass, "getOwnPropertyNames")), polyObjGetOwnPropertyNames));
