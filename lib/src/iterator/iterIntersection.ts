/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { _arrIntersection } from "../array/intersection";
import { iterToArray } from "./iterToArray";
import { LENGTH } from "../internal/constants";

/**
 * Returns values that are present in every provided iterator / iterable.
 * @since 0.15.0
 * @group Iterator
 * @throws TypeError when a value's `[Symbol.iterator]` isn't `null`, `undefined` or a function, its
 * `[Symbol.iterator]()` doesn't return an iterator, or the iterator's `next()` returns a value which is not an object
 * @example
 * ```ts
 * iterIntersection([1, 2, 3, 4], [2, 4, 6], [0, 2, 4]); // [2, 4]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterIntersection<T>(...iters: Array<Iterator<T> | Iterable<T>>): T[];

/*#__NO_SIDE_EFFECTS__*/
export function iterIntersection<T>(): T[] {
    // The iterators are only read, so the arguments are used rather than copied into a new array
    let iters: ArrayLike<Iterator<T> | Iterable<T>> = arguments;
    let values: T[][] = [];

    // Every value is read (in order) before they are compared
    for (let lp = 0; lp < iters[LENGTH]; lp++) {
        values.push(iterToArray(iters[lp]));
    }

    return _arrIntersection(values);
}
