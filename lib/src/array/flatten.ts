/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArray, isArrayLike, isUndefined } from "../helpers/base";
import { arrForEach } from "./forEach";

function _addItems(result: any[], arr: any, d: number): void {
    const arrLen = arr.length;
    let arrIdx = 0;
    
    while (arrIdx < arrLen) {
        const item = arr[arrIdx];
        if (d > 0 && isArray(item)) {
            _addItems(result, item, d - 1);
        } else {
            result.push(item);
        }

        arrIdx++;
    }
}


/**
 * The arrFlatten() method returns a new array with all sub-array elements flattened
 * up to the specified depth (default 1).
 * @function
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @param theArray - The array or array-like object to flatten
 * @param depth - The flattening depth, defaults to 1. Use Infinity for complete flattening
 * @returns A new flattened array
 * @example
 * ```ts
 * arrFlatten([1, [2, 3], [4, [5, 6]]]);           // [1, 2, 3, 4, [5, 6]]
 * arrFlatten([1, [2, 3], [4, [5, 6]]], 2);        // [1, 2, 3, 4, 5, 6]
 * arrFlatten([1, [2, 3], [4, [5, 6]]], Infinity); // [1, 2, 3, 4, 5, 6]
 * arrFlatten([1, 2, 3]);                          // [1, 2, 3]
 * arrFlatten([]);                                 // []
 *
 * // With array-like objects
 * arrFlatten({ length: 2, 0: 1, 1: [2, 3] });     // [1, 2, 3]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrFlatten<T>(theArray: ArrayLike<T | any[]> | null | undefined, depth?: number): any[] {
    const result: any[] = [];

    if (isArrayLike(theArray)) {
        const d = isUndefined(depth) ? 1 : depth;

        arrForEach(theArray, (item) => {
            if (d > 0 && isArray(item)) {
                _addItems(result, item, d - 1);
            } else {
                result.push(item);
            }
        });
    }

    return result;
}
