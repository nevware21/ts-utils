/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { iterForOf } from "./forOf";
import { LENGTH } from "../internal/constants";
import { _createSeenSet } from "../internal/identity_map";

/**
 * Returns unique values from all provided iterators / iterables.
 * @since 0.15.0
 * @group Iterator
 * @throws TypeError when a value's `[Symbol.iterator]` isn't `null`, `undefined` or a function, its
 * `[Symbol.iterator]()` doesn't return an iterator, or the iterator's `next()` returns a value which is not an object
 * @example
 * ```ts
 * iterUnion([1, 2, 3], [3, 4], createRangeIterator(4, 5)); // [1, 2, 3, 4, 5]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterUnion<T>(...iters: Array<Iterator<T> | Iterable<T>>): T[];

/*#__NO_SIDE_EFFECTS__*/
export function iterUnion<T>(): T[] {
    // The iterators are only read, so the arguments are used rather than copied into a new array
    let iters: ArrayLike<Iterator<T> | Iterable<T>> = arguments;
    let result: T[] = [];

    // The values which have been added (compared like arrIncludes(), SameValueZero), so a value is found in the set
    // rather than by searching the result (without a usable Set an object, function or symbol is still searched for)
    let seen = _createSeenSet();

    for (let lp = 0; lp < iters[LENGTH]; lp++) {
        iterForOf(iters[lp], (value) => {
            if (!seen.has(value)) {
                seen.add(value);
                result.push(value);
            }
        });
    }

    return result;
}
