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
 * The `mathSin()` function returns the sine of a number.
 * @function
 * @since 0.12.0
 * @group Math
 * @param x - A number (given in radians)
 * @returns The sine of the given number
 * @example
 * ```ts
 * mathSin(0); // 0
 * mathSin(Math.PI / 2); // 1
 * mathSin(Math.PI); // 0 (approximately)
 * ```
 */
export const mathSin = (/*#__PURE__*/_pureRef<typeof Math.sin>(MathCls, "sin"));

/**
 * The `mathCos()` function returns the cosine of a number.
 * @function
 * @since 0.12.0
 * @group Math
 * @param x - A number (given in radians)
 * @returns The cosine of the given number
 * @example
 * ```ts
 * mathCos(0); // 1
 * mathCos(Math.PI / 2); // 0 (approximately)
 * mathCos(Math.PI); // -1
 * ```
 */
export const mathCos = (/*#__PURE__*/_pureRef<typeof Math.cos>(MathCls, "cos"));

/**
 * The `mathTan()` function returns the tangent of a number.
 * @function
 * @since 0.12.0
 * @group Math
 * @param x - A number (given in radians)
 * @returns The tangent of the given number
 * @example
 * ```ts
 * mathTan(0); // 0
 * mathTan(Math.PI / 4); // 1 (approximately)
 * mathTan(Math.PI / 2); // Infinity or a very large number (depending on implementation)
 * ```
 */
export const mathTan = (/*#__PURE__*/_pureRef<typeof Math.tan>(MathCls, "tan"));
