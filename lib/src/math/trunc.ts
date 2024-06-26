/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { MathCls } from "../internal/constants";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";
import { mathCeil, mathFloor } from "./floor";

/**
 * The `mathTrunc()` function returns the integer part of a number by removing any fractional digits.
 * Unlike the other three Math methods: Math.floor(), Math.ceil() and Math.round(), the way `mathTrunc()`
 * works is very simple. It truncates (cuts off) the dot and the digits to the right of it, no matter
 * whether the argument is a positive or negative number.
 * The argument passed to this method will be converted to number type implicitly.
 * @group Math
 * @param value - The value to be truncated
 * @returns The integer path of the given number
 */
export const mathTrunc: (value: number) => number = (/* #__PURE__*/_pureAssign((/* #__PURE__*/_pureRef<typeof Math.trunc>(MathCls as any, "trunc")), polyMathTrunc));

/**
 * The `mathTrunc()` function returns the integer part of a number by removing any fractional digits.
 * Unlike the other three Math methods: Math.floor(), Math.ceil() and Math.round(), the way `mathTrunc()`
 * works is very simple. It truncates (cuts off) the dot and the digits to the right of it, no matter
 * whether the argument is a positive or negative number.
 * The argument passed to this method will be converted to number type implicitly.
 * @group Polyfill
 * @group Math
 * @param value - The value to be truncated
 * @returns The integer path of the given number
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyMathTrunc(value: number): number {
    let theValue = +value;

    return (theValue > 0 ? mathFloor : mathCeil)(theValue);
}