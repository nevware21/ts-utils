/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isObject } from "../helpers/base";
import { dumpObj } from "../helpers/diagnostics";
import { throwTypeError } from "../helpers/throw";
import { NULL_VALUE } from "../internal/constants";
import { objForEachKey } from "../object/for_each_key";
import { objHasOwn } from "../object/has_own";

/**
 * Returns the names of the enumerable string properties and methods of an object. This helper exists to avoid adding a polyfil for older browsers
 * that do not define Object.keys eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
 * Note: For consistency this will not use the Object.keys implementation if it exists as this would cause a testing requirement to test with and without the implementations
 * @group Polyfill
 * @group Object
 * @param obj Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyObjKeys(obj: any): string[] {
    if (!isObject(obj) || obj === NULL_VALUE) {
        throwTypeError("non-object " + dumpObj(obj));
    }

    const result: string[] = [];
    for (const prop in obj) {
        if (objHasOwn(obj, prop)) {
            result.push(prop);
        }
    }

    return result;
}

/**
 * Returns an array of key/values of the enumerable properties of an object
 * @since 0.9.7
 * @group Polyfill
 * @group Object
 * @group ArrayLike
 * @param value Object that contains the properties and methods.
 * @example
 * ```ts
 * polyObjEntries({ Hello: "Darkness", my: "old", friend: "." });
 * // [ [ "Hello", "Darkness" ], [ "my", "old"], [ "friend", "." ] ]
 *
 * // Array-like object
 * polyObjEntries({ 0: "a", 1: "b", 2: "c" }));
 * // [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ]
 *
 * // Array-like object with random key ordering
 * polyObjEntries({ 100: "a", 2: "b", 7: "c" });
 * // [ ['2', 'b'], ['7', 'c'], ['100', 'a'] ]*
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyObjEntries<T = any>(value: {} | { [s: string]: T } | ArrayLike<T>): [string, T][] {
    let result: [string, T][] = [];

    objForEachKey(value, (key, value) => {
        result.push([key, value]);
    });

    return result;
}

/**
 * Returns an array of key/values of the enumerable properties of an object
 * @since 0.9.7
 * @group Polyfill
 * @group Object
 * @group ArrayLike
 * @param value Object that contains the properties and methods.
 * @example
 * ```ts
 * polyObjValues({ Hello: "Darkness", my: "old", friend: "." });
 * // [ "Darkness", "old", "." ]
 *
 * // Array-like object
 * polyObjValues({ 0: "a", 1: "b", 2: "c" }));
 * // [ 'a', 'b', 'c']
 *
 * // Array-like object with random key ordering
 * polyObjValues({ 100: "a", 2: "b", 7: "c" });
 * // [ 'b', 'c', 'a']
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyObjValues<T = any>(value: {} | { [s: string]: T } | ArrayLike<T>): T[] {
    let result: T[] = [];

    objForEachKey(value, (key, value) => {
        result.push(value);
    });

    return result;
}