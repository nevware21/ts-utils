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
export const ObjClass = /*#__PURE__*/_pureAssign(Object);

/**
 * @ignore
 */
export const ObjProto = /*#__PURE__*/_pureRef<typeof Object.prototype>(ObjClass, PROTOTYPE);

/**
 * @ignore
 */
export const StrCls = /*#__PURE__*/_pureAssign(String);

/**
 * @ignore
 */
export const StrProto = /*#__PURE__*/_pureRef<typeof String.prototype>(StrCls, PROTOTYPE) as String;

/**
 * @ignore
 */
export const MathCls = /*#__PURE__*/_pureAssign(Math) as Math;

/**
 * @ignore
 */
export const ArrCls = /*#__PURE__*/_pureAssign(Array);

/**
 * @ignore
 */
export const ArrProto = /*#__PURE__*/_pureRef<typeof ArrCls.prototype>(ArrCls, PROTOTYPE);

/**
 * @ignore
 *
 */
export const ArrSlice = /*#__PURE__*/_pureRef<typeof ArrProto.slice>(ArrProto, "slice");

/**
 * @ignore
 */
export const NumberCls = /*#__PURE__*/_pureAssign(Number);

/**
 * @ignore
 */
export const NumberProto = /*#__PURE__*/_pureRef<typeof Number.prototype>(NumberCls, PROTOTYPE) as Number;

/**
 * @ignore
 */
export const FuncCls = /*#__PURE__*/_pureAssign(Function) as FunctionConstructor;

/**
 * @ignore
 */
export const FuncProto = /*#__PURE__*/_pureRef<typeof Function.prototype>(FuncCls, PROTOTYPE) as Function;

/**
 * @ignore
 */
export const DateCls = /*#__PURE__*/_pureAssign(Date) as DateConstructor;

/**
 * @ignore
 */
export const DateProto = /*#__PURE__*/_pureRef<typeof Date.prototype>(DateCls, PROTOTYPE) as Date;

/**
 * @ignore
 */
export const RegExpCls = /*#__PURE__*/_pureAssign(RegExp) as RegExpConstructor;

/**
 * @ignore
 */
export const RegExpProto = /*#__PURE__*/_pureRef<typeof RegExp.prototype>(RegExpCls, PROTOTYPE) as RegExp;

/**
 * @ignore
 */
export const BooleanCls = /*#__PURE__*/_pureAssign(Boolean) as BooleanConstructor;

/**
 * @ignore
 */
export const BooleanProto = /*#__PURE__*/_pureRef<typeof Boolean.prototype>(BooleanCls, PROTOTYPE) as Boolean;

/**
 * @ignore
 */
export const ErrorCls = /*#__PURE__*/_pureAssign(Error) as ErrorConstructor;

/**
 * @ignore
 */
export const ErrorProto = /*#__PURE__*/_pureRef<typeof Error.prototype>(ErrorCls, PROTOTYPE) as Error;
