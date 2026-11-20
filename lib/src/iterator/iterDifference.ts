/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { arrIncludes } from "../array/includes";
import { iterForOf } from "./forOf";
import { iterToArray } from "./iterToArray";
import { LENGTH } from "../internal/constants";

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
    let excludedValues: T[] = [];

    for (let lp = 1; lp < theArgs[LENGTH]; lp++) {
        iterForOf(theArgs[lp], (value: T) => {
            if (!arrIncludes(excludedValues, value)) {
                excludedValues.push(value);
            }
        });
    }

    let result: T[] = [];
    arrForEach(sourceValues, (value) => {
        if (!arrIncludes(excludedValues, value)) {
            result.push(value);
        }
    });

    return result;
}
