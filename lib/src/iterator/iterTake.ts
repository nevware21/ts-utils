/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { _closeIter } from "./forOf";
import { _asIterator, _createIterHelper } from "./helpers";
import { mathFloor } from "../math/floor";

/**
 * Creates a lazy iterator that yields at most `count` values.
 * The value is processed like `for...of` (and {@link iterForOf}), so an iterable (including a string or an array) is
 * processed using its iterator (a string by its code points on a runtime which supports `Symbol.iterator`) and an
 * iterator which is not iterable is used as-is. Unlike `for...of` (and iterForOf, which only also processes an array)
 * any other array-like which is not iterable (eg. `{ length: 2, 0: "a", 1: "b" }`, or `arguments` or a string on a
 * runtime without `Symbol.iterator`) is processed using its indexes. A `Map` or `Set` which is not iterable (eg. on
 * IE 11) is processed using a copy of its `[key, value]` entries / values, which is made when this is called (rather
 * than when the first value is read), so a value added after that is not processed.
 * Like the native iterator helpers a TypeError is thrown when the source's `next()` returns a value which is not an
 * object, the source is closed (by calling its `return()` with no arguments) once the count is reached, it is done
 * once the source throws, and its `return()` only closes the source when it isn't already done. Unlike the native
 * `take()`, a negative or `NaN` count is used as 0 (so the source is closed by the first `next()`) rather than throwing
 * a `RangeError` when it is created, and a fractional count is truncated.
 * @throws TypeError when it is created if the value's `[Symbol.iterator]` isn't `null`, `undefined` or a function, from
 * its `next()` (the iterator isn't checked when it is created) when the value's `[Symbol.iterator]()` doesn't return an
 * iterator or the source's `next()` (or `return()`, when the count is reached) returns a value which is not an object,
 * and from its `return()` when the source's `return()` returns a value which is not an object
 * @since 0.15.0
 * @group Iterator
 * @example
 * ```ts
 * const firstThree = iterTake([10, 20, 30, 40, 50], 3);
 * iterToArray(firstThree); // [10, 20, 30]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterTake<T>(iter: Iterator<T> | Iterable<T>, count: number): IterableIterator<T> {
    let source = _asIterator(iter);
    let remaining = count > 0 ? mathFloor(count) : 0;

    return _createIterHelper<T, T>(source, (ctx, next) => {
        if (remaining <= 0) {
            // Like the native take() the source is closed when the count is reached
            _closeIter(source);
            return true;
        }

        // Like the native take() the result's done (and value) is only read once
        let result = next();
        if (result.done) {
            return true;
        }

        ctx.v = result.value;
        remaining--;
        return false;
    });
}
