/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { objCreate } from "./create";
import { forEachOwnKey } from "./forEachOwnKey";

/**
 * Creates a new object with the same keys as `source` but with each value transformed
 * by the provided `mapper` function.
 * @since 0.14.0
 * @group Object
 * @typeParam T - The type of the source object
 * @typeParam U - The type of the mapped values
 * @param source - The source object whose values will be mapped
 * @param mapper - A function `(value, key) => U` called for every own enumerable property.
 * @returns A new object with the same keys as `source` and values produced by `mapper`.
 *   Returns an empty object if `source` is null or undefined.
 * @example
 * ```ts
 * const prices = { apple: 1.5, banana: 0.75, cherry: 3.0 };
 *
 * objMapValues(prices, (v) => v * 2);
 * // => { apple: 3, banana: 1.5, cherry: 6 }
 *
 * const user = { firstName: "ada", lastName: "lovelace" };
 * objMapValues(user, (v) => v.toUpperCase());
 * // => { firstName: "ADA", lastName: "LOVELACE" }
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function objMapValues<T, U>(source: T, mapper: (value: T[keyof T], key: PropertyKey) => U): { [K in keyof T]: U } {
    const result: any = objCreate(null);
    forEachOwnKey(source, (key, value) => {
        result[key] = mapper(value, key);
    });
    return result;
}
