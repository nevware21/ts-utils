/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { getLength } from "../helpers/length";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { mathToInt } from "../math/to_int";
import { objHasOwn } from "../object/has_own";

/**
 * Returns only present own numeric index keys for an array-like value.
 *
 * Unlike {@link arrKeys}, this skips holes / missing indexes.
 * For example, an array with indexes `0`, `1`, `2`, `10` returns `[0, 1, 2, 10]`.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @param value - The array-like value to enumerate.
 * @returns An array containing only present own numeric index keys.
 * @example
 * ```ts
 * arrIndexKeys(["a", "b", "c"]);
 * // [0, 1, 2]
 *
 * const sparse: any[] = [];
 * sparse[0] = "a";
 * sparse[10] = "z";
 * arrIndexKeys(sparse);
 * // [0, 10]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrIndexKeys<T = any>(value: ArrayLike<T>): number[] {
    _throwIfNullOrUndefined(value);

    let keys: number[] = [];
    let len = mathToInt(getLength(value));
    if (len > 0) {
        for (let lp = 0; lp < len; lp++) {
            if (objHasOwn(value, lp)) {
                keys.push(lp);
            }
        }
    }

    return keys;
}
