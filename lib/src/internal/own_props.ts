/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { GET_OWN_PROPERTY_DESCRIPTOR, GET_OWN_PROPERTY_SYMBOLS, ObjClass } from "./constants";
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
