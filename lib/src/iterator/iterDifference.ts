/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { iterForOf } from "./forOf";
import { iterToArray } from "./iterToArray";
import { LENGTH } from "../internal/constants";
import { _createSeenSet } from "../internal/identity_map";

/**
 * Returns values from `iter` that are absent from all `excludeIters`.
 * @since 0.15.0
 * @group Iterator
 * @throws TypeError when a value's `[Symbol.iterator]` isn't `null`, `undefined` or a function, its
 * `[Symbol.iterator]()` doesn't return an iterator, or the iterator's `next()` returns a value which is not an object
 * @example
 * ```ts
 * iterDifference([1, 2, 3, 4, 5], [2, 5], [9, 4]); // [1, 3]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterDifference<T>(iter: Iterator<T> | Iterable<T>, ...excludeIters: Array<Iterator<T> | Iterable<T>>): T[];

/*#__NO_SIDE_EFFECTS__*/
export function iterDifference<T>(iter: Iterator<T> | Iterable<T>): T[] {
    // The iterators to exclude are the arguments after iter, which are only read so they are not copied into a new array
    let theArgs = arguments;
    let sourceValues = iterToArray(iter);

    // The excluded values (compared like arrIncludes(), SameValueZero), so a source value is found in the set rather
    // than by searching every excluded value (without a usable Set an object, function or symbol is still searched for)
    let excluded = _createSeenSet();

    for (let lp = 1; lp < theArgs[LENGTH]; lp++) {
        iterForOf(theArgs[lp], (value: T) => {
            // Without a usable Set an object, function or symbol is added without searching for it, so adding many
            // isn't quadratic, but one which is repeated is stored (and searched) again
            excluded.add(value);
        });
    }

    let result: T[] = [];
    arrForEach(sourceValues, (value) => {
        !excluded.has(value) && result.push(value);
    });

    return result;
}
