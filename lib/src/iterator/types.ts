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
 * Callback signature for key selection in `arrToMap()`.
 * @since 0.15.0
 * @group Array
 * @example
 * ```ts
 * const byId: ArrToMapKeySelectorFn<{ id: string }> = (value) => value.id;
 * ```
 */
export type ArrToMapKeySelectorFn<T> = (value: T, index: number) => string | number;

/**
 * Callback signature for value selection in `arrToMap()`.
 * @since 0.15.0
 * @group Array
 * @example
 * ```ts
 * const pickName: ArrToMapValueSelectorFn<{ name: string }, string> = (value) => value.name;
 * ```
 */
export type ArrToMapValueSelectorFn<T, V = T> = (value: T, index: number) => V;

/**
 * The async iterator returned by an {@link IAsyncIterable}, it is compatible with the native `AsyncIterator` type
 * which is only available when using the ES2018 (or later) lib.
 * @since 0.20.0
 * @group Iterator
 * @typeParam T - Identifies the type of the values returned by the async iterator
 */
export interface IAsyncIterator<T = any> {
    /**
     * Returns a promise for the next result of the iteration.
     * @param args - Optional value to pass to the iterator
     */
    next(...args: any[]): Promise<IteratorResult<T>>;

    /**
     * Optionally signals that the caller has finished with the iterator.
     * @param value - The value to be returned
     */
    return?(value?: any): Promise<IteratorResult<T>>;

    /**
     * Optionally signals that the caller has detected an error.
     * @param e - The error
     */
    throw?(e?: any): Promise<IteratorResult<T>>;
}

/**
 * A value which can be iterated asynchronously, it is compatible with the native `AsyncIterable` type which is only
 * available when using the ES2018 (or later) lib, so that the exported types can be used without that lib.
 * - When the compiler can use `Symbol.asyncIterator` as a key (TypeScript v4.3 and later with the ES2018 or later lib)
 * this contains the `[Symbol.asyncIterator]` function, so a native `AsyncIterable` can be assigned to it and vice-versa
 * and it can be used with `for await`.
 * - Earlier versions of TypeScript with the ES2018 or later lib define the symbol as a plain `symbol` which can't be
 * used as a key, so this is `any` which can still be assigned to a native `AsyncIterable` and be used with `for await`.
 * - Without the ES2018 or later lib `Symbol.asyncIterator` is not defined, so this is `object`.
 * @since 0.20.0
 * @group Iterator
 * @typeParam T - Identifies the type of the values returned by the async iterator
 */
export type IAsyncIterable<T = any> = SymbolConstructor extends { readonly asyncIterator: infer S } ?
    (symbol extends S ? any : { [K in Extract<S, PropertyKey>]: () => IAsyncIterator<T> }) : object;
