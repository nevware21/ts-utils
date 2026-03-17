/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike } from "../helpers/base";
import { normalizeJsName } from "../helpers/encode";
import { objCreate } from "../object/create";
import { objHasOwn } from "../object/has_own";
import { arrForEach } from "./forEach";

/**
 * The arrUnique() method returns a new array with duplicate elements removed.
 * Uses strict equality (===) for comparison and maintains insertion order.
 * @function
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @param theArray - The array or array-like object to remove duplicates from
 * @returns A new array with duplicate values removed, preserving order of first occurrence
 * @example
 * ```ts
 * arrUnique([1, 2, 2, 3, 1, 4]);           // [1, 2, 3, 4]
 * arrUnique(["a", "b", "a", "c"]);         // ["a", "b", "c"]
 * arrUnique([1, "1", 1, "1"]);             // [1, "1"]
 * arrUnique([]);                           // []
 * arrUnique([1]);                          // [1]
 *
 * // Array-like objects
 * arrUnique({ length: 4, 0: 1, 1: 2, 2: 2, 3: 3 });  // [1, 2, 3]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrUnique<T>(theArray: ArrayLike<T> | null | undefined): T[] {
    const result: T[] = [];

    if (isArrayLike(theArray)) {
        const seen: any = objCreate(null);

        arrForEach(theArray, (item) => {
            const key = ((typeof item) + "_" + item);
            
            if (!objHasOwn(seen, key)) {
                seen[key] = 1;
                result.push(item);
            }
        });
    }

    return result;
}
