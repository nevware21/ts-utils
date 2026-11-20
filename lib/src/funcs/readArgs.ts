/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrSlice } from "../array/slice";
import { LENGTH, UNDEF_VALUE } from "../internal/constants";
import { _getMapSetValues, _iterForOf } from "../iterator/forOf";
import { _getIterKey } from "../iterator/iterator";
import { fnCall } from "./funcs";
import { objHasOwn } from "../object/has_own";
import { _pushOwnValue } from "../object/define";

/**
 * Read the arguments from the provided array, iterator /  or generator function
 * When processing an Iterable and a negative start or end is provided the entire
 * iterator will be processed into an array before applying the start / end restrictions
 * and when undefined or \>= 0 any iterator will not be fully processed.
 * @param theArgs - The arguments to process, may be ArrayLike or an Iterable
 * @param start - Zero-based index at which to start extraction, converted to an integer.
 * - Negative index counts back from the end of the array or iteration
 * - if start \< 0, start + (array.length || iterator.count) is used.
 * - If start \< -array.length or start is omitted, 0 is used.
 * - If start \>= array.length, nothing is extracted.
 * @param end - Zero-based index at which to end extraction, converted to an integer. readArgs() extracts
 * up to but not including end.
 * - Negative index counts back from the end of the array — if end \< 0, end + array.length is used.
 * - If end \< -array.length, 0 is used.
 * - If end \>= array.length or end is omitted, array.length is used, causing all elements until the
 * end to be extracted.
 * - If end is positioned before or at start after normalization, nothing is extracted.
 * @returns A new array with the extracted elements
 * @example
 * ```ts
 * function myFunc<T>(firstArg: T, ...otherArgs) {
 *    // Read all of the arguments
 *    let allArgs = readArgs(arguments);
 *
 *    // Get all of the arguments after the first
 *    let optArgs = readArgs(arguments, 1);
 * }
 *
 * myFunc("Hello");
 * myFunc("Hello", "Darkness", "my", "old", "friend", ".");
 *
 * function* myGenerator() {
 *   yield "Hello";
 *   yield "Darkness";
 *   yield "my";
 *   yield "old";
 *   yield "friend";
 * }
 *
 * function* myGenerator2() {
 *   yield "I've";
 *   yield "come";
 *   yield "to";
 *   yield "talk";
 *   yield "with";
 *   yield "you";
 *   yield "again";
 * }
 *
 * readArgs(myGenerator());
 * // [ "Hello", "Darkness", "my", "old", "friend"]);
 *
 * readArgs(myGenerator(), 1);
 * // [ "Darkness", "my", "old", "friend"]);
 *
 * readArgs(myGenerator2());
 * // [ "I've", "come", "to", "talk", "with", "you", "again" ]);
 *
 * readArgs(myGenerator2(), 0, -2);
 * // [ "I've", "come", "to", "talk", "with" ]);
 *
 * readArgs(myGenerator2(), -3, -2);
 * // [ "with" ]);

 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function readArgs<T = any>(theArgs: ArrayLike<T> | Iterable<T>, start?: number, end?: number): T[] {
    
    if (!objHasOwn(theArgs, LENGTH)) {
        // Does not contain a length property so lets check if it's an iterable
        // IArgument is both ArrayLike and an iterable, so prefering to treat it as
        // an array for performance
        let iterFn: any = (theArgs as any)[_getIterKey()];
        if (iterFn) {
            let values: T[] = [];
            let to = end < 0 || start < 0 ? UNDEF_VALUE : end;
            _iterForOf<T>(fnCall(iterFn, theArgs), (value, cnt) => {
                // Like arrSlice() the start and end are converted to integers, as cnt + 1 <= x is only true when cnt is
                // before the truncated x (so a fraction is truncated, and it's never true for NaN, which is 0)
                if (to !== UNDEF_VALUE && !(cnt + 1 <= to)) {
                    return -1;
                }

                if (!(cnt + 1 <= start)) {
                    // Like Array.from() each value is added as an own property
                    _pushOwnValue(values, value);
                }
            });

            if ((start === UNDEF_VALUE || start >= 0) && (end === UNDEF_VALUE || end >= 0)) {
                return values;
            }

            // The values before a positive start were not added, so only a negative (or NaN) start is still applied
            theArgs = values;
            start = start > 0 ? 0 : start;
        } else {
            // A Map or Set which isn't iterable (eg. IE 11) is read from a copy of its entries / values
            theArgs = _getMapSetValues(theArgs) || theArgs;
        }
    }

    return arrSlice(theArgs as ArrayLike<T>, start, end);
}
