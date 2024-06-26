/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ICachedValue, createCachedValue } from "../helpers/cache";
import { CALL, NULL_VALUE, UNDEF_VALUE } from "../internal/constants";
import { getKnownSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";
import { isIterator } from "./iterator";

let _iterSymbol: ICachedValue<symbol>;

/**
 * Calls the provided `callbackFn` function once for each element in the iterator or iterator returned by
 * the iterable and processed in the same order as returned by the iterator. As with the {@link arrForEach}
 * you CAN stop / break the iteration by returning -1 from the`callbackFn` function.
 *
 * The order of processing is not reset if you add or remove elements to the iterator, the actual behavior
 * will depend on the iterator imeplementation.
 *
 * If the passed `iter` is both an Iterable<T> and Iterator<T> the Iterator<T> interface takes preceedence.
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
 * @param callbackfn A `synchronous` function that accepts up to three arguments. iterForOf calls the
 * callbackfn function one time for each element returned by the iterator.
 * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is
 * omitted, null or undefined the iterator will be used as the this value.
 * @throws Any exception thrown while processing the iterator
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
        if (!isIterator(iter)) {
            !_iterSymbol && (_iterSymbol = createCachedValue(getKnownSymbol(WellKnownSymbols.iterator)));
            iter = iter[_iterSymbol.v] ? iter[_iterSymbol.v]() : null;
        }
        
        if (isIterator(iter)) {
            let err: { e: any } = UNDEF_VALUE
            let iterResult: IteratorResult<T> = UNDEF_VALUE
            try {
                let count = 0;
                while(!(iterResult = iter.next()).done) {
                    if (callbackfn[CALL](thisArg || iter, iterResult.value, count, iter) === -1) {
                        break;
                    }
        
                    count++;
                }
            } catch (failed) {
                err = { e: failed };
                if (iter.throw) {
                    iterResult = NULL_VALUE;
                    iter.throw(err);
                }
            } finally {
                try {
                    if (iterResult && !iterResult.done) {
                        iter.return && iter.return(iterResult);
                    }
                } finally {
                    if (err) {
                        // eslint-disable-next-line no-unsafe-finally
                        throw err.e;
                    }
                }
            }
        }
    }
}
