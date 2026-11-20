/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike } from "../helpers/base";
import { _toLength } from "../helpers/length";
import { mathMin } from "../math/min_max";
import { LENGTH } from "../internal/constants";

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
export function arrZip(...arrays: ArrayLike<any>[]): any[][];

/*#__NO_SIDE_EFFECTS__*/
export function arrZip(): any[][] {
    // The arrays are only read, so the arguments are used rather than copied into a new array
    let arrays: ArrayLike<ArrayLike<any>> = arguments;
    let result: any[][];

    if (arrays[LENGTH] !== 0) {
        // Filter out null/undefined arrays and find the minimum length
        const validArrays: ArrayLike<any>[] = [];

        for (let i = 0; i < arrays[LENGTH]; i++) {
            if (isArrayLike(arrays[i])) {
                validArrays.push(arrays[i]);
            }
        }
        
        if (validArrays[LENGTH] !== 0) {
            // Find the minimum length among all valid arrays
            let minLen = Infinity;

            for (let lp = 0; lp < validArrays[LENGTH]; lp++) {
                minLen = mathMin(minLen, _toLength(validArrays[lp]));
            }
            
            // A result which would be longer than an array can be (2^32 - 1), eg. when every array has an Infinity length,
            // is not created (rather than adding groups until the runtime runs out of memory)
            if (minLen !== 0 && minLen <= 0xFFFFFFFF) {
                result = [];

                for (let lp = 0; lp < minLen; lp++) {
                    const group: any[] = [];

                    for (let j = 0; j < validArrays[LENGTH]; j++) {
                        group.push(validArrays[j][lp]);
                    }

                    result.push(group);
                }
            }
        }
    }
    
    return result || [];
}
