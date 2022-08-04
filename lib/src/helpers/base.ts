/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { BOOLEAN, FUNCTION, NUMBER, OBJECT, ObjProto, STRING, UNDEFINED } from "../internal/constants";

/**
 * @ignore
 */
export function _createIs<T>(theType: string): (value: any) => value is T {
    return function (value: any): value is T {
        return typeof value === theType;
    }
}

/**
 * @ignore
 */
export function _createObjIs<T>(theType: string): (value: any) => value is T {
    return function (value: any): value is T {
        return !!(value && objToString(value) === theType);
    }
}

/**
 * The `objToString()` method returns a string representing the object. This explicitly
 * always calls the `Object.prototype.toString()` method.
 *
 * An object's toString() method is most commonly invoked when that object undergoes:
 * - explicit type conversion to a string (for example, String(myObject))
 * - implicit type coercion into a string (for example, myObject + "hello world")
 *
 * @group Object
 * @param value - The object to be converted into a string
 * @returns A string representation of the object
 */
export function objToString(value: any): string {
    return ObjProto.toString.call(value);
}

/**
 * Validate if the provided value object is of the expected type
 * @group Type Identity
 * @param value - The value to check
 * @param theType - The expected type name as a string
 * @returns
 */
export function isTypeof(value: any, theType: string): boolean {
    return typeof value === theType;
}

/**
 * Checks if the provided value is undefined or contains the string value "undefined".
 * @group Type Identity
 * @group Value Check
 * @param value - The value to check
 * @returns
 */
export function isUndefined(value: any) {
    return value == UNDEFINED || typeof value === UNDEFINED;
}

/**
 * Checks if the provided value is undefined, a string value of "undefined" is NOT considered
 * to be undefined.
 * @group Type Identity
 * @group Value Check
 * @param value - The value to check
 * @returns true if the typeof value === UNDEFINED
 */
export function isStrictUndefined(arg: any): arg is undefined {
    return !isDefined(arg);
}

/**
 * Checks if the provided value is null, undefined or contains the string value of "undefined".
 * @group Type Identity
 * @group Value Check
 * @param value - The value to check
 * @returns
 */
export function isNullOrUndefined(value:  any): boolean {
    return value === null || isUndefined(value);
}

/**
 * Checks if the provided value is null, undefined only, a string value of "undefined" is NOT considered
 * to be undefined.
 * @group Type Identity
 * @group Value Check
 * @param value - The value to check
 * @returns
 */
export function isStrictNullOrUndefined(value: any): boolean {
    return value === null || !isDefined(value);
}

/**
 * Checks if the passed value is defined, which means it has any value and is not undefined.
 * A string value of "undefined" is considered to be defined.
 * @group Value Check
 * @param arg - The value to check
 * @returns true if arg has a value (is not === undefined)
 */
export function isDefined(arg: any): boolean {
    return !!arg || arg !== undefined;
}

/**
 * Checks to see if the past value is a string value
 * @group Type Identity
 * @group String
 * @param value - The value to check
 * @returns
 */
export const isString: (value: any) => value is string = _createIs<string>(STRING);

/**
 * Checks to see if the past value is a function value
 * @group Type Identity
 * @param value - The value to check
 * @returns
 */
export const isFunction: (value: any) => value is Function = _createIs<Function>(FUNCTION);

/**
 * Checks to see if the past value is an object value
 * @group Type Identity
 * @group Object
 * @typeParam T - The object type, defaults to any
 * @param value - The value to check
 * @returns
 */
export function isObject<T>(value: T): value is T {
    if (isNullOrUndefined(value)) {
        return false;
    }

    return typeof value === OBJECT;
}

/**
 * Checks if the type of value is an Array.
 *
 * @group Type Identity
 * @group Array
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a Array, false otherwise.
 * @example
 * ```ts
 * import { isArray, isObject } from "@nevware21/ts-utils";
 *
 * function performAction(value: any) {
 *     if (isArray(value) || isObject(value)) {
 *         // Do something
 *     } else {
 *         // Do something else
 *     }
 * }
 * ```
 */
export const isArray: <T = any>(arg: any) => arg is Array<T> = Array.isArray;

/**
 * Check if an object is of type Date
 * @group Type Identity
 * @example
 * ```ts
 * import { isDate } from "@nevware21/ts-utils";
 *
 * let _theDate = null;
 *
 * function getSetDate(newDate?: any) {
 *     _theDate = isDate(newDate) ? newDate : new Date();
 *
 *     return _theDate;
 * }
 * ```
 */
export const isDate: (value: any) => value is Date = _createObjIs<Date>("[object Date]");

/**
 * Checks if the type of value is a number.
 * @group Type Identity
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a number, false otherwise.
 */
export const isNumber: (value: any) => value is number = _createIs<number>(NUMBER);

/**
 * Checks if the type of value is a boolean.
 * @group Type Identity
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a boolean, false otherwise.
 */
export const isBoolean: (value: any) => value is boolean = _createIs<boolean>(BOOLEAN);

/**
 * Determines if a value is a regular expression object.
 * @group Type Identity
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `RegExp`.
 */
export const isRegExp: (value: any) => value is RegExp = _createObjIs<RegExp>("[object RegExp]");

/**
 * Checks if the type of value is a File object.
 * @group Type Identity
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a File, false otherwise.
 */
export const isFile: (value: any) => value is File = _createObjIs<File>("[object File]");

/**
 * Checks if the type of value is a FormData object.
 * @group Type Identity
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a FormData, false otherwise.
 */
export const isFormData: (value: any) => value is FormData = _createObjIs<FormData>("[object FormData]");

/**
 * Checks if the type of value is a Blob object.
 * @group Type Identity
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a Blob, false otherwise.
 */
export const isBlob: (value: any) => value is Blob = _createObjIs<Blob>("[object Blob]");

/**
 * Checks if the type of value is a ArrayBuffer object.
 * @group Type Identity
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a ArrayBuffer, false otherwise.
 */
export const isArrayBuffer: (value: any) => value is ArrayBuffer = _createObjIs<ArrayBuffer>("[object ArrayBuffer]");

/**
 * Checks if the type of value is a Error object.
 * @group Type Identity
 * @group Error
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a Error, false otherwise.
 */
export const isError: (value: any) => value is Error = _createObjIs<Error>("[object Error]");

/**
 * Checks if the type of value is a PromiseLike instance (contains a then function).
 * @group Type Identity
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a PromiseLike, false otherwise.
 */
export function isPromiseLike<T>(value: any): value is PromiseLike<T> {
    return !!value && isFunction(value.then);
}

/**
 * Checks if the type of value is a Promise instance (contains then and catch functions).
 * @group Type Identity
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a Promise, false otherwise.
 */
export function isPromise<T>(value: any): value is Promise<T> {
    return isPromiseLike(value) && isFunction((value as any).catch);
}

/**
 * Checks if the type of value does not evaluate to true value, handling some special
 * case usages of Boolean(true/false) and new Boolean(true/false).
 * @group Value Check
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is not truthy, false otherwise.
 */
export function isNotTruthy(value: any) {
    return !value || !(value && (0 + value));
}

/**
 * Checks if the type of value evaluates to true value, handling some special
 * case usages of Boolean(true/false) and new Boolean(true/false).
 * @group Value Check
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is not truthy, false otherwise.
 */
export function isTruthy(value: any) {
    return !(!value || !(value && (0 + value)));
}