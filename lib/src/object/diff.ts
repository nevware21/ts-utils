/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isStrictNullOrUndefined } from "../helpers/base";
import { objCreate } from "./create";
import { forEachOwnKey } from "./forEachOwnKey";
import { objHasOwn } from "./has_own";

/**
 * Returns a shallow diff of two objects: a new object containing only the own enumerable
 * properties from `modified` whose values differ from the corresponding values in `base`
 * (using strict equality `!==`).  Properties present in `modified` but not in `base` are
 * also included.  Properties removed in `modified` (i.e. present only in `base`) are
 * **not** included — use the result to describe *what changed* in `modified`.
 * @since 0.14.0
 * @group Object
 * @typeParam T - The type of the base object
 * @typeParam U - The type of the modified object (defaults to `Partial<T>`)
 * @param base - The original / reference object
 * @param modified - The updated object to compare against `base`
 * @returns A new plain object with the keys from `modified` that differ from `base`.
 *   Returns an empty object when the two objects are equivalent or when either argument
 *   is null or undefined.
 * @example
 * ```ts
 * const prev = { x: 1, y: 2, z: 3 };
 * const next = { x: 1, y: 99, z: 3 };
 *
 * objDiff(prev, next);  // { y: 99 }
 *
 * // Added keys are included
 * objDiff({ a: 1 }, { a: 1, b: 2 });  // { b: 2 }
 *
 * // Removed keys are NOT included
 * objDiff({ a: 1, b: 2 }, { a: 1 });  // {}
 *
 * // null / undefined values are compared strictly
 * objDiff({ a: null }, { a: undefined });  // { a: undefined }
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function objDiff<T, U extends Partial<T> = Partial<T>>(base: T, modified: U): Partial<U> {
    const result: Partial<U> = objCreate(null);

    if (!isStrictNullOrUndefined(base)) {
        forEachOwnKey(modified, (key, value) => {
            const hasBase = objHasOwn(base, key);
            const baseVal = hasBase ? (base as any)[key] : undefined;
            if (!hasBase || baseVal !== value) {
                (result as any)[key] = value;
            }
        });
    }
    
    return result;
}
