/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArray, isMapLike, isObject, isSetLike, isStrictNullOrUndefined, isString } from "./base";
import { objKeys } from "../object/object";

/**
 * Checks if a value is empty. Works with strings, arrays, objects, maps, and sets.
 * Returns true for null or undefined.
 * @group Value Check
 * @param value - The value to check
 * @returns True if the value is empty or null/undefined
 * @example
 * ```ts
 * isEmpty("");                    // true
 * isEmpty([]);                    // true
 * isEmpty({});                    // true
 * isEmpty(new Map());             // true
 * isEmpty(new Set());             // true
 * isEmpty(null);                  // true
 * isEmpty(undefined);             // true
 *
 * isEmpty("hello");               // false
 * isEmpty([1, 2, 3]);             // false
 * isEmpty({ key: "value" });      // false
 * isEmpty(new Map([["a", 1]]));   // false
 * isEmpty(new Set([1, 2]));       // false
 * ```
 */
export function isEmpty(value: any): boolean {
    let result = isStrictNullOrUndefined(value);

    if (!result) {
        if (isString(value) || isArray(value)) {
            result = (value.length === 0);
        } else if (isMapLike(value) || isSetLike(value)) {
            result = (value.size === 0);
        } else if (isObject(value)) {
            result = objKeys(value).length === 0;
        }
    }
    
    return result;
}
