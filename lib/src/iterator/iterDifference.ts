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

/**
 * Returns values from `iter` that are absent from all `excludeIters`.
 * @since 0.15.0
 * @group Iterator
 * @example
 * ```ts
 * iterDifference([1, 2, 3, 4, 5], [2, 5], [9, 4]); // [1, 3]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterDifference<T>(iter: Iterator<T> | Iterable<T>, ...excludeIters: Array<Iterator<T> | Iterable<T>>): T[] {
    let sourceValues = iterToArray(iter);
    let excludedValues: T[] = [];

    arrForEach(excludeIters, (excludeIter) => {
        iterForOf(excludeIter, (value) => {
            if (!arrIncludes(excludedValues, value)) {
                excludedValues.push(value);
            }
        });
    });

    let result: T[] = [];
    arrForEach(sourceValues, (value) => {
        if (!arrIncludes(excludedValues, value)) {
            result.push(value);
        }
    });

    return result;
}
