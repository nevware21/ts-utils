/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { isArray, isFunction, isMap, isObject, isPrimitive, isSet, isStrictNullOrUndefined, isString, isStringObject } from "../helpers/base";
import { asString } from "../string/as_string";
import { _checkArrayLength, _toLength } from "../helpers/length";
import { safe } from "../helpers/safe";
import { throwTypeError } from "../helpers/throw";
import { FUNCTION, NULL_VALUE, OBJECT } from "../internal/constants";
import { _pushOwnValue } from "../object/define";
import { _getIterKey, _hasNativeIterator, isIterator } from "./iterator";

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
 * Closes the iterator, by calling its `return()` function (if it has one) with no arguments like for...of, which
 * must return an object. Like for...of only a `null` or `undefined` `return` is ignored, any other value which isn't a
 * function (including a falsy one, eg. `0` or `false`) throws a TypeError (the runtime's own, from calling it)
 * @param iter - The iterator to close
 */
export function _closeIter(iter: any): void {
    let returnFn = iter.return;
    !isStrictNullOrUndefined(returnFn) && _throwIfNotResult(fnCall(returnFn, iter));
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
 * - A `TypeError` is thrown when `[Symbol.iterator]()` doesn't return an iterator, when `next()` returns a value
 * which is not an object, or when `return()` returns a value which is not an object after the `callbackFn` returns -1.
 *
 * Unlike `for...of` (which throws a `TypeError` for a value which isn't iterable) an array which isn't iterable is
 * processed (since 0.20.0) by its indexes, eg. on a runtime without `Symbol.iterator` (such as IE) or an array whose own
 * `[Symbol.iterator]` is `null` or `undefined`, like the native array iterator its values are read as they are iterated
 * (so a value added by the `callbackFn` is also processed). Likewise a `Map` (its `[key, value]` entries) or `Set` (its
 * values) which isn't iterable (eg. on IE 11, which has no iterator functions) is processed (since 0.20.0) using its
 * `forEach()`, as a copy of its entries / values when processing starts (so a value added by the `callbackFn` is not
 * processed). On a runtime without `Symbol.iterator` a string or `String` object is processed by its code points (like
 * the native String iterator). The polyfills (`polyArrFrom` and `polyObjFromEntries`) instead follow the native
 * functions, so they only emulate these iterators on a runtime without `Symbol.iterator`.
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
 * @throws TypeError when `[Symbol.iterator]` is not a function (other than `null` or `undefined`) or doesn't return an
 * iterator, or the iterator's `next()` (or `return()` when the `callbackFn` returns -1) returns a value which is not
 * an object
 * @example
 * ```ts
 * const items = new Set(["value1", "value2", "value3"]);
 * const copyItems = [];
 *
 * iterForOf(items, (item) => {
 *   copyItems.push(item);
 *   // May return -1 to abort the iteration
 * });
 * // copyItems === ["value1", "value2", "value3"]
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
            // An array which isn't iterable (eg. on IE, or its own [Symbol.iterator] is undefined) has its values read by
            // index as they are iterated (like the native array iterator), a Map or Set (eg. IE 11) is processed using a
            // copy of its entries / values and (only on a runtime without Symbol.iterator) a string by its code points
            // (like the String iterator). Unlike for...of (which throws a TypeError) any other value isn't processed
            let values = _getEmulatedStrValues(iter) || (isArray(iter) ? iter : _getMapSetValues(iter));
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
 * a value which has a `forEach()` function (so an object with a `Symbol.toStringTag` of "Map" isn't processed). The
 * helpers (eg. iterForOf) use it for a Map or Set which isn't iterable on every runtime, while the polyfills
 * (polyArrFrom and polyObjFromEntries) only use it on a runtime without a native Symbol.iterator, like the native
 * functions.
 * @param value - The value to get the entries / values of
 * @param cb - When given (by the polyfills), each entry / value is passed to it as it is read (like the native Map and
 * Set iterators, which read the values live, so a value which the callback adds or deletes is or isn't read), rather
 * than being copied
 * @returns A new array of the entries of a Map or the values of a Set (empty when the cb is given), otherwise null
 */
export function _getMapSetValues(value: any, cb?: (value: any) => void): any[] | null {
    let values: any[] = NULL_VALUE;
    let isMapValue: boolean;

    // An object which is only identified as a Map or Set (eg. by its Symbol.toStringTag) without a forEach() function
    // isn't one, so (like a value which isn't iterable) it has no values. The value is identified before its forEach is
    // read, so (like the native functions) an array-like's own forEach (eg. a getter) isn't read
    if (((isMapValue = isMap(value)) || isSet(value)) && isFunction(value.forEach)) {
        values = [];
        value.forEach((theValue: any, key: any) => {
            let entry = isMapValue ? [key, theValue] : theValue;

            // Like polyArrFrom each value is added as an own property, so an Array.prototype setter doesn't stop it
            cb ? cb(entry) : _pushOwnValue(values, entry);
        });
    }

    return values;
}

/**
 * @internal
 * @ignore
 * Without a native iterator (eg. IE) returns the values of a string or String object which the native String iterator
 * would return: the string (converted like the String iterator, so a String object's own toString() is used) split into
 * its code points (each surrogate pair, or any other single code unit, including an unpaired surrogate), otherwise (and
 * for any other value) null
 * @param value - The value
 * @returns The code points of the string, or null
 */
/*#__NO_SIDE_EFFECTS__*/
export function _getEmulatedStrValues(value: any): string[] | null {
    // Only a string or an object is checked (so the other values don't check for the native iterator), and the native
    // iterator is checked before an object is identified, so where there is one an object isn't read (eg. its
    // Symbol.toStringTag)
    let isStr = isString(value);

    return (isStr || isObject(value)) && !_hasNativeIterator.v && (isStr || isStringObject(value)) ?
        (asString(value).match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || []) : NULL_VALUE;
}

/**
 * @internal
 * @ignore
 * Creates an iterator which (like the native array iterator) reads the values of an array or array-like by index as they
 * are iterated, so a value added while it is iterated is also returned. It is used for an array (or array-like) which
 * isn't iterable, eg. on a runtime without Symbol.iterator. Like the native functions the length is converted to an
 * integer (a fraction is truncated, and NaN or a negative length is 0), and (like `Array.from()`) a length which is
 * longer than an array can be (2^32 - 1) throws a RangeError rather than (effectively) never ending. Like the native
 * array iterator the index is read before the length and moves before the value is read (so a length getter or a value
 * getter which calls next() doesn't change the value this returns), and once it is done it stays done. As the iterator
 * protocol allows, a result which isn't done has no done property and the done result has no value.
 * @param values - The array or array-like to read
 * @returns The iterator
 */
/*#__NO_SIDE_EFFECTS__*/
export function _createIndexIterator<T>(values: ArrayLike<T>): Iterator<T> {
    let idx = 0;

    return {
        next: () => {
            let index = idx;
            let theValues = values;
            if (theValues && index < _checkArrayLength(_toLength(theValues))) {
                values = theValues;
                idx = index + 1;
                return { value: theValues[index] } as IteratorResult<T>;
            }

            values = NULL_VALUE;
            return { done: true } as IteratorResult<T>;
        }
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
 * @param source - The iterator helper's source (from _asIterator), whose next() has already been read, so (like the
 * native GetIteratorDirect) it isn't read again, even when it isn't a function (calling it throws a TypeError)
 */
export function _iterForOf<T>(iter: Iterator<T>, callbackfn: (value: T, count?: number, iter?: Iterator<T>) => void | number, thisArg?: any, source?: { n: Iterator<T>["next"] }): void {
    let count = 0;
    let iterResult: IteratorResult<T>;
    let value: T;

    // Only set while the callbackfn is processing a value, so (like for...of) the iterator is closed when the
    // callbackfn throws or stops the iteration (returns -1), but not when the iterator itself throws, returns
    // a result which is not an object or is done. A TypeError is thrown when the iterator is not an object with a
    // next() function (eg. when the [Symbol.iterator]() of an iterable doesn't return an iterator)
    let closeIter = false;

    // Like for...of the iterator must be an object, whose next() is read once (and called for every value)
    _throwIfNotResult(iter);
    let nextFn = source ? source.n : iter.next;
    try {
        for (;;) {
            iterResult = fnCall(nextFn, iter);

            // The result is checked inline (only calling _throwIfNotResult to throw the TypeError when it isn't an
            // object), as a call for every value is noticeably slower (eg. for a generator)
            let resultType = typeof iterResult;
            if (!iterResult || (resultType !== OBJECT && resultType !== FUNCTION)) {
                _throwIfNotResult(iterResult);
            }

            if (iterResult.done) {
                break;
            }

            // The callbackfn is called with the intrinsic call (not its own, or a replaced Function.prototype.call)
            value = iterResult.value;
            closeIter = true;
            if (fnCall(callbackfn, isStrictNullOrUndefined(thisArg) ? iter : thisArg, value, count++, iter) === -1) {
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
