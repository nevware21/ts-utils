/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrProto } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { createIterableIterator } from "../iterator/create";
import { mathToInt } from "../math/to_int";

/**
 * Returns an iterator over all numeric keys from `0` to `length - 1`.
 *
 * This uses `Array.prototype.keys()` when available and falls back to {@link polyArrKeys}.
 * Unlike {@link arrIndexKeys}, this always iterates all index positions, including holes.
 * @since 0.14.0
 * @function
 * @group Array
 * @group ArrayLike
 * @group Iterator
 * @param value - The array-like value to get key iterator for.
 * @returns An iterable iterator of numeric index keys.
 * @example
 * ```ts
 * arrFrom(arrKeys(["a", "b", "c"]));
 * // [0, 1, 2]
 *
 * const sparse: any[] = [];
 * sparse[2] = "c";
 * arrFrom(arrKeys(sparse));
 * // [0, 1, 2]
 * ```
 */
export const arrKeys: <T = any>(value: ArrayLike<T>) => IterableIterator<number> = /*#__PURE__*/ _unwrapFunctionWithPoly("keys", ArrProto as any, polyArrKeys) as any;

/**
 * Polyfill implementation of `Array.prototype.keys()` for array-like values.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @group Iterator
 * @group Polyfill
 * @param value - The array-like value to get key iterator for.
 * @returns An iterable iterator of numeric index keys.
 * @example
 * ```ts
 * arrFrom(polyArrKeys(["a", "b", "c"]));
 * // [0, 1, 2]
 *
 * arrFrom(polyArrKeys({ length: 3, 0: "a", 2: "c" }));
 * // [0, 1, 2]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyArrKeys<T = any>(value: ArrayLike<T>): IterableIterator<number> {
    _throwIfNullOrUndefined(value);

    let idx = -1;
    let len = mathToInt(value.length);
    if (len < 0) {
        len = 0;
    }

    return createIterableIterator<number>({
        n: function() {
            idx++;
            let isDone = idx >= len;
            if (!isDone) {
                this.v = idx;
            }

            return isDone;
        }
    });
}
