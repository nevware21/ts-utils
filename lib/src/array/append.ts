/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArray, isUndefined } from "../helpers/base";
import { isIterable, isIterator } from "../iterator/iterator";
import { iterToArray } from "../iterator/iterToArray";
import { fnApply } from "../funcs/funcs";
import { LENGTH } from "../internal/constants";

/**
 * Appends the `elms` to the `target` where the elms may be an array, a single object
 * or an iterator object
 *
 * An array is added by its indexes, an iterator or an iterable (eg. a `Set`) adds each of its values and any other
 * value is added as a single element. Every value of an iterator or iterable is read before any are added (like
 * spread), so the target isn't changed when the iterator throws. The values are added with one `push()` call (like
 * `target.push(...values)`), unless there are more of them than `apply()` accepts as arguments (it throws a
 * `RangeError`), when each value is pushed (since 0.20.0 also for an array, which threw the `RangeError`), any other
 * error (eg. from the target's `push()`) is thrown. A `RangeError` from the target's `push()` (eg. when the target is
 * at the maximum array length, 2^32 - 1) or from an array's index getter can't be told apart from the arguments limit,
 * so the values are then also pushed one at a time (a value which the failed `push()` call already added may be pushed
 * again, and the getter is read again). On a runtime without `Symbol.iterator` (eg. IE) a
 * value which is only iterable where there is `Symbol.iterator` (eg. a `Map`, `Set`, string or `arguments` object) is
 * added as a single element, use {@link arrFrom} (eg. `arrAppend(target, arrFrom(theSet))`) to add its values on every
 * runtime.
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
        let values: T[];
        if (isArray(elms)) {
            values = elms;
        } else if (isIterator<T>(elms) || isIterable<T>(elms)) {
            // Every value is read before any are appended (like spread), so the target isn't changed when the iterator
            // throws, and an iterator of the target (eg. its values()) doesn't also return the values which are appended
            // (which never finishes)
            values = iterToArray(elms);
        }

        if (values) {
            try {
                // This is not just "target.push(values)" but becomes effectively "target.push(values[0], values[1], ...)"
                fnApply(target.push, target, values);
            } catch (e) {
                // Only a RangeError (there are more values than apply() accepts as arguments) pushes each value, any other
                // error (eg. from the target's push() or a value's getter) is thrown, so no value is pushed again. A
                // RangeError from push() itself (eg. a target at the maximum array length) or a getter is also retried, as
                // it can't be told apart (see the TSDoc). Like apply() the length is read once, as the values may be the
                // target
                if (!(e instanceof RangeError)) {
                    throw e;
                }

                for (let idx = 0, len = values[LENGTH]; idx < len; idx++) {
                    target.push(values[idx]);
                }
            }
        } else {
            target.push(elms as T);
        }
    }

    return target;
}
