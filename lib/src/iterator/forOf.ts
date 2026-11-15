/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ICachedValue, createCachedValue } from "../helpers/cache";
import { isFunction, isPrimitive, isStrictNullOrUndefined } from "../helpers/base";
import { safe } from "../helpers/safe";
import { throwTypeError } from "../helpers/throw";
import { CALL } from "../internal/constants";
import { getKnownSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";
import { isIterator } from "./iterator";

let _iterSymbol: ICachedValue<symbol>;

/**
 * @internal
 * @ignore
 * Closes the iterator, by calling its `return()` function (if it has one) with no arguments like for...of.
 * @param iter - The iterator to close
 */
function _closeIter(iter: any): void {
    iter.return && iter.return();
}

/**
 * Calls the provided `callbackFn` function once for each element in the iterator or iterator returned by
 * the iterable and processed in the same order as returned by the iterator. As with the `arrForEach()`
 * you CAN stop / break the iteration by returning -1 from the`callbackFn` function.
 *
 * The order of processing is not reset if you add or remove elements to the iterator, the actual behavior
 * will depend on the iterator imeplementation.
 *
 * Like `for...of`:
 * - An iterable is processed using the iterator returned by its `[Symbol.iterator]()`, even when it is also an
 * iterator (has a `next()` function), and only an iterator which is not iterable is used as-is. The built-in
 * iterators and generators return themselves, while an object such as a jQuery collection (which has a `next()`
 * function that is not an iterator function) is processed using its iterator.
 * - When the iteration stops before the iterator is done, because the `callbackFn` returns -1 or throws, the
 * iterator is closed by calling its `return()` function (if any), so a generator's `finally` block is run. The
 * error thrown by the `callbackFn` is then re-thrown (rather than any error thrown by `return()`). The iterator is
 * not closed when the iterator itself throws.
 * - A `TypeError` is thrown when `next()` returns a value which is not an object.
 * @remarks
 * If Symbols are NOT supported then the iterable MUST be using the same polyFill for the well know symbols,
 * if you are targetting a mixed environment you SHOULD either
 * - only use the polyfill Symbol's provided by this library
 * - ensure that you add any symbol polyfills BEFORE these utilities
 * iterForOf expects a `synchronous` function.
 * iterForOf does not wait for promises. Make sure you are aware of the implications while using
 * promises (or async functions) as forEach callback.
 *
 * @since 0.4.2
 * @group Iterator
 * @typeParam T - Identifies the element type of the iterator
 * @param callbackfn - A `synchronous` function that accepts up to three arguments. iterForOf calls the
 * callbackfn function one time for each element returned by the iterator.
 * @param thisArg - An object to which the this keyword can refer in the callbackfn function. If thisArg is
 * omitted, null or undefined the iterator will be used as the this value.
 * @throws Any exception thrown while processing the iterator
 * @throws TypeError when the iterator's `next()` returns a value which is not an object
 * @example
 * ```ts
 * const items = {
 *     'item1': 'value1',
 *     'item2': 'value2',
 *     'item3': 'value3
 * };
 * const copyItems = [];
 *
 * iterForOf(items, (item) => {
 *   copyItems.push(item);
 *   // May return -1 to abort the iteration
 * });
 * ```
 */
export function iterForOf<T>(iter: Iterator<T> | Iterable<T>, callbackfn: (value: T, count?: number, iter?: Iterator<T>) => void | number, thisArg?: any): void {
    if (iter) {
        !_iterSymbol && (_iterSymbol = createCachedValue(getKnownSymbol(WellKnownSymbols.iterator)));

        // Like for...of, an iterable (even when it also has a next() function) is processed using the iterator
        // returned by its [Symbol.iterator](), and only an iterator which is not iterable is used as-is
        if (isFunction((iter as any)[_iterSymbol.v])) {
            iter = (iter as any)[_iterSymbol.v]();
        }

        if (isIterator(iter)) {
            let count = 0;
            let iterResult: IteratorResult<T>;
            let value: T;

            // Only set while the callbackfn is processing a value, so (like for...of) the iterator is closed when the
            // callbackfn throws or stops the iteration (returns -1), but not when the iterator itself throws, returns
            // a result which is not an object or is done
            let closeIter = false;
            try {
                for (;;) {
                    iterResult = iter.next();
                    if (isPrimitive(iterResult)) {
                        throwTypeError("Iterator result is not an object");
                    }

                    if (iterResult.done) {
                        break;
                    }

                    value = iterResult.value;
                    closeIter = true;
                    if (callbackfn[CALL](isStrictNullOrUndefined(thisArg) ? iter : thisArg, value, count++, iter) === -1) {
                        break;
                    }

                    closeIter = false;
                }
            } catch (e) {
                // Like for...of, the error from the callbackfn is thrown rather than any error thrown by return()
                closeIter && safe(_closeIter, [iter]);

                throw e;
            }

            if (closeIter) {
                _closeIter(iter);
            }
        }
    }
}
