/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction, isObject, isStrictNullOrUndefined } from "../helpers/base";
import { CALL, UNDEF_VALUE } from "../internal/constants";
import { objHasOwn } from "./has_own";
import { isUnsafePropKey } from "./isUnsafePropKey";

/**
 * @internal
 * @ignore
 * Shared implementation for {@link objForEachKey} and {@link forEachOwnKey}, iterates the own enumerable
 * string keys of the object via a for...in loop. Each value is read inline within a try/catch (rather than
 * via a helper function call per key) so that a throwing getter passes `undefined` as the value instead of
 * aborting the iteration, while exceptions thrown by the callback still propagate.
 * @param theObject - The object to iterate over
 * @param callbackfn - The callback to call for each key, returning -1 stops the iteration
 * @param ctx - The already resolved `this` value to use when calling the callback
 * @returns -1 if the callback requested the iteration to stop, otherwise undefined
 */
export function _objForEachKey<T>(theObject: T, callbackfn: (key: string, value: T[keyof T]) => void | number, ctx: any): number | void {
    for (const prop in theObject) {
        if (objHasOwn(theObject, prop)) {
            let value: any = UNDEF_VALUE;
            try {
                value = theObject[prop as keyof T];
            } catch (e) {
                // A throwing getter, so just pass undefined as the value
            }

            if (callbackfn[CALL](ctx, prop, value) === -1) {
                return -1;
            }
        }
    }
}

/**
 * Calls the provided `callbackFn` function once for each key in an object. This is equivalent to `arrForEach(Object.keys(theObject), callbackFn)` or
 * if not using the array helper `Object.keys(theObject).forEach(callbackFn)` except that this helper avoids creating a temporary array of the object
 * keys before iterating over them and like the `arrForEach` helper you CAN stop or break the iteration by returning -1 from the `callbackFn` function.
 *
 * **Note:** This helper only iterates string (and numeric) keys (via for...in loop) and does NOT include enumerable symbol keys.
 * If you need to iterate all keys including symbol, use {@link forEachOwnKey} or {@link forEachOwnKeySafe} instead.
 *
 * If reading a property value throws (for example a getter that throws an exception), the exception is caught and the
 * `callbackFn` is still called for that key with an `undefined` value, so a single throwing getter does not stop the
 * iteration of the remaining keys.
 *
 * Caution: this helper does not filter unsafe keys like `__proto__`, `constructor`, or `prototype`.
 * If your callback uses the returned key to assign directly to another object (for example
 * `target[key] = value`), validate keys first (for example with {@link isUnsafePropKey}) or
 * use {@link objForEachKeySafe} when iterating untrusted input.
 * @group Object
 * @typeParam T - The object type
 * @param theObject - The object to iterate over
 * @param callbackfn - A function that accepts up to two arguments, the key name and the current value of the property represented by the key.
 * @param thisArg - [Optional] An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, null or undefined
 * the object will be used as the this value.
 * @example
 * ```ts
 * // Basic iteration - only string keys
 * const obj = { name: "Alice", age: 30 };
 * objForEachKey(obj, (key, value) => {
 *     console.log(key, value);  // name Alice, age 30
 * });
 * ```
 * @example
 * ```ts
 * // Unsafe keys warning - use objForEachKeySafe for untrusted input
 * // Note: use Object.defineProperty (not an object literal) so "__proto__" is
 * // created as a normal own enumerable property rather than being treated
 * // specially by the JS engine.
 * const untrustedObj: any = { name: "Bob" };
 * Object.defineProperty(untrustedObj, "__proto__", { value: "attack", enumerable: true, configurable: true, writable: true });
 * objForEachKey(untrustedObj, (key, value) => {
 *     console.log(key, value);  // name Bob, __proto__ attack (UNSAFE!)
 * });
 *
 * // Safe iteration with objForEachKeySafe
 * objForEachKeySafe(untrustedObj, (key, value) => {
 *     console.log(key, value);  // name Bob (unsafe keys filtered)
 * });
 * ```
 * @example
 * ```ts
 * // A throwing getter does not stop the iteration
 * const obj = { a: 1, get b(): number { throw new Error("fail"); }, c: 3 };
 * objForEachKey(obj, (key, value) => {
 *     console.log(key, value);  // a 1, b undefined, c 3
 * });
 * ```
 * @see {@link objForEachKeySafe} for safe iteration that filters unsafe keys
 * @see {@link forEachOwnKey} for iteration that includes both string and symbol keys
 * @see {@link forEachOwnKeySafe} for safe iteration with both string and symbol keys
 */
export function objForEachKey<T>(theObject: T, callbackfn: (key: string, value: T[keyof T]) => void | number, thisArg?: any): void {
    if (theObject && (isObject(theObject) || isFunction(theObject))) {
        _objForEachKey(theObject, callbackfn, isStrictNullOrUndefined(thisArg) ? theObject : thisArg);
    }
}

/**
 * Calls the provided `callbackFn` function once for each key in an object, filtering out unsafe keys like `__proto__`, `constructor`, and `prototype`.
 * This is a safe wrapper around {@link objForEachKey} that validates keys before passing them to the callback.
 *
 * Like {@link objForEachKey}, this helper iterates only string keys (via for...in loop) and does NOT include enumerable symbol keys.
 * If you need to iterate both string and symbol keys, use {@link forEachOwnKeySafe} instead.
 *
 * As with {@link objForEachKey}, if reading a property value throws (for example a throwing getter) the `callbackFn`
 * is called for that key with an `undefined` value and the iteration continues.
 * @group Object
 * @since 0.14.0
 * @typeParam T - The object type
 * @param theObject - The object to iterate over
 * @param callbackfn - A function that accepts up to two arguments, the key name and the current value of the property represented by the key.
 * @param thisArg - [Optional] An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, null or undefined
 * the object will be used as the this value.
 * @example
 * ```ts
 * // Safe iteration - unsafe keys are skipped
 * const untrustedObj: any = { name: "Alice", constructor: {} };
 * Object.defineProperty(untrustedObj, "__proto__", { value: "attack", enumerable: true, configurable: true, writable: true });
 * objForEachKeySafe(untrustedObj, (key, value) => {
 *     console.log(key, value);  // Only prints: name Alice
 * });
 * ```
 * @example
 * ```ts
 * // Difference between objForEachKey variants:
 * const source = { name: "Alice", age: 30, [Symbol.for("id")]: 123 };
 *
 * // objForEachKey - includes unsafe keys if present, no symbol keys
 * objForEachKey(source, (key, value) => {
 *     console.log(key, value);  // name Alice, age 30
 * });
 *
 * // objForEachKeySafe - filters unsafe keys, no symbol keys
 * objForEachKeySafe(source, (key, value) => {
 *     console.log(key, value);  // name Alice, age 30 (same as above since no unsafe keys)
 * });
 *
 * // forEachOwnKeySafe - filters unsafe keys, includes symbol keys
 * forEachOwnKeySafe(source, (key, value) => {
 *     console.log(key, value);  // name Alice, age 30, Symbol(id) 123
 * });
 * ```
 */
export function objForEachKeySafe<T>(theObject: T, callbackfn: (key: string, value: T[keyof T]) => void | number, thisArg?: any): void {
    // Resolve the `this` value once (not per key), passing it directly rather than via the wrapper's own `this`
    // as that would box primitive values (e.g. 0, "", false) when running in non-strict mode
    thisArg = isStrictNullOrUndefined(thisArg) ? theObject : thisArg;
    objForEachKey(theObject, (key: string, value: T[keyof T]) => {
        if (!isUnsafePropKey(key)) {
            return callbackfn[CALL](thisArg, key, value);
        }
    });
}
