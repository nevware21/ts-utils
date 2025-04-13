/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrSlice, CALL, NULL_VALUE } from "../internal/constants";

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
 * @since 0.9.3
 * @group Array
 * @group ArrayLike
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
 * @example
 * ```ts
 * const lyrics = ["Hello", "Darkness", "my", "old", "friend.", "I've", "come", "to", "talk" ];
 *
 * arrSlice(lyrics);        // [ "Hello", "Darkness", "my", "old", "friend.", "I've", "come", "to", "talk" ]
 * arrSlice(lyrics, 1, 3);  // [ "Darkness", "my" ]
 * arrSlicw(lyrics, 2);     // [ "my", "old", "friend.", "I've", "come", "to", "talk" ]
 * arrSlice(lyrics, 2, 4);  // [ "my", "old" ]
 * arrSlice(lyrics, 1, 5);  // [ "Darkness", "my", "old", "friend." ]
 * arrSlice(lyrics, -2);    // [ "to", "talk" ]
 * arrSlice(lyrics, 2, -1); // [ "my", "old", "friend.", "I've", "come", "to" ]
 * ```
 */
export function arrSlice<T>(theArray: ArrayLike<T>, start?: number, end?: number): T[] {
    return ((theArray ? (theArray as any)["slice"] : NULL_VALUE) || ArrSlice).apply(theArray, ArrSlice[CALL](arguments, 1));
}
