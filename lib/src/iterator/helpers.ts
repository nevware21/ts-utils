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
import { UNDEF_VALUE } from "../internal/constants";
import { _throwIfNotCallbackFn } from "../internal/throwIf";
import { createIterableIterator, CreateIteratorContext } from "./create";
import { _closeIter, _createIndexIterator, _getEmulatedStrValues, _getMapSetValues, _throwIfNotResult } from "./forOf";
import { _getIterKey } from "./iterator";

/**
 * @internal
 * @ignore
 * The iterator which is processed (eg. by an iterator helper) and its next(), which (like the native GetIteratorDirect)
 * is only read once
 */
export interface _IterSource<T> {
    /**
     * The iterator
     */
    i: Iterator<T>;

    /**
     * The iterator's next()
     */
    n: Iterator<T>["next"];
}

export function _asIterator<T>(iter: Iterator<T> | Iterable<T> | ArrayLike<T>): _IterSource<T> {
    let theIter: Iterator<T>;
    let nextFn: Iterator<T>["next"];

    // Like for...of (and iterForOf), an iterable is processed using the iterator returned by its [Symbol.iterator]()
    // (which is only read once), even when it is also an array-like (eg. a string is processed by its code points, which
    // are also emulated on a runtime without Symbol.iterator) or has a next() function (eg. a jQuery collection), and
    // only an iterator which is not iterable is used as-is.
    // Like Array.from() (and iterForOf / polyArrFrom) only a null or undefined [Symbol.iterator] is ignored, any
    // other value which isn't a function throws a TypeError (the runtime's own, from calling it) rather than the
    // value being used as an iterator or array-like
    let iteratorFn = !isStrictNullOrUndefined(iter) ? (iter as any)[_getIterKey()] : UNDEF_VALUE;
    if (!isStrictNullOrUndefined(iteratorFn)) {
        theIter = fnCall(iteratorFn, iter);
    } else if (iter && isFunction(nextFn = (iter as any).next)) {
        // An iterator which is not iterable is used as-is, with the next() which identified it
        theIter = iter as Iterator<T>;
    } else {
        // On a runtime without Symbol.iterator a string is processed by its code points (like the String iterator), an
        // array-like which is not iterable (eg. an array on a runtime without Symbol.iterator) is processed using its
        // indexes (like the native array iterator they are read as they are iterated), a Map or Set which is not
        // iterable (eg. on IE 11) using a copy of its entries / values, and any other value (including null or
        // undefined) has no values
        theIter = _createIndexIterator(_getEmulatedStrValues(iter) || (isArrayLike(iter) ? iter : _getMapSetValues(iter)) || []);
    }

    // Like the native GetIteratorFlattenable the iterator must be an object, and (like GetIteratorDirect) its next() is
    // then read once. The `next` which was read is only used when it identified the value as an iterator (an array-like
    // can have a `next` which is not a function, eg. `{ length: 1, 0: "a", next: 5 }`)
    _throwIfNotResult(theIter);

    return {
        i: theIter,
        n: isFunction(nextFn) ? nextFn : theIter.next
    };
}

/**
 * @internal
 * @ignore
 * Throws a TypeError when the callbackfn isn't a function, once the value's iterator has been resolved (like
 * Iterator.from()) and before any value is read. Like the native iterator helpers (which close the iterator when an
 * argument isn't valid) the source is closed first, and an error from its return() is ignored (the TypeError is thrown)
 * @param callbackfn - The callbackfn to check
 * @param source - The source iterator (and its next())
 */
export function _throwIfNotIterCallbackFn(callbackfn: any, source: _IterSource<any>): void {
    if (!isFunction(callbackfn)) {
        safe(_closeIter, [source.i]);
        _throwIfNotCallbackFn(callbackfn);
    }
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
 * the helper isn't already done, and its result is `{ value: undefined, done: true }` (the value passed to it is
 * ignored).
 * - A TypeError is thrown when its next() or return() is called while it is running (eg. from its callbackfn).
 * @param source - The source iterator (closed by the helper's return()) and its next()
 * @param step - Processes the next value, setting the value of the context (`ctx.v`) and returning true when the
 * helper is done
 * @returns The new iterable iterator
 */
export function _createIterHelper<T, R>(source: _IterSource<T>, step: (ctx: CreateIteratorContext<R>, next: () => IteratorResult<T>) => boolean): IterableIterator<R> {
    let isDone: boolean;
    let isRunning: boolean;

    // Like the native iterator helpers (GetIteratorDirect) the source's next() is read once (by _asIterator(), when the
    // helper is created), and the step is passed a function which calls it (throwing a TypeError for a result which is
    // not an object)
    let iter = source.i;
    let nextFn = source.n;
    let next = () => {
        let result = fnCall(nextFn, iter);
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
        r: function() {
            _throwIfRunning();
            if (!isDone) {
                isDone = true;
                _closeIter(iter);
            }

            // Like the native %IteratorHelperPrototype%.return() the result's value is undefined
            return UNDEF_VALUE;
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
