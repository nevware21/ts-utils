/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isArray, isUndefined } from "../helpers/base";
import { isIterator } from "../iterator/iterator";
import { DONE, VALUE } from "../internal/constants";

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
 * @param elms - The item, array of items or an iterable object of items to add to the target
 */
export function arrAppend<T>(target: T[], elms: T | T[] | Iterator<T>): T[] {
    if (!isUndefined(elms) && target) {
        if (isArray(elms)) {
            // This is not just "target.push(elms)" but becomes effectively "target.push(elms[0], elms[1], ...)"
            target.push.apply(target, elms);
        } else if (isIterator<T>(elms)) {
            let value = elms.next();
            while(!value[DONE]) {
                target.push(value[VALUE]);
                value = elms.next();
            }
        } else {
            target.push(elms);
        }
    }

    return target;
}
