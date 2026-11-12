/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isString } from "../helpers/base";
import { ArrProto, ArrSlice, CALL, FuncCall } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";
import { arrMap } from "./map";

/**
 * The arrSlice() method returns a shallow copy of a portion of an array into a new array object
 * selected from start to end (end not included) where start and end represent the index of items
 * in that array. The original array will not be modified.
 *
 * The `arrSlice()` method is a copying method. It does not alter this but instead returns a shallow
 * copy that contains some of the same elements as the ones from the original array.
 *
 * The `arrSlice()` method preserves empty slots. If the sliced portion is sparse, the returned arra
 * is sparse as well.
 *
 * The `arrSlice()` method is generic. It only expects the this value to have a length property and
 * integer-keyed properties.
 *
 * For both start and end, a negative index can be used to indicate an offset from the end of the array.
 * For example, -2 refers to the second to last element of the array.
 *
 * When the value has its own `slice` function it is used (like `theArray.slice(start, end)`), otherwise
 * `Array.prototype.slice` is called with the value as `this`. So for a string the result is a string, and for a value
 * whose own `slice` returns its own type, such as a typed array, the result is that type (and for a Node `Buffer` it is
 * a view of the same memory).
 * @function
 * @since 0.9.3
 * @group Array
 * @group ArrayLike
 * @param theArray - The array or array-like value to extract the elements from.
 * @param start - Zero-based index at which to start extraction, converted to an integer.
 * - Negative index counts back from the end of the array — if start \< 0, start + array.length is used.
 * - If start \< -array.length or start is omitted, 0 is used.
 * - If start \>= array.length, nothing is extracted.
 * @param end - Zero-based index at which to end extraction, converted to an integer. slice() extracts
 * up to but not including end.
 * - Negative index counts back from the end of the array — if end \< 0, end + array.length is used.
 * - If end \< -array.length, 0 is used.
 * - If end \>= array.length or end is omitted, array.length is used, causing all elements until the
 * end to be extracted.
 * - If end is positioned before or at start after normalization, nothing is extracted.
 * @returns A new array containing the extracted elements, or the result of the value's own `slice` function.
 * @example
 * ```ts
 * const lyrics = ["Hello", "Darkness", "my", "old", "friend.", "I've", "come", "to", "talk" ];
 *
 * arrSlice(lyrics);        // [ "Hello", "Darkness", "my", "old", "friend.", "I've", "come", "to", "talk" ]
 * arrSlice(lyrics, 1, 3);  // [ "Darkness", "my" ]
 * arrSlice(lyrics, 2);     // [ "my", "old", "friend.", "I've", "come", "to", "talk" ]
 * arrSlice(lyrics, 2, 4);  // [ "my", "old" ]
 * arrSlice(lyrics, 1, 5);  // [ "Darkness", "my", "old", "friend." ]
 * arrSlice(lyrics, -2);    // [ "to", "talk" ]
 * arrSlice(lyrics, 2, -1); // [ "my", "old", "friend.", "I've", "come", "to" ]
 *
 * // A value with its own slice function, which returns its own type
 * arrSlice(new Uint8Array([1, 2, 3]), 1); // Uint8Array [ 2, 3 ]
 * arrSlice("Hello", 1, 3);                // "el"
 * ```
 */
export const arrSlice: {
    // A value with its own slice() returns its result type (eg. a typed array), "any" is still any[]
    <T extends object & { slice(start?: number, end?: number): any }>(theArray: T, start?: number, end?: number): 0 extends (1 & T) ? any[] : (T extends { slice(start?: number, end?: number): infer R } ? R : never);
    // A string uses its own slice(), which returns a string
    (theArray: string, start?: number, end?: number): string;
    <T>(theArray: ArrayLike<T>, start?: number, end?: number): T[];
} = (/*#__PURE__*/_unwrapFunction<any, typeof ArrProto>("slice", ArrProto));

/**
 * @internal
 * @ignore
 * Slices the value into a new array using the Array slice function. Unlike {@link arrSlice} it doesn't use the value's
 * own slice function, which returns a string for a string, a typed array for a typed array and for a Node Buffer a view
 * of the same memory (so changing the result would change the Buffer).
 * @param theArray - The value to slice
 * @param start - The zero-based index at which to start extraction
 * @param end - The zero-based index at which to end extraction
 * @returns The new array
 */
/*#__NO_SIDE_EFFECTS__*/
export function _arrSliceToArr<T>(theArray: ArrayLike<T> | null | undefined, start?: number, end?: number): T[] {
    // ArrSlice.call(theArray, ...) passing on the arguments as-is, as an explicit undefined start / end is slower
    return (FuncCall as Function).apply(ArrSlice, arguments);
}

/**
 * @internal
 * @ignore
 * Returns the values with any string converted into an array of its characters (as a string has its own functions,
 * such as includes(), which work with substrings), the values are returned as-is (without a copy) when none of them
 * are a string.
 * @param values - The values to check
 * @returns The values, or a new array of the converted values
 */
/*#__NO_SIDE_EFFECTS__*/
export function _strArgsToArr<T>(values: ArrayLike<ArrayLike<T>>): ArrayLike<ArrayLike<T>> {
    for (let lp = 0; lp < values.length; lp++) {
        if (isString(values[lp])) {
            return arrMap(values, (value) => isString(value) ? ArrSlice[CALL](value) : value);
        }
    }

    return values;
}
