/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { MathCls } from "../internal/constants";

/**
 * The `mathFloor()` function returns the largest integer less than or equal to a given number.
 * @group Math
 * @param x - A number
 * @returns A number representing the largest integer less than or equal to the specified number.
 */
export const mathFloor = MathCls.floor;

/**
 * The `mathCeil()` function always rounds a number up to the next largest integer.
 * @group Math
 * @param x - A number
 * @returns The smallest integer greater than or equal to the given number.
 */
export const mathCeil = MathCls.ceil;
