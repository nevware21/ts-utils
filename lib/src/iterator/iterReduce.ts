/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { throwTypeError } from "../helpers/throw";
import { _iterForOf } from "./forOf";
import { _asIterator, _throwIfNotIterCallbackFn } from "./helpers";
import { IterReduceCallbackFn } from "./types";
import { LENGTH, UNDEF_VALUE } from "../internal/constants";

/**
 * Reduces an iterator / iterable into a single value.
 * The value is processed like `for...of` (and {@link iterForOf}), so an iterable (including a string or an array) is
 * processed using its iterator (a string by its code points, which (since 0.20.0) are also emulated on a runtime
 * without `Symbol.iterator`, eg. IE) and an iterator which is not iterable is used as-is. Unlike `for...of` (and
 * iterForOf, which only also processes an array and a string) any other array-like which is not iterable (eg.
 * `{ length: 2, 0: "a", 1: "b" }`, or `arguments` on a runtime without `Symbol.iterator`) is processed using its
 * indexes, and a `Map` or `Set` which is not iterable (eg. on IE 11) using a copy of its `[key, value]` entries /
 * values.
 * @since 0.15.0
 * @group Iterator
 * @throws TypeError when the value's `[Symbol.iterator]` isn't `null`, `undefined` or a function, when its
 * `[Symbol.iterator]()` doesn't return an iterator, or the iterator's `next()` returns a value which is not an object,
 * or when the iterator is empty and there is no initialValue
 * @example
 * ```ts
 * iterReduce([1, 2, 3, 4], (prev, value) => (prev as number) + value, 0); // 10
 * iterReduce([4, 9, 2], (prev, value) => (prev as number) > value ? (prev as number) : value); // 9
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterReduce<T, R = T>(iter: Iterator<T> | Iterable<T>, callbackfn: IterReduceCallbackFn<T, R>, initialValue?: T | R): R {
    let source = _asIterator(iter);

    // Like the native reduce() the callbackfn is checked once the value's iterator has been resolved, before any value
    // is read (closing the source when it isn't a function)
    _throwIfNotIterCallbackFn(callbackfn, source);
    let hasAccumulator = arguments[LENGTH] > 2;
    let accumulator = initialValue as T | R;

    _iterForOf(source.i, (value, count) => {
        if (!hasAccumulator) {
            accumulator = value;
            hasAccumulator = true;
        } else {
            accumulator = callbackfn(accumulator, value, count, source.i);
        }
    }, UNDEF_VALUE, source);

    if (!hasAccumulator) {
        throwTypeError("Reduce of empty iterator with no initial value");
    }

    return accumulator as R;
}
