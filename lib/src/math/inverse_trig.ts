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
 * The `mathAsin()` function returns the arcsine of a number.
 * @function
 * @since 0.12.0
 * @group Math
 * @param x - A number between -1 and 1, inclusive
 * @returns The arcsine (in radians) of the given number, a value between -π/2 and π/2
 * @example
 * ```ts
 * mathAsin(0); // 0
 * mathAsin(1); // 1.5707963267948966 (π/2)
 * mathAsin(-1); // -1.5707963267948966 (-π/2)
 * mathAsin(0.5); // 0.5235987755982989 (approximately π/6)
 * ```
 */
export const mathAsin = (/*#__PURE__*/_pureRef<typeof Math.asin>(MathCls, "asin"));

/**
 * The `mathAcos()` function returns the arccosine of a number.
 * @function
 * @since 0.12.0
 * @group Math
 * @param x - A number between -1 and 1, inclusive
 * @returns The arccosine (in radians) of the given number, a value between 0 and π
 * @example
 * ```ts
 * mathAcos(0); // 1.5707963267948966 (π/2)
 * mathAcos(1); // 0
 * mathAcos(-1); // 3.141592653589793 (π)
 * mathAcos(0.5); // 1.0471975511965979 (approximately π/3)
 * ```
 */
export const mathAcos = (/*#__PURE__*/_pureRef<typeof Math.acos>(MathCls, "acos"));

/**
 * The `mathAtan()` function returns the arctangent of a number.
 * @function
 * @since 0.12.0
 * @group Math
 * @param x - A number
 * @returns The arctangent (in radians) of the given number, a value between -π/2 and π/2
 * @example
 * ```ts
 * mathAtan(0); // 0
 * mathAtan(1); // 0.7853981633974483 (approximately π/4)
 * mathAtan(Infinity); // 1.5707963267948966 (π/2)
 * ```
 */
export const mathAtan = (/*#__PURE__*/_pureRef<typeof Math.atan>(MathCls, "atan"));

/**
 * The `mathAtan2()` function returns the angle in the plane (in radians) between the positive
 * x-axis and the ray from (0,0) to the point (x,y).
 * @function
 * @since 0.12.0
 * @group Math
 * @param y - The y coordinate
 * @param x - The x coordinate
 * @returns The arctangent of the quotient of the arguments
 * @example
 * ```ts
 * mathAtan2(1, 1); // 0.7853981633974483 (approximately π/4)
 * mathAtan2(1, 0); // 1.5707963267948966 (π/2)
 * mathAtan2(0, 1); // 0
 * mathAtan2(-1, -1); // -2.356194490192345 (approximately -3π/4)
 * ```
 */
export const mathAtan2 = (/*#__PURE__*/_pureRef<typeof Math.atan2>(MathCls, "atan2"));
