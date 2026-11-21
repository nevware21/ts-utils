/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isStrictNullOrUndefined, isStrictUndefined } from "../helpers/base";
import { ArrSlice, CALL, LENGTH, UNDEF_VALUE } from "../internal/constants";
import { _getMapSetValues, _iterForOf } from "../iterator/forOf";
import { _getIterKey } from "../iterator/iterator";
import { fnCall } from "./funcs";
import { objHasOwn } from "../object/has_own";
import { _pushOwnValue } from "../object/define";

/**
 * Read the arguments from the provided array, iterator /  or generator function
 * When processing an Iterable and a negative start or end is provided the entire
 * iterator will be processed into an array before applying the start / end restrictions
 * and when undefined or \>= 0 any iterator will not be fully processed. A value with a `length` (eg. an array,
 * `arguments` or a string) is read like `Array.prototype.slice.call(theArgs, start, end)`, so (since 0.20.0) a new
 * array is always returned, rather than the result of the value's own `slice()` (eg. a string's). On a runtime
 * without `Symbol.iterator` (eg. IE 11, which has no iterator functions) a `Map` (its `[key, value]` entries) or `Set`
 * (its values) is read (since 0.20.0) from a copy of its entries / values.
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
 * @throws TypeError when a value without a `length` has a `[Symbol.iterator]` which isn't `null`, `undefined` or a
 * function, an iterable's `[Symbol.iterator]()` doesn't return an iterator, the iterator's `next()`
 * returns a value which is not an object, or (like `for...of`) when it stops early (at the end index) and the
 * iterator's `return()` doesn't return an object
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
        // Like Array.from() only a null or undefined [Symbol.iterator] is ignored, any other value which isn't a
        // function throws a TypeError (the runtime's own, from calling it)
        let iterFn: any = (theArgs as any)[_getIterKey()];
        if (!isStrictNullOrUndefined(iterFn)) {
            let values: T[] = [];
            let from: number;
            let to: number;
            let stop: number;
            let isConverted: boolean;

            // The start and end are each converted to a number once (like Array.from(theArgs).slice(start, end), which
            // converts them after every value has been read), after the iterator has been created and has returned its
            // first value (or is done), so an error from creating the iterator or its first next() is thrown before one
            // from converting them (and rather than when each value is compared, which
            // made reading a large iterable slower and called a valueOf() of the start / end for each value)
            let _convert = () => {
                isConverted = true;
                from = +start;
                to = isStrictUndefined(end) ? UNDEF_VALUE : +end;
                stop = to < 0 || from < 0 ? UNDEF_VALUE : to;
            };

            _iterForOf<T>(fnCall(iterFn, theArgs), (value, cnt) => {
                !isConverted && _convert();

                // Like arrSlice() the start and end are used as integers, as cnt + 1 <= x is only true when cnt is
                // before the truncated x (so a fraction is truncated, and it's never true for NaN, which is 0)
                if (stop !== UNDEF_VALUE && !(cnt + 1 <= stop)) {
                    return -1;
                }

                if (!(cnt + 1 <= from)) {
                    // Like Array.from() each value is added as an own property
                    _pushOwnValue(values, value);
                }
            });

            !isConverted && _convert();
            if ((isStrictUndefined(start) || from >= 0) && (to === UNDEF_VALUE || to >= 0)) {
                return values;
            }

            // The values before a positive start were not added, so only a negative (or NaN) start is still applied
            // (with the converted numbers, so they're not converted again)
            theArgs = values;
            start = from > 0 ? 0 : from;
            end = to;
        } else {
            // A Map or Set which isn't iterable (eg. IE 11) is read from a copy of its entries / values
            theArgs = _getMapSetValues(theArgs) || theArgs;
        }
    }

    // Like Array.prototype.slice.call(theArgs, start, end) a new array is returned (rather than using the value's own
    // slice(), eg. a string's)
    return ArrSlice[CALL](theArgs as ArrayLike<T>, start, end);
}
