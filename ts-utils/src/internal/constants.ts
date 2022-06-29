/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

// These constants are currently NOT exported directly, we may export them later associated with a frozen namespace (maybe)
// For now do NOT expect that we will export these values.


export const EMPTY = "";
export const BOOLEAN = "boolean";
export const FUNCTION = "function";
export const NUMBER = "number";
export const OBJECT = "object";
export const PROTOTYPE = "prototype";
export const STRING = "string";
export const UNDEFINED = "undefined";
export const CONSTRUCTOR = "constructor";
export const HAS_OWN_PROPERTY = "hasOwnProperty";

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
export const StrProto = String[PROTOTYPE];

/**
 * @ignore
 */
export const MathCls = Math;
