/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { MathCls } from "../internal/constants";
import { _pureRef } from "../internal/treeshake_helpers";

/**
 * The `mathRound()` function returns the value of a number rounded to the nearest integer.
 * 
 * If the fractional portion of the argument is greater than 0.5, the argument is rounded to the
 * integer with the next higher absolute value. If it is less than 0.5, the argument is rounded
 * to the integer with the lower absolute value. If the fractional portion is exactly 0.5, the
 * argument is rounded to the next integer in the direction of +∞.
 * 
 * > Note: This differs from many languages' round() functions, which often round half-increments
 * > away from zero, giving a different result in the case of negative numbers with a fractional part of exactly 0.5.
 * 
 * `mathRound(x)` is not exactly the same as `mathFloor(x + 0.5)`. When `x` is -0, or -0.5 ≤ x < 0, `mathRound(x)`
 * returns -0, while `mathFloor(x + 0.5)` returns 0. However, neglecting that difference and potential precision errors,
 * `mathRound(x)` and `mathFloor(x + 0.5)` are generally equivalent.
 * @group Math
 * @since 0.11.8
 * @param x - A number
 * @returns A value of `x` rounded to the nearest integer.
 * @example
 * ```ts
 * mathRound(0.9); // 1
 * mathRound(5.95); // 6
 * mathRound(5.5); // 6
 * mathRound(5.05); // 5
 * mathRound(-5.05); // -5 
 * mathRound(-5.5); // -5
 * mathRound(-5.95); // -6
 * mathRound(-0.9); // -1
 * ```
 */
export const mathRound = (/*#__PURE__*/_pureRef<typeof Math.floor>(MathCls, "round"));
