/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { MathCls } from "../internal/constants";
import { _pureRef } from "../internal/treeshake_helpers";

/**
 * The `mathPow()` function returns the base to the exponent power, that is, base^exponent.
 * @function
 * @since 0.12.0
 * @group Math
 * @param base - The base number
 * @param exponent - The exponent used to raise the base
 * @returns The result of raising the base to the exponent power (base^exponent)
 * @example
 * ```ts
 * mathPow(2, 3); // 8
 * mathPow(4, 0.5); // 2
 * mathPow(7, 2); // 49
 * mathPow(8, 1/3); // 2
 * ```
 */
export const mathPow = (/*#__PURE__*/_pureRef<typeof Math.pow>(MathCls, "pow"));

/**
 * The `mathSqrt()` function returns the square root of a number.
 * @function
 * @since 0.12.0
 * @group Math
 * @param x - A number
 * @returns The square root of x, a positive number. If x is negative, NaN is returned.
 * @example
 * ```ts
 * mathSqrt(9); // 3
 * mathSqrt(2); // 1.414...
 * mathSqrt(1); // 1
 * mathSqrt(0); // 0
 * mathSqrt(-1); // NaN
 * ```
 */
export const mathSqrt = (/*#__PURE__*/_pureRef<typeof Math.sqrt>(MathCls, "sqrt"));
