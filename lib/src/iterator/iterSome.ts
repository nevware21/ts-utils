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
 * Tests whether at least one value in the iterator / iterable matches the predicate.
 * @since 0.15.0
 * @group Iterator
 * @example
 * ```ts
 * iterSome([1, 3, 5, 8], (value) => value % 2 === 0); // true
 * iterSome([1, 3, 5], (value) => value % 2 === 0);    // false
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterSome<T>(iter: Iterator<T> | Iterable<T>, callbackfn: IterPredicateCallbackFn<T>, thisArg?: any): boolean {
    let source = _asIterator(iter);
    let matched = false;

    iterForOf(source, (value, count) => {
        if (fnCall(callbackfn, _getIteratorThisArg(source, thisArg), value, count)) {
            matched = true;
            return -1;
        }
    });

    return matched;
}
