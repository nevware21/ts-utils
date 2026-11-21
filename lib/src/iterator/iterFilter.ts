/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { _asIterator, _callIterFn, _createIterHelper } from "./helpers";
import { IterPredicateCallbackFn } from "./types";

/**
 * Creates a lazily filtered iterable iterator.
 * The value is processed like `for...of` (and {@link iterForOf}), so an iterable (including a string or an array) is
 * processed using its iterator (a string by its code points on a runtime which supports `Symbol.iterator`) and an
 * iterator which is not iterable is used as-is. Unlike `for...of` (and iterForOf, which only also processes an array)
 * any other array-like which is not iterable (eg. `{ length: 2, 0: "a", 1: "b" }`, or `arguments` or a string on a
 * runtime without `Symbol.iterator`) is processed using its indexes. A `Map` or `Set` which is not iterable (eg. on
 * IE 11) is processed using a copy of its `[key, value]` entries / values, which is made when this is called (rather
 * than when the first value is read), so a value added after that is not processed.
 * Like the native iterator helpers a TypeError is thrown when the source's `next()` returns a value which is not an
 * object, the source is closed (by calling its `return()` with no arguments) when the callbackfn throws, it is done
 * once the source or the callbackfn throws, its `return()` only closes the source when it isn't already done, and a
 * TypeError is thrown when its `next()` or `return()` is called by the callbackfn.
 * @throws TypeError when it is created if the value's `[Symbol.iterator]` isn't `null`, `undefined` or a function, from
 * its `next()` (the iterator isn't checked when it is created) when the value's `[Symbol.iterator]()` doesn't return an
 * iterator or the source's `next()` returns a value which is not an object, from its `return()` when the source's
 * `return()` returns a value which is not an object, and when its `next()` or `return()` is called by the callbackfn
 * @since 0.15.0
 * @group Iterator
 * @example
 * ```ts
 * const filtered = iterFilter([1, 2, 3, 4, 5], (value) => value % 2 === 0);
 * iterToArray(filtered); // [2, 4]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterFilter<T>(iter: Iterator<T> | Iterable<T>, callbackfn: IterPredicateCallbackFn<T>, thisArg?: any): IterableIterator<T> {
    let source = _asIterator(iter);
    let index = 0;

    return _createIterHelper<T, T>(source, (ctx, next) => {
        for (;;) {
            let result = next();
            if (result.done) {
                return true;
            }

            // The value is only read once
            let value = result.value;
            if (_callIterFn(source, callbackfn, thisArg, value, index++)) {
                ctx.v = value;
                return false;
            }
        }
    });
}
