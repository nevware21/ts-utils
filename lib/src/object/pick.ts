/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { arrIndexOf } from "../array/indexOf";
import { isArrayLike, isString } from "../helpers/base";
import { objCreate } from "./create";
import { forEachOwnKey } from "./forEachOwnKey";
import { objHasOwn } from "./has_own";
import { _objPropertyIsEnumerable } from "./property_is_enumerable";

/**
 * Creates a new object composed of the picked enumerable own properties of `source`.
 * Only keys present in the `keys` array are included in the returned object.
 * @since 0.14.0
 * @group Object
 * @typeParam T - The type of the source object
 * @typeParam K - The key type (subset of keyof T)
 * @param source - The source object to pick from
 * @param keys - The array of keys to include
 * @returns A new object containing only the specified keys and their values from `source`.
 *   Returns an empty object if `source` is null or undefined.
 * @example
 * ```ts
 * const obj = { a: 1, b: "hello", c: true };
 *
 * objPick(obj, ["a", "c"]);  // { a: 1, c: true }
 * objPick(obj, ["b"]);        // { b: "hello" }
 * objPick(obj, []);           // {}
 * objPick(null, ["a"]);       // {}
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function objPick<T, K extends keyof T>(source: T, keys: ArrayLike<K>): Pick<T, K>;
/*#__NO_SIDE_EFFECTS__*/
export function objPick<T>(source: T, keys: ArrayLike<string>): Partial<T>;
/*#__NO_SIDE_EFFECTS__*/
export function objPick<T>(source: T, keys: ArrayLike<PropertyKey>): Partial<T>;
export function objPick<T>(source: T, keys: ArrayLike<PropertyKey>): Partial<T> {
    const result: Partial<T> = objCreate(null);
    if (source && isArrayLike(keys)) {
        arrForEach(keys, (key) => {
            if (objHasOwn(source, key) && _objPropertyIsEnumerable(source, key)) {
                (result as any)[key] = (source as any)[key];
            }
        });
    }
    return result;
}

/**
 * Creates a new object composed of the enumerable own properties of `source` **except** for
 * those matching the provided `keys`.
 * @since 0.14.0
 * @group Object
 * @typeParam T - The type of the source object
 * @typeParam K - The key type (subset of keyof T) to exclude
 * @param source - The source object to omit from
 * @param keys - The array of keys to exclude
 * @returns A new object containing all own enumerable properties of `source` except those listed in `keys`.
 *   Returns an empty object if `source` is null or undefined.
 * @example
 * ```ts
 * const obj = { a: 1, b: "hello", c: true };
 *
 * objOmit(obj, ["b"]);         // { a: 1, c: true }
 * objOmit(obj, ["a", "c"]);    // { b: "hello" }
 * objOmit(obj, []);            // { a: 1, b: "hello", c: true }
 * objOmit(null, ["a"]);        // {}
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function objOmit<T, K extends keyof T>(source: T, keys: ArrayLike<K>): Pick<T, Exclude<keyof T, K>>;
/*#__NO_SIDE_EFFECTS__*/
export function objOmit<T>(source: T, keys: ArrayLike<string>): Partial<T>;
/*#__NO_SIDE_EFFECTS__*/
export function objOmit<T>(source: T, keys: ArrayLike<PropertyKey>): Partial<T>;
export function objOmit<T>(source: T, keys: ArrayLike<PropertyKey>): Partial<T> {
    const result: Partial<T> = objCreate(null);
    if (source && isArrayLike(keys)) {
        forEachOwnKey(source, (key, value) => {
            let hasKey = arrIndexOf(keys, key) !== -1;
            if (!hasKey && isString(key)) {
                // Also check for numeric keys using their runtime property names (e.g. "1" for key 1)
                const numericKey = +key;
                if (key === numericKey + "") {
                    if (numericKey === numericKey) {
                        hasKey = arrIndexOf(keys, numericKey) !== -1;
                    } else {
                        arrForEach(keys, (candidate) => {
                            if (candidate !== candidate) {
                                hasKey = true;
                            }
                        });
                    }
                }
            }

            if (!hasKey) {
                (result as any)[key] = value;
            }
        });
    }
    return result;
}

/**
 * Creates a new object composed of the enumerable own properties of `source` for which
 * the predicate function returns a truthy value.
 * @since 0.14.0
 * @group Object
 * @typeParam T - The type of the source object
 * @param source - The source object to pick from
 * @param predicate - A function `(key, value) => boolean` that is invoked for each own enumerable
 *   property. A property is included in the result when the predicate returns truthy.
 * @returns A new object containing only the properties for which `predicate` returned truthy.
 *   Returns an empty object if `source` is null or undefined.
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3, d: 4 };
 *
 * objPickBy(obj, (key, value) => value > 2);   // { c: 3, d: 4 }
 * objPickBy(obj, (key) => key !== "b");         // { a: 1, c: 3, d: 4 }
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function objPickBy<T>(source: T, predicate: (key: PropertyKey, value: T[keyof T]) => boolean): Partial<T> {
    const result: Partial<T> = objCreate(null);
    forEachOwnKey(source, (key, value) => {
        if (predicate(key, value)) {
            (result as any)[key] = value;
        }
    });
    return result;
}

/**
 * Creates a new object composed of the enumerable own properties of `source` for which
 * the predicate function returns a **falsy** value — the inverse of {@link objPickBy}.
 * @since 0.14.0
 * @group Object
 * @typeParam T - The type of the source object
 * @param source - The source object to omit from
 * @param predicate - A function `(key, value) => boolean` that is invoked for each own enumerable
 *   property. A property is **excluded** from the result when the predicate returns truthy.
 * @returns A new object containing only the properties for which `predicate` returned falsy.
 *   Returns an empty object if `source` is null or undefined.
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3, d: 4 };
 *
 * objOmitBy(obj, (key, value) => value > 2);   // { a: 1, b: 2 }
 * objOmitBy(obj, (key) => key === "b");         // { a: 1, c: 3, d: 4 }
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function objOmitBy<T>(source: T, predicate: (key: PropertyKey, value: T[keyof T]) => boolean): Partial<T> {
    const result: Partial<T> = objCreate(null);
    forEachOwnKey(source, (key, value) => {
        if (!predicate(key, value)) {
            (result as any)[key] = value;
        }
    });
    return result;
}
