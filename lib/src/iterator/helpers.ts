/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { isArrayLike, isFunction, isStrictNullOrUndefined } from "../helpers/base";
import { safe } from "../helpers/safe";
import { throwTypeError } from "../helpers/throw";
import { _closeIter, _createIndexIterator, _getMapSetValues, _throwIfNotResult } from "./forOf";
import { _getIterKey, isIterator } from "./iterator";

export function _asIterator<T>(iter: Iterator<T> | Iterable<T> | ArrayLike<T>): Iterator<T> {
    let values: ArrayLike<T>;

    if (!isStrictNullOrUndefined(iter)) {
        // Like for...of (and iterForOf), an iterable is processed using the iterator returned by its [Symbol.iterator]()
        // (which is only read once), even when it is also an array-like (eg. a string is processed by its code points) or
        // has a next() function (eg. a jQuery collection), and only an iterator which is not iterable is used as-is
        let iteratorFn = (iter as any)[_getIterKey()];
        if (isFunction(iteratorFn)) {
            return fnCall(iteratorFn, iter);
        }

        if (isIterator(iter)) {
            return iter;
        }

        // An array-like which is not iterable (eg. on a runtime without Symbol.iterator) is processed using its indexes,
        // and a Map or Set which is not iterable (eg. on IE 11) using a copy of its entries / values
        values = isArrayLike(iter) ? iter : _getMapSetValues(iter);
    }

    // Like the native array iterator the values of an array-like are read as they are iterated (rather than from a copy),
    // and any other value (including null or undefined) has no values
    return _createIndexIterator(values || []);
}

export function _getIteratorThisArg<T>(source: Iterator<T>, thisArg?: any): any {
    return isStrictNullOrUndefined(thisArg) ? source : thisArg;
}

/**
 * @internal
 * @ignore
 * The state of a lazy iterator helper (eg. iterMap, iterFilter and iterTake)
 */
export interface _IterHelperState {
    /**
     * Identifies that the helper is done
     */
    d?: boolean;

    /**
     * Identifies that the helper is running (processing a value), eg. while its callbackfn is called
     */
    r?: boolean;
}

/**
 * @internal
 * @ignore
 * Like the native iterator helpers, throws a TypeError when the helper's next() or return() is called while it is
 * running (eg. from its callbackfn)
 * @param state - The state of the helper
 */
function _throwIfRunning(state: _IterHelperState): void {
    if (state.r) {
        throwTypeError("Iterator is already running");
    }
}

/**
 * @internal
 * @ignore
 * Processes the next() of a lazy iterator helper, like the native iterator helpers it is done once the step throws
 * (eg. the source's next() or the callbackfn throws), and a TypeError is thrown when it is called while it is running
 * @param state - The state of the helper
 * @param step - Processes the next value, returning true when the helper is done
 * @returns true when the helper is done
 */
export function _iterStep(state: _IterHelperState, step: () => boolean): boolean {
    _throwIfRunning(state);
    if (!state.d) {
        state.d = state.r = true;
        try {
            state.d = step();
        } finally {
            state.r = false;
        }
    }

    return state.d;
}

/**
 * @internal
 * @ignore
 * Processes the return() of a lazy iterator helper, like the native iterator helpers the source is only closed (by
 * calling its `return()` with no arguments, which must return an object) when the helper isn't already done
 * @param state - The state of the helper
 * @param source - The source iterator to close
 * @param value - The value to return
 * @returns The value
 */
export function _iterReturn<T, R>(state: _IterHelperState, source: Iterator<T>, value?: R): R | undefined {
    _throwIfRunning(state);
    if (!state.d) {
        state.d = true;
        _closeIter(source);
    }

    return value;
}

/**
 * @internal
 * @ignore
 * Returns the next result of the source iterator, like the native iterator helpers (and iterForOf) a TypeError is thrown
 * when it is not an object (rather than a primitive result being processed, or looping forever)
 * @param source - The source iterator
 * @returns The next result
 */
export function _iterNext<T>(source: Iterator<T>): IteratorResult<T> {
    let result = source.next();
    _throwIfNotResult(result);

    return result;
}

/**
 * @internal
 * @ignore
 * Calls the callbackfn of an iterator helper with a value of the source iterator, like the native iterator helpers the
 * source is closed when the callbackfn throws, and the callbackfn's error is thrown rather than any error thrown by its
 * `return()`
 * @param source - The source iterator
 * @param callbackfn - The function to call
 * @param thisArg - The this value of the callbackfn, the source is used when it is omitted, null or undefined
 * @param value - The value from the source
 * @param index - The index of the value
 * @returns The callbackfn's result
 */
export function _callIterFn<T>(source: Iterator<T>, callbackfn: (...args: any) => any, thisArg: any, value: T, index: number): any {
    try {
        return fnCall(callbackfn, _getIteratorThisArg(source, thisArg), value, index);
    } catch (e) {
        safe(_closeIter, [source]);
        throw e;
    }
}
