/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrIncludes } from "../array/includes";
import { iterForOf } from "./forOf";

/**
 * Returns unique values from all provided iterators / iterables.
 * @since 0.15.0
 * @group Iterator
 * @example
 * ```ts
 * iterUnion([1, 2, 3], [3, 4], createRangeIterator(4, 5)); // [1, 2, 3, 4, 5]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterUnion<T>(...iters: Array<Iterator<T> | Iterable<T>>): T[] {
    let result: T[] = [];

    for (let lp = 0; lp < iters.length; lp++) {
        iterForOf(iters[lp], (value) => {
            if (!arrIncludes(result, value)) {
                result.push(value);
            }
        });
    }

    return result;
}
