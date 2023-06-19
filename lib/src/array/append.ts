/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isArray, isUndefined } from "../helpers/base";
import { isIterable, isIterator } from "../iterator/iterator";
import { iterForOf } from "../iterator/forOf";
import { fnApply } from "../funcs/fnApply";

/**
 * Appends the `elms` to the `target` where the elms may be an array, a single object
 * or an iterator object
 * @group Array
 * @group Iterator
 * @example
 * ```ts
 * let theArray = arrAppend([], 1);
 * arrAppend(theArray, [ 2, 3, 4 ]);
 * arrAppend(theArray, [ "a", "b", "c" ]);
 * // theArray is now [ 1, 2, 3, 4, "a", "b", "c" ]
 * ```
 * @param target - The target array
 * @param elms - The item, array of items an iterable or iterator object of items to add to the target
 * @returns The passed in target array
 * @example
 * ```ts
 * // Adding a single value
 * arrAppend([], undefined);            // []
 * arrAppend([], 0);                    // [ 0 ]
 * arrAppend([1], undefined);           // [ 1 ]
 * arrAppend([1], 2);                   // [ 1, 2 ]
 *
 * // Adding an array
 * arrAppend([], [] as number[]);       // []
 * arrAppend([], [0]);                  // [ 0 ]
 * arrAppend([1], []);                  // [ 1 ]
 * arrAppend([1], [2]);                 // [ 1, 2 ]
 *
 * // Adding with an iterator
 * arrAppend([], ([] as number[]).values());    // []
 * arrAppend([], [0].values());         // [ 0 ]
 * arrAppend([1], [].keys());           // [ 1 ]
 * arrAppend([1], [2].values());        // [ 1, 2 ]
 * arrAppend([1], [2].keys());          // [ 1, 0 ] - 0 is from the index from the first element
 * ```
 */
export function arrAppend<T>(target: T[], elms: T | T[] | Iterator<T>): T[] {
    if (!isUndefined(elms) && target) {
        if (isArray(elms)) {
            // This is not just "target.push(elms)" but becomes effectively "target.push(elms[0], elms[1], ...)"
            fnApply(target.push, target, elms);
        } else if (isIterator<T>(elms) || isIterable<T>(elms)) {
            iterForOf(elms, (elm) => {
                target.push(elm);
            });
        } else {
            target.push(elms);
        }
    }

    return target;
}
