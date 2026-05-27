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
    let isDone = false;

    return createIterableIterator<T>({
        n: function() {
            let hasValue = false;
            while (!isDone && !hasValue) {
                let next = source.next();
                isDone = !!next.done;
                if (!isDone) {
                    hasValue = !!fnCall(callbackfn, _getIteratorThisArg(source, thisArg), next.value, index);
                    if (hasValue) {
                        this.v = next.value;
                    }

                    index++;
                }
            }

            return !hasValue;
        },
        r: function(value?: T) {
            return _doIteratorReturn(source, value);
        }
    });
}
