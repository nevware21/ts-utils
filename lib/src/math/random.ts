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
 * The `mathRandom()` function returns a floating-point, pseudo-random number in the range 0 to less than 1
 * (inclusive of 0, but not 1) with approximately uniform distribution over that range.
 * @function
 * @since 0.12.0
 * @group Math
 * @returns A floating-point, pseudo-random number between 0 (inclusive) and 1 (exclusive).
 * @example
 * ```ts
 * mathRandom(); // a random number between 0 and 1
 * mathRandom() * 10; // a random number between 0 and 10
 * Math.floor(mathRandom() * 100); // a random integer between 0 and 99
 * ```
 */
export const mathRandom = (/*#__PURE__*/_pureRef<typeof Math.random>(MathCls, "random"));
