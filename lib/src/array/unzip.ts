/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike } from "../helpers/base";
import { getLength } from "../helpers/length";
import { UNDEF_VALUE } from "../internal/constants";
import { arrForEach } from "./forEach";

/**
 * The arrUnzip() method reverses the operation of arrZip(). Given an array of grouped elements,
 * it creates multiple arrays where each contains elements from the same position in each group.
 * This is the inverse operation of arrZip().
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @param theArray - An array of arrays to unzip
 * @returns An array of arrays, ungrouped by position
 * @example
 * ```ts
 * arrUnzip([[1, "a"], [2, "b"], [3, "c"]]);           // [[1, 2, 3], ["a", "b", "c"]]
 * arrUnzip([[1, "a", true], [2, "b", false]]);        // [[1, 2], ["a", "b"], [true, false]]
 * arrUnzip([[1], [2], [3]]);                          // [[1, 2, 3]]
 * arrUnzip([]);                                       // []
 *
 * // Array-like objects
 * arrUnzip({ length: 2, 0: [1, "x"], 1: [2, "y"] });  // [[1, 2], ["x", "y"]]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrUnzip(theArray: ArrayLike<ArrayLike<any>> | null | undefined): any[][] {
    let result: any[][];

    if (isArrayLike(theArray)) {
        const len = getLength(theArray);

        if (len !== 0) {
            // Find the maximum length among all sub-arrays
            let maxLen = 0;

            arrForEach(theArray, (subArray) => {
                if (isArrayLike(subArray)) {
                    const subLen = getLength(subArray);

                    if (subLen > maxLen) {
                        maxLen = subLen;
                    }
                }
            });
            
            if (maxLen !== 0) {
                // Create result arrays
                result = [];

                for (let lp = 0; lp < maxLen; lp++) {
                    result.push([]);
                }
                
                // Fill result arrays
                arrForEach(theArray, (subArray) => {
                    if (isArrayLike(subArray)) {
                        for (let lp = 0; lp < maxLen; lp++) {
                            result[lp].push(lp < getLength(subArray) ? subArray[lp] : UNDEF_VALUE);
                        }
                    }
                });
            }
        }
    }

    return result || [];
}
