/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike, isFunction } from "../helpers/base";
import { objHasOwn } from "../object/has_own";
import { asString } from "../string/as_string";
import { isSymbol } from "../symbol/symbol";
import { arrForEach } from "./forEach";

/**
 * Callback function type used by {@link arrGroupBy} to derive a group key for each element.
 * The function is called once per element and must return a `string`, `number`, or `symbol`
 * that identifies which group the element belongs to. Elements that map to the same key are
 * collected into the same array in the result object.
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @param value - The current element of the array being processed.
 * @param index - The zero-based index of the current element in the array.
 * @param array - The array (or array-like object) that {@link arrGroupBy} was called on.
 * @returns A `string`, `number`, or `symbol` that identifies the group for the current element.
 * @example
 * ```ts
 * // Group numbers as "even" or "odd"
 * const parity: ArrGroupByCallbackFn<number> = (n) => n % 2 === 0 ? "even" : "odd";
 *
 * arrGroupBy([1, 2, 3, 4, 5], parity);
 * // { odd: [1, 3, 5], even: [2, 4] }
 * ```
 * @example
 * ```ts
 * // Group objects by a property value
 * interface Person { name: string; dept: string; }
 *
 * const byDept: ArrGroupByCallbackFn<Person> = (p) => p.dept;
 *
 * const people: Person[] = [
 *     { name: "Alice", dept: "eng" },
 *     { name: "Bob",   dept: "hr"  },
 *     { name: "Carol", dept: "eng" }
 * ];
 *
 * arrGroupBy(people, byDept);
 * // {
 * //   eng: [{ name: "Alice", dept: "eng" }, { name: "Carol", dept: "eng" }],
 * //   hr:  [{ name: "Bob",   dept: "hr"  }]
 * // }
 * ```
 * @example
 * ```ts
 * // Use the element index to create fixed-size buckets
 * const bucket: ArrGroupByCallbackFn<string> = (_v, idx) => idx % 3;
 *
 * arrGroupBy(["a", "b", "c", "d", "e"], bucket);
 * // { 0: ["a", "d"], 1: ["b", "e"], 2: ["c"] }
 * ```
 */
export type ArrGroupByCallbackFn<T> = (value: T, index: number, array: ArrayLike<T>) => string | number | symbol;

/**
 * The arrGroupBy() method groups array elements by the result of a callback function,
 * returning an object where keys are group identifiers and values are arrays of grouped elements.
 * @function
 * @since 0.14.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the base type of array elements
 * @param theArray - The array or array-like object to group
 * @param callbackFn - Function that determines the group key for each element
 * @param thisArg - The value to use as 'this' when executing callbackFn
 * @returns An object with group keys as properties and arrays of grouped elements as values
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5, 6];
 * const grouped = arrGroupBy(numbers, (n) => n % 2 === 0 ? "even" : "odd");
 * // { odd: [1, 3, 5], even: [2, 4, 6] }
 *
 * const people = [
 *   { name: "Alice", age: 30 },
 *   { name: "Bob", age: 25 },
 *   { name: "Charlie", age: 30 }
 * ];
 * const byAge = arrGroupBy(people, (p) => p.age);
 * // { "25": [{ name: "Bob", age: 25 }], "30": [{ name: "Alice", age: 30 }, { name: "Charlie", age: 30 }] }
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrGroupBy<T>(
    theArray: ArrayLike<T> | null | undefined,
    callbackFn: ArrGroupByCallbackFn<T>,
    thisArg?: any
): Record<string | number | symbol, T[]> {
    const result: Record<string | number | symbol, T[]> = {};
    
    if (isArrayLike(theArray) && isFunction(callbackFn)) {
        arrForEach(theArray, (item, idx) => {
            const keyVal = callbackFn.call(thisArg, item, idx, theArray);
            const theKey = isSymbol(keyVal) ? keyVal : asString(keyVal);
           
            if (!objHasOwn(result, theKey)) {
                result[theKey] = [];
            }

            result[theKey].push(item);
        });
    }

    return result;
}
