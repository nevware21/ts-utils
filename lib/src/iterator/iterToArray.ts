/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { isFunction } from "../helpers/base";
import { UNDEF_VALUE } from "../internal/constants";
import { _iterForOf } from "./forOf";
import { _pushOwnValue } from "../object/define";
import { _asIterator, _getIteratorThisArg } from "./helpers";
import { IterMapCallbackFn } from "./types";

/**
 * Materializes an iterator / iterable / array-like value as an array.
 * The value is processed like `for...of` (and {@link iterForOf}), so an iterable (including a string or an array) is
 * processed using its iterator (a string by its code points, which (since 0.20.0) are also emulated on a runtime
 * without `Symbol.iterator`, eg. IE) and an iterator which is not iterable is used as-is. Unlike `for...of` (and
 * iterForOf, which only also processes an array and a string) any other array-like which is not iterable (eg.
 * `{ length: 2, 0: "a", 1: "b" }`, or `arguments` on a runtime without `Symbol.iterator`) is processed using its
 * indexes, and (like iterForOf) a `Map` or `Set` which is not iterable (eg. on IE 11, or one whose own
 * `[Symbol.iterator]` is `null` or `undefined`) returns its `[key, value]` entries / values. Unlike `Array.from()` (and
 * {@link polyArrFrom}, which follows it) this is done on every runtime, where there is `Symbol.iterator` `Array.from()`
 * returns `[]` for such a `Map` or `Set`.
 * @since 0.15.0
 * @group Iterator
 * @throws TypeError when the value's `[Symbol.iterator]` isn't `null`, `undefined` or a function, when its
 * `[Symbol.iterator]()` doesn't return an iterator, or the iterator's `next()` returns a value which is not an object
 * @example
 * ```ts
 * iterToArray(createRangeIterator(1, 3)); // [1, 2, 3]
 * iterToArray([10, 20, 30], (value, idx) => value + idx); // [10, 21, 32]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterToArray<T, R = T>(iter: Iterator<T> | Iterable<T> | ArrayLike<T>, mapFn?: IterMapCallbackFn<T, R>, thisArg?: any): R[] {
    let source = _asIterator(iter);
    let values: R[] = [];

    // Like Array.from() each value is added as an own property, so a setter or read-only property of the same index on
    // Array.prototype (or Object.prototype) doesn't stop it being added
    if (isFunction(mapFn)) {
        _iterForOf(source.i, (value, count) => {
            _pushOwnValue(values, fnCall(mapFn, _getIteratorThisArg(source.i, thisArg), value, count as number));
        }, UNDEF_VALUE, source);
    } else {
        _iterForOf(source.i, (value) => {
            _pushOwnValue(values, value as any as R);
        }, UNDEF_VALUE, source);
    }

    return values;
}
