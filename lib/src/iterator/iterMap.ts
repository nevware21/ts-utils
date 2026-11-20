/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { _asIterator, _callIterFn, _createIterHelper, _iterNext } from "./helpers";
import { IterMapCallbackFn } from "./types";

/**
 * Creates a lazily mapped iterable iterator.
 * @since 0.15.0
 * @group Iterator
 * @example
 * ```ts
 * const mapped = iterMap([1, 2, 3], (value) => value * 10);
 * iterToArray(mapped); // [10, 20, 30]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterMap<T, R = T>(iter: Iterator<T> | Iterable<T>, callbackfn: IterMapCallbackFn<T, R>, thisArg?: any): IterableIterator<R> {
    let source = _asIterator(iter);
    let index = 0;

    return _createIterHelper<T, R>(source, (ctx) => {
        // Like the native helper the result's done (and value) is only read once
        let next = _iterNext(source);
        if (next.done) {
            return true;
        }

        ctx.v = _callIterFn(source, callbackfn, thisArg, next.value, index++);
        return false;
    });
}
