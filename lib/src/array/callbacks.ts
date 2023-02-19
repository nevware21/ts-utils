/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

/**
 * The `ArrPredicateCallbackFn` function is used for {@link arrEvery} and {@link arrFilter},
 * it should return a `truthy` value to indicate a matching element has been found.
 * @since 0.8.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the type of array elements
 * @typeParam E - Identifies the type of the return array elements (defaults to T)
 * @param value - The cuirrent element of the array being processed.
 * @param index - The index of the current elemety of the array being processed.
 * @param array - The array being processed.
 * @returns A boolean value indicating that the value is of the type expected (the test is true)
 */
export type ArrPredicateCallbackFn<T, E extends T> = (value: T, index: number, array: T[]) => value is E;

/**
 * The `ArrPredicateCallbackFn2` function is used for {@link arrEvery} and {@link arrFilter},
 * it should return a `truthy` value to indicate a matching element has been found.
 * @since 0.8.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the type of array elements
 * @typeParam E - Identifies the type of the return array elements (defaults to T)
 * @param value - The cuirrent element of the array being processed.
 * @param index - The index of the current elemety of the array being processed.
 * @param array - The array being processed.
 */
export type ArrPredicateCallbackFn2<T> = (value: T, index: number, array: T[]) => unknown;