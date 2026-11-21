/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArray, isObject, isStrictNullOrUndefined, isUndefined } from "../helpers/base";
import { _getIterKey, _hasNativeIterator, isIterator } from "../iterator/iterator";
import { _getMapSetValues, _iterForOf } from "../iterator/forOf";
import { fnApply, fnCall } from "../funcs/funcs";
import { ArrProto, LENGTH, NULL_VALUE, UNDEF_VALUE } from "../internal/constants";
import { _pushOwnValue } from "../object/define";

/**
 * Appends the `elms` to the `target` where the elms may be an array, a single object
 * or an iterator object
 *
 * An array, an iterator or an iterable (eg. a `Set`) adds each of its values, any other value is added as a single
 * element. On a runtime without `Symbol.iterator` (eg. IE) a `Map` (its `[key, value]` entries) or `Set` (its
 * values) is still added using a copy of its entries / values, but a value which is only iterable where there is
 * `Symbol.iterator` (eg. an `arguments` object or a typed array) is added as a single element, use {@link arrFrom}
 * (eg. `arrAppend(target, arrFrom(arguments))`) to add its values on every runtime.
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
        // Like spread the iterator function is read once (from every value, so an array's own or a replaced
        // Array.prototype one is used) and only a null or undefined one is ignored, any other value is used as the
        // iterator function (so a TypeError is thrown for one which isn't a function)
        let iterKey = _getIterKey();
        let iterFn: any = elms !== NULL_VALUE ? (elms as any)[iterKey] : UNDEF_VALUE;
        let iter: Iterator<T>;
        let values: any[];

        if (isArray(elms) && (iterFn === (ArrProto as any)[iterKey] || isStrictNullOrUndefined(iterFn) || !_hasNativeIterator())) {
            // An array which uses the native array iterator (or which has no iterator function, or any array on a
            // runtime without a native iterator, eg. IE) is not just "target.push(elms)" but becomes effectively
            // "target.push(elms[0], elms[1], ...)"
            fnApply(target.push, target, elms);
        } else {
            if (!isStrictNullOrUndefined(iterFn)) {
                iter = fnCall(iterFn, elms);
            } else if (isIterator<T>(elms)) {
                // An iterator which isn't iterable (eg. on a runtime without Symbol.iterator) is used as-is
                iter = elms;
            } else {
                // A Map or Set which isn't iterable (eg. IE 11, which has no iterator functions) appends a copy of its
                // entries / values, any other value is appended as-is
                values = isObject(elms) && _getMapSetValues(elms);
            }

            if (iter || values) {
                // Like spread every value is read before any are appended, so the target isn't changed when the
                // iterator throws, then each is pushed (so a large iterable can't exceed the argument limit of apply())
                values = values || [];
                iter && _iterForOf(iter, (value) => {
                    _pushOwnValue(values, value);
                });

                for (let idx = 0; idx < values[LENGTH]; idx++) {
                    target.push(values[idx]);
                }
            } else {
                target.push(elms as T);
            }
        }
    }

    return target;
}
