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
 * The mathMin() function returns the lowest-valued number passed into it, or NaN if any
 * parameter isn't a number and can't be converted into one.
 *
 * If no arguments are given, the result is Infinity.
 *
 * If at least one of arguments cannot be converted to a number, the result is NaN.
 *
 * @function
 * @since 0.4.2
 * @group Math
 * @param values - Zero or more numbers among which the lowest value will be selected and returned.
 * @returns The smallest of the given numbers. If any one or more of the parameters cannot
 * be converted into a number, NaN is returned. The result is Infinity if no parameters are provided.
 * @example
 * ```ts
 * const x = 10, y = -20;
 * const z = Math.min(x, y); // -20
 * ```
 */
export const mathMin: (...values: number[]) => number = (/*#__PURE__*/_pureRef<typeof Math.min>(MathCls, "min"));

/**
 * The `mathMax()` function returns the largest of the zero or more numbers given as input
 * parameters, or NaN if any parameter isn't a number and can't be converted into one.
 *
 * If no arguments are given, the result is -Infinity.
 *
 * If at least one of arguments cannot be converted to a number, the result is NaN.
 *
 * @function
 * @since 0.4.2
 * @group Math
 * @param values - Zero or more numbers among which the largest value will be selected and returned.
 * @returns The largest of the given numbers. If any one or more of the parameters cannot be
 * converted into a number, NaN is returned. The result is -Infinity if no parameters are provided.
 * @example
 * ```ts
 * mathMax(10, 20);   //  20
 * mathMax(-10, -20); // -10
 * mathMax(-10, 20);  //  20
 * ```
 */
export const mathMax: (...values: number[]) => number = (/*#__PURE__*/_pureRef<typeof Math.max>(MathCls, "max"));
