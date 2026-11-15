/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike, isStrictUndefined } from "../helpers/base";
import { _toLength } from "../helpers/length";
import { mathToInt } from "../math/to_int";

/**
 * Searches theArray for the subset, forwards from the fromIndex (default 0) or backwards (isLast) from the fromIndex
 * (default the length). The fromIndex is normalized like the native `indexOf()` / `lastIndexOf()`, so `null` and `NaN`
 * are `0` (only an omitted value uses the default), it is truncated towards zero and a negative value is an offset
 * from the end. Only as many elements as are available in theArray from each position are compared, the elements are
 * read by index and compared with ===, so the characters of a string are compared (rather than a string's own
 * indexOf() matching a substring) and an empty slot is undefined.
 */
/*#__NO_SIDE_EFFECTS__*/
function _findSubset<T>(theArray: ArrayLike<T>, subset: ArrayLike<T>, fromIndex: number | undefined, isLast?: boolean): number {
    if (isArrayLike(theArray) && isArrayLike(subset)) {
        let len = _toLength(theArray);
        let subsetLen = _toLength(subset);
        let pos = isStrictUndefined(fromIndex) ? (isLast ? len : 0) : mathToInt(fromIndex);

        if (pos < 0) {
            pos += len;
        }

        // Forwards starts from 0 when before the start, backwards finds nothing when before the start
        pos = pos > len ? len : (pos < 0 && !isLast ? 0 : pos);
        if (!subsetLen) {
            return pos < 0 ? 0 : pos;
        }

        for (pos = isLast && pos === len ? len - 1 : pos; pos >= 0 && pos < len; pos += isLast ? -1 : 1) {
            let matchLen = subsetLen < len - pos ? subsetLen : len - pos;
            let lp = 0;
            while (lp < matchLen && theArray[pos + lp] === subset[lp]) {
                lp++;
            }

            if (lp === matchLen) {
                return pos;
            }
        }
    }

    return -1;
}

/**
 * The arrIndexOfSubset() method returns the index within `theArray` at which `subset`
 * first matches contiguously, comparing elements using strict equality (the same method used by the
 * === or triple-equals operator).
 *
 * Unlike a simple `arrIndexOf()` of the first element of `subset`, this continues searching
 * later occurrences of that first element until it finds one where the whole sequence lines up (or
 * exhausts `theArray`), which avoids landing on the wrong occurrence when values repeat -- for
 * example matching one stack trace against another when recursive calls repeat identical lines.
 *
 * If `theArray` has fewer remaining elements than `subset` from a candidate position, the
 * comparison is limited to just those available elements -- so a `subset` that "runs off the end"
 * of `theArray` is still considered a match against its available prefix. This makes it possible
 * to match a shorter (eg. truncated) array against a longer one, or vice-versa.
 *
 * The elements are read by index, so for a string its characters (UTF-16 code units) are compared
 * (a string element of `subset` never matches a substring) and an empty slot of a sparse array is
 * compared as `undefined`. As strict equality is used `NaN` never matches.
 * @function
 * @since 0.20.0
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
 * arrIndexOfSubset("abcabc", ["c", "a"]);           // 2
 * arrIndexOfSubset("abc", ["bc"]);                  // -1 (the characters are compared)
 *
 * // Repeated values -- a plain indexOf() of the first element would land on index 0
 * let haystack = ["at foo", "at bar", "at foo", "at bar", "at baz"];
 * arrIndexOfSubset(haystack, ["at foo", "at bar", "at baz"]); // 2
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrIndexOfSubset<T>(theArray: ArrayLike<T>, subset: ArrayLike<T>, fromIndex?: number): number {
    return _findSubset(theArray, subset, fromIndex);
}

/**
 * The arrLastIndexOfSubset() method returns the last index within `theArray` at which
 * `subset` matches contiguously, comparing elements using strict equality (the same method
 * used by the === or triple-equals operator). It is the mirror of {@link arrIndexOfSubset}, searching
 * backwards from `fromIndex` (or the end of theArray) towards the start.
 *
 * As with {@link arrIndexOfSubset}, if `theArray` has fewer remaining elements than
 * `subset` from a candidate position, the comparison is limited to just those available
 * elements -- so a `subset` that "runs off the end" of `theArray` is still considered a
 * match against its available prefix. The elements are also read by index, so for a string
 * its characters are compared and an empty slot of a sparse array is compared as `undefined`.
 * @function
 * @since 0.20.0
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
    return _findSubset(theArray, subset, fromIndex, true);
}
