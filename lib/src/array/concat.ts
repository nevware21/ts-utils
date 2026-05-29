/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrProto } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";

/**
 * Alias of `Array.prototype.concat()` for consumers that prefer the `arr*` helper naming.
 *
 * Unlike {@link arrAppend}, this helper does NOT mutate the input arrays and returns a new array.
 * @since 0.15.0
 * @function
 * @group Array
 * @param theArray - The array to concatenate into a new array.
 * @param items - Additional arrays and/or items to concatenate.
 * @returns A new array containing values from `theArray` followed by each concatenated item.
 * @example
 * ```ts
 * let values = arrConcat([1], [2, 3]);
 * // values is [1, 2, 3]
 *
 * let next = arrConcat(values, ["a", "b"]);
 * // next is [1, 2, 3, "a", "b"]
 * // values is still [1, 2, 3]
 * ```
 * @example
 * ```ts
 * const left = [1, 2];
 * const right = [3, 4];
 * const merged = arrConcat(left, right, 5);
 * // merged is [1, 2, 3, 4, 5]
 * // left is still [1, 2]
 * // right is still [3, 4]
 * ```
 */
export const arrConcat: {
    <T>(theArray: T[]): T[];
    <T>(theArray: T[], ...items: ConcatArray<T>[]): T[];
    <T>(theArray: T[], ...items: (T | ConcatArray<T>)[]): T[];
} = (/*#__PURE__*/_unwrapFunction("concat", ArrProto));
