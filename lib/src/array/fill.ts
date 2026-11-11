/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrProto, UNDEF_VALUE } from "../internal/constants";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { isArrayLike } from "../helpers/base";
import { _toLength } from "../helpers/length";
import { WritableArrayLike } from "../helpers/arrayLike";

/**
 * @internal
 * @ignore
 * Converts a start / end value into the position within the array that it identifies, which is always in range.
 * @param value - The value to convert (NaN becomes 0)
 * @param len - The length of the array
 * @returns The position within the array
 */
/*#__NO_SIDE_EFFECTS__*/
function _getFillIdx(value: number, len: number): number {
    let idx = +value || 0;

    // Check the bounds before truncating, which uses % as a bitwise operator would wrap the indexes of an array longer than 2^31
    if (idx <= -len) {
        return 0;
    }

    if (idx >= len) {
        return len;
    }

    idx -= idx % 1;

    return idx < 0 ? len + idx : idx;
}

/**
 * The arrFill() method changes all elements in an array to a static value, from a start index
 * (default 0) to an end index (default array.length). It returns the modified array.
 * This method mutates the array.
 * @function
 * @since 0.14.0
 * @group Array
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array to fill
 * @param value - Value to fill the array with
 * @param start - Start index (inclusive), defaults to 0. Negative index counts from the end
 * @param end - End index (exclusive), defaults to array.length. Negative index counts from the end
 * @returns The modified array
 * @example
 * ```ts
 * arrFill([1, 2, 3], 0);              // [0, 0, 0]
 * arrFill([1, 2, 3], 4, 1);           // [1, 4, 4]
 * arrFill([1, 2, 3], 5, 1, 2);        // [1, 5, 3]
 * arrFill([1, 2, 3], 6, -2);          // [1, 6, 6]
 * arrFill([1, 2, 3], 7, -3, -1);      // [7, 7, 3]
 * arrFill([], 1);                     // []
 * ```
 */
export const arrFill = (/*#__PURE__*/_unwrapFunctionWithPoly("fill", ArrProto, polyArrFill) as <T>(theArray: WritableArrayLike<T>, value: T, start?: number, end?: number) => WritableArrayLike<T>);

/**
 * Polyfill implementation of Array.fill() for environments that don't support it.
 * @function
 * @since 0.14.0
 * @group Array
 * @group Polyfill
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array to fill
 * @param value - Value to fill the array with
 * @param start - Start index (inclusive), defaults to 0
 * @param end - End index (exclusive), defaults to array.length
 * @returns The modified array
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyArrFill<T>(theArray: WritableArrayLike<T>, value: T, start?: number, end?: number): WritableArrayLike<T> {
    if (isArrayLike(theArray)) {
        const len = _toLength(theArray.length);
        const startIdx = _getFillIdx(start, len);
        const endIdx = end === UNDEF_VALUE ? len : _getFillIdx(end, len);
        
        // Fill the array
        for (let i = startIdx; i < endIdx; i++) {
            theArray[i] = value;
        }
    }
    
    return theArray;
}
