/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrFromMapFn, ArrPredicateCallbackFn, ArrPredicateCallbackFn2 } from "../array/callbacks";
import { arrForEach } from "../array/forEach";
import { arrIndexOf } from "../array/indexOf";
import { arrMap } from "../array/map";
import { arrSlice } from "../array/slice";
import { isArray, isNullOrUndefined, objToString } from "../helpers/base";
import { CALL, LENGTH } from "../internal/constants";
import { iterForOf } from "../iterator/forOf";

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
 * Note: The polyfill does not handle NaN correctly.
 * @since 0.8.0
 * @group Array
 * @group Polyfill
 * @param theArray - The array or array like object of elements to be searched.
 * @param searchElement - The value to search for
 * @param fromIndex - The optional Zero-based index at which to start searching, converted to an integer.
 * - Negative index counts back from the end of the array — if fromIndex < 0, fromIndex + array.length
 * is used. However, the array is still searched from front to back in this case.
 * - If fromIndex < -array.length or fromIndex is omitted, 0 is used, causing the entire array to be searched.
 * - If fromIndex >= array.length, the array is not searched and false is returned.
 * @returns A boolean value which is true if the value searchElement is found within the array (or the part of
 * the array indicated by the index fromIndex, if specified).
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyArrIncludes<T>(theArray: ArrayLike<T>, searchElement: T, fromIndex?: number): boolean {
    return arrIndexOf(theArray, searchElement, fromIndex) !== -1;
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
 * @param callbackFn A function that accepts up to three arguments of type {@link ArrPredicateCallbackFn} or
 * {@link ArrPredicateCallbackFn2}. The predicate function is called for each element in the thArray until
 * the predicate returns a value which is coercible to the Boolean value false, or until the end of the array.
 * @return The first element in the array that satisfies the provided testing function. Otherwise, undefined
 * is returned.
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
    let result;
    let idx = polyArrFindIndex(theArray, callbackFn, thisArg);
    return idx !== -1 ? theArray[idx] : result;
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
 * @param callbackFn A function that accepts up to three arguments of type {@link ArrPredicateCallbackFn} or
 * {@link ArrPredicateCallbackFn2}. The predicate function is called for each element in the thArray until
 * the predicate returns a value which is coercible to the Boolean value false, or until the end of the array.
 * @param thisArg - A value to use as this when executing callbackFn. Defaults to the array if not provided.
 * @return The index of the first element in the array that passes the test. Otherwise, -1.
 * @example
 * ```ts
 * ```
 */
export function polyArrFindIndex<T, E extends T>(theArray: ArrayLike<T>, callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>, thisArg?: any): number {
    let result = -1;
    arrForEach(theArray, (value, index) => {
        if (callbackFn[CALL](thisArg | theArray as any, value, index, theArray)) {
            result = index;
            return -1;
        }
    });

    return result;
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
 * @param callbackFn A function that accepts up to three arguments of type {@link ArrPredicateCallbackFn} or
 * {@link ArrPredicateCallbackFn2}. The predicate function is called for each element in the thArray until
 * the predicate returns a value which is coercible to the Boolean value false, or until the end of the array.
 * @param thisArg - A value to use as this when executing callbackFn. Defaults to the array if not provided.
 * @return The last element in the array that satisfies the provided testing function. Otherwise, undefined
 * is returned.
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
    let result;
    let idx = polyArrFindLastIndex(theArray, callbackFn, thisArg);
    return idx !== -1 ? theArray[idx] : result;
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
 * @param callbackFn A function that accepts up to three arguments of type {@link ArrPredicateCallbackFn} or
 * {@link ArrPredicateCallbackFn2}. The predicate function is called for each element in the thArray until
 * the predicate returns a value which is coercible to the Boolean value false, or until the end of the array.
 * @param thisArg - A value to use as this when executing callbackFn. Defaults to the array if not provided.
 * @return The index of the last (highest-index) element in the array that passes the test. Otherwise -1 if
 * no matching element is found.
 */
export function polyArrFindLastIndex<T, E extends T>(theArray: ArrayLike<T>, callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>, thisArg?: any): number {
    let result = -1;
    let len = theArray[LENGTH] >>> 0;
    for (let idx = len - 1; idx >= 0; idx--) {
        if (idx in theArray && callbackFn[CALL](thisArg | theArray as any, theArray[idx], idx, theArray)) {
            result = idx;
            break;
        }
    }

    return result;
}

/**
 * The polyArrFrom creates an new shallow-copied array from an array-like object or an iterable.
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
 * value is added to the array instead. The function is called with the following arguments:
 * @param thisArg Value of 'this' used to invoke the mapfn.
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
    if (isArray(theValue)) {
        let result = arrSlice(theValue);
        return mapFn ? arrMap<T, U>(result, mapFn, thisArg) : result;
    }

    let result: U[] = [];
    iterForOf(theValue as any, (value: U, cnt) => {
        return result.push(mapFn ? mapFn[CALL](thisArg, value, cnt) : value);
    });

    return result;
}
