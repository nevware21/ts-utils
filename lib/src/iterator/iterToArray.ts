/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { isFunction } from "../helpers/base";
import { iterForOf } from "./forOf";
import { _asIterator, _getIteratorThisArg } from "./helpers";
import { IterMapCallbackFn } from "./types";

/**
 * Materializes an iterator / iterable / array-like value as an array.
 * @since 0.15.0
 * @group Iterator
 * @example
 * ```ts
 * iterToArray(createRangeIterator(1, 3)); // [1, 2, 3]
 * iterToArray([10, 20, 30], (value, idx) => value + idx); // [10, 21, 32]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterToArray<T, R = T>(iter: Iterator<T> | Iterable<T> | ArrayLike<T>, mapFn?: IterMapCallbackFn<T, R>, thisArg?: any): R[] {
    let source = _asIterator(iter);
    let values: R[] = [];

    if (isFunction(mapFn)) {
        iterForOf(source, (value, count) => {
            values.push(fnCall(mapFn, _getIteratorThisArg(source, thisArg), value, count || 0));
        });
    } else {
        iterForOf(source, (value) => {
            values.push(value as any as R);
        });
    }

    return values;
}
