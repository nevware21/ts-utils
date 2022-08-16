/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { StrCls } from "../internal/constants";

/**
 * The toString() method returns a string representing the value by
 * explicitly using `String(`value`)`.
 *
 * @since 0.4.2
 * @group String
 * @param value - The value to get a string representation of
 * @example
 * ```ts
 * const arr = [ 1, 2, 3];
 * toString(arr);       // "1,2,3"
 * toString(null);      // "null"
 * toString(undefined); // "undefined"
 * toString(42);        // "42"
 * toString(Symbol.for("Hello"));   // "Symbol(Hello)"
 * ```
 */
export const toString: (value: any) => string = StrCls;
