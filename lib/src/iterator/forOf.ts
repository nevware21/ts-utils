/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { DONE, VALUE } from "../internal/constants";
import { getKnownSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";
import { isIterator } from "./iterator";

/**
 * Calls the provided `callbackFn` function once for each element in the iterator or iterator returned by
 * the iterable and processed in the same order as returned by the iterator. And withthe {@link arrForEach}
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
            let itSymbol = getKnownSymbol(WellKnownSymbols.iterator);
            iter = iter[itSymbol] ? iter[itSymbol]() : null;
        }
        
        if (isIterator(iter)) {
            try {
                let count = 0;
                let value = iter.next();
                while(!value[DONE]) {
                    if (callbackfn.call(thisArg || iter, value[VALUE], count, iter) === -1) {
                        break;
                    }
        
                    count++;
                    value = iter.next();
                }

                iter.return && iter.return(value);
            } catch (e) {
                iter.throw && iter.throw(e);
            }
        }
    }
}
