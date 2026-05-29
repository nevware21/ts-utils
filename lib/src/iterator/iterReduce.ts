/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { throwTypeError } from "../helpers/throw";
import { iterForOf } from "./forOf";
import { _asIterator } from "./helpers";
import { IterReduceCallbackFn } from "./types";

/**
 * Reduces an iterator / iterable into a single value.
 * @since 0.15.0
 * @group Iterator
 * @example
 * ```ts
 * iterReduce([1, 2, 3, 4], (prev, value) => (prev as number) + value, 0); // 10
 * iterReduce([4, 9, 2], (prev, value) => (prev as number) > value ? (prev as number) : value); // 9
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterReduce<T, R = T>(iter: Iterator<T> | Iterable<T>, callbackfn: IterReduceCallbackFn<T, R>, initialValue?: T | R): R {
    let source = _asIterator(iter);
    let hasAccumulator = arguments.length > 2;
    let accumulator = initialValue as T | R;

    iterForOf(source, (value, count) => {
        if (!hasAccumulator) {
            accumulator = value;
            hasAccumulator = true;
        } else {
            accumulator = callbackfn(accumulator, value, count, source);
        }
    });

    if (!hasAccumulator) {
        throwTypeError("Reduce of empty iterator with no initial value");
    }

    return accumulator as R;
}
