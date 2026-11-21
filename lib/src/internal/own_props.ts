/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { GET_OWN_PROPERTY_DESCRIPTOR, GET_OWN_PROPERTY_NAMES, GET_OWN_PROPERTY_SYMBOLS, ObjClass } from "./constants";
import { _returnEmptyArray, _returnNothing } from "./stubs";
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
export const _objGetOwnPropertySymbols: (obj: any) => symbol[] = (/*#__PURE__*/_pureAssign((/*#__PURE__*/_pureRef<typeof Object.getOwnPropertySymbols>(ObjClass, GET_OWN_PROPERTY_SYMBOLS)), _returnEmptyArray));

/**
 * @internal
 * @ignore
 * Object.getOwnPropertyNames() (defined by every supported runtime, ES5) or a stub which returns an empty array
 */
export const _objGetOwnPropertyNames: (obj: any) => string[] = (/*#__PURE__*/_pureAssign((/*#__PURE__*/_pureRef<typeof Object.getOwnPropertyNames>(ObjClass, GET_OWN_PROPERTY_NAMES)), _returnEmptyArray));

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
