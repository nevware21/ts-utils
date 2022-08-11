/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { getKnownSymbol, hasSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";
import { isFunction, isStrictNullOrUndefined } from "./base";

/**
 * Checks if the type of value looks like an iterator instance (contains a next function).
 * @group Type Identity
 * @group Iterator
 * @typeParam T - Identifies the return type of the iterator defaults to any
 * @param value - The value to be checked
 * @returns {boolean} True if the value is an Iterator, otherwise false
 */
export function isIterator<T = any>(value: any): value is Iterator<T> {
    return !!value && isFunction(value.next);
}

/**
 * Checks if the value looks like it is iterable, contains a [symbol.iterator] if `symbols`
 * are supported or `isIterator(value)` is `symbols` are not supported
 * @group Type Identity
 * @group Iterator
 * @typeParam T - Identifies the return type of the iterator
 * @param value - The value to be checked
 * @returns {boolean} True if the value is an Iterable, otherwise false
 */
export function isIterable<T = any>(value: any): value is Iterable<T> {
    return !isStrictNullOrUndefined(value) && (hasSymbol() ? isFunction(value[getKnownSymbol(WellKnownSymbols.iterator)]) : isIterator(value));
}