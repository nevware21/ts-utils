/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrProto } from "../internal/constants";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { polyArrIncludes } from "../polyfills/array";

/**
 * The arrIncludes() method determines whether an array includes a certain value among its
 * entries, returning true or false as appropriate.
 * @function
 * @since 0.8.0
 * @group Array
 * @group ArrayLike
 * @param theArray - The array or array like object of elements to be searched.
 * @param searchElement - The value to search for
 * @param fromIndex - The optional Zero-based index at which to start searching, converted to an integer.
 * - Negative index counts back from the end of the array — if fromIndex \< 0, fromIndex + array.length
 * is used. However, the array is still searched from front to back in this case.
 * - If fromIndex \< -array.length or fromIndex is omitted, 0 is used, causing the entire array to be searched.
 * - If fromIndex \>= array.length, the array is not searched and false is returned.
 * @returns A boolean value which is true if the value searchElement is found within the array (or the part of
 * the array indicated by the index fromIndex, if specified).
 * @example
 * ```ts
 * arrIncludes([1, 2, 3], 2);       // true
 * arrIncludes([1, 2, 3], 4);       // false
 * arrIncludes([1, 2, 3], 3, 3);    // false
 * arrIncludes([1, 2, 3], 3, -1);   // true
 * arrIncludes([1, 2, NaN], NaN);   // true
 * arrIncludes(["1", "2", "3"], 3 as any); // false
 *
 * // Array Like
 * arrIncludes({ length: 3, 0: 1, 1: 2, 2: 3 }, 2);       // true
 * arrIncludes({ length: 3, 0: 1, 1: 2, 2: 3 }, 4);       // false
 * arrIncludes({ length: 3, 0: 1, 1: 2, 2: 3 }, 3, 3);    // false
 * arrIncludes({ length: 3, 0: 1, 1: 2, 2: 3 }, 3, -1);   // true
 * arrIncludes({ length: 3, 0: 1, 1: 2, 2: NaN }, NaN);   // true
 * arrIncludes({ length: 3, 0: "1", 1: "2", 2: "3" }, 3 as any); // false
 * ```
 */
export const arrIncludes: <T>(theArray: ArrayLike<T>, searchElement: T, fromIndex?: number) => boolean = (/*#__PURE__*/_unwrapFunctionWithPoly("includes", ArrProto, polyArrIncludes));

/**
 * The arrContains() method determines whether an array contains a certain value among its
 * entries, returning true or false as appropriate.
 * @function
 * @since 0.8.0
 * @group Array
 * @group ArrayLike
 * @param theArray - The array or array like object of elements to be searched.
 * @param searchElement - The value to search for
 * @param fromIndex - The optional Zero-based index at which to start searching, converted to an integer.
 * - Negative index counts back from the end of the array — if fromIndex \< 0, fromIndex + array.length
 * is used. However, the array is still searched from front to back in this case.
 * - If fromIndex \< -array.length or fromIndex is omitted, 0 is used, causing the entire array to be searched.
 * - If fromIndex \>= array.length, the array is not searched and false is returned.
 * @returns A boolean value which is true if the value searchElement is found within the array (or the part of
 * the array indicated by the index fromIndex, if specified).
 * @example
 * ```ts
 * arrContains([1, 2, 3], 2);       // true
 * arrContains([1, 2, 3], 4);       // false
 * arrContains([1, 2, 3], 3, 3);    // false
 * arrContains([1, 2, 3], 3, -1);   // true
 * arrContains([1, 2, NaN], NaN);   // true
 * arrContains(["1", "2", "3"], 3 as any); // false
 *
 * // Array Like
 * arrContains({ length: 3, 0: 1, 1: 2, 2: 3 }, 2);       // true
 * arrContains({ length: 3, 0: 1, 1: 2, 2: 3 }, 4);       // false
 * arrContains({ length: 3, 0: 1, 1: 2, 2: 3 }, 3, 3);    // false
 * arrContains({ length: 3, 0: 1, 1: 2, 2: 3 }, 3, -1);   // true
 * arrContains({ length: 3, 0: 1, 1: 2, 2: NaN }, NaN);   // true
 * arrContains({ length: 3, 0: "1", 1: "2", 2: "3" }, 3 as any); // false
 * ```
 */
export const arrContains: <T>(theArray: ArrayLike<T>, searchElement: T, fromIndex?: number) => boolean = arrIncludes;
