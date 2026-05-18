/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { isStrictUndefined } from "../helpers/base";
import { forEachOwnKeySafe } from "./forEachOwnKeySafe";
import { objHasOwn } from "./has_own";
import { isUnsafeTarget } from "./isUnsafeTarget";

/**
 * Copies own enumerable properties from `source` to `target` **only** when the predicate
 * returns truthy for that key/value pair.  All other own properties on `target` are left
 * unchanged.
 * @since 0.14.0
 * @group Object
 * @typeParam T - The type of the target object
 * @param target - The target object to merge into
 * @param source - The source object to merge from. Null or undefined source is safely ignored.
 * @param predicate - A function `(key, srcValue, tgtValue) => boolean` called for each own
 *   enumerable property of `source`. The property is merged only when the predicate returns truthy.
 * @returns The `target` object (mutated in place).
 * @example
 * ```ts
 * const target = { a: 1, b: 2 };
 * const source = { b: 99, c: 3 };
 *
 * // Only merge keys whose source value is greater than 2
 * objMergeIf(target, source, (key, srcVal) => srcVal > 2);
 * // target => { a: 1, b: 99, c: 3 }
 *
 * // Only merge when the key does not already exist in target
 * const t2 = { x: 10 };
 * objMergeIf(t2, { x: 99, y: 5 }, (key, _sv, tgtVal) => tgtVal === undefined);
 * // t2 => { x: 10, y: 5 }
 * ```
 */
export function objMergeIf<T>(
    target: T,
    source: Record<string, any> | null | undefined,
    predicate: (key: string, srcValue: any, tgtValue: any) => boolean
): T {
    if (target && source && !isUnsafeTarget(target)) {
        forEachOwnKeySafe(source, (key, value) => {
            if (predicate(key, value, (target as any)[key])) {
                (target as any)[key] = value;
            }
        });
    }
    return target;
}

/**
 * Assigns own enumerable properties from one or more `sources` onto `target` **only** for
 * properties that are currently `undefined` on `target` — it never overwrites an already-defined
 * value (including `null`).  Sources are processed left-to-right; the first defined value wins.
 *
 * This is similar to Lodash `_.defaults()`, but it only considers each source object's own
 * enumerable properties and does not copy inherited source properties.
 * @since 0.14.0
 * @group Object
 * @typeParam T - The type of the target object
 * @param target - The destination object. Modified in place.
 * @param sources - One or more source objects. Null / undefined sources are skipped.
 * @returns The `target` object with all defaults applied.
 * @example
 * ```ts
 * const options = { timeout: 5000 };
 * const defaults = { timeout: 3000, retries: 3, verbose: false };
 *
 * objDefaults(options, defaults);
 * // => { timeout: 5000, retries: 3, verbose: false }
 * // `timeout` was kept because it was already defined.
 *
 * // Multiple sources — first defined value wins
 * objDefaults({}, { a: 1 }, { a: 99, b: 2 });
 * // => { a: 1, b: 2 }
 * ```
 */
export function objDefaults<T>(target: T, ...sources: Array<Partial<T> | null | undefined>): T {
    if (target && !isUnsafeTarget(target)) {
        arrForEach(sources, (source) => {
            if (source) {
                forEachOwnKeySafe(source, (key, value) => {
                    if (!objHasOwn(target, key) || isStrictUndefined((target as any)[key])) {
                        (target as any)[key] = value;
                    }
                });
            }
        });
    }
    return target;
}
