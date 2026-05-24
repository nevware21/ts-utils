/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { StrCls } from "../internal/constants";
import { _pureAssign } from "../internal/treeshake_helpers";

/**
 * The asString() method returns a string representing the value by
 * explicitly using `String(`value`)`.
 *
 * @function
 * @since 0.4.3
 * @group String
 * @group Conversion
 * @group Value
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
export const asString: (value: any) => string = (/*#__PURE__*/_pureAssign(StrCls));
