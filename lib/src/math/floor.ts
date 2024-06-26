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
 * The `mathFloor()` function returns the largest integer less than or equal to a given number.
 * @group Math
 * @param x - A number
 * @returns A number representing the largest integer less than or equal to the specified number.
 */
export const mathFloor = (/*#__PURE__*/_pureRef<typeof Math.floor>(MathCls, "floor"));

/**
 * The `mathCeil()` function always rounds a number up to the next largest integer.
 * @group Math
 * @param x - A number
 * @returns The smallest integer greater than or equal to the given number.
 */
export const mathCeil = (/*#__PURE__*/_pureRef<typeof Math.ceil>(MathCls, "ceil"));
