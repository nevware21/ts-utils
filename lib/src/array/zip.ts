/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike } from "../helpers/base";
import { getLength } from "../helpers/length";
import { mathMin } from "../math/min_max";

/**
 * The arrZip() method creates a new array of grouped elements, where the first array contains
 * the first elements of each input array, the second array contains the second elements, and so on.
 * The length of the result is determined by the shortest input array.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @param arrays - Two or more arrays to zip together
 * @returns A new array of arrays, grouped by index
 * @example
 * ```ts
 * arrZip([1, 2, 3], ["a", "b", "c"]);           // [[1, "a"], [2, "b"], [3, "c"]]
 * arrZip([1, 2], ["a", "b", "c"]);              // [[1, "a"], [2, "b"]]
 * arrZip([1, 2, 3], ["a", "b"], [true, false]); // [[1, "a", true], [2, "b", false]]
 * arrZip([1], []);                              // []
 *
 * // Array-like objects
 * arrZip({ length: 2, 0: 1, 1: 2 }, ["x", "y"]); // [[1, "x"], [2, "y"]]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrZip(...arrays: ArrayLike<any>[]): any[][] {
    let result: any[][];

    if (arrays.length !== 0) {
        // Filter out null/undefined arrays and find the minimum length
        const validArrays: ArrayLike<any>[] = [];

        for (let i = 0; i < arrays.length; i++) {
            if (isArrayLike(arrays[i])) {
                validArrays.push(arrays[i]);
            }
        }
        
        if (validArrays.length !== 0) {
            // Find the minimum length among all valid arrays
            let minLen = Infinity;

            for (let lp = 0; lp < validArrays.length; lp++) {
                minLen = mathMin(minLen, getLength(validArrays[lp]));
            }
            
            if (isFinite(minLen) && minLen !== 0) {
                result = [];

                for (let lp = 0; lp < minLen; lp++) {
                    const group: any[] = [];

                    for (let j = 0; j < validArrays.length; j++) {
                        group.push(validArrays[j][lp]);
                    }

                    result.push(group);
                }
            }
        }
    }
    
    return result || [];
}
