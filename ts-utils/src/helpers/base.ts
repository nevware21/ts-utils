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

function _createIs<T>(theType: string): (value: any) => value is T {
    return function (value: any): value is T {
        return typeof value === theType;
    }
}

function _createObjIs<T>(theType: string): (value: any) => value is T {
    return function (value: any): value is T {
        return !!(value && objToString(value) === theType);
    }
}

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
 * Checks if the provided value is undefined or contains the string value "undefined".
 * @param value - The value to check
 * @returns
 */
export function isUndefined(value: any) {
    return value == UNDEFINED || typeof value === UNDEFINED;
}

/**
 * Checks if the provided value is null, undefined or contains the string value of "undefined".
 * @param value - The value to check
 * @returns
 */
export function isNullOrUndefined(value:  any) {
    return value === null || isUndefined(value);
}

/**
 * Checks if the passed value is defined, which means it has any value and is not undefined.
 * A string value of "undefined" is considered to be defined.
 * @param arg - The value to check
 * @returns
 */
export function isDefined(arg: any): arg is undefined {
    return !!arg || arg !== undefined;
}

/**
 * Checks to see if the past value is a string value
 * @param value - The value to check
 * @returns
 */
export const isString = _createIs<string>(STRING);

/**
 * Checks to see if the past value is a function value
 * @param value - The value to check
 * @returns
 */
export const isFunction = _createIs<Function>(FUNCTION);

/**
 * Checks to see if the past value is an object value
 * @param value - The value to check
 * @returns
 */
export function isObject(value: any): value is object {
    if (isNullOrUndefined(value)) {
        return false;
    }

    return typeof value === OBJECT;
}

/**
 * Checks if the type of value is an Array.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a Array, false otherwise.
 */
export const isArray = Array.isArray;

/**
 * Check if an object is of type Date
 */
export const isDate = _createObjIs<Date>("[object Date]");

/**
 * Checks if the type of value is a number.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a number, false otherwise.
 */
export const isNumber = _createIs<number>(NUMBER);

/**
 * Checks if the type of value is a boolean.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a boolean, false otherwise.
 */
export const isBoolean = _createIs<boolean>(BOOLEAN);

/**
 * Determines if a value is a regular expression object.
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `RegExp`.
 */
export const isRegExp = _createObjIs<RegExp>("[object RegExp]");

/**
 * Checks if the type of value is a File object.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a File, false otherwise.
 */
export const isFile = _createObjIs<File>("[object File]");

/**
 * Checks if the type of value is a FormData object.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a FormData, false otherwise.
 */
export const isFormData = _createObjIs<FormData>("[object FormData]");

/**
 * Checks if the type of value is a Blob object.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a Blob, false otherwise.
 */
export const isBlob = _createObjIs<Blob>("[object Blob]");

/**
 * Checks if the type of value is a ArrayBuffer object.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a ArrayBuffer, false otherwise.
 */
export const isArrayBuffer = _createObjIs<ArrayBuffer>("[object ArrayBuffer]");

/**
 * Checks if the type of value is a Error object.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a Error, false otherwise.
 */
export const isError = _createObjIs<ArrayBuffer>("[object Error]");

/**
 * Checks if the type of value is a PromiseLike instance (contains a then function).
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a PromiseLike, false otherwise.
 */
export function isPromiseLike<T>(value: any): value is PromiseLike<T> {
    return !!value && isFunction(value.then);
}

/**
 * Checks if the type of value is a Promise instance (contains then and catch functions).
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a Promise, false otherwise.
 */
export function isPromise<T>(value: any): value is Promise<T> {
    return isPromiseLike(value) && isFunction((value as any).catch);
}

/**
 * Checks if the type of value does not evaluate to true value, handling some special
 * case usages of Boolean(true/false) and new Boolean(true/false).
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is not truthy, false otherwise.
 */
export function isNotTruthy(value: any) {
    return !value || !(value && (0 + value));
}

/**
 * Checks if the type of value evaluates to true value, handling some special
 * case usages of Boolean(true/false) and new Boolean(true/false).
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is not truthy, false otherwise.
 */
export function isTruthy(value: any) {
    return !(!value || !(value && (0 + value)));
}