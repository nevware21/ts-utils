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
 * The `mathExp()` function returns e raised to the power of a number, where e is Euler's number,
 * the base of natural logarithms.
 * @function
 * @since 0.12.0
 * @group Math
 * @param x - A number representing the power to which e is raised
 * @returns The value of e^x, where e is Euler's number and x is the argument
 * @example
 * ```ts
 * mathExp(0); // 1
 * mathExp(1); // 2.718281828459045 (approximately e)
 * mathExp(2); // 7.38905609893065 (approximately e^2)
 * ```
 */
export const mathExp = (/*#__PURE__*/_pureRef<typeof Math.exp>(MathCls, "exp"));

/**
 * The `mathLog()` function returns the natural logarithm (base e) of a number.
 * @function
 * @since 0.12.0
 * @group Math
 * @param x - A number
 * @returns The natural logarithm (base e) of x. If x is less than 0, NaN is returned.
 * @example
 * ```ts
 * mathLog(1); // 0
 * mathLog(Math.E); // 1
 * mathLog(10); // 2.302585092994046
 * mathLog(-1); // NaN
 * ```
 */
export const mathLog = (/*#__PURE__*/_pureRef<typeof Math.log>(MathCls, "log"));
