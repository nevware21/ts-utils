/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { createIterableIterator } from "./create";
import { _asIterator, _doIteratorReturn, _getIteratorThisArg } from "./helpers";
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
    let isDone = false;

    return createIterableIterator<R>({
        n: function() {
            if (!isDone) {
                let next = source.next();
                isDone = !!next.done;
                if (!isDone) {
                    this.v = fnCall(callbackfn, _getIteratorThisArg(source, thisArg), next.value, index);
                    index++;
                }
            }

            return isDone;
        },
        r: function(value?: R) {
            return _doIteratorReturn(source, value);
        }
    });
}
