/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { _iterForOf } from "./forOf";
import { _asIterator, _getIteratorThisArg } from "./helpers";
import { IterPredicateCallbackFn } from "./types";

/**
 * Tests whether at least one value in the iterator / iterable matches the predicate.
 * The value is processed like `for...of` (and {@link iterForOf}), so an iterable (including a string or an array) is
 * processed using its iterator (a string by its code points on a runtime which supports `Symbol.iterator`) and an
 * iterator which is not iterable is used as-is. Unlike `for...of` (and iterForOf, which only also processes an array)
 * any other array-like which is not iterable (eg. `{ length: 2, 0: "a", 1: "b" }`, or `arguments` or a string on a
 * runtime without `Symbol.iterator`) is processed using its indexes, and a `Map` or `Set` which is not iterable (eg. on
 * IE 11) using a copy of its `[key, value]` entries / values.
 * @since 0.15.0
 * @group Iterator
 * @throws TypeError when the value's `[Symbol.iterator]` isn't `null`, `undefined` or a function, when its
 * `[Symbol.iterator]()` doesn't return an iterator, or the iterator's `next()` returns a value which is not an object,
 * or (like `for...of`) when it stops early and the iterator's `return()` doesn't return an object
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

    _iterForOf(source, (value, count) => {
        if (fnCall(callbackfn, _getIteratorThisArg(source, thisArg), value, count)) {
            matched = true;
            return -1;
        }
    });

    return matched;
}
