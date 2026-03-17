/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * Writable (mutable) ArrayLike interface.
 * This is similar to the built-in ArrayLike, but with mutable properties.
 * @since 0.14.0
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @example
 * ```ts
 * const buf: WritableArrayLike<number> = { length: 3, 0: 1, 1: 2, 2: 3 };
 * buf[1] = 42;
 * buf.length = 4;
 * ```
 */
export interface WritableArrayLike<T> {
    length: number;
    [index: number]: T;
}
