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