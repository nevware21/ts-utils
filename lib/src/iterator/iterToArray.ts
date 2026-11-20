/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { isFunction } from "../helpers/base";
import { _iterForOf } from "./forOf";
import { _asIterator, _getIteratorThisArg } from "./helpers";
import { IterMapCallbackFn } from "./types";

/**
 * Materializes an iterator / iterable / array-like value as an array.
 * The value is processed like `for...of` (and {@link iterForOf}), so an iterable (including a string or an array) is
 * processed using its iterator (a string by its code points on a runtime which supports `Symbol.iterator`) and an
 * iterator which is not iterable is used as-is. Unlike `for...of` (and iterForOf, which only also processes an array)
 * any other array-like which is not iterable (eg. `{ length: 2, 0: "a", 1: "b" }`, or `arguments` or a string on a
 * runtime without `Symbol.iterator`) is processed using its indexes, and (like iterForOf) a `Map` or `Set` which is
 * not iterable (eg. on IE 11) returns its `[key, value]` entries / values.
 * @since 0.15.0
 * @group Iterator
 * @throws TypeError when the value's `[Symbol.iterator]()` doesn't return an iterator, or the iterator's `next()`
 * returns a value which is not an object
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
        _iterForOf(source, (value, count) => {
            values.push(fnCall(mapFn, _getIteratorThisArg(source, thisArg), value, count || 0));
        });
    } else {
        _iterForOf(source, (value) => {
            values.push(value as any as R);
        });
    }

    return values;
}
