/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { EMPTY, StrCls, StrProto } from "../internal/constants";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";
import { fnCall } from "../funcs/funcs";

// The intrinsic String.prototype.concat (captured, so one which is replaced later isn't used)
const _strConcat = (/*#__PURE__*/_pureRef<typeof String.prototype.concat>(StrProto, "concat"));

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

/**
 * @internal
 * @ignore
 * Converts the value to a string like the native ToString() (which the String.prototype functions use for their `this`
 * and string arguments), so (unlike asString()) a Symbol throws a TypeError and an object is converted (once) using
 * its Symbol.toPrimitive("string") or its toString() / valueOf()
 * @param value - The value to convert
 * @returns The string
 */
/*#__NO_SIDE_EFFECTS__*/
export function _toString(value: any): string {
    return fnCall(_strConcat, EMPTY, value);
}
