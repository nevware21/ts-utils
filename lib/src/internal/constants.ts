/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { _pureAssign, _pureRef } from "./treeshake_helpers";

// These constants are currently NOT exported directly, we may export them later associated with a frozen namespace (maybe)
// For now do NOT expect that we will export these values.

export const UNDEF_VALUE: undefined = undefined;
export const NULL_VALUE: null = null;

export const EMPTY = "";
export const FUNCTION = "function";
export const OBJECT = "object";
export const PROTOTYPE = "prototype";
export const __PROTO__ = "__proto__";
export const UNDEFINED = "undefined";
export const CONSTRUCTOR = "constructor";
export const SYMBOL = "Symbol";
export const LENGTH = "length";
export const NAME = "name";
export const CALL = "call";
export const TO_STRING = "toString";

export const GET_OWN_PROPERTY_DESCRIPTOR = "getOwnPropertyDescriptor";
export const GET_OWN_PROPERTY_NAMES = "getOwnPropertyNames";
export const GET_OWN_PROPERTY_SYMBOLS = "getOwnPropertySymbols";

/**
 * @ignore
 */
export const ObjClass = /*#__PURE__*/ _pureAssign(Object);

/**
 * @ignore
 */
export const ObjProto = /*#__PURE__*/ _pureRef<typeof Object.prototype>(ObjClass, PROTOTYPE);

/**
 * @ignore
 */
export const StrCls = /*#__PURE__*/ _pureAssign(String);

/**
 * @ignore
 */
export const StrProto: String = /*#__PURE__*/ _pureRef<typeof String.prototype>(StrCls, PROTOTYPE);

/**
 * @ignore
 */
export const MathCls: Math = /*#__PURE__*/ _pureAssign(Math);

/**
 * @ignore
 */
export const ArrCls = /*#__PURE__*/ _pureAssign(Array);

/**
 * @ignore
 */
export const ArrProto = /*#__PURE__*/ _pureRef<typeof ArrCls.prototype>(ArrCls, PROTOTYPE);

/**
 * @ignore
 *
 */
export const ArrSlice = /*#__PURE__*/ _pureRef<typeof ArrProto.slice>(ArrProto, "slice");

/**
 * @ignore
 */
export const NumberCls = /*#__PURE__*/ _pureAssign(Number);

/**
 * @ignore
 */
export const NumberProto: Number = /*#__PURE__*/ _pureRef<typeof Number.prototype>(NumberCls, PROTOTYPE);

/**
 * @ignore
 */
export const FuncCls: FunctionConstructor = /*#__PURE__*/ _pureAssign(Function);

/**
 * @ignore
 */
export const FuncProto: Function = /*#__PURE__*/ _pureRef<typeof Function.prototype>(FuncCls, PROTOTYPE);

/**
 * @ignore
 */
export const DateCls: DateConstructor = /*#__PURE__*/ _pureAssign(Date);

/**
 * @ignore
 */
export const DateProto: Date = /*#__PURE__*/ _pureRef<typeof Date.prototype>(DateCls, PROTOTYPE);

/**
 * @ignore
 */
export const RegExpCls: RegExpConstructor = /*#__PURE__*/ _pureAssign(RegExp);

/**
 * @ignore
 */
export const RegExpProto: RegExp = /*#__PURE__*/ _pureRef<typeof RegExp.prototype>(RegExpCls, PROTOTYPE);

/**
 * @ignore
 */
export const BooleanCls: BooleanConstructor = /*#__PURE__*/ _pureAssign(Boolean);

/**
 * @ignore
 */
export const BooleanProto: Boolean = /*#__PURE__*/ _pureRef<typeof Boolean.prototype>(BooleanCls, PROTOTYPE);

/**
 * @ignore
 */
export const ErrorCls: ErrorConstructor = /*#__PURE__*/ _pureAssign(Error);

/**
 * @ignore
 */
export const ErrorProto: Error = /*#__PURE__*/ _pureRef<typeof Error.prototype>(ErrorCls, PROTOTYPE);
