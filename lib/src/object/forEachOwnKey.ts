/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { isStrictNullOrUndefined } from "../helpers/base";
import { CALL, NULL_VALUE, UNDEF_VALUE } from "../internal/constants";
import { objGetOwnPropertySymbols } from "./get_own_property";
import { objHasOwn } from "./has_own";
import { isUnsafePropKey } from "./isUnsafePropKey";
import { _objPropertyIsEnumerable } from "./property_is_enumerable";

/**
 * Calls the provided `callbackFn` once for each own enumerable key (string and symbol) in the
 * supplied value. The callback can stop iteration early by returning `-1`.
 *
 * This helper works with plain objects, arrays, and functions while safely ignoring
 * `null` and `undefined` values.
 *
 * **Note:** Unlike {@link objForEachKey}, this helper also iterates enumerable symbol keys via
 * `Object.getOwnPropertySymbols`. Use {@link forEachOwnKeySafe} when iterating untrusted input
 * to filter out unsafe keys like `__proto__`, `constructor`, and `prototype`.
 * @since 0.14.0
 * @group Object
 * @typeParam T - The source type.
 * @param theObject - The object-like value to iterate.
 * @param callbackfn - Invoked for each own enumerable key.
 * @param thisArg - [Optional] The `this` context for the callback. If omitted, `null`, or
 * `undefined`, the iterated object is used as `this`.
 * @example
 * ```ts
 * // Iterates both string and symbol keys
 * const sym = Symbol("id");
 * const obj = { name: "Alice", [sym]: 42 };
 *
 * forEachOwnKey(obj, (key, value) => {
 *     console.log(String(key), value);
 *     // "name" "Alice"
 *     // "Symbol(id)" 42
 * });
 * ```
 * @example
 * ```ts
 * // Stop iteration early by returning -1
 * const obj = { a: 1, b: 2, c: 3 };
 * forEachOwnKey(obj, (key) => {
 *     console.log(key);    // "a", "b"
 *     if (key === "b") {
 *         return -1;       // stops here
 *     }
 * });
 * ```
 * @example
 * ```ts
 * // Custom this context
 * const obj = { value: 10 };
 * const ctx = { multiplier: 3 };
 * forEachOwnKey(obj, function(key, val) {
 *     console.log((val as number) * this.multiplier); // 30
 * }, ctx);
 * ```
 */
export function forEachOwnKey<T>(theObject: T, callbackfn: (key: PropertyKey, value: T[keyof T]) => void | number, thisArg?: any): void {
    if (theObject !== NULL_VALUE && theObject !== UNDEF_VALUE) {
        for (const prop in theObject) {
            if (objHasOwn(theObject, prop)) {
                if (callbackfn[CALL](isStrictNullOrUndefined(thisArg) ? theObject : thisArg, prop, theObject[prop as keyof T]) === -1) {
                    return;
                }
            }
        }

        arrForEach(objGetOwnPropertySymbols(theObject), (key) => {
            if (_objPropertyIsEnumerable(theObject, key)) {
                if (callbackfn[CALL](isStrictNullOrUndefined(thisArg) ? theObject : thisArg, key, theObject[key as keyof T]) === -1) {
                    return -1;
                }
            }
        });
    }
}

/**
 * Calls the provided `callbackFn` once for each own enumerable key (string and symbol) in the
 * supplied value, skipping keys that are considered unsafe (`__proto__`, `constructor`,
 * `prototype`). The callback can stop iteration early by returning `-1`.
 *
 * This helper wraps {@link forEachOwnKey} with extra key filtering for safer assignment flows.
 * Use this instead of {@link forEachOwnKey} whenever keys come from untrusted input (e.g.
 * user-supplied objects, parsed JSON).
 * @since 0.14.0
 * @group Object
 * @typeParam T - The source type.
 * @param theObject - The object-like value to iterate.
 * @param callbackfn - Invoked for each safe own enumerable key.
 * @param thisArg - [Optional] The `this` context for the callback. If omitted, `null`, or
 * `undefined`, the iterated object is used as `this`.
 * @example
 * ```ts
 * // Safely copy properties from an untrusted source
 * function safeMerge<T extends object>(target: T, source: any): T {
 *     forEachOwnKeySafe(source, (key, value) => {
 *         (target as any)[key] = value;
 *     });
 *     return target;
 * }
 *
 * // Note: use Object.defineProperty so "__proto__" is a real own enumerable
 * // property rather than being treated as prototype syntax by the JS engine.
 * const src: any = { name: "Alice" };
 * Object.defineProperty(src, "__proto__", { value: "attack", enumerable: true, configurable: true, writable: true });
 * const result = safeMerge({}, src);
 * // result.name === "Alice"  (__proto__ was silently skipped)
 * ```
 * @example
 * ```ts
 * // Symbol keys are included but unsafe string keys are filtered
 * const sym = Symbol("safe");
 * // Note: use Object.defineProperty so "__proto__" is a real own enumerable
 * // property rather than being treated as prototype syntax by the JS engine.
 * const obj: any = { a: 1, [sym]: "ok" };
 * Object.defineProperty(obj, "__proto__", { value: "bad", enumerable: true, configurable: true, writable: true });
 *
 * forEachOwnKeySafe(obj, (key, value) => {
 *     console.log(String(key), value);
 *     // "a" 1
 *     // "Symbol(safe)" "ok"
 *     // "__proto__" is never visited
 * });
 * ```
 * @example
 * ```ts
 * // Stop iteration early by returning -1
 * const obj = { a: 1, b: 2, c: 3 };
 * forEachOwnKeySafe(obj, (key) => {
 *     console.log(key);    // "a", "b"
 *     if (key === "b") {
 *         return -1;       // stops here
 *     }
 * });
 * ```
 */
export function forEachOwnKeySafe<T>(theObject: T, callbackfn: (key: PropertyKey, value: T[keyof T]) => void | number, thisArg?: any): void {
    forEachOwnKey(theObject, (key, value) => {
        if (!isUnsafePropKey(key)) {
            return callbackfn[CALL](isStrictNullOrUndefined(thisArg) ? theObject : thisArg, key, value);
        }
    }, thisArg);
}
