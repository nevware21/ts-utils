/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * Callback signature for {@link iterMap}.
 * @since 0.15.0
 * @group Iterator
 * @example
 * ```ts
 * const toLabel: IterMapCallbackFn<number, string> = (value, index) => index + ":" + value;
 * ```
 */
export type IterMapCallbackFn<T, R = T> = (value: T, index: number) => R;

/**
 * Callback signature for {@link iterFilter}, {@link iterSome} and {@link iterEvery}.
 * @since 0.15.0
 * @group Iterator
 * @example
 * ```ts
 * const isEven: IterPredicateCallbackFn<number> = (value) => value % 2 === 0;
 * ```
 */
export type IterPredicateCallbackFn<T> = (value: T, index: number) => unknown;

/**
 * Callback signature for {@link iterReduce}.
 * @since 0.15.0
 * @group Iterator
 * @example
 * ```ts
 * const sum: IterReduceCallbackFn<number, number> = (previous, value) => (previous as number) + value;
 * ```
 */
export type IterReduceCallbackFn<T, R = T> = (previousValue: T | R, currentValue: T, currentIndex: number, iter: Iterator<T>) => R;

/**
 * Callback signature for key selection in {@link arrToMap}.
 * @since 0.15.0
 * @group Array
 * @example
 * ```ts
 * const byId: ArrToMapKeySelectorFn<{ id: string }> = (value) => value.id;
 * ```
 */
export type ArrToMapKeySelectorFn<T> = (value: T, index: number) => string | number;

/**
 * Callback signature for value selection in {@link arrToMap}.
 * @since 0.15.0
 * @group Array
 * @example
 * ```ts
 * const pickName: ArrToMapValueSelectorFn<{ name: string }, string> = (value) => value.name;
 * ```
 */
export type ArrToMapValueSelectorFn<T, V = T> = (value: T, index: number) => V;
