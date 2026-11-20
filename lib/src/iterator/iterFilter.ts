/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { _asIterator, _callIterFn, _createIterHelper, _iterNext } from "./helpers";
import { IterPredicateCallbackFn } from "./types";

/**
 * Creates a lazily filtered iterable iterator.
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

    return _createIterHelper<T, T>(source, (ctx) => {
        for (;;) {
            let next = _iterNext(source);
            if (next.done) {
                return true;
            }

            // The value is only read once
            let value = next.value;
            if (_callIterFn(source, callbackfn, thisArg, value, index++)) {
                ctx.v = value;
                return false;
            }
        }
    });
}
