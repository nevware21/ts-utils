/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { StrCls } from "../internal/constants";

/**
 * The asString() method returns a string representing the value by
 * explicitly using `String(`value`)`.
 *
 * @since 0.4.3
 * @group String
 * @group Conversion
 * @param value - The value to get a string representation of
 * @example
 * ```ts
 * const arr = [ 1, 2, 3];
 * asString(arr);       // "1,2,3"
 * asString(null);      // "null"
 * asString(undefined); // "undefined"
 * asString(42);        // "42"
 * asString(Symbol.for("Hello"));   // "Symbol(Hello)"
 * ```
 */
export const asString: (value: any) => string = StrCls;
