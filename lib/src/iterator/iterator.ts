/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { getKnownSymbol, hasSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";
import { isFunction, isStrictNullOrUndefined } from "../helpers/base";

/**
 * Checks if the type of value looks like an iterator instance (contains a next function).
 *
 * @since 0.4.0
 * @group Type Identity
 * @group Iterator
 * @typeParam T - Identifies the return type of the iterator defaults to any
 * @param value - The value to be checked
 * @returns {boolean} True if the value is an Iterator, otherwise false
 * @example
 * ```ts
 * isIterator(null);        // false
 * isIterator(undefined);   // false
 * isIterator("null");      // false (Strings are iterable but not iterators)
 * isIterator([]);          // false (Arrays are iterable but not iterators)
 * isIterator({
 *     next: function() { return true }
 * });                      // true, iterators must contain a "next" function
 * ```
 */
export function isIterator<T = any>(value: any): value is Iterator<T> {
    return !!value && isFunction(value.next);
}

/**
 * Checks if the value looks like it is iterable, contains a [symbol.iterator].
 *
 * @since 0.4.0
 * @group Type Identity
 * @group Iterator
 * @typeParam T - Identifies the return type of the iterator
 * @param value - The value to be checked
 * @returns {boolean} True if the value is an Iterable, otherwise false
 * @example
 * ```ts
 * isIterable(null);        // false
 * isIterable(undefined);   // false
 * isIterable("null");      // true (Strings are iterable)
 * isIterable([]);          // true (Arrays are iterable)
 * ```
 */
export function isIterable<T = any>(value: any): value is Iterable<T> {
    return !isStrictNullOrUndefined(value) && isFunction(value[getKnownSymbol(WellKnownSymbols.iterator)]);
}