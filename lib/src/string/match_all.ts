/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { isConstructor } from "../funcs/isNative";
import { isFunction, isPrimitive, isStrictNullOrUndefined, isStrictUndefined } from "../helpers/base";
import { _toInt } from "../helpers/length";
import { CONSTRUCTOR, EMPTY, NULL_VALUE, RegExpCls, RegExpProto, StrProto, UNDEF_VALUE } from "../internal/constants";
import { _getNativeSymbol } from "../internal/native_symbol";
import { getKnownSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";
import { _isRegExp, _isRegExpObj, _throwIfNotGlobal } from "../internal/is_regexp";
import { _charLen } from "../internal/surrogate";
import { _throwIfNullOrUndefined, _throwTypeOf } from "../internal/throwIf";
import { _pureRef } from "../internal/treeshake_helpers";
import { _unwrapFunctionWithPoly } from "../internal/unwrapFunction";
import { _toString } from "./as_string";
import { mathMin } from "../math/min_max";
import { createIterableIterator } from "../iterator/create";

/**
 * The intrinsic RegExp.prototype.exec, captured when the module is loaded, which (like the native RegExpExec) is used
 * for a match when the matcher's exec isn't a function
 */
const RegExpExec = (/*#__PURE__*/_pureRef<Function>(RegExpProto as any, "exec"));

/**
 * Converts a lastIndex like the native ToLength(), so NaN or a negative value is 0, a fraction is truncated and a value
 * is at most 2^53 - 1
 * @param value - The lastIndex
 * @returns The converted lastIndex
 */
function _toLastIndex(value: any): number {
    let num = _toInt(value);

    return num > 0 ? mathMin(num, 0x1FFFFFFFFFFFFF) : 0;
}

/**
 * The `strMatchAll()` method returns an iterator of all results matching a string against a
 * regular expression, including capturing groups. Unlike `String.prototype.match()`, it returns
 * every match in the string (not just the first) and each result includes full `RegExpExecArray`
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

/**
 * Polyfill implementation of `String.prototype.matchAll()` that returns an iterator of all
 * results matching a string against a regular expression, including capturing groups.
 *
 * Matches the behaviour of the native `String.prototype.matchAll()` method:
 * - A regular expression `matcher` (identified like the native IsRegExp, so a `RegExp` whose `Symbol.match` is falsy
 *   isn't one and an object whose `Symbol.match` is truthy is) **must** have a global (`g`) flag in its `flags`;
 *   passing a non-global one throws a `TypeError`.
 * - Any other `matcher` is converted to a string for `new RegExp(matcher, "g")` (`undefined` is an empty pattern),
 *   mirroring native behavior, and (like the native function) the value is converted to a string (a `Symbol` throws a
 *   `TypeError`).
 * - If `matcher` has a `[Symbol.matchAll]` (read once; a value which isn't `null`, `undefined` or a function throws a
 *   `TypeError`), it is called with the (unconverted) value, like the native function. On a runtime without a native
 *   `Symbol` (eg. IE) the method for the polyfill symbol (`getKnownSymbol(WellKnownSymbols.matchAll)`) is called. On a
 *   runtime without `Symbol.matchAll` a `RegExp` is iterated like the native
 *   `RegExp.prototype[Symbol.matchAll]`: a copy with its flags and `lastIndex` (created by its species constructor where
 *   there is a native `Symbol.species`, eg. a subclass of RegExp creates an instance of the subclass), whose `exec` is
 *   called for each match (a result which isn't an object or null throws a `TypeError`), and whose flags (rather than
 *   its properties) identify whether it is global (a non-global one only returns its first match) and unicode.
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
    let isClone: boolean;
    let matchAllSym = _getNativeSymbol("matchAll");

    // Like the native function (in the same order) a matcher which isn't null or undefined is checked first: a regular
    // expression (IsRegExp, eg. a RegExp whose Symbol.match isn't falsy or an object whose Symbol.match is truthy) must
    // have a "g" in its flags, then its [Symbol.matchAll] (read once, only a null or undefined one is ignored, any other
    // value which isn't a function throws a TypeError) is called with the value (not yet converted). On a runtime
    // without a native Symbol (eg. IE) the method for the polyfill symbol is used, while a runtime with a native Symbol
    // which has no Symbol.matchAll (eg. Chrome 51-72) has no key for it
    if (!isStrictNullOrUndefined(matcher)) {
        _isRegExp(matcher) && _throwIfNotGlobal(matcher, "matcher");

        let matchAllKey = matchAllSym || getKnownSymbol(WellKnownSymbols.matchAll);
        let matchAllFn = matchAllKey ? (matcher as any)[matchAllKey] : UNDEF_VALUE;
        if (!isStrictNullOrUndefined(matchAllFn)) {
            return fnCall(matchAllFn, matcher, value);
        }

        // On a runtime without Symbol.matchAll (eg. IE) a RegExp is used like its native [Symbol.matchAll], which
        // iterates a copy of it (with its flags and lastIndex). Like the native function, which calls the
        // RegExp.prototype[Symbol.matchAll] that it inherits, this includes a value which inherits from RegExp.prototype
        // (eg. a Proxy of a RegExp), not only a RegExp
        isClone = !matchAllSym && (_isRegExpObj(matcher) || RegExpProto.isPrototypeOf(matcher));
    }

    // Like the native function the value is converted to a string (a Symbol throws a TypeError), and (like
    // RegExpCreate) any other matcher is converted to the pattern of a new global RegExp (undefined is an empty pattern),
    // whose native [Symbol.matchAll] is used when there is one
    let theValue = _toString(value);
    let theRegex: RegExp;
    let flags = "g";
    if (isClone) {
        // Like the native RegExp.prototype[Symbol.matchAll], the copy is created by the RegExp's species constructor
        // (SpeciesConstructor, only where there is a native Symbol.species, eg. a subclass of RegExp creates an
        // instance of the subclass, a null or undefined species is RegExp and any other value which isn't a
        // constructor throws a TypeError) from the RegExp (where RegExp.prototype has flags, ES2015+, otherwise from its
        // source) with its flags (converted to a string), and its lastIndex is copied (converted like ToLength)
        let srcRegex = matcher as RegExp;
        let ctor: any = RegExpCls;
        let speciesSym = _getNativeSymbol("species");
        if (speciesSym) {
            let theCtor = (srcRegex as any)[CONSTRUCTOR];
            if (theCtor !== UNDEF_VALUE) {
                isPrimitive(theCtor) && _throwTypeOf(theCtor, " is not an object");
                ctor = theCtor[speciesSym];
                if (isStrictNullOrUndefined(ctor)) {
                    ctor = RegExpCls;
                } else if (!isConstructor(ctor)) {
                    // Like IsConstructor, before the flags are read
                    _throwTypeOf(ctor, " is not a constructor");
                }
            }
        }

        let hasFlags = "flags" in RegExpProto;
        flags = hasFlags ? _toString((srcRegex as any).flags) : EMPTY;
        if (!hasFlags) {
            srcRegex.global && (flags += "g");
            srcRegex.ignoreCase && (flags += "i");
            srcRegex.multiline && (flags += "m");
            (srcRegex as any).dotAll && (flags += "s");
            srcRegex.unicode && (flags += "u");
            srcRegex.sticky && (flags += "y");
        }

        theRegex = new ctor(hasFlags ? srcRegex : srcRegex.source, flags);
        theRegex.lastIndex = _toLastIndex(srcRegex.lastIndex);
    } else {
        // eslint-disable-next-line security/detect-non-literal-regexp
        theRegex = new RegExpCls(isStrictUndefined(matcher) ? EMPTY : _toString(matcher), "g");
    }

    if (matchAllSym) {
        result = fnCall((theRegex as any)[matchAllSym], theRegex, theValue);
    } else {
        // Like the native RegExp String Iterator, whether the matcher is global (a non-global RegExp, eg. a copy of one
        // whose Symbol.match is false, only returns its first match) and unicode is identified by its flags (rather than
        // its properties), each match uses its exec (read for each match like RegExpExec, the intrinsic exec is used
        // when it isn't a function), whose result must be an object or null, and an empty match advances its lastIndex
        // (converted like ToLength) like AdvanceStringIndex (past a surrogate pair for a unicode matcher)
        let isGlobal = flags.indexOf("g") !== -1;
        let isUnicode = flags.indexOf("u") !== -1 || flags.indexOf("v") !== -1;
        let isDone: boolean;
        let ctx = {
            n: () => {
                let match: any;
                if (!isDone) {
                    let execFn = (theRegex as any).exec;
                    match = fnCall(isFunction(execFn) ? execFn : RegExpExec, theRegex, theValue);
                    if (match !== NULL_VALUE && isPrimitive(match)) {
                        _throwTypeOf(match, " is not an object or null (the result of exec)");
                    }
                }

                if (!match) {
                    return true;
                }

                isDone = !isGlobal;
                if (!isDone && _toString(match[0]) === EMPTY) {
                    let index = _toLastIndex(theRegex.lastIndex);
                    theRegex.lastIndex = index + (isUnicode ? _charLen(theValue, index) : 1);
                }

                ctx.v = match;
                return false;
            },
            v: UNDEF_VALUE as RegExpExecArray
        };

        result = createIterableIterator<RegExpExecArray>(ctx);
    }

    return result;
}
