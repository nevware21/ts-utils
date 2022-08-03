/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { MathCls } from "../internal/constants";
import { mathCeil, mathFloor } from "./floor";

const _mathTrunc = MathCls.trunc;

/**
 * The `mathTrunc()` function returns the integer part of a number by removing any fractional digits.
 * Unlike the other three Math methods: Math.floor(), Math.ceil() and Math.round(), the way `mathTrunc()`
 * works is very simple. It truncates (cuts off) the dot and the digits to the right of it, no matter
 * whether the argument is a positive or negative number.
 * The argument passed to this method will be converted to number type implicitly.
 * @param value - The value to be truncated
 * @returns The integer path of the given number
 */
export const mathTrunc = _mathTrunc ? _mathTrunc : polyMathTrunc;

/**
 * The `mathTrunc()` function returns the integer part of a number by removing any fractional digits.
 * Unlike the other three Math methods: Math.floor(), Math.ceil() and Math.round(), the way `mathTrunc()`
 * works is very simple. It truncates (cuts off) the dot and the digits to the right of it, no matter
 * whether the argument is a positive or negative number.
 * The argument passed to this method will be converted to number type implicitly.
 * @param value - The value to be truncated
 * @returns The integer path of the given number
 */
export function polyMathTrunc(value: number): number {
    let theValue = +value;

    return (theValue > 0 ? mathFloor : mathCeil)(theValue);
}