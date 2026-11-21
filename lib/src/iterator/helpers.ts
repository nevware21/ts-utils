/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { isArrayLike, isStrictNullOrUndefined } from "../helpers/base";
import { safe } from "../helpers/safe";
import { throwTypeError } from "../helpers/throw";
import { UNDEF_VALUE } from "../internal/constants";
import { createIterableIterator, CreateIteratorContext } from "./create";
import { _closeIter, _createIndexIterator, _getMapSetValues, _throwIfNotResult } from "./forOf";
import { _getIterKey, isIterator } from "./iterator";

export function _asIterator<T>(iter: Iterator<T> | Iterable<T> | ArrayLike<T>): Iterator<T> {
    let values: ArrayLike<T>;

    if (!isStrictNullOrUndefined(iter)) {
        // Like for...of (and iterForOf), an iterable is processed using the iterator returned by its [Symbol.iterator]()
        // (which is only read once), even when it is also an array-like (eg. a string is processed by its code points) or
        // has a next() function (eg. a jQuery collection), and only an iterator which is not iterable is used as-is.
        // Like Array.from() (and iterForOf / polyArrFrom) only a null or undefined [Symbol.iterator] is ignored, any
        // other value which isn't a function throws a TypeError (the runtime's own, from calling it) rather than the
        // value being used as an iterator or array-like
        let iteratorFn = (iter as any)[_getIterKey()];
        if (!isStrictNullOrUndefined(iteratorFn)) {
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
 * Creates a lazy iterator helper (eg. iterMap, iterFilter and iterTake) of the source iterator. Like the native iterator
 * helpers:
 * - Its next() is done once the step throws (eg. the source's next() or the callbackfn throws).
 * - Its return() only closes the source (by calling its `return()` with no arguments, which must return an object) when
 * the helper isn't already done, and returns the value.
 * - A TypeError is thrown when its next() or return() is called while it is running (eg. from its callbackfn).
 * @param source - The source iterator, closed by the helper's return()
 * @param step - Processes the next value, setting the value of the context (`ctx.v`) and returning true when the
 * helper is done
 * @returns The new iterable iterator
 */
export function _createIterHelper<T, R>(source: Iterator<T>, step: (ctx: CreateIteratorContext<R>, next: () => IteratorResult<T>) => boolean): IterableIterator<R> {
    let isDone: boolean;
    let isRunning: boolean;

    // Like the native iterator helpers (GetIteratorDirect) the source's next() is read once, when the helper is created,
    // and the step is passed a function which calls it (throwing a TypeError for a result which is not an object)
    let nextFn = source.next;
    let next = () => {
        let result = fnCall(nextFn, source);
        _throwIfNotResult(result);

        return result;
    };

    function _throwIfRunning(): void {
        if (isRunning) {
            throwTypeError("Iterator is already running");
        }
    }

    // The ctx (the step's ctx) has its own v, so setting it doesn't call an inherited setter (eg. an Object.prototype.v
    // accessor)
    return createIterableIterator<R>({
        v: UNDEF_VALUE,
        n: function() {
            _throwIfRunning();
            if (!isDone) {
                isDone = isRunning = true;
                try {
                    isDone = step(this, next);
                } finally {
                    isRunning = false;
                }
            }

            return isDone;
        },
        r: function(value?: R) {
            _throwIfRunning();
            if (!isDone) {
                isDone = true;
                _closeIter(source);
            }

            return value;
        }
    });
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
