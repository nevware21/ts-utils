/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { CALL, NULL_VALUE, UNDEF_VALUE } from "../internal/constants";
import { objHasOwn } from "./has_own";
import { isUnsafePropKey } from "./isUnsafePropKey";

/**
 * Calls the provided `callbackFn` once for each own enumerable key in the supplied value,
 * skipping keys that are considered unsafe (`__proto__`, `constructor`, `prototype`).
 * The callback can stop iteration early by returning `-1`.
 *
 * This helper works with plain objects, arrays, and functions while safely ignoring
 * `null` and `undefined` values.
 * @since 0.14.0
 * @group Object
 * @typeParam T - The source type.
 * @param theObject - The object-like value to iterate.
 * @param callbackfn - Invoked for each safe own enumerable key.
 * @param thisArg - [Optional] The `this` context for the callback.
 * @example
 * ```ts
 * const result: string[] = [];
 * forEachOwnKeySafe({ a: 1, constructor: 2, b: 3 }, (key) => {
 *     result.push(key);
 * });
 *
 * // result === ["a", "b"]
 * ```
 */
export function forEachOwnKeySafe<T>(theObject: T, callbackfn: (key: string, value: T[keyof T]) => void | number, thisArg?: any): void {
    if (theObject !== NULL_VALUE && theObject !== UNDEF_VALUE) {
        for (const prop in theObject) {
            if (objHasOwn(theObject, prop) && !isUnsafePropKey(prop)) {
                if (callbackfn[CALL](thisArg || theObject, prop, theObject[prop as keyof T]) === -1) {
                    break;
                }
            }
        }
    }
}
