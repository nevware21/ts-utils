/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { isArray, isFunction, isMap, isPrimitive, isSet, isStrictNullOrUndefined } from "../helpers/base";
import { _toArrayLength } from "../helpers/length";
import { safe } from "../helpers/safe";
import { throwTypeError } from "../helpers/throw";
import { CALL, FUNCTION, NULL_VALUE, OBJECT } from "../internal/constants";
import { _pushOwnValue } from "../object/define";
import { _getIterKey, isIterator } from "./iterator";

/**
 * @internal
 * @ignore
 * Throws a TypeError when the value returned by the iterator's `next()` or `return()` is not an object, like for...of
 * @param result - The value returned by the iterator
 */
export function _throwIfNotResult(result: any): void {
    if (isPrimitive(result)) {
        throwTypeError("Iterator result is not an object");
    }
}

/**
 * @internal
 * @ignore
 * Closes the iterator, by calling its `return()` function (if it has one) with no arguments like for...of.
 * @param iter - The iterator to close
 */
export function _closeIter(iter: any): void {
    let returnFn = iter.return;
    returnFn && _throwIfNotResult(fnCall(returnFn, iter));
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
        // Like for...of, an iterable (even when it also has a next() function) is processed using the iterator returned
        // by its [Symbol.iterator]() (which is only read once), so a TypeError is thrown when that isn't a function (only
        // null or undefined is ignored) or doesn't return an iterator, and only an iterator which is not iterable is used
        // as-is
        let iterFn = (iter as any)[_getIterKey()];
        if (!isStrictNullOrUndefined(iterFn)) {
            _iterForOf(fnCall(iterFn, iter), callbackfn, thisArg);
        } else if (isIterator(iter)) {
            _iterForOf(iter, callbackfn, thisArg);
        } else {
            // On a runtime without Symbol.iterator (eg. IE) an array isn't iterable, so (like the native array iterator,
            // where it is iterable) its values are read by index as they are iterated, and a Map or Set (eg. IE 11) is
            // processed using a copy of its entries / values
            let values = isArray(iter) ? iter : _getMapSetValues(iter);
            values && _iterForOf(_createIndexIterator(values), callbackfn, thisArg);
        }
    }
}

/**
 * @internal
 * @ignore
 * Returns the `[key, value]` entries of a `Map` or the values of a `Set` using its `forEach()`, for a Map or Set which
 * isn't iterable (eg. on IE 11, which has Map and Set without Symbol.iterator or their iterator functions). This is
 * only used when the value isn't iterable, so it doesn't change how an iterable Map or Set is processed, and only for
 * a value which has a `forEach()` function (so an object with a `Symbol.toStringTag` of "Map" isn't processed).
 * @param value - The value to get the entries / values of
 * @returns A new array of the entries of a Map or the values of a Set, otherwise null
 */
export function _getMapSetValues(value: any): any[] | null {
    let values: any[] = NULL_VALUE;
    let isMapValue: boolean;

    // An object which is only identified as a Map or Set (eg. by its Symbol.toStringTag) without a forEach() function
    // isn't one, so (like a value which isn't iterable) it has no values. The forEach() is checked first, as most
    // values don't have one and it's quicker than identifying the value
    if (value && isFunction(value.forEach) && ((isMapValue = isMap(value)) || isSet(value))) {
        values = [];
        value.forEach((theValue: any, key: any) => {
            // Like polyArrFrom each value is added as an own property, so an Array.prototype setter doesn't stop it
            _pushOwnValue(values, isMapValue ? [key, theValue] : theValue);
        });
    }

    return values;
}

/**
 * @internal
 * @ignore
 * Creates an iterator which (like the native array iterator) reads the values of an array or array-like by index as they
 * are iterated, so a value added while it is iterated is also returned. It is used for an array (or array-like) which
 * isn't iterable, eg. on a runtime without Symbol.iterator. Like the native functions the length is converted to an
 * integer (a fraction is truncated, and NaN or a negative length is 0), and (like `Array.from()`) a length which is
 * longer than an array can be (2^32 - 1) throws a RangeError rather than (effectively) never ending. As the iterator
 * protocol allows, a result which isn't done has no done property and the done result has no value.
 * @param values - The array or array-like to read
 * @returns The iterator
 */
/*#__NO_SIDE_EFFECTS__*/
export function _createIndexIterator<T>(values: ArrayLike<T>): Iterator<T> {
    let idx = 0;

    return {
        next: () => (idx < _toArrayLength(values) ? { value: values[idx++] } : { done: true }) as IteratorResult<T>
    };
}

/**
 * @internal
 * @ignore
 * Calls the callbackfn for each value of an iterator which has already been resolved (eg. by calling the
 * `[Symbol.iterator]()` function of an iterable) like for...of, see {@link iterForOf}. Unlike iterForOf the iterator is
 * used as-is (its `[Symbol.iterator]` is not read) and it is not checked, so (like for...of) a TypeError is thrown when
 * it is not an object with a `next()` function.
 * @param iter - The iterator to process
 * @param callbackfn - The function called for each value, it can return -1 to stop the iteration
 * @param thisArg - The this value of the callbackfn, the iterator is used when it is omitted, null or undefined
 */
export function _iterForOf<T>(iter: Iterator<T>, callbackfn: (value: T, count?: number, iter?: Iterator<T>) => void | number, thisArg?: any): void {
    let count = 0;
    let iterResult: IteratorResult<T>;
    let value: T;

    // Only set while the callbackfn is processing a value, so (like for...of) the iterator is closed when the
    // callbackfn throws or stops the iteration (returns -1), but not when the iterator itself throws, returns
    // a result which is not an object or is done. A TypeError is thrown when the iterator is not an object with a
    // next() function (eg. when the [Symbol.iterator]() of an iterable doesn't return an iterator)
    let closeIter = false;
    try {
        for (;;) {
            iterResult = iter.next();

            // The result is checked inline (only calling _throwIfNotResult to throw the TypeError when it isn't an
            // object), as a call for every value is noticeably slower (eg. for a generator)
            let resultType = typeof iterResult;
            if (!iterResult || (resultType !== OBJECT && resultType !== FUNCTION)) {
                _throwIfNotResult(iterResult);
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
        // Like for...of, the error from the callbackfn is thrown rather than any error thrown by return() (including
        // the TypeError for a return() result which is not an object)
        closeIter && safe(_closeIter, [iter]);

        throw e;
    }

    if (closeIter) {
        _closeIter(iter);
    }
}
