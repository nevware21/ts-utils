/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrFromMapFn, ArrPredicateCallbackFn, ArrPredicateCallbackFn2 } from "../array/callbacks";
import { isArray, isFunction, isNullOrUndefined, isStrictNullOrUndefined, isString, isStringObject, isStrictUndefined, objToString } from "../helpers/base";
import { dumpObj } from "../helpers/diagnostics";
import { throwTypeError } from "../helpers/throw";
import { DUMP_ERR_MAX_LENGTH, LENGTH, NULL_VALUE, UNDEF_VALUE } from "../internal/constants";
import { asString } from "../string/as_string";
import { _throwIfNotCallbackFn, _throwIfNullOrUndefined, _throwTypeOf, _toObject } from "../internal/throwIf";
import { _checkArrayLength, _toLength, _toRelIndex } from "../helpers/length";
import { fnCall } from "../funcs/funcs";
import { _getMapSetValues, _iterForOf } from "../iterator/forOf";
import { getKnownSymbol, hasSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";
import { _pushOwnValue } from "../object/define";

/**
 * Polyfill support function for Array.isArray
 * @group Polyfill
 * @group Array
 * @param value - The value to be checked
 * @returns true if the value is an array otherwise false.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyIsArray<T>(value: any): value is T[] {
    if (isNullOrUndefined(value)) {
        return false;
    }

    return objToString(value) === "[object Array]";
}

/**
 * The polyArrIncludes() method determines whether an array includes a certain value among its
 * entries, returning true or false as appropriate.
 *
 * Like the native function the values are compared using SameValueZero, which is the same as strict equality
 * (`===`) except that NaN matches NaN, and every index is checked so an empty slot of a sparse array (or a
 * missing index of an array-like object) matches `undefined`.
 * @since 0.8.0
 * @group Array
 * @group Polyfill
 * @param theArray - The array or array like object of elements to be searched.
 * @param searchElement - The value to search for
 * @param fromIndex - The optional Zero-based index at which to start searching, converted to an integer.
 * - Negative index counts back from the end of the array — if fromIndex \< 0, fromIndex + array.length
 * is used. However, the array is still searched from front to back in this case.
 * - If fromIndex \< -array.length or fromIndex is omitted, 0 is used, causing the entire array to be searched.
 * - If fromIndex \>= array.length, the array is not searched and false is returned.
 * @returns A boolean value which is true if the value searchElement is found within the array (or the part of
 * the array indicated by the index fromIndex, if specified).
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyArrIncludes<T>(theArray: ArrayLike<T>, searchElement: T, fromIndex?: number): boolean {
    // Like the native function the value is converted to an object (null and undefined throw a TypeError) and its length
    // and values are read from the object
    let theObj = _toObject(theArray);
    let len = _toLength(theObj);
    if (len) {
        // Convert the fromIndex like the native function (NaN is 0, a negative index counts back from the end, before the
        // start is 0 and from the end, including Infinity, searches nothing)
        let idx = _toRelIndex(fromIndex, len);

        // SameValueZero, NaN is the only value which is not equal to itself
        let isNaNValue = searchElement !== searchElement;
        for (; idx < len; idx++) {
            let value = theObj[idx];
            if (value === searchElement || (isNaNValue && value !== value)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * The polyArrFind() method returns the first element in the provided array that satisfies
 * the provided testing function. If no values satisfy the testing function, undefined
 * is returned.
 * - If you need the index of the found element in the array, use {@link arrFindIndex}.
 * - If you need to find the index of a value, use arrIndexOf(). (It's similar to {@link arrFindIndex}, but checks
 * each element for equality with the value instead of using a testing function.)
 * - If you need to find if a value exists in an array, use arrIncludes(). Again, it checks each element for
 * equality with the value instead of using a testing function.
 * - If you need to find if any element satisfies the provided testing function, use {@link arrSome}.
 *
 * The polyArrFind() method is an iterative method. It calls a provided `callbackFn` function once for each element
 * in an array in ascending-index order, until `callbackFn` returns a truthy value. polyArrFind() then returns that
 * element and stops iterating through the array. If callbackFn never returns a truthy value, polyArrFind() returns
 * undefined.
 *
 * `callbackFn` is invoked for every index of the array, not just those with assigned values. Empty slots in
 * sparse arrays behave the same as undefined.
 *
 * polyArrFind() does not mutate the array on which it is called, but the function provided as callbackFn can.
 * Note, however, that the length of the array is saved before the first invocation of `callbackFn`. Therefore:
 * - `callbackFn` will not visit any elements added beyond the array's initial length when the call to polyArrFind() began.
 * - Changes to already-visited indexes do not cause callbackFn to be invoked on them again.
 * - If an existing, yet-unvisited element of the array is changed by callbackFn, its value passed to the
 * `callbackFn` will be the value at the time that element gets visited. Deleted elements are visited as if they
 * were undefined.
 * @since 0.8.0
 * @group Polyfill
 * @group Array
 * @typeParam T - Identifies the base type of array elements
 * @typeParam E - Identifies a more specific instance of the base array type
 * @param theArray - The array or array like object of elements to be searched.
 * @param callbackFn - A function that accepts up to three arguments of type {@link ArrPredicateCallbackFn} or
 * {@link ArrPredicateCallbackFn2}. The predicate function is called for each element in theArray until
 * the predicate returns a value which is coercible to the Boolean value true, or until the end of the array.
 * @param thisArg - A value to use as this when executing callbackFn, like the native function it is `undefined` when not provided.
 * @return The first element in the array that satisfies the provided testing function. Otherwise, undefined
 * is returned.
 * @throws TypeError if `theArray` is `null` or `undefined`, or `callbackFn` is not a function (even when the array is empty)
 * @example
 * ```ts
 * const inventory = [
 *   { name: "apples", quantity: 2 },
 *   { name: "bananas", quantity: 0 },
 *   { name: "cherries", quantity: 5 },
 * ];
 *
 * function isCherries(fruit) {
 *   return fruit.name === "cherries";
 * }
 *
 * console.log(polyArrFind(inventory, isCherries));
 * // { name: 'cherries', quantity: 5 }
 *
 * function isPrime(element, index, array) {
 *   let start = 2;
 *   while (start <= Math.sqrt(element)) {
 *     if (element % start++ < 1) {
 *       return false;
 *     }
 *   }
 *   return element > 1;
 * }
 *
 * console.log(polyArrFind([4, 6, 8, 12], isPrime)); // undefined, not found
 * console.log(polyArrFind([4, 5, 8, 12], isPrime)); // 5
 * ```
 */
export function polyArrFind<T, E extends T>(theArray: ArrayLike<T>, callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>, thisArg?: any): T | E | undefined {
    return _arrFind(theArray, callbackFn, thisArg, false, true);
}

/**
 * @internal
 * @ignore
 * The shared implementation of polyArrFind(), polyArrFindIndex(), polyArrFindLast() and polyArrFindLastIndex().
 * Like the native functions the array is converted to an object (so null and undefined throw a TypeError, and a
 * string's callbackFn is passed its String object) and its length is read before the callbackFn is checked, every
 * index is visited (an empty slot is undefined, so there is no "in" check), the
 * callbackFn is called with the intrinsic call (not its own call property), and the value which was passed to the
 * callbackFn is returned (the index isn't read again, so a getter is only called once and a value the callbackFn
 * changed isn't returned).
 * @param theArray - The array or array like object of elements to be searched.
 * @param callbackFn - The predicate function
 * @param thisArg - The value to use as this when executing callbackFn
 * @param isLast - Search from the last index to the first
 * @param isValue - Return the value (or undefined), rather than the index (or -1)
 */
function _arrFind<T>(theArray: ArrayLike<T>, callbackFn: Function, thisArg: any, isLast: boolean, isValue: boolean): any {
    let theObj = _toObject(theArray);
    let len = _toLength(theObj);
    _throwIfNotCallbackFn(callbackFn);

    for (let lp = 0; lp < len; lp++) {
        let idx = isLast ? len - lp - 1 : lp;
        let value = theObj[idx];
        if (fnCall(callbackFn as any, thisArg, value, idx, theObj)) {
            return isValue ? value : idx;
        }
    }

    return isValue ? UNDEF_VALUE : -1;
}

/**
 * The polyArrFindIndex() method returns the index of the first element in an array that satisfies the provided testing
 * function. If no elements satisfy the testing function, -1 is returned.
 *
 * The polyArrFindIndex() is an iterative method. It calls a provided callbackFn function once for each element in an
 * array in ascending-index order, until callbackFn returns a truthy value. polyArrFindIndex() then returns the index
 * of that element and stops iterating through the array. If `callbackFn` never returns a truthy value, polyArrFindIndex()
 * returns -1.
 *
 * `callbackFn` is invoked for every index of the array, not just those with assigned values. Empty slots in sparse
 * arrays behave the same as undefined.
 *
 * polyArrFindIndex() does not mutate the array on which it is called, but the function provided as `callbackFn` can.
 * Note, however, that the length of the array is saved before the first invocation of callbackFn. Therefore:
 * - `callbackFn` will not visit any elements added beyond the array's initial length when the call to polyArrFindIndex() began.
 * - Changes to already-visited indexes do not cause `callbackFn` to be invoked on them again.
 * If an existing, yet-unvisited element of the array is changed by `callbackFn`, its value passed to the `callbackFn`
 * will be the value at the time that element gets visited. Deleted elements are visited as if they were undefined.
 * @since 0.8.0
 * @group Polyfill
 * @group Array
 * @typeParam T - Identifies the base type of array elements
 * @typeParam E - Identifies a more specific instance of the base array type
 * @param theArray - The array or array like object of elements to be searched.
 * @param callbackFn - A function that accepts up to three arguments of type {@link ArrPredicateCallbackFn} or
 * {@link ArrPredicateCallbackFn2}. The predicate function is called for each element in theArray until
 * the predicate returns a value which is coercible to the Boolean value true, or until the end of the array.
 * @param thisArg - A value to use as this when executing callbackFn, like the native function it is `undefined` when not provided.
 * @return The index of the first element in the array that passes the test. Otherwise, -1.
 * @throws TypeError if `theArray` is `null` or `undefined`, or `callbackFn` is not a function (even when the array is empty)
 */
export function polyArrFindIndex<T, E extends T>(theArray: ArrayLike<T>, callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>, thisArg?: any): number {
    return _arrFind(theArray, callbackFn, thisArg, false, false);
}

/**
 * The polyArrFindLast() method iterates the array in reverse order and returns the value of the first element that
 * satisfies the provided testing function. If no elements satisfy the testing function, undefined is returned.
 * - If you need the index of the found element in the array, use {@link arrFindLastIndex}.
 * - If you need to find the index of a value, use arrLastIndexOf(). (It's similar to {@link arrFindLastIndex}, but checks
 * each element for equality with the value instead of using a testing function.)
 * - If you need to find if a value exists in an array, use arrIncludes(). Again, it checks each element for
 * equality with the value instead of using a testing function.
 * - If you need to find if any element satisfies the provided testing function, use {@link arrSome}.
 *
 * The polyArrFindLast() method is an iterative method. It calls a provided callbackFn function once for each element
 * in an array in descending-index order, until callbackFn returns a truthy value. polyArrFindLast() then returns that
 * element and stops iterating through the array. If `callbackFn` never returns a truthy value, polyArrFindLast() returns
 * undefined.
 *
 * `callbackFn` is invoked for every index of the array, not just those with assigned values. Empty slots in sparse
 * arrays behave the same as undefined.
 *
 * polyArrFindLast() does not mutate the array on which it is called, but the function provided as `callbackFn` can.
 * Note, however, that the length of the array is saved before the first invocation of `callbackFn`. Therefore:
 * - `callbackFn` will not visit any elements added beyond the array's initial length when the call to polyArrFindLast() began.
 * - Changes to already-visited indexes do not cause callbackFn to be invoked on them again.
 * - If an existing, yet-unvisited element of the array is changed by `callbackFn`, its value passed to the `callbackFn`
 * will be the value at the time that element gets visited. Deleted elements are visited as if they were undefined.
 * @since 0.8.0
 * @group Polyfill
 * @group Array
 * @typeParam T - Identifies the base type of array elements
 * @typeParam E - Identifies a more specific instance of the base array type
 * @param theArray - The array or array like object of elements to be searched.
 * @param callbackFn - A function that accepts up to three arguments of type {@link ArrPredicateCallbackFn} or
 * {@link ArrPredicateCallbackFn2}. The predicate function is called for each element in theArray until
 * the predicate returns a value which is coercible to the Boolean value true, or until the end of the array.
 * @param thisArg - A value to use as this when executing callbackFn, like the native function it is `undefined` when not provided.
 * @return The last element in the array that satisfies the provided testing function. Otherwise, undefined
 * is returned.
 * @throws TypeError if `theArray` is `null` or `undefined`, or `callbackFn` is not a function (even when the array is empty)
 * @example
 * ```ts
 * const inventory = [
 *   { name: "apples", quantity: 2 },
 *   { name: "bananas", quantity: 0 },
 *   { name: "cherries", quantity: 5 },
 * ];
 *
 * function isCherries(fruit) {
 *   return fruit.name === "cherries";
 * }
 *
 * console.log(polyArrFindLast(inventory, isCherries));
 * // { name: 'cherries', quantity: 5 }
 *
 * function isPrime(element, index, array) {
 *   let start = 2;
 *   while (start <= Math.sqrt(element)) {
 *     if (element % start++ < 1) {
 *       return false;
 *     }
 *   }
 *   return element > 1;
 * }
 *
 * console.log(polyArrFindLast([4, 6, 8, 12], isPrime)); // undefined, not found
 * console.log(polyArrFindLast([4, 5, 7, 12], isPrime)); // 7
 * ```
 */
export function polyArrFindLast<T, E extends T>(theArray: ArrayLike<T>, callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>, thisArg?: any): T | E | undefined {
    return _arrFind(theArray, callbackFn, thisArg, true, true);
}

/**
 * The polyArrFindLastIndex() method iterates the array in reverse order and returns the index of the first element that
 * satisfies the provided testing function. If no elements satisfy the testing function, -1 is returned.
 *
 * The polyArrFindLastIndex() method is an iterative method. It calls a provided `callbackFn` function once for each element
 * in an array in descending-index order, until callbackFn returns a truthy value. polyArrFindLastIndex() then returns the
 * index of that element and stops iterating through the array. If callbackFn never returns a truthy value, returns -1.
 *
 * `callbackFn` is invoked for every index of the array, not just those with assigned values. Empty slots in sparse arrays
 * behave the same as undefined.
 *
 * polyArrFindLastIndex() does not mutate the array on which it is called, but the function provided as callbackFn can.
 * Note, however, that the length of the array is saved before the first invocation of callbackFn. Therefore:
 * - `callbackFn` will not visit any elements added beyond the array's initial length when the call to polyArrFindLastIndex() began.
 * - Changes to already-visited indexes do not cause callbackFn to be invoked on them again.
 * - If an existing, yet-unvisited element of the array is changed by `callbackFn`, its value passed to the callbackFn
 * will be the value at the time that element gets visited. Deleted elements are visited as if they were undefined.
 * @since 0.8.0
 * @group Polyfill
 * @group Array
 * @typeParam T - Identifies the base type of array elements
 * @typeParam E - Identifies a more specific instance of the base array type
 * @param theArray - The array or array like object of elements to be searched.
 * @param callbackFn - A function that accepts up to three arguments of type {@link ArrPredicateCallbackFn} or
 * {@link ArrPredicateCallbackFn2}. The predicate function is called for each element in theArray until
 * the predicate returns a value which is coercible to the Boolean value true, or until the end of the array.
 * @param thisArg - A value to use as this when executing callbackFn, like the native function it is `undefined` when not provided.
 * @return The index of the last (highest-index) element in the array that passes the test. Otherwise -1 if
 * no matching element is found.
 * @throws TypeError if `theArray` is `null` or `undefined`, or `callbackFn` is not a function (even when the array is empty)
 */
export function polyArrFindLastIndex<T, E extends T>(theArray: ArrayLike<T>, callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>, thisArg?: any): number {
    return _arrFind(theArray, callbackFn, thisArg, true, false);
}

/**
 * The polyArrFrom creates an new shallow-copied array from an array-like object or an iterable.
 *
 * Like the native `Array.from()`:
 * - A value with an iterator function (`[Symbol.iterator]`, which is only read once) is iterated using the iterator it
 * returns, so an iterator which is not iterable (eg. one created by {@link createIterator} or {@link createRangeIterator})
 * returns an empty array (use {@link iterToArray} to read its values). Otherwise (when the iterator function is `null`
 * or `undefined`) the value is used as an array-like value (eg. `arguments` or
 * a `NodeList`), so every index up to its length is read (an empty slot or missing index is `undefined`) and any other
 * value (eg. a number) returns an empty array. An array is always read using its indexes, like the native array
 * iterator its length is read for each index, so a value added to it while it is read (eg. by the `mapFn`) is also
 * read and the reading stops at its new length when values are removed, while (like the native function) any other
 * array-like is read up to the length it had when it was called.
 * - A string (or a `String` object) is split into its code points (so a surrogate pair is a single value), this is also
 * done for runtimes which don't support `Symbol.iterator`.
 * - A `Map` returns its `[key, value]` entries and a `Set` its values, this is also done (since 0.20.0) for a `Map` or
 * `Set` which has no iterator function (eg. on IE 11) using its `forEach()`.
 * - The `mapFn` is called with the value and its index (without using its own `call` property), and each value is
 * added as an own property of the new array (even when `Array.prototype` has a setter or read-only property for the
 * index).
 * - A `null` or `undefined` value, a `mapFn` which is not a function, an iterator function which is not a function or
 * one which doesn't return an iterator, or an iterator result which is not an object throws a `TypeError`, and a
 * length which is longer than an array can be (2^32 - 1) throws a `RangeError`.
 * @since 0.9.7
 * @group Polyfill
 * @group ArrayLike
 * @group Array
 * @group Iterator
 * @typeParam T - Identifies the element type of the array-like or iterable.
 * @typeParam U - Identifies returned type of the array
 * @param theValue - An array-like object or iterable to convert to an array.
 * @param mapFn - A {@link ArrFromMapFn | mapping function} to call on every element of the array. If provided, every
 * value to be added to the array is first passed through this map function, and the return
 * value is added to the array instead. The function is called with the value and its index (`mapFn(value, index)`)
 * and the `thisArg` as `this`.
 * @param thisArg - Value of 'this' used to invoke the mapfn.
 * @example
 * ```ts
 * polyArrFrom("Hello");
 * // [ "H", "e", "l", "l", "o" ]
 *
 * polyArrFrom(new Set(["Hello", "Darkness", "my", "old", "friend"]));
 * // ["Hello", "Darkness", "my", "old", "friend"]
 *
 * let map = new Map([
 *   [ 1, "Hello" ],
 *   [ 2, "Darkness" ],
 *   [ 3, "my" ],
 *   [ 4, "old" ],
 *   [ 5, "friend"]
 * ]);
 *
 * polyArrFrom(map.values());
 * // ["Hello", "Darkness", "my", "old", "friend"]
 *
 * polyArrFrom(map.keys());
 * // [ 1, 2, 3, 4, 5 ]
 *
 * polyArrFrom(map.entries());
 * // [ [ 1, "Hello" ], [ 2, "Darkness" ], [ 3, "my" ], [ 4, "old" ], [ 5, "friend"] ]
 *
 * polyArrFrom(map, ([ key, value ]) => ({ [key]: value }));
 * // [ {"1": "Hello"}, {"2": "Darkness"}, {"3": "my"}, {"4": "old"}, {"5": "friend"} ]
 * ```
 */
export function polyArrFrom<T, U = T>(theValue: ArrayLike<T> | Iterable<T>, mapFn?: ArrFromMapFn<T, U>, thisArg?: any): U[] {
    let result: any[] = [];
    let iterFn: any;

    // Like the native function the mapFn and the iterator function (when they are not undefined, or null for the
    // iterator function) must be functions
    function _throwIfNotFunction(value: any) {
        if (!isFunction(value)) {
            throwTypeError(dumpObj(value, 0, DUMP_ERR_MAX_LENGTH) + " is not a function");
        }
    }

    !isStrictUndefined(mapFn) && _throwIfNotFunction(mapFn);
    _throwIfNullOrUndefined(theValue);

    // Each value's index is the number of values added before it, like the native function the mapFn is called
    // without using its own (replaceable) call property and each value is added as an own property
    function _addValue(value: T) {
        _pushOwnValue(result, mapFn ? fnCall(mapFn, thisArg, value, result[LENGTH]) : value);
    }

    if (!isString(theValue) && !isArray(theValue)) {
        // Like the native function the iterator function is only read once
        iterFn = (theValue as any)[getKnownSymbol(WellKnownSymbols.iterator)];
    }

    if (!isStrictNullOrUndefined(iterFn)) {
        // Like the native function a value (other than null or undefined) which is not a function throws, rather than
        // the value being used as an array-like, and the iterator it returns is used as-is
        _throwIfNotFunction(iterFn);
        _iterForOf(fnCall(iterFn, theValue), _addValue);
    } else {
        // A string is split into each surrogate pair (or any other single code unit, including an unpaired surrogate), as
        // is a String object on a runtime without Symbol (which has no iterator function), which (like the String iterator
        // of a runtime with Symbol) is converted to a string, so its own toString() is used. A Map or Set which has no
        // iterator function (eg. IE 11) returns its entries / values, like the native function where they are iterable
        let strValue: string = isString(theValue) ? theValue : (!hasSymbol() && isStringObject(theValue) ? asString(theValue) : NULL_VALUE);
        let values: ArrayLike<any> = isString(strValue) ? strValue.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || [] :
            (isArray(theValue) ? theValue : (_getMapSetValues(theValue) || theValue as ArrayLike<T>));
        // An array's length is read for each index (like the native array iterator), as the mapFn may change it, while
        // (like the native function) the length of any other array-like is only read once
        let isArr = isArray(values);
        for (let idx = 0, len = _checkArrayLength(_toLength(values)); idx < (isArr ? values[LENGTH] : len); idx++) {
            _addValue(values[idx]);
        }
    }

    return result;
}
