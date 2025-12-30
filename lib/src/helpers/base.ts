/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrCls, FUNCTION, NULL_VALUE, OBJECT, ObjProto, TO_STRING, UNDEFINED, UNDEF_VALUE } from "../internal/constants";
import { _isPolyfillType } from "../internal/poly_helpers";
import { _pureRef } from "../internal/treeshake_helpers";
import { safeGet } from "./safe_get";

let _primitiveTypes: string[];

/**
 * @ignore
 * @internal
 * Create and returns a function that will return `true` if the argument passed
 * to it matches the provided type.
 * @param theType - The type to match against the `typeof value`
 * @returns A function which takes a single argument and returns a boolean
 */
/*#__NO_SIDE_EFFECTS__*/
export function _createIs<T>(theType: string): (value: any) => value is T {
    return function (value: any): value is T {
        return typeof value === theType;
    }
}

/**
 * @ignore
 * @internal
 * Create and returns a function that will return `true` if the argument passed
 * to it matches the provided type or the type is a polyfill for the provided type.
 * @param theType - The type to match against the `typeof value`
 * @returns A function which takes a single argument and returns a boolean
 */
/*#__NO_SIDE_EFFECTS__*/
export function _createIsWithPoly<T>(theType: string): (value: any) => value is T {
    return function (value: any): value is T {
        return typeof value === theType || _isPolyfillType(value, theType);
    }
}

/**
 * @ignore
 * @internal
 * Create and returns a function that will return `true` if the argument passed
 * to it matches the object type specified based on {@link objToString}.
 * @param - The object name to match for the `objToString(value)`
 * @returns A function which takes a single argument and returns a boolean
 */
/*#__NO_SIDE_EFFECTS__*/
export function _createObjIs<T>(theName: string): (value: any) => value is T {
    const theType = "[object " + theName + "]";
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
 * @example
 * ```ts
 * objToString(new Date()); // [object Date]
 * objToString(new String()); // [object String]
 *
 * // Math has its Symbol.toStringTag
 * objToString(Math); // [object Math]
 *
 * objToString(undefined); // [object Undefined]
 * objToString(null); // [object Null]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function objToString(value: any): string {
    return ObjProto[TO_STRING].call(value);
}

/**
 * Validate if the provided value object is of the expected type
 * @group Type Identity
 * @param value - The value to check
 * @param theType - The expected type name as a string
 * @returns `true` if the value matches the provided type
 */
/*#__NO_SIDE_EFFECTS__*/
export function isTypeof(value: any, theType: string): boolean {
    return typeof value === theType;
}

/**
 * Checks if the provided value is undefined or contains the string value "undefined",
 * if you want to consider the string value as undefined see {@link @nevware21/ts-utils#isStrictUndefined}
 * @group Type Identity
 * @group Value Check
 * @param value - The value to check
 * @returns true if the value is undefined or "undefined", otherwise false
 * @example
 * ```ts
 * isUndefined(undefined);              // true
 * isUndefined("undefined");            // true
 *
 * isUndefined(null);                   // false
 * isUndefined("null");                 // false
 * isUndefined("1");                    // false
 * isUndefined("aa");                   // false
 * isUndefined(new Date());             // false
 * isUndefined(1);                      // false
 * isUndefined("");                     // false
 * isUndefined(_dummyFunction);         // false
 * isUndefined([]);                     // false
 * isUndefined(new Array(1));           // false
 * isUndefined(true);                   // false
 * isUndefined(false);                  // false
 * isUndefined("true");                 // false
 * isUndefined("false");                // false
 * isUndefined(new Boolean(true));      // false
 * isUndefined(new Boolean(false));     // false
 * isUndefined(new Boolean("true"));    // false
 * isUndefined(new Boolean("false"));   // false
 * isUndefined(Boolean(true));          // false
 * isUndefined(Boolean(false));         // false
 * isUndefined(Boolean("true"));        // false
 * isUndefined(Boolean("false"));       // false
 * isUndefined(new RegExp(""));         // false
 * isUndefined(new ArrayBuffer(0));     // false
 * isUndefined(new Error("Test Error"));// false
 * isUndefined(new TypeError("Test TypeError"));    // false
 * isUndefined(new TestError("Test TestError"));    // false
 * isUndefined(_dummyError());          // false
 * isUndefined(Promise.reject());       // false
 * isUndefined(Promise.resolve());      // false
 * isUndefined(new Promise(() => {}));  // false
 * isUndefined(_simplePromise());       // false
 * isUndefined(_simplePromiseLike());   // false
 * isUndefined(Object.create(null));    // false
 * isUndefined(polyObjCreate(null));    // false
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function isUndefined(value: any) {
    return typeof value === UNDEFINED || value === UNDEFINED;
}

/**
 * Checks if the provided value is undefined, a string value of "undefined" is NOT considered
 * to be undefined.
 * @group Type Identity
 * @group Value Check
 * @param arg - The value to check
 * @returns true if the typeof value === UNDEFINED
 * @example
 * ```ts
 * isStrictUndefined(undefined);    // true
 *
 * isStrictUndefined(null);         // false
 * isStrictUndefined("null");       // false
 * isStrictUndefined("undefined");  // false
 * isStrictUndefined("1");          // false
 * isStrictUndefined("aa");         // false
 * isStrictUndefined(new Date());   // false
 * isStrictUndefined(0);            // false
 * isStrictUndefined(1);            // false
 * isStrictUndefined("");           // false
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function isStrictUndefined(arg: any): arg is undefined {
    return arg === UNDEF_VALUE;
}

/**
 * Checks if the provided value is null, undefined or contains the string value of "undefined".
 * @group Type Identity
 * @group Value Check
 * @param value - The value to check
 * @returns `true` if the value is `null` or `undefined`
 * @example
 * ```ts
 * isNullOrUndefined(null);         // true
 * isNullOrUndefined(undefined);    // true
 * isNullOrUndefined("undefined");  // true
 *
 * let value = null;
 * isNullOrUndefined(value);        // true
 * let value = undefined;
 * isNullOrUndefined(value);        // true
 *
 * isNullOrUndefined("");           // false
 * isNullOrUndefined(0);            // false
 * isNullOrUndefined(new Date());   // false
 * isNullOrUndefined(true);         // false
 * isNullOrUndefined(false);        // false
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function isNullOrUndefined(value:  any): boolean {
    return value === NULL_VALUE || isUndefined(value);
}

/**
 * Checks if the provided value is null, undefined only, a string value of "undefined" is NOT considered
 * to be undefined.
 * @group Type Identity
 * @group Value Check
 * @param value - The value to check
 * @returns
 * @example
 * ```ts
 * isStrictNullOrUndefined(null);         // true
 * isStrictNullOrUndefined(undefined);    // true
 * isStrictNullOrUndefined("undefined");  // false
 *
 * let value = null;
 * isStrictNullOrUndefined(value);        // true
 * let value = undefined;
 * isStrictNullOrUndefined(value);        // true
 *
 * isStrictNullOrUndefined("");           // false
 * isStrictNullOrUndefined(0);            // false
 * isStrictNullOrUndefined(new Date());   // false
 * isStrictNullOrUndefined(true);         // false
 * isStrictNullOrUndefined(false);        // false
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function isStrictNullOrUndefined(value: any): boolean {
    return value === NULL_VALUE || value === UNDEF_VALUE;
}

/**
 * Checks if the passed value is defined, which means it has any value and is not undefined.
 * A string value of "undefined" is considered to be defined.
 * @group Value Check
 * @param arg - The value to check
 * @returns true if arg has a value (is not === undefined)
 * @example
 * ```ts
 * isDefined(null);         // false
 * isDefined(undefined);    // false
 * isDefined("undefined");  // true
 *
 * let value = null;
 * isDefined(value);        // false
 * let value = undefined;
 * isDefined(value);        // false
 *
 * isDefined("");           // true
 * isDefined(0);            // true
 * isDefined(new Date());   // true
 * isDefined(true);         // true
 * isDefined(false);        // true
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function isDefined(arg: any): boolean {
    return !!arg || arg !== UNDEF_VALUE;
}

/**
 * Identifies whether the provided value is a JavaScript [primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)
 * which is when is it not an object and has no methods or properties. There are 7 primitive data types:
 * - string
 * - number
 * - bigint
 * - boolean
 * - undefined
 * - null
 * - symbol
 *
 * Most of the time, a primitive value is represented directly at the lowest level of the language implementation.
 *
 * All primitives are immutable; that is, they cannot be altered. It is important not to confuse a primitive itself
 * with a variable assigned a primitive value. The variable may be reassigned to a new value, but the existing value
 * can not be changed in the ways that objects, arrays, and functions can be altered. The language does not offer
 * utilities to mutate primitive values.
 * @since 0.4.4
 * @group Type Identity
 * @param value - The value to check whether it's a primitive value
 * @example
 * ```ts
 * isPrimitive(null);                   // true
 * isPrimitive(undefined);              // true
 * isPrimitive("null");                 // true
 * isPrimitive("undefined");            // true
 * isPrimitive("1");                    // true
 * isPrimitive("aa");                   // true
 * isPrimitive(1);                      // true
 * isPrimitive(Number(2));              // true
 * isPrimitive("");                     // true
 * isPrimitive(String(""));             // true
 * isPrimitive(true);                   // true
 * isPrimitive(false);                  // true
 * isPrimitive("true");                 // true
 * isPrimitive("false");                // true
 * isPrimitive(BigInt(42));             // true
 * isPrimitive(Symbol.for("Hello"));    // true
 *
 * isPrimitive(new String("aa"));       // false
 * isPrimitive(new Date());             // false
 * isPrimitive(_dummyFunction);         // false
 * isPrimitive([]);                     // false
 * isPrimitive(new Array(1));           // false
 * isPrimitive(new Boolean(true));      // false
 * isPrimitive(new Boolean(false));     // false
 * isPrimitive(new Boolean("true"));    // false
 * isPrimitive(new Boolean("false"));   // false
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function isPrimitive(value: any): value is string | number | bigint | boolean | undefined | symbol | null {
    return value === NULL_VALUE || isPrimitiveType(typeof value);
}

/**
 * Identifies whether the provided value is a JavaScript [primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)
 * which is when is it not an object and has no methods or properties. There are 6 primitive data types:
 * - string
 * - number
 * - bigint
 * - boolean
 * - undefined
 * - symbol
 *
 * Most of the time, a primitive value is represented directly at the lowest level of the language implementation.
 *
 * All primitives are immutable; that is, they cannot be altered. It is important not to confuse a primitive itself
 * with a variable assigned a primitive value. The variable may be reassigned to a new value, but the existing value
 * can not be changed in the ways that objects, arrays, and functions can be altered. The language does not offer
 * utilities to mutate primitive values.
 * @since 0.9.6
 * @group Type Identity
 * @param theType - The type as a string value to be checked whther it's a primitive type, this should be the value
 * returned from `typeof value`.
 * @example
 * ```ts
 * isPrimitiveType(null);                   // false
 * isPrimitiveType(undefined);              // false
 * isPrimitiveType("null");                 // false
 * isPrimitiveType("undefined");            // false
 * isPrimitiveType("1");                    // false
 * isPrimitiveType("aa");                   // false
 * isPrimitiveType(1);                      // false
 * isPrimitiveType(Number(2));              // false
 * isPrimitiveType("");                     // false
 * isPrimitiveType(String(""));             // false
 * isPrimitiveType(true);                   // false
 * isPrimitiveType(false);                  // false
 * isPrimitiveType("true");                 // false
 * isPrimitiveType("false");                // false
 * isPrimitiveType(BigInt(42));             // false
 * isPrimitiveType(Symbol.for("Hello"));    // false
 *
 * isPrimitiveType("string");               // true
 * isPrimitiveType("number");               // true
 * isPrimitiveType("boolean");              // true
 * isPrimitiveType("undefined");            // true
 * isPrimitiveType("symbol");               // true
 * isPrimitiveType("bigint");               // true
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function isPrimitiveType(theType: string): boolean {
    !_primitiveTypes && (_primitiveTypes = [ "string", "number", "boolean", UNDEFINED, "symbol", "bigint" ]);

    return !!(theType !== OBJECT && _primitiveTypes.indexOf(theType) !== -1);
}

/**
 * Checks to see if the past value is a string value
 * @function
 * @group Type Identity
 * @group String
 * @param value - The value to check
 * @returns
 * @example
 * ```ts
 * isString("");            // true
 * isString("null");        // true
 * isString("undefined");   // true
 * isString(String(""));    // true
 *
 * isString(null);          // false
 * isString(undefined);     // false
 * isString(0);             // false
 * ```
 */
export const isString: (value: any) => value is string = (/*#__PURE__*/_createIs<string>("string"));

/**
 * Checks to see if the past value is a function value
 * @function
 * @group Type Identity
 * @param value - The value to check
 * @returns
 * @example
 * ```ts
 * function myFunction() { }
 * isFunction(null);            // false
 * isFunction(undefined);       // false
 * isFunction("null");          // false
 * isFunction("undefined");     // false
 * isFunction("1");             // false
 * isFunction("aa");            // false
 * isFunction(new Date());      // false
 * isFunction(1);               // false
 * isFunction("");              // false
 * isFunction(myFunction);      // true
 * isFunction([]);              // false
 * isFunction(new Array(1));    // false
 * ```
 */
export const isFunction: (value: any) => value is Function = (/*#__PURE__*/_createIs<Function>(FUNCTION));

/**
 * Checks if the provided value is an AsyncFunction
 * @function
 * @group Type Identity
 * @since 0.12.3
 * @param value - Value to be checked
 * @returns True if the value is an AsyncFunction, false otherwise
 * @remarks
 * This function checks if the provided value is an AsyncFunction, which is a special type of function
 * that returns a Promise and can be used with the `await` keyword. Note that this function does not
 * check if the function is a generator or an async generator function. And when using TypeScript
 * and targetting earlier versions of JavaScript, the type of the function may NOT be AsyncFunction
 * and instead be a regular function. This is because the type of the function is determined by the
 * JavaScript engine and not the TypeScript compiler.
 * @example
 * ```ts
 * async function asyncFn() { }
 * isAsyncFunction(asyncFn);               // true
 * isAsyncFunction(function() {});         // false
 * isAsyncFunction(function* () {});       // false
 * isAsyncFunction(async function* () {}); // false
 * isAsyncFunction(null);                  // false
 * isAsyncFunction(undefined);             // false
 * ```
 */
export const isAsyncFunction: (value: any) => value is Function = (/*#__PURE__*/_createObjIs<Function>("AsyncFunction"));

/**
 * Checks if the provided value is a GeneratorFunction
 * @function
 * @group Type Identity
 * @since 0.12.3
 * @param value - Value to be checked
 * @returns True if the value is a GeneratorFunction, false otherwise
 * @remarks
 * This function checks if the provided value is a GeneratorFunction, which is a special type of function
 * that returns a Generator and can be used with the `yield` keyword. Note that this function does not
 * check if the function is an async function or an async generator function. And when using TypeScript
 * and targetting earlier versions of JavaScript, the type of the function may NOT be GeneratorFunction
 * and instead be a regular function.
 * @example
 * ```ts
 * function* genFn() { }
 * isGenerator(genFn);                     // true
 * isGenerator(function() {});             // false
 * isGenerator(async function() {});       // false
 * isGenerator(async function* () {});     // false
 * isGenerator(null);                      // false
 * isGenerator(undefined);                 // false
 * ```
 */
export const isGenerator: (value: any) => value is GeneratorFunction = (/*#__PURE__*/_createObjIs<GeneratorFunction>("GeneratorFunction"));

/**
 * Checks if the provided value is an AsyncGeneratorFunction
 * @function
 * @group Type Identity
 * @since 0.12.3
 * @param value - Value to be checked
 * @returns True if the value is an AsyncGeneratorFunction, false otherwise
 * @remarks
 * This function checks if the provided value is an AsyncGeneratorFunction, which is a special type of function
 * that returns an AsyncGenerator and can be used with the `await` keyword. Note that this function does not
 * check if the function is a generator or an async function. And when using TypeScript and targetting earlier
 * versions of JavaScript, the type of the function may NOT be AsyncGeneratorFunction and instead be a regular function.
 * @example
 * ```ts
 * async function* asyncGenFn() { }
 * isAsyncGenerator(asyncGenFn);           // true
 * isAsyncGenerator(function() {});        // false
 * isAsyncGenerator(async function() {});  // false
 * isAsyncGenerator(function* () {});      // false
 * isAsyncGenerator(null);                 // false
 * isAsyncGenerator(undefined);            // false
 * ```
 */
export const isAsyncGenerator: (value: any) => value is AsyncGeneratorFunction = (/*#__PURE__*/_createObjIs<AsyncGeneratorFunction>("AsyncGeneratorFunction"));

/**
 * Checks to see if the past value is an object value
 * @function
 * @group Type Identity
 * @group Object
 * @typeParam T - The object type, defaults to any
 * @param value - The value to check
 * @returns
 */
/*#__NO_SIDE_EFFECTS__*/
export function isObject<T>(value: T): value is T {
    if (!value && isNullOrUndefined(value)) {
        return false;
    }

    return !!value && typeof value === OBJECT;
}

/**
 * Checks if the type of value is an Array.
 *
 * @function
 * @group Type Identity
 * @group Array
 * @param arg - Value to be checked.
 * @return True if the value is a Array, false otherwise.
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
export const isArray: <T = any>(arg: any) => arg is Array<T> = (/* #__PURE__*/_pureRef<typeof ArrCls.isArray>(ArrCls as any, "isArray"));

/**
 * Check if an object is of type Date
 * @function
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
export const isDate: (value: any) => value is Date = (/*#__PURE__*/_createObjIs<Date>("Date"));

/**
 * Checks if the type of value is a number.
 * @function
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value is a number, false otherwise.
 */
export const isNumber: (value: any) => value is number = (/*#__PURE__*/_createIs<number>("number"));

/**
 * Checks if the type of value is a boolean.
 * @function
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value is a boolean, false otherwise.
 */
export const isBoolean: (value: any) => value is boolean = (/*#__PURE__*/_createIs<boolean>("boolean"));

/**
 * Determines if a value is a regular expression object.
 * @function
 * @group Type Identity
 * @param value - Reference to check.
 * @returns True if `value` is a `RegExp`.
 */
export const isRegExp: (value: any) => value is RegExp = (/*#__PURE__*/_createObjIs<RegExp>("RegExp"));

/**
 * Checks if the type of value is a File object.
 * @function
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value is a File, false otherwise.
 */
export const isFile: (value: any) => value is File = (/*#__PURE__*/_createObjIs<File>("File"));

/**
 * Checks if the type of value is a FormData object.
 * @function
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value is a FormData, false otherwise.
 */
export const isFormData: (value: any) => value is FormData = (/*#__PURE__*/_createObjIs<FormData>("FormData"));

/**
 * Checks if the type of value is a Blob object.
 * @function
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value is a Blob, false otherwise.
 */
export const isBlob: (value: any) => value is Blob = (/*#__PURE__*/_createObjIs<Blob>("Blob"));

/**
 * Checks if the type of value is a ArrayBuffer object.
 * @function
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value is a ArrayBuffer, false otherwise.
 */
export const isArrayBuffer: (value: any) => value is ArrayBuffer = (/*#__PURE__*/_createObjIs<ArrayBuffer>("ArrayBuffer"));

/**
 * Checks if the type of value is a Error object.
 * @function
 * @group Type Identity
 * @group Error
 * @param value - Value to be checked.
 * @return True if the value is a Error, false otherwise.
 */
export const isError: (value: any) => value is Error = (/*#__PURE__*/_createObjIs<Error>("Error"));

/**
 * Checks if the type of value is a PromiseLike instance (contains a then function).
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value is a PromiseLike, false otherwise.
 */
/*#__NO_SIDE_EFFECTS__*/
export function isPromiseLike<T>(value: any): value is PromiseLike<T> {
    return !!(value && value.then && isFunction(value.then));
}

/**
 * Checks if the type of value is a PromiseLike instance (contains a then function).
 * This is an alias for {@link isPromiseLike}.
 * @function
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value is a PromiseLike, false otherwise.
 */
export const isThenable: <T>(value: any) => value is PromiseLike<T> = isPromiseLike;

/**
 * Checks if the type of value is a Promise instance (contains then and catch functions).
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value is a Promise, false otherwise.
 */
/*#__NO_SIDE_EFFECTS__*/
export function isPromise<T>(value: any): value is Promise<T> {
    return !!(value && value.then && value.catch && isFunction(value.then) && isFunction((value as any).catch));
}

/**
 * Checks if the type of value is a Map object.
 * @function
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value is a Map, false otherwise.
 * @example
 * ```ts
 * isMap(new Map());        // true
 * isMap(new WeakMap());    // false
 * isMap({});               // false
 * isMap(null);             // false
 * ```
 */
export const isMap: <K = any, V = any>(value: any) => value is Map<K, V> = (/*#__PURE__*/_createObjIs<Map<any, any>>("Map"));

/**
 * Checks if the type of value is a WeakMap object.
 * @function
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value is a WeakMap, false otherwise.
 * @example
 * ```ts
 * isWeakMap(new WeakMap());    // true
 * isWeakMap(new Map());        // false
 * isWeakMap({});               // false
 * isWeakMap(null);             // false
 * ```
 */
export const isWeakMap: <K extends object = object, V = any>(value: any) => value is WeakMap<K, V> = (/*#__PURE__*/_createObjIs<WeakMap<any, any>>("WeakMap"));

/**
 * Checks if the type of value is a Set object.
 * @function
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value is a Set, false otherwise.
 * @example
 * ```ts
 * isSet(new Set());        // true
 * isSet(new WeakSet());    // false
 * isSet({});               // false
 * isSet(null);             // false
 * ```
 */
export const isSet: <T = any>(value: any) => value is Set<T> = (/*#__PURE__*/_createObjIs<Set<any>>("Set"));

/**
 * Checks if the type of value is a WeakSet object.
 * @function
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value is a WeakSet, false otherwise.
 * @example
 * ```ts
 * isWeakSet(new WeakSet());    // true
 * isWeakSet(new Set());        // false
 * isWeakSet({});               // false
 * isWeakSet(null);             // false
 * ```
 */
export const isWeakSet: <T extends object = object>(value: any) => value is WeakSet<T> = (/*#__PURE__*/_createObjIs<WeakSet<any>>("WeakSet"));

/**
 * Checks if the type of value is Map-like (has essential Map methods).
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value implements the Map interface, false otherwise.
 * @example
 * ```ts
 * isMapLike(new Map());                // true
 *
 * // Custom map-like implementation
 * const myMap = {
 *   get: (key) => { return null; },
 *   set: (key, value) => { return myMap; },
 *   has: (key) => { return false; },
 *   delete: (key) => { return false; },
 *   size: 0
 * };
 * isMapLike(myMap);                    // true
 *
 * isMapLike({});                       // false
 * isMapLike(null);                     // false
 * isMapLike(undefined);                // false
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function isMapLike<K = any, V = any>(value: any): value is Map<K, V> {
    return !!(value &&
        isFunction(value.get) &&
        isFunction(value.set) &&
        isFunction(value.has) &&
        isFunction(value.delete) &&
        isNumber(value.size));
}

/**
 * Checks if the type of value is Set-like (has essential Set methods).
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value implements the Set interface, false otherwise.
 * @example
 * ```ts
 * isSetLike(new Set());                // true
 *
 * // Custom set-like implementation
 * const mySet = {
 *   add: (value) => { return mySet; },
 *   has: (value) => { return false; },
 *   delete: (value) => { return false; },
 *   size: 0
 * };
 * isSetLike(mySet);                    // true
 *
 * isSetLike({});                       // false
 * isSetLike(null);                     // false
 * isSetLike(undefined);                // false
 * ```
 */
export function isSetLike<T = any>(value: any): value is Set<T> {
    return !!(value &&
        isFunction(value.add) &&
        isFunction(value.has) &&
        isFunction(value.delete) &&
        isNumber(value.size));
}

/**
 * Checks if the type of value does not evaluate to true value, handling some special
 * case usages of Boolean(true/false) and new Boolean(true/false).
 * @group Value Check
 * @param value - Value to be checked.
 * @return True if the value is not truthy, false otherwise.
 */
/*#__NO_SIDE_EFFECTS__*/
export function isNotTruthy(value: any) {
    return !value || !isTruthy(value);
}

/**
 * Checks if the type of value evaluates to true value, handling some special
 * case usages of Boolean(true/false) and new Boolean(true/false).
 * @group Value Check
 * @param value - Value to be checked.
 * @return True if the value is not truthy, false otherwise.
 */
/*#__NO_SIDE_EFFECTS__*/
export function isTruthy(value: any) {
    // Objects created with no prototype (Object.create(null)) cannot be converted to primitives
    // Which causes this code to throw, additionally just using !! also fails for Boolean objects
    // !!(new Boolean(false)) evaluates to true
    return !(!value || safeGet(() => !(value && (0 + value)), !value));
    //return !(!value || !(value && (0 + value)));
}

/**
 * Checks if the type of value is a BigInt.
 * @function
 * @group Type Identity
 * @param value - Value to be checked.
 * @return True if the value is a BigInt, false otherwise.
 * @example
 * ```ts
 * isBigInt(BigInt(42));           // true
 * isBigInt(42n);                  // true
 *
 * isBigInt(42);                   // false
 * isBigInt("42");                 // false
 * isBigInt(null);                 // false
 * isBigInt(undefined);            // false
 * ```
 */
export const isBigInt: (value: any) => value is bigint = (/*#__PURE__*/_createIsWithPoly<bigint>("bigint"));
