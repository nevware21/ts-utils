/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { iterForOf } from "./forOf";
import { _asIterator, _getIteratorThisArg } from "./helpers";
import { IterPredicateCallbackFn } from "./types";

/**
 * Tests whether all values in the iterator / iterable match the predicate.
 * @since 0.15.0
 * @group Iterator
 * @example
 * ```ts
 * iterEvery([2, 4, 6], (value) => value % 2 === 0); // true
 * iterEvery([2, 3, 6], (value) => value % 2 === 0); // false
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterEvery<T>(iter: Iterator<T> | Iterable<T>, callbackfn: IterPredicateCallbackFn<T>, thisArg?: any): boolean {
    let source = _asIterator(iter);
    let allMatched = true;

    iterForOf(source, (value, count) => {
        if (!fnCall(callbackfn, _getIteratorThisArg(source, thisArg), value, count)) {
            allMatched = false;
            return -1;
        }
    });

    return allMatched;
}
