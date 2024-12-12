/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrProto } from "../internal/constants";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { polyArrFind, polyArrFindIndex, polyArrFindLast, polyArrFindLastIndex } from "../polyfills/array";
import { ArrPredicateCallbackFn, ArrPredicateCallbackFn2 } from "./callbacks";

/**
 * The arrFind() method returns the first element in the provided array that satisfies
 * the provided testing function. If no values satisfy the testing function, undefined
 * is returned.
 * - If you need the index of the found element in the array, use {@link arrFindIndex}.
 * - If you need to find the index of a value, use arrIndexOf(). (It's similar to {@link arrFindIndex}, but
 * checks each element for equality with the value instead of using a testing function.)
 * - If you need to find if a value exists in an array, use {@link arrIncludes}. Again, it checks each element for
 * equality with the value instead of using a testing function.
 * - If you need to find if any element satisfies the provided testing function, use {@link arrSome}.
 *
 * The arrFind() method is an iterative method. It calls a provided `callbackFn` function once for each element
 * in an array in ascending-index order, until `callbackFn` returns a truthy value. arrFind() then returns that
 * element and stops iterating through the array. If callbackFn never returns a truthy value, arrFind() returns
 * undefined.
 *
 * `callbackFn` is invoked for every index of the array, not just those with assigned values. Empty slots in
 * sparse arrays behave the same as undefined.
 *
 * arrFind() does not mutate the array on which it is called, but the function provided as callbackFn can.
 * Note, however, that the length of the array is saved before the first invocation of `callbackFn`. Therefore:
 * - `callbackFn` will not visit any elements added beyond the array's initial length when the call to arrFind() began.
 * - Changes to already-visited indexes do not cause callbackFn to be invoked on them again.
 * - If an existing, yet-unvisited element of the array is changed by callbackFn, its value passed to the
 * `callbackFn` will be the value at the time that element gets visited. Deleted elements are visited as if they
 * were undefined.
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
 * console.log(arrFind(inventory, isCherries));
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
 * console.log(arrFind([4, 6, 8, 12], isPrime)); // undefined, not found
 * console.log(arrFind([4, 5, 8, 12], isPrime)); // 5
 *
 * // Array Like
 * console.log(arrFind({ length: 4, 0: 4, 1: 6, 2: 8, 3: 12 }, isPrime)); // undefined, not found
 * console.log(arrFind({ length: 4:, 0: 4, 1: 5, 2: 8, 3: 12 }, isPrime)); // 5
 * ```
 */
export const arrFind =  (/*#__PURE__*/_unwrapFunctionWithPoly("find", ArrProto, polyArrFind) as <T, E extends T>(theArray: ArrayLike<T>, callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>, thisArg?: any) => T | E | undefined);

/**
 * The arrFindIndex() method returns the index of the first element in an array that satisfies the provided testing
 * function. If no elements satisfy the testing function, -1 is returned.
 *
 * The arrFindIndex() is an iterative method. It calls a provided callbackFn function once for each element in an
 * array in ascending-index order, until callbackFn returns a truthy value. arrFindIndex() then returns the index
 * of that element and stops iterating through the array. If `callbackFn` never returns a truthy value, arrFindIndex()
 * returns -1.
 *
 * `callbackFn` is invoked for every index of the array, not just those with assigned values. Empty slots in sparse
 * arrays behave the same as undefined.
 *
 * arrFindIndex() does not mutate the array on which it is called, but the function provided as `callbackFn` can.
 * Note, however, that the length of the array is saved before the first invocation of callbackFn. Therefore:
 * - `callbackFn` will not visit any elements added beyond the array's initial length when the call to arrFindIndex() began.
 * - Changes to already-visited indexes do not cause `callbackFn` to be invoked on them again.
 * If an existing, yet-unvisited element of the array is changed by `callbackFn`, its value passed to the `callbackFn`
 * will be the value at the time that element gets visited. Deleted elements are visited as if they were undefined.
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
 * @return The index of the first element in the array that passes the test. Otherwise, -1.
 * @example
 * ```ts
 * const inventory: Array<{ name: string, quantity: number}> = [
 *   { name: "apples", quantity: 2 },
 *   { name: "bananas", quantity: 0 },
 *   { name: "cherries", quantity: 5 }
 * ];
 *
 * function isCherries(fruit: { name: string, quantity: number}) {
 *   return fruit.name === "cherries";
 *  }
 *
 * arrFindIndex(inventory, isCherries); // 2
 *
 * function isPrime(element: number) {
 *   if (element % 2 === 0 || element < 2) {
 *     return false;
 *   }
 *
 *   for (let factor = 3; factor <= Math.sqrt(element); factor += 2) {
 *     if (element % factor === 0) {
 *       return false;
 *     }
 *   }
 *   return true;
 * }
 *
 * arrFindIndex([4, 6, 8, 9, 12], isPrime) // -1
 * arrFindIndex([4, 6, 7, 9, 12], isPrime) // 2
 *
 * // Array Like
 * arrFindIndex({ length: 5, 0: 4, 1: 6, 2: 8, 3: 9, 4: 12 }, isPrime) // -1
 * arrFindIndex({ length: 5:, 0: 4, 1: 6, 2: 7, 3: 9, 4: 12 }, isPrime) // 2
 * ```
 */
export const arrFindIndex = (/*#__PURE__*/_unwrapFunctionWithPoly("findIndex", ArrProto, polyArrFindIndex) as <T, E extends T>(theArray: ArrayLike<T>, callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>, thisArg?: any) => number);

/**
 * The arrFindLast() method iterates the array in reverse order and returns the value of the first element that
 * satisfies the provided testing function. If no elements satisfy the testing function, undefined is returned.
 * - If you need the index of the found element in the array, use arrFindLastIndex().
 * - If you need to find the index of a value, use arrLastIndexOf(). (It's similar to arrFindLastIndex(), but checks
 * each element for equality with the value instead of using a testing function.)
 * - If you need to find if a value exists in an array, use {@link arrIncludes}. Again, it checks each element for
 * equality with the value instead of using a testing function.
 * - If you need to find if any element satisfies the provided testing function, use {@link arrSome}.
 *
 * The arrFindLast() method is an iterative method. It calls a provided callbackFn function once for each element
 * in an array in descending-index order, until callbackFn returns a truthy value. arrFindLast() then returns that
 * element and stops iterating through the array. If `callbackFn` never returns a truthy value, arrFindLast() returns
 * undefined.
 *
 * `callbackFn` is invoked for every index of the array, not just those with assigned values. Empty slots in sparse
 * arrays behave the same as undefined.
 *
 * arrFindLast() does not mutate the array on which it is called, but the function provided as `callbackFn` can.
 * Note, however, that the length of the array is saved before the first invocation of `callbackFn`. Therefore:
 * - `callbackFn` will not visit any elements added beyond the array's initial length when the call to arrFindLast() began.
 * - Changes to already-visited indexes do not cause callbackFn to be invoked on them again.
 * - If an existing, yet-unvisited element of the array is changed by `callbackFn`, its value passed to the `callbackFn`
 * will be the value at the time that element gets visited. Deleted elements are visited as if they were undefined.
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
 * console.log(arrFindLast(inventory, isCherries));
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
 * console.log(arrFindLast([4, 6, 8, 12], isPrime)); // undefined, not found
 * console.log(arrFindLast([4, 5, 7, 12], isPrime)); // 7
 *
 * // Array Like
 * console.log(arrFindLast({ length: 4, 0: 4, 1: 6, 2: 8, 3: 12 }, isPrime)); // undefined, not found
 * console.log(arrFindLast({ length: 4, 0: 4, 1: 5, 2: 7, 3: 12 }, isPrime)); // 7
 * ```
 */
export const arrFindLast = (/*#__PURE__*/_unwrapFunctionWithPoly("findLast", ArrProto as any, polyArrFindLast) as <T, E extends T>(theArray: ArrayLike<T>, callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>, thisArg?: any) => T | E | undefined);

/**
 * The arrFindLastIndex() method iterates the array in reverse order and returns the index of the first element that
 * satisfies the provided testing function. If no elements satisfy the testing function, -1 is returned.
 *
 * The arrFindLastIndex() method is an iterative method. It calls a provided `callbackFn` function once for each element
 * in an array in descending-index order, until callbackFn returns a truthy value. arrFindLastIndex() then returns the
 * index of that element and stops iterating through the array. If callbackFn never returns a truthy value, returns -1.
 *
 * `callbackFn` is invoked for every index of the array, not just those with assigned values. Empty slots in sparse arrays
 * behave the same as undefined.
 *
 * arrFindLastIndex() does not mutate the array on which it is called, but the function provided as callbackFn can.
 * Note, however, that the length of the array is saved before the first invocation of callbackFn. Therefore:
 * - `callbackFn` will not visit any elements added beyond the array's initial length when the call to arrFindLastIndex() began.
 * - Changes to already-visited indexes do not cause callbackFn to be invoked on them again.
 * - If an existing, yet-unvisited element of the array is changed by `callbackFn`, its value passed to the callbackFn
 * will be the value at the time that element gets visited. Deleted elements are visited as if they were undefined.
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
 * @return The index of the last (highest-index) element in the array that passes the test. Otherwise -1 if
 * no matching element is found.
 * @example
 * ```ts
 * const inventory: Array<{ name: string, quantity: number}> = [
 *   { name: "apples", quantity: 2 },
 *   { name: "bananas", quantity: 0 },
 *   { name: "cherries", quantity: 5 }
 * ];
 *
 * let called = 0;
 * function isCherries(fruit: { name: string, quantity: number}) {
 *   called++;
 *   return fruit.name === "cherries";
 * }
 *
 * arrFindLastIndex(inventory, isCherries)' // 2
 * // called === 1
 *
 * called = 0;
 * function isPrime(element: number) {
 *   called++;
 *   if (element % 2 === 0 || element < 2) {
 *     return false;
 *   }
 *   for (let factor = 3; factor <= Math.sqrt(element); factor += 2) {
 *     if (element % factor === 0) {
 *       return false;
 *     }
 *   }
 *   return true;
 * }
 *
 * arrFindLastIndex([4, 6, 8, 9, 12], isPrime); // -1
 * // called === 5
 *
 * called = 0;
 * arrFindLastIndex([4, 6, 7, 9, 12], isPrime); // 2
 * // called === 3
 *
 * // Array Like
 * called = 0;
 * arrFindLastIndex({ length: 5: 0: 4, 1: 6, 2: 8, 3: 9, 4: 12 }, isPrime); // -1
 * // called === 5
 *
 * called = 0;
 * arrFindLastIndex({ length: 5: 0: 4, 1: 6, 2: 7, 3: 9, 4: 12 }, isPrime); // 2
 * // called === 3

 * ```
 */
export const arrFindLastIndex = (/*#__PURE__*/_unwrapFunctionWithPoly("findLastIndex", ArrProto as any, polyArrFindLastIndex) as <T, E extends T>(theArray: ArrayLike<T>, callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>, thisArg?: any) => number);
