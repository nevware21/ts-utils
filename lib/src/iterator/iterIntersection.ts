/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { arrIncludes } from "../array/includes";
import { iterToArray } from "./iterToArray";

/**
 * Returns values that are present in every provided iterator / iterable.
 * @since 0.15.0
 * @group Iterator
 * @example
 * ```ts
 * iterIntersection([1, 2, 3, 4], [2, 4, 6], [0, 2, 4]); // [2, 4]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterIntersection<T>(...iters: Array<Iterator<T> | Iterable<T>>): T[] {
    if (iters.length === 0) {
        return [];
    }

    let result: T[] = [];
    let firstValues = iterToArray(iters[0]);
    let otherValues: T[][] = [];

    for (let lp = 1; lp < iters.length; lp++) {
        otherValues.push(iterToArray(iters[lp]));
    }

    arrForEach(firstValues, (value) => {
        let inAll = true;
        arrForEach(otherValues, (other) => {
            if (!arrIncludes(other, value)) {
                inAll = false;
                return -1;
            }
        });

        if (inAll && !arrIncludes(result, value)) {
            result.push(value);
        }
    });

    return result;
}
