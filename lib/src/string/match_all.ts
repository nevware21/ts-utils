/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction, isRegExp, isStrictNullOrUndefined } from "../helpers/base";
import { throwTypeError } from "../helpers/throw";
import { EMPTY, StrProto } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { asString } from "./as_string";
import { mathMax } from "../math/min_max";
import { getKnownSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";
import { createIterableIterator } from "../iterator/create";

/**
 * The `strMatchAll()` method returns an iterator of all results matching a string against a
 * regular expression, including capturing groups. Unlike {@link strMatch}, it returns every
 * match in the string (not just the first) and each result includes full `RegExpExecArray`
 * details: matched substrings, capture groups, the match `index`, and the original `input` string.
 *
 * If `matcher` is a `RegExp` it **must** have the global (`g`) flag set; a non-global `RegExp`
 * throws a `TypeError`. If `matcher` is not a `RegExp`, native behavior is followed by creating
 * a global `RegExp` from the matcher value (for example, `"."` matches any character and
 * `undefined` behaves as an empty pattern).
 *
 * If `matcher` is an object that implements `[Symbol.matchAll]`, that method is called instead,
 * allowing custom matcher objects to control the iteration.
 *
 * @function
 * @since 0.14.0
 * @group String
 * @param value - The string value to search.
 * @param matcher - A `RegExp` with the global flag set, a matcher value used to create a global
 * `RegExp`, or any object with a `[Symbol.matchAll]` method.
 * @returns An `IterableIterator<RegExpExecArray>` where each `RegExpExecArray` contains:
 * - `[0]` — the full matched substring
 * - `[1..n]` — captured groups (or `undefined` for unmatched optional groups)
 * - `.index` — zero-based index of the match in `value`
 * - `.input` — the original string
 * - `.groups` — named capture groups object, or `undefined` if no named captures
 * @throws `TypeError` if `matcher` is a `RegExp` without the global (`g`) flag.
 * @throws `TypeError` if `value` is `null` or `undefined`.
 * @example
 * ```ts
 * // Basic global regex — all matches with capture groups
 * const matches = [...strMatchAll("test1 test2 test3", /test(\d)/g)];
 * matches.length;  // 3
 * matches[0][0];   // "test1"
 * matches[0][1];   // "1"
 * matches[0].index; // 0
 * matches[1][0];   // "test2"
 * matches[2][1];   // "3"
 * ```
 * @example
 * ```ts
 * // Named capture groups
 * const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/g;
 * const dates = [...strMatchAll("2024-01-15 and 2025-06-30", re)];
 * dates[0].groups; // { year: "2024", month: "01", day: "15" }
 * dates[1].groups; // { year: "2025", month: "06", day: "30" }
 * ```
 * @example
 * ```ts
 * // String matcher — treated like native RegExp(pattern, "g")
 * const hits = [...strMatchAll("banana", "an")];
 * hits.length;    // 2
 * hits[0].index;  // 1
 * hits[1].index;  // 3
 * ```
 * @example
 * ```ts
 * // Non-global RegExp throws TypeError
 * strMatchAll("hello", /l/); // throws TypeError
 * ```
 */
export const strMatchAll: (value: string, matcher: string | RegExp) => IterableIterator<RegExpExecArray> = (/*#__PURE__*/_unwrapFunctionWithPoly("matchAll", StrProto as any, polyStrMatchAll));

/*#__NO_SIDE_EFFECTS__*/
function _cloneRegExp(theRegex: RegExp): RegExp {
    let flags = (theRegex as any).flags;
    if (flags === undefined) {
        flags = EMPTY;
        theRegex.global && (flags += "g");
        theRegex.ignoreCase && (flags += "i");
        theRegex.multiline && (flags += "m");
        (theRegex as any).dotAll && (flags += "s");
        theRegex.unicode && (flags += "u");
        theRegex.sticky && (flags += "y");
    }

    // eslint-disable-next-line security/detect-non-literal-regexp
    let result = new RegExp(theRegex.source, flags);
    // Normalize lastIndex using ToLength semantics: integers only, negatives clamped to 0.
    result.lastIndex = mathMax(0, theRegex.lastIndex);

    return result;
}

/*#__NO_SIDE_EFFECTS__*/
function _advanceStringIndex(value: string, index: number, unicode: boolean): number {
    let newIndex = index + 1;
    if (unicode) {
        if (index < value.length) {
            let first = value.charCodeAt(index);
            if (first >= 0xD800  && first <= 0xDBFF) {
                let second = value.charCodeAt(index + 1);
                if (second >= 0xDC00 && second <= 0xDFFF) {
                    newIndex++;
                }
            }
        }
    }

    return newIndex;
}

/**
 * Polyfill implementation of `String.prototype.matchAll()` that returns an iterator of all
 * results matching a string against a regular expression, including capturing groups.
 *
 * Matches the behaviour of the native `String.prototype.matchAll()` method:
 * - A `RegExp` `matcher` **must** carry the global (`g`) flag; passing a non-global `RegExp`
 *   throws a `TypeError`.
 * - A non-`RegExp` `matcher` is passed to `new RegExp(matcher, "g")`, mirroring native behavior.
 * - If `matcher` exposes a `[Symbol.matchAll]` method, that method is called with the coerced
 *   string value, mirroring the native delegation behaviour.
 * - Zero-length matches advance `lastIndex` using native-style `AdvanceStringIndex` behavior,
 *   including code-point advancement for unicode regexes.
 *
 * @since 0.14.0
 * @group String
 * @group Polyfill
 * @param value - The string value to search.
 * @param matcher - A `RegExp` with the global flag set, a matcher value used to create a global
 * `RegExp`, or any object with a `[Symbol.matchAll]` method.
 * @returns An `IterableIterator<RegExpExecArray>` where each `RegExpExecArray` contains:
 * - `[0]` — the full matched substring
 * - `[1..n]` — captured groups (or `undefined` for unmatched optional groups)
 * - `.index` — zero-based index of the match in `value`
 * - `.input` — the original string
 * - `.groups` — named capture groups object, or `undefined` if no named captures
 * @throws `TypeError` if `matcher` is a `RegExp` without the global (`g`) flag.
 * @throws `TypeError` if `value` is `null` or `undefined`.
 * @example
 * ```ts
 * // Basic global regex
 * const matches = [...polyStrMatchAll("test1 test2", /test(\d)/g)];
 * matches.length;   // 2
 * matches[0][0];    // "test1"
 * matches[0][1];    // "1"
 * matches[0].index; // 0
 * ```
 * @example
 * ```ts
 * // String matcher (native RegExp(pattern, "g") semantics)
 * const hits = [...polyStrMatchAll("banana", "an")];
 * hits.length;   // 2
 * hits[0].index; // 1
 * hits[1].index; // 3
 * ```
 * @example
 * ```ts
 * // Named capture groups
 * const re = /(?<word>\w+)/g;
 * const words = [...polyStrMatchAll("hello world", re)];
 * words[0].groups; // { word: "hello" }
 * words[1].groups; // { word: "world" }
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyStrMatchAll(value: string, matcher: string | RegExp): IterableIterator<RegExpExecArray> {
    _throwIfNullOrUndefined(value);

    let result: IterableIterator<RegExpExecArray>;

    // Mirror native IsRegExp semantics: a RegExp whose @@match property is explicitly set
    // to false must not be treated as a regular expression (per ECMAScript spec).
    let matchSym = getKnownSymbol(WellKnownSymbols.match);
    let isMatcherRegExp = isRegExp(matcher)
        && (!matcher || isStrictNullOrUndefined((matcher as any)[matchSym]) || (matcher as any)[matchSym] !== false);

    if (isMatcherRegExp && !(matcher as RegExp).global) {
        throwTypeError("matcher must be a global regular expression");
    }

    let theValue = asString(value);
    let matchAllFn: (regexp: string) => Iterator<RegExpExecArray> = matcher && (matcher as any)[getKnownSymbol(WellKnownSymbols.matchAll)];
    if (isFunction(matchAllFn)) {
        result = matchAllFn.call(matcher, theValue);
    } else {
        // eslint-disable-next-line security/detect-non-literal-regexp
        let theRegex: RegExp = isMatcherRegExp ? _cloneRegExp(matcher as RegExp) : new RegExp(matcher as any, "g");

        let ctx = {
            n: () => {
                let match = theRegex.exec(theValue) as RegExpExecArray;
                if (!match) {
                    return true;
                }

                if (match[0] === EMPTY) {
                    theRegex.lastIndex = _advanceStringIndex(theValue, theRegex.lastIndex, !!(theRegex as any).unicode);
                }

                ctx.v = match;
                return false;
            },
            v: undefined as RegExpExecArray
        };

        result = createIterableIterator<RegExpExecArray>(ctx);
    }

    return result;
}
