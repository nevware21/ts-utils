/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { objForEachKey } from "../../object/for_each_key";

/**
 * Returns an array of key/values of the enumerable properties of an object
 * @since 0.9.7
 * @group Polyfill
 * @group Object
 * @group ArrayLike
 * @param value - Object that contains the properties and methods.
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