/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/grunt-plugins
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { BOOLEAN, FUNCTION, NUMBER, OBJECT, PROTOTYPE, STRING, UNDEFINED } from "../internal/constants";

export const ObjClass = Object;
export const ObjProto = ObjClass[PROTOTYPE];

export function objToString(value: any): string {
    return ObjProto.toString.call(value);
}

/**
 * Validate if the provided value object is of the expected type
 * @param value - The value to check
 * @param theType - The expected type name as a string
 * @returns
 */
export function isTypeof(value: any, theType: string): boolean {
    return typeof value === theType;
}

/**
 * Checks if the provided value is undefined
 * @param value - The value to check
 * @returns
 */
export function isUndefined(value: any) {
    return value == UNDEFINED || typeof value === UNDEFINED;
}

/**
 * Checks if the provided value is null or undefined
 * @param value - The value to check
 * @returns
 */
export function isNullOrUndefined(value:  any) {
    return value === null || isUndefined(value);
}

export function isDefined(arg: any): arg is undefined {
    return !!arg || arg !== undefined;
}

export function isString(value: any): value is string {
    return typeof value === STRING;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: any): value is Function {
    return typeof value === FUNCTION;
}

export function isObject(value: any): value is object {
    if (isNullOrUndefined(value)) {
        return false;
    }

    return typeof value === OBJECT;
}

export function isArray<T>(arg: any): arg is T[] {
    if (isNullOrUndefined(arg)) {
        return false;
    }

    return objToString(arg) === "[object Array]" || Array.isArray(arg);
}

/**
 * Check if an object is of type Date
 */
export function isDate(value: any): value is Date {
    return objToString(value) === "[object Date]";
}

/**
 * Checks if the type of value is a number.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a number, false otherwise.
 */
export function isNumber(value: any): value is number {
    return isTypeof(value, NUMBER);
}

/**
 * Checks if the type of value is a boolean.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a boolean, false otherwise.
 */
export function isBoolean(value: any): value is boolean {
    return isTypeof(value, BOOLEAN);
}

/**
 * Determines if a value is a regular expression object.
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `RegExp`.
 */
export function isRegExp(value: any): value is RegExp {
    return objToString(value) === "[object RegExp]";
}

export function isFile(value: any): value is File {
    return objToString(value) === "[object File]";
}

export function isFormData(value: any): value is FormData {
    return objToString(value) === "[object FormData]";
}

export function isBlob(value: any): value is Blob {
    return objToString(value) === "[object Blob]";
}

export function isArrayBuffer(value: any): value is ArrayBuffer {
    return objToString(value) === "[object ArrayBuffer]";
}

export function isPromiseLike<T>(value: any): value is PromiseLike<T> {
    return value && isFunction(value.then);
}

export function isPromise<T>(value: any): value is Promise<T> {
    return value && isPromiseLike(value) && isFunction((value as any).catch);
}

export function isNotTruthy(value: any) {
    return !value;
}

export function isTruthy(value: any) {
    return !!value;
}