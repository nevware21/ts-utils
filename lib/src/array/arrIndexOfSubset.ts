/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike } from "../helpers/base";
import { mathTrunc } from "../math/trunc";
import { arrIndexOf, arrLastIndexOf } from "./indexOf";

/**
 * Normalizes a fromIndex argument the same way the native `indexOf()` / `lastIndexOf()` do -- an
 * omitted (`undefined`) value falls back to defValue, while `null` and `NaN` both coerce to `0`
 * (matching `ToInteger(null) === 0`), and any other finite value is truncated towards zero.
 */
function _normalizeFromIndex(value: number | null | undefined, defValue: number): number {
    if (value === undefined) {
        return defValue;
    }

    if (value === null || isNaN(value)) {
        return 0;
    }

    return mathTrunc(value);
}

/**
 * The arrIndexOfSubset() method returns the index within {@link theArray} at which {@link subset}
 * first matches contiguously, comparing elements using strict equality (the same method used by the
 * === or triple-equals operator).
 *
 * Unlike a simple `arrIndexOf()` of the first element of {@link subset}, this continues searching
 * later occurrences of that first element until it finds one where the whole sequence lines up (or
 * exhausts {@link theArray}), which avoids landing on the wrong occurrence when values repeat -- for
 * example matching one stack trace against another when recursive calls repeat identical lines.
 *
 * If {@link theArray} has fewer remaining elements than {@link subset} from a candidate position, the
 * comparison is limited to just those available elements -- so a {@link subset} that "runs off the end"
 * of {@link theArray} is still considered a match against its available prefix. This makes it possible
 * to match a shorter (eg. truncated) array against a longer one, or vice-versa.
 * @function
 * @since 0.17.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array or array-like object of elements to be searched.
 * @param subset - The (ordered) array or array-like object of elements to locate within theArray.
 * @param fromIndex - The index to start the search at. If the provided index value is a negative
 * number, it is taken as the offset from the end of theArray. Default: 0 (search from the start).
 * @returns The index within theArray at which subset fully matches (or matches theArray's available
 * elements from that position), or -1 if no such position exists. Returns fromIndex (normalized to a
 * valid index, or the length of theArray) if subset is empty.
 * @example
 * ```ts
 * arrIndexOfSubset([1, 2, 3, 4, 5], [3, 4]);        // 2
 * arrIndexOfSubset([1, 2, 3, 4, 5], [4, 3]);        // -1
 * arrIndexOfSubset(["a", "b", "a", "b", "c"], ["b", "c"]); // 3
 * arrIndexOfSubset([1, 2, 3], [3, 4, 5]);           // 2 (matches the available "3")
 * arrIndexOfSubset([1, 2, 3], []);                  // 0
 *
 * // Repeated values -- a plain indexOf() of the first element would land on index 0
 * let haystack = ["at foo", "at bar", "at foo", "at bar", "at baz"];
 * arrIndexOfSubset(haystack, ["at foo", "at bar", "at baz"]); // 2
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrIndexOfSubset<T>(theArray: ArrayLike<T>, subset: ArrayLike<T>, fromIndex?: number): number {
    if (!isArrayLike(theArray) || !isArrayLike(subset)) {
        return -1;
    }

    let haystackLen = theArray.length;
    let subsetLen = subset.length;

    let searchFrom = _normalizeFromIndex(fromIndex, 0);
    if (searchFrom < 0) {
        searchFrom = haystackLen + searchFrom;
    }

    if (searchFrom < 0) {
        searchFrom = 0;
    }

    if (subsetLen === 0) {
        return searchFrom < haystackLen ? searchFrom : haystackLen;
    }

    while (searchFrom < haystackLen) {
        let pos = arrIndexOf(theArray, subset[0], searchFrom);
        if (pos === -1) {
            return -1;
        }

        // Only compare as many elements as are actually available in theArray from pos
        let matchLen = subsetLen < (haystackLen - pos) ? subsetLen : (haystackLen - pos);
        let isMatch = true;
        for (let lp = 1; isMatch && lp < matchLen; lp++) {
            isMatch = theArray[pos + lp] === subset[lp];
        }

        if (isMatch) {
            return pos;
        }

        searchFrom = pos + 1;
    }

    return -1;
}

/**
 * The arrLastIndexOfSubset() method returns the last index within {@link theArray} at which
 * {@link subset} matches contiguously, comparing elements using strict equality (the same method
 * used by the === or triple-equals operator). It is the mirror of {@link arrIndexOfSubset}, searching
 * backwards from {@link fromIndex} (or the end of theArray) towards the start.
 *
 * As with {@link arrIndexOfSubset}, if {@link theArray} has fewer remaining elements than
 * {@link subset} from a candidate position, the comparison is limited to just those available
 * elements -- so a {@link subset} that "runs off the end" of {@link theArray} is still considered a
 * match against its available prefix.
 * @function
 * @since 0.17.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array or array-like object of elements to be searched.
 * @param subset - The (ordered) array or array-like object of elements to locate within theArray.
 * @param fromIndex - The index to start searching backwards from (the position at which subset's
 * first element may occur). If the provided index value is a negative number, it is taken as the
 * offset from the end of theArray. Default: theArray's length - 1 (search from the end).
 * @returns The last index within theArray at which subset fully matches (or matches theArray's
 * available elements from that position), or -1 if no such position exists. Returns fromIndex
 * (normalized to a valid index, or theArray's length) if subset is empty.
 * @example
 * ```ts
 * arrLastIndexOfSubset([1, 2, 3, 4, 5], [3, 4]);    // 2
 * arrLastIndexOfSubset([1, 2, 3, 4, 5], [4, 3]);    // -1
 * arrLastIndexOfSubset(["a", "b", "a", "b", "c"], ["a", "b"]); // 2 (the later occurrence)
 * arrLastIndexOfSubset([1, 2, 3], [3, 4, 5]);       // 2 (matches the available "3")
 * arrLastIndexOfSubset([1, 2, 3], []);              // 3
 *
 * // Repeated values -- returns the later occurrence, unlike arrIndexOfSubset()
 * let haystack = ["at foo", "at bar", "at foo", "at bar", "at baz"];
 * arrLastIndexOfSubset(haystack, ["at foo", "at bar"]); // 2
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrLastIndexOfSubset<T>(theArray: ArrayLike<T>, subset: ArrayLike<T>, fromIndex?: number): number {
    if (!isArrayLike(theArray) || !isArrayLike(subset)) {
        return -1;
    }

    let haystackLen = theArray.length;
    let subsetLen = subset.length;

    let searchFrom = _normalizeFromIndex(fromIndex, haystackLen);
    if (searchFrom < 0) {
        searchFrom = haystackLen + searchFrom;
    }

    if (searchFrom > haystackLen) {
        searchFrom = haystackLen;
    }

    if (subsetLen === 0) {
        return searchFrom < 0 ? 0 : searchFrom;
    }

    if (searchFrom > haystackLen - 1) {
        searchFrom = haystackLen - 1;
    }

    while (searchFrom >= 0) {
        let pos = arrLastIndexOf(theArray, subset[0], searchFrom);
        if (pos === -1) {
            return -1;
        }

        // Only compare as many elements as are actually available in theArray from pos
        let matchLen = subsetLen < (haystackLen - pos) ? subsetLen : (haystackLen - pos);
        let isMatch = true;
        for (let lp = 1; isMatch && lp < matchLen; lp++) {
            isMatch = theArray[pos + lp] === subset[lp];
        }

        if (isMatch) {
            return pos;
        }

        searchFrom = pos - 1;
    }

    return -1;
}
