/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { ArrProto } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";
import { polyArrFind, polyArrFindIndex, polyArrFindLast, polyArrFindLastIndex } from "../polyfills/array";
import { ArrPredicateCallbackFn, ArrPredicateCallbackFn2 } from "./callbacks";

/**
 * The arrSome() method tests whether at least one element in the array passes the test implemented by the
 * provided function. It returns true if, in the array, it finds an element for which the provided function
 * returns true; otherwise it returns false. It doesn't modify the array.
 *
 * The arrSome() method is an iterative method. It calls a provided `callbackFn` function once for each element
 * in an array, until the `callbackFn` returns a truthy value. If such an element is found, arrSome() immediately
 * returns true and stops iterating through the array. Otherwise, if callbackFn returns a falsy value for all
 * elements, some() returns false.
 *
 * arrSome() acts like the "there exists" quantifier in mathematics. In particular, for an empty array, it
 * returns false for any condition.
 *
 * `callbackFn` is invoked only for array indexes which have assigned values. It is not invoked for empty slots
 * in sparse arrays.
 *
 * arrSome() does not mutate the array on which it is called, but the function provided as callbackFn can.
 * Note, however, that the length of the array is saved before the first invocation of callbackFn. Therefore:
 * - `callbackFn` will not visit any elements added beyond the array's initial length when the call to arrSome() began.
 * - Changes to already-visited indexes do not cause callbackFn to be invoked on them again.
 * - If an existing, yet-unvisited element of the array is changed by `callbackFn`, its value passed to the
 * `callbackFn` will be the value at the time that element gets visited. Deleted elements are not visited.
 * - The arrSome() method is generic. It only expects the this value to have a length property and integer-keyed properties.
 * @since 0.8.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @typeParam E - Identifies a more specific instance of the base array type
 * @param theArray - The array or array like object of elements to be searched.
 * @param callbackFn A function that accepts up to three arguments of type {@link ArrPredicateCallbackFn} or
 * {@link ArrPredicateCallbackFn2}. The predicate function is called for each element in the thArray until
 * the predicate returns a value which is coercible to the Boolean value false, or until the end of the array.
 * @param thisArg - A value to use as this when executing callbackFn. Defaults to the array if not provided.
 * @return `true` if the callback function returns a truthy value for at least one element in the array.
 * Otherwise, `false`.
 */
export const arrSome: <T, E extends T>(theArray: ArrayLike<T>, callbackFn: ArrPredicateCallbackFn<T, E> | ArrPredicateCallbackFn2<T>, thisArg?: any) => boolean = _unwrapFunction("some", ArrProto);
