/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

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
export const POLYFILL_TAG = "_polyfill";
export const LENGTH = "length";
export const NAME = "name";
export const CALL = "call";
export const TO_STRING = "toString";

/**
 * @ignore
 */
export const ObjClass = Object;

/**
 * @ignore
 */
export const ObjProto = ObjClass[PROTOTYPE];

/**
 * @ignore
 */
export const StrCls = String;

/**
 * @ignore
 */
export const StrProto = StrCls[PROTOTYPE];

/**
 * @ignore
 */
export const MathCls = Math;

/**
 * @ignore
 */
export const ArrCls = Array;

/**
 * @ignore
 */
export const ArrProto = ArrCls[PROTOTYPE];

/**
 * @ignore
 *
 */
export const ArrSlice = ArrProto["slice"];