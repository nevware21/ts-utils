/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { GET_OWN_PROPERTY_DESCRIPTOR, GET_OWN_PROPERTY_NAMES, GET_OWN_PROPERTY_SYMBOLS, ObjClass } from "./constants";
import { _returnNothing } from "./stubs";
import { _pureAssign, _pureRef } from "./treeshake_helpers";

// The Object own property functions (or a stub when not available), they are defined in this module which has no
// (polyfill) dependencies so that they can be shared without causing circular references

/**
 * @internal
 * @ignore
 * Object.getOwnPropertyDescriptor() or a stub which returns undefined
 */
export const _objGetOwnPropertyDescriptor: (target: any, prop: PropertyKey) => PropertyDescriptor | undefined = (/*#__PURE__*/_pureAssign((/*#__PURE__*/_pureRef<typeof Object.getOwnPropertyDescriptor>(ObjClass as any, GET_OWN_PROPERTY_DESCRIPTOR)), _returnNothing));

/**
 * @internal
 * @ignore
 * Object.getOwnPropertySymbols() or a stub which returns an empty array
 */
export const _objGetOwnPropertySymbols: (obj: any) => symbol[] = (/*#__PURE__*/_pureAssign((/*#__PURE__*/_pureRef<typeof Object.getOwnPropertySymbols>(ObjClass, GET_OWN_PROPERTY_SYMBOLS)), () => []));

/**
 * @internal
 * @ignore
 * The native Object.getOwnPropertyNames() (defined by every supported runtime, ES5)
 */
export const _objGetOwnPropertyNames: (obj: any) => string[] = (/*#__PURE__*/_pureRef<typeof Object.getOwnPropertyNames>(ObjClass, GET_OWN_PROPERTY_NAMES));

/**
 * @internal
 * @ignore
 * The native Object.getPrototypeOf() (defined by every supported runtime, ES5)
 */
export const _objGetPrototypeOf: (value: any) => any = (/*#__PURE__*/_pureRef<typeof Object.getPrototypeOf>(ObjClass, "getPrototypeOf"));

/**
 * @internal
 * @ignore
 * The native Object.create() (defined by every supported runtime, ES5)
 */
export const _objCreate: (proto: any, properties?: PropertyDescriptorMap & ThisType<any>) => any = (/*#__PURE__*/_pureRef<typeof Object.create>(ObjClass, "create"));

/**
 * @internal
 * @ignore
 * Creates an object without a prototype (so a key can't match an inherited property, eg. one added to
 * Object.prototype) using the native Object.create(null), or (on a runtime without it, where an object without a
 * prototype can't be created) an empty object, as polyObjCreate(null) does. Used rather than objCreate(null) so the
 * polyObjCreate polyfill isn't included (and by the define helpers, which objCreate depends on).
 * @returns A new object without a prototype, or an empty object
 */
/*#__NO_SIDE_EFFECTS__*/
export function _objCreateNull(): any {
    return _objCreate ? _objCreate(null) : {};
}
