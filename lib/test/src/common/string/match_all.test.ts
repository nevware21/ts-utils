/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { polyStrMatchAll, strMatchAll } from "../../../../src/string/match_all";
import { getKnownSymbol } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";
import { iterForOf } from "../../../../src/iterator/forOf";

function _toMatchInfo(iterator: Iterator<RegExpExecArray>): string[] {
    let result: string[] = [];
    let next = iterator.next();
    while (!next.done) {
        let current = next.value;
        let captures = (current as any).slice ? (current as any).slice(1) : [];
        result.push((current.index as any) + ":" + current[0] + ":" + JSON.stringify(captures));
        next = iterator.next();
    }

    return result;
}

function _expectThrow(cb: () => void): Error {
    try {
        cb();
    } catch (e) {
        assert.ok(true, "Expected an exception to be thrown");
        return e as Error;
    }

    assert.ok(false, "Expected an exception to be thrown");
    return null as any;
}

describe("strMatchAll helper", () => {
    it("matches with global regex including captures", () => {
        let matches = _toMatchInfo(strMatchAll("test1test2", /test(\d)/g));
        assert.deepEqual(matches, [
            "0:test1:[\"1\"]",
            "5:test2:[\"2\"]"
        ]);
    });

    it("supports string matcher", () => {
        let matches = _toMatchInfo(strMatchAll("banana", "an" as any));
        assert.deepEqual(matches, [
            "1:an:[]",
            "3:an:[]"
        ]);
    });

    it("matches native string-pattern semantics for meta characters", () => {
        _checkNativeParity("strMatchAll", (value, matcher) => {
            return strMatchAll(value, matcher);
        }, "a.b", ".");

        _checkNativeParity("polyStrMatchAll", (value, matcher) => {
            return polyStrMatchAll(value, matcher);
        }, "a.b", ".");
    });

    it("throws for non-global regex", () => {
        _checkNativeParity("strMatchAll", (value, matcher) => {
            return strMatchAll(value, matcher);
        }, "abc", /a/);

        _checkNativeParity("polyStrMatchAll", (value, matcher) => {
            return polyStrMatchAll(value, matcher);
        }, "abc", /a/);
    });

    it("RegExp with @@match=false is treated as a non-RegExp pattern", () => {
        let matchSym = getKnownSymbol(WellKnownSymbols.match);
        // A non-global RegExp normally throws TypeError; setting @@match=false makes native
        // treat it as a non-RegExp, so it should be used as a constructor argument instead.
        let re = /ab/;
        (re as any)[matchSym] = false;
        _checkNativeParity("polyStrMatchAll", (value, matcher) => {
            return polyStrMatchAll(value, matcher);
        }, "xabxabx", re as any);
    });

    it("RegExp with @@match=true still enforces global flag", () => {
        let matchSym = getKnownSymbol(WellKnownSymbols.match);
        let re = /ab/;
        (re as any)[matchSym] = true;
        _checkNativeParity("polyStrMatchAll", (value, matcher) => {
            return polyStrMatchAll(value, matcher);
        }, "xabxabx", re as any);
    });

    it("delegates to @@matchAll when present", () => {
        let matchAllSym = getKnownSymbol(WellKnownSymbols.matchAll);
        let iteratorSym = getKnownSymbol(WellKnownSymbols.iterator);
        let matcher = {
            [matchAllSym]: (_value: string) => {
                return {
                    next: () => ({ done: true, value: undefined as any }),
                    [iteratorSym]: function() {
                        return this;
                    }
                };
            }
        };

        assert.deepEqual(_toMatchInfo(polyStrMatchAll("abc", matcher as any)), []);
    });

    it("matches native semantics for representative cases", () => {
        let testCases: { value: any; matcher: any }[] = [
            { value: "banana", matcher: /an/g },
            { value: "test1test2", matcher: /test(\d)/g },
            { value: "abc", matcher: "" },
            { value: "abc", matcher: "b" },
            { value: 123123, matcher: "23" },
            { value: "a1b2", matcher: /\d/g }
        ];

        for (let lp = 0; lp < testCases.length; lp++) {
            let testCase = testCases[lp];
            _checkNativeParity("strMatchAll", (value, matcher) => {
                return strMatchAll(value, matcher);
            }, testCase.value, testCase.matcher);

            _checkNativeParity("polyStrMatchAll", (value, matcher) => {
                return polyStrMatchAll(value, matcher);
            }, testCase.value, testCase.matcher);
        }
    });

    it("throws for null and undefined value", () => {
        _expectThrow(() => polyStrMatchAll(null as any, /a/g));
        _expectThrow(() => polyStrMatchAll(undefined as any, /a/g));
    });

    it("null matcher treated as literal string 'null'", () => {
        _checkNativeParity("polyStrMatchAll", (value, matcher) => {
            return polyStrMatchAll(value, matcher);
        }, "null value null", null);
    });

    it("undefined matcher follows native empty-pattern behavior", () => {
        _checkNativeParity("polyStrMatchAll", (value, matcher) => {
            return polyStrMatchAll(value, matcher);
        }, "undefined and undefined", undefined);
    });

    it("zero-length match advances lastIndex to avoid infinite loop", () => {
        // /a*/g matches zero-length at positions between non-'a' chars
        _checkNativeParity("polyStrMatchAll", (value, matcher) => {
            return polyStrMatchAll(value, matcher);
        }, "bbb", /a*/g);

        // empty pattern matches at every position
        _checkNativeParity("polyStrMatchAll", (value, matcher) => {
            return polyStrMatchAll(value, matcher);
        }, "ab", /(?:)/g);
    });

    it("zero-length unicode matches advance by code point", () => {
        let value = "A\uD83D\uDE00B";
        let matchAllSym = getKnownSymbol(WellKnownSymbols.matchAll);
        let polyRegex = /(?:)/gu;
        let nativeRegex = /(?:)/gu;
        (polyRegex as any)[matchAllSym] = undefined;

        let polyResult = _toMatchInfo(polyStrMatchAll(value, polyRegex));
        let nativeResult = _toMatchInfo((String.prototype as any).matchAll.call(value, nativeRegex));
        assert.deepEqual(polyResult, nativeResult);
    });

    it("clones global regex and preserves lastIndex like native", () => {
        // Native String.prototype.matchAll copies lastIndex from the source regex to the clone,
        // so iteration starts from the preserved position (matching native parity).
        let re = /\d/g;
        re.lastIndex = 3; // simulate a regex mid-use
        _checkNativeParity("polyStrMatchAll", (value, matcher) => {
            return polyStrMatchAll(value, matcher);
        }, "a1b2c3", re);
    });

    it("clones regex normalizing negative lastIndex to 0", () => {
        let matchAllSym = getKnownSymbol(WellKnownSymbols.matchAll);
        let re = /\d/g;
        re.lastIndex = -5;
        (re as any)[matchAllSym] = undefined; // force polyfill path

        let matches = _toMatchInfo(polyStrMatchAll("a1b2c3", re));
        // Negative lastIndex must be clamped to 0 by ToLength, so all digits are found.
        assert.deepEqual(matches, ["1:1:[]", "3:2:[]", "5:3:[]"]);
    });

    it("clones regex preserving ignoreCase and multiline flags", () => {
        _checkNativeParity("polyStrMatchAll", (value, matcher) => {
            return polyStrMatchAll(value, matcher);
        }, "Hello\nhello", /^hello/gim);
    });

    it("clones regex when flags property is unavailable", () => {
        let matchAllSym = getKnownSymbol(WellKnownSymbols.matchAll);
        let re = new RegExp("a", "gimuy");
        re.lastIndex = 1;
        Object.defineProperty(re, "flags", { value: undefined });
        (re as any)[matchAllSym] = undefined;

        let matches = _toMatchInfo(polyStrMatchAll("ba", re));
        assert.deepEqual(matches, ["1:a:[]"]);
    });

    it("clones regex preserving dotAll when flags property is unavailable", () => {
        let matchAllSym = getKnownSymbol(WellKnownSymbols.matchAll);
        let re = new RegExp(".", "gs");
        Object.defineProperty(re, "flags", { value: undefined });
        (re as any)[matchAllSym] = undefined;

        let iter = polyStrMatchAll("\n", re);
        let first = iter.next();
        assert.equal(first.done, false);
        assert.equal(first.value[0], "\n");
        assert.equal(iter.next().done, true);
    });

    it("result exposes .index and .input on each match", () => {
        let iter = polyStrMatchAll("abc", /b/g);
        let first = iter.next();
        assert.equal(first.done, false);
        assert.equal(first.value[0], "b");
        assert.equal(first.value.index, 1);
        assert.equal(first.value.input, "abc");
        assert.equal(iter.next().done, true);
    });

    it("named capture groups are accessible on each match", () => {
        _checkNativeParity("polyStrMatchAll", (value, matcher) => {
            return polyStrMatchAll(value, matcher);
        }, "2024-01-15 and 2025-06-30", /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/g);

        let iter = polyStrMatchAll("2024-01-15", /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/g);
        let match = iter.next().value;
        assert.equal(match.groups["year"], "2024");
        assert.equal(match.groups["month"], "01");
        assert.equal(match.groups["day"], "15");
    });

    it("result supports iterable protocol (for...of)", () => {
        // In ES5 compiled tests, native for...of doesn't properly call [Symbol.iterator],
        // so we verify the iterable protocol using the library's iterForOf helper.
        let results: string[] = [];
        iterForOf(polyStrMatchAll("a1b2", /\d/g), (match) => {
            results.push(match[0]);
        });
        assert.deepEqual(results, ["1", "2"]);
    });

    it("result supports iterable consumption", () => {
        // In ES5 compiled tests, spread syntax doesn't call [Symbol.iterator] on iterables.
        // We verify the same iterable consumption using explicit iteration instead.
        let matches: RegExpExecArray[] = [];
        iterForOf(polyStrMatchAll("test1test2", /test(\d)/g), (m) => {
            matches.push(m);
        });
        assert.equal(matches.length, 2);
        assert.equal(matches[0][0], "test1");
        assert.equal(matches[0][1], "1");
        assert.equal(matches[1][0], "test2");
        assert.equal(matches[1][1], "2");
    });

    it("optional capture groups return undefined for unmatched groups", () => {
        _checkNativeParity("polyStrMatchAll", (value, matcher) => {
            return polyStrMatchAll(value, matcher);
        }, "aXb", /(a)(X)?(b)/g);

        let iter = polyStrMatchAll("ab", /(a)(X)?(b)/g);
        let match = iter.next().value;
        assert.equal(match[1], "a");
        assert.isUndefined(match[2]);
        assert.equal(match[3], "b");
    });

    it("no matches returns empty iterator", () => {
        let results: RegExpExecArray[] = [];
        iterForOf(polyStrMatchAll("abc", /z/g), (match) => {
            results.push(match);
        });
        assert.equal(results.length, 0);

        let iter = polyStrMatchAll("abc", /z/g);
        assert.equal(iter.next().done, true);
    });
});

function _checkNativeParity(testName: string, testFn: (value: any, matcher: any) => Iterator<RegExpExecArray>, value: any, matcher: any) {
    let testResult: any;
    let nativeResult: any;
    let testThrew: any;
    let nativeThrew: any;

    try {
        testResult = _toMatchInfo(testFn(value, matcher));
    } catch (e) {
        testThrew = e;
    }

    try {
        nativeResult = _toMatchInfo((String.prototype as any).matchAll.call(value, matcher));
    } catch (e) {
        nativeThrew = e;
    }

    if (testThrew) {
        assert.equal(true, !!nativeThrew,
            "Checking whether Native and " + testName + " both threw [" + dumpObj(testThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "] [" + dumpObj(matcher) + "]");
    } else if (nativeThrew) {
        assert.ok(false,
            "Native threw but " + testName + " did not [" + dumpObj(testResult) + "] - [" + dumpObj(nativeThrew) + "] for [" + dumpObj(value) + "] [" + dumpObj(matcher) + "]");
    } else {
        assert.deepEqual(testResult, nativeResult,
            "Checking whether Native and " + testName + " returned the same [" + dumpObj(testResult) + "] - [" + dumpObj(nativeResult) + "] for [" + dumpObj(value) + "] [" + dumpObj(matcher) + "]");
    }
}
