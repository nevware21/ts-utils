/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrProto } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";
import { ArrPredicateCallbackFn, ArrPredicateCallbackFn2 } from "./callbacks";

/**
 * The arrEvery() method is an iterative method. It calls a provided callbackFn function once for
 * each element in an array, until the callbackFn returns a falsy value. If such an element is found,
 * arrEvery() immediately returns false and stops iterating through the array. Otherwise, if callbackFn
 * returns a truthy value for all elements, every() returns true.
 * @since 0.8.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @typeParam E - Identifies a more specific instance of the base array type
 * @param theArray - The array or array like object of elements to be searched.
 * @param callbackFn - A function that accepts up to three arguments of type {@link ArrPredicateCallbackFn} or
 * {@link ArrPredicateCallbackFn2}. The predicate function is called for each element in the thArray until
 * the predicate returns a value which is coercible to the Boolean value false, or until the end of the array.
 * @param thisArg - A value to use as this when executing callbackFn. Defaults to the array if not provided.
 * @return `true` if the callbackFn returns a `truthy` value for every array elements. Otherwise `false`.
 * @example
 * ```ts
 * function isBigEnough<T>(element: T, index: number, array: T[]) {
 *   return element >= 10;
 * }
 *
 * arrEvery([12, 5, 8, 130, 44], isBigEnough);   // false
 * arrEvery([12, 54, 18, 130, 44], isBigEnough); // true
 *
 * const isSubset = <T>(array1: T[], array2: T[]) => arrEvery(array2, (element) => arrIncludes(array1, element));
 *
 * isSubset([1, 2, 3, 4, 5, 6, 7], [5, 7, 6]);  // true
 * isSubset([1, 2, 3, 4, 5, 6, 7], [5, 8, 7]);  // false
 *
 * arrEvery([1, , 3], (x) => x !== undefined);  // true
 * arrEvery([2, , 2], (x) => x === 2);          // true
 *
 * // Array Like combinations
 * isSubset([1, 2, 3, 4, 5, 6, 7], { length: 3, 0: 5, 1: 7, 2: 6}); // true
 * isSubset([1, 2, 3, 4, 5, 6, 7], { length: 3, 0: 5, 1: 8, 2: 7}); // false
 *
 * isSubset({ length: 7, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 }, [ 5, 7, 6 ]); // true
 * isSubset({ length: 7, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 }, [5, 8, 7]); // false
 *
 * isSubset({ length: 7, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 }, { length: 3, 0: 5, 1: 7, 2: 6}); // true
 * isSubset({ length: 7, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 }, { length: 3, 0: 5, 1: 8, 2: 7}); // false
 * ```
 */
export const arrEvery: <T, E extends T>(theArray: ArrayLike<T>, callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>, thisArg?: any) => theArray is T[] = (/*#__PURE__*/_unwrapFunction("every", ArrProto) as any);

/**
 * The arrFilter() method creates a shallow copy of a portion of a given array, filtered down to just the elements
 * from the given array that pass the test implemented by the provided function.
 *
 * The filter() method is an iterative method. It calls a provided callbackFn function once for each element in an
 * array, and constructs a new array of all the values for which callbackFn returns a truthy value. Array elements
 * which do not pass the callbackFn test are not included in the new array.
 *
 * `callbackFn` is invoked only for array indexes which have assigned values. It is not invoked for empty slots in
 * sparse arrays.
 *
 * The arrFilter() method is a copying method. It does not alter this but instead returns a shallow copy that contains
 * the same elements as the ones from the original array (with some filtered out). However, the function provided as
 * callbackFn can mutate the array. Note, however, that the length of the array is saved before the first invocation
 * of callbackFn. Therefore:
 * - `callbackFn` will not visit any elements added beyond the array's initial length when the call to arrFilter()
 * began.
 * - Changes to already-visited indexes do not cause callbackFn to be invoked on them again.
 * - If an existing, yet-unvisited element of the array is changed by callbackFn, its value passed to the `callbackFn`
 * will be the value at the time that element gets visited. Deleted elements are not visited.
 * @since 0.8.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of the elements.
 * @typeParam E - Identifies a more specific instance of the base array type.
 * @param theArray - The array or array like object of elements to be searched.
 * @param callbackFn - A function that accepts up to three arguments of type {@link ArrPredicateCallbackFn} or
 * {@link ArrPredicateCallbackFn2}. The predicate function is called for each element in the thArray until
 * the predicate returns a value which is coercible to the Boolean value false, or until the end of the array.
 * @param thisArg - A value to use as this when executing callbackFn. Defaults to the array if not provided.
 * @return A shallow copy of a portion of the given array, filtered down to just the elements from the given
 * array that pass the test implemented by the provided function. If no elements pass the test, an empty array
 * will be returned.
 * @example
 * ```ts
 * function isBigEnough<T>(value: T) {
 *   return value >= 10;
 * }
 *
 * const filtered = arrFilter([12, 5, 8, 130, 44], isBigEnough);
 * // filtered is [12, 130, 44]
 *
 * const arrayLikeFiltered = arrFilter({ length: 5, 0: 12, 1: 5, 2: 8, 3: 130, 4: 44}, isBigEnough);
 * // arrayLikeFiltered is [12, 130, 44]
 *
 * const array = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
 *
 * function isPrime(num) {
 *   for (let i = 2; num > i; i++) {
 *     if (num % i === 0) {
 *       return false;
 *     }
 *   }
 *   return num > 1;
 * }
 *
 * console.log(arrFilter(array, isPrime)); // [2, 3, 5, 7, 11, 13]
 * ```
 */
export const arrFilter: <T, E extends T>(theArray: ArrayLike<T>, callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>, thisArg?: any) => T[] | E[] = (/*#__PURE__*/_unwrapFunction("filter", ArrProto) as any);
