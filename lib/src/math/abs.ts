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
 * The `mathAbs()` function returns the absolute value of a number.
 * If the value is negative, it returns the positive value. If the value is
 * already positive, it returns the value unchanged.
 * @function
 * @since 0.12.0
 * @group Math
 * @param x - A number
 * @returns The absolute value of x. If x is negative, it returns -x. If x is 0, it returns 0.
 * @example
 * ```ts
 * mathAbs(-5); // 5
 * mathAbs(5); // 5
 * mathAbs(-3.14); // 3.14
 * mathAbs(0); // 0
 * ```
 */
export const mathAbs = (/*#__PURE__*/_pureRef<typeof Math.abs>(MathCls, "abs"));
