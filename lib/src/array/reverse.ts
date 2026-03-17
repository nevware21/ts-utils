/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { WritableArrayLike } from "../helpers/arrayLike";
import { ArrProto } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";

/**
 * The arrReverse() method reverses an array in place and returns the reference to the same array.
 * The first array element becomes the last, and the last array element becomes the first.
 * If you want to reverse an array without modifying the original, use arrSlice() first.
 * @function
 * @since 0.14.0
 * @group Array
 * @param theArray - The array to reverse
 * @returns The reversed array (same reference as input)
 * @example
 * ```ts
 * const arr1 = [1, 2, 3];
 * arrReverse(arr1);        // [3, 2, 1]
 * // arr1 is now [3, 2, 1]
 *
 * arrReverse(["a", "b", "c"]);  // ["c", "b", "a"]
 * arrReverse([1]);              // [1]
 * arrReverse([]);               // []
 *
 * // Non-mutating usage
 * const original = [1, 2, 3];
 * const reversed = arrReverse(arrSlice(original));
 * // original: [1, 2, 3], reversed: [3, 2, 1]
 * ```
 */
export const arrReverse: <T>(theArray: WritableArrayLike<T>) => WritableArrayLike<T> = (/*#__PURE__*/_unwrapFunction("reverse", ArrProto));
