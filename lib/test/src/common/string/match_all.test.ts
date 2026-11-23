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
import { getKnownSymbol, hasSymbol } from "../../../../src/symbol/symbol";
import { _initTestHooks, setBypassLazyCache } from "../../../../src/helpers/lazy";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";
import { iterForOf } from "../../../../src/iterator/forOf";
import { getGlobal } from "../../../../src/helpers/environment";

/**
 * Calls the callback like on a runtime without Symbol.matchAll (eg. an older runtime, where the polyfill emulates the
 * native RegExp.prototype[Symbol.matchAll]) by replacing the global Symbol with one which has every other well-known
 * symbol (the lazy Symbol is bypassed, so getKnownSymbol() also has no matchAll), and (when noFlags is set) like ES5
 * (where RegExp.prototype has no flags) by removing RegExp.prototype.flags, then restores them. On a runtime without
 * Symbol (eg. IE), which has no Symbol.matchAll, the global Symbol isn't replaced.
 */
function _withoutMatchAll<T>(noFlags: boolean, callback: () => T): T {
    const theGlobal: any = getGlobal();
    const orgSymbol = theGlobal.Symbol;
    const flagsDesc = Object.getOwnPropertyDescriptor(RegExp.prototype, "flags");
    const stubSymbol: any = function() {
        // Not used
    };

    orgSymbol && Object.getOwnPropertyNames(orgSymbol).forEach((name) => {
        if (name !== "matchAll" && name !== "length" && name !== "name" && name !== "prototype") {
            stubSymbol[name] = orgSymbol[name];
        }
    });

    _initTestHooks();
    setBypassLazyCache(true);
    try {
        orgSymbol && (theGlobal.Symbol = stubSymbol);
        if (noFlags && flagsDesc) {
            delete (RegExp.prototype as any).flags;
        }

        return callback();
    } finally {
        if (orgSymbol) {
            theGlobal.Symbol = orgSymbol;

            // The lazy Symbol is read again (while it is bypassed), so it isn't left as the stub
            hasSymbol();
        }

        setBypassLazyCache(false);
        if (noFlags && flagsDesc) {
            Object.defineProperty(RegExp.prototype, "flags", flagsDesc);
        }
    }
}

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

    it("zero-length unicode matches advance by code point", function() {
        if (typeof Symbol !== "function" || !(String.prototype as any).matchAll) {
            this.skip();
            return;
        }

        let value = "A\uD83D\uDE00B";
        let polyRegex = /(?:)/gu;
        let nativeRegex = /(?:)/gu;

        // The emulation of RegExp.prototype[Symbol.matchAll] (on a runtime without Symbol.matchAll)
        let polyResult = _withoutMatchAll(false, () => _toMatchInfo(polyStrMatchAll(value, polyRegex)));
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
        let re = /\d/g;
        re.lastIndex = -5;

        // The emulation of RegExp.prototype[Symbol.matchAll] (on a runtime without Symbol.matchAll)
        let matches = _withoutMatchAll(false, () => _toMatchInfo(polyStrMatchAll("a1b2c3", re)));
        // Negative lastIndex must be clamped to 0 by ToLength, so all digits are found.
        assert.deepEqual(matches, ["1:1:[]", "3:2:[]", "5:3:[]"]);
    });

    it("emulation returns only the first match of a non-global RegExp whose Symbol.match is false, like the native function", function() {
        if (typeof Symbol !== "function" || !Symbol.match || !(String.prototype as any).matchAll) {
            this.skip();
            return;
        }

        let polyRegex: any = /a/;
        polyRegex[Symbol.match] = false;
        let nativeRegex: any = /a/;
        nativeRegex[Symbol.match] = false;

        // The emulation of RegExp.prototype[Symbol.matchAll] (on a runtime without Symbol.matchAll)
        let polyResult = _withoutMatchAll(false, () => _toMatchInfo(polyStrMatchAll("abcabc", polyRegex)));
        let nativeResult = _toMatchInfo((String.prototype as any).matchAll.call("abcabc", nativeRegex));
        assert.deepEqual(polyResult, ["0:a:[]"]);
        assert.deepEqual(nativeResult, ["0:a:[]"], "String.prototype.matchAll");
    });

    it("emulation uses a Proxy of a RegExp (which inherits from RegExp.prototype) like the native function", function() {
        if (typeof Proxy !== "function") {
            this.skip();
            return;
        }

        // A Proxy which reads the RegExp's properties from the RegExp itself (so its getters work)
        const forwarding = () => new Proxy(/\d/g, {
            get: (target, key) => (target as any)[key]
        });

        // The emulation of RegExp.prototype[Symbol.matchAll] (on a runtime without Symbol.matchAll)
        let polyResult = _withoutMatchAll(false, () => _toMatchInfo(polyStrMatchAll("a1b2c3", forwarding())));
        assert.deepEqual(polyResult, ["1:1:[]", "3:2:[]", "5:3:[]"], "The Proxy is copied, not converted to a string");

        // A Proxy with the default get, whose RegExp getters (eg. the flags) are called on the Proxy, throws a TypeError
        assert.throws(() => _withoutMatchAll(false, () => polyStrMatchAll("a1b2c3", new Proxy(/\d/g, {}))), TypeError);

        let nativeMatchAll = (String.prototype as any).matchAll;
        if (nativeMatchAll) {
            assert.deepEqual(_toMatchInfo(nativeMatchAll.call("a1b2c3", forwarding())), polyResult, "String.prototype.matchAll");
            assert.throws(() => nativeMatchAll.call("a1b2c3", new Proxy(/\d/g, {})), TypeError, undefined, "String.prototype.matchAll");
        }
    });

    it("clones regex preserving ignoreCase and multiline flags", () => {
        _checkNativeParity("polyStrMatchAll", (value, matcher) => {
            return polyStrMatchAll(value, matcher);
        }, "Hello\nhello", /^hello/gim);
    });

    it("clones regex when flags property is unavailable", () => {
        let re = new RegExp("a", "gimuy");
        re.lastIndex = 1;

        // Like on an ES5 runtime without Symbol.matchAll, where RegExp.prototype has no flags (so the flags are read from
        // the global, ignoreCase, multiline, unicode and sticky properties)
        let matches = _withoutMatchAll(true, () => _toMatchInfo(polyStrMatchAll("ba", re)));
        assert.deepEqual(matches, ["1:a:[]"]);
    });

    it("clones regex preserving dotAll when flags property is unavailable", () => {
        let re = new RegExp(".", "gs");

        // Like on a runtime without Symbol.matchAll, where RegExp.prototype has no flags
        let results = _withoutMatchAll(true, () => {
            let iter = polyStrMatchAll("\n", re);
            let first = iter.next();
            return { first, second: iter.next() };
        });

        assert.equal(results.first.done, false);
        assert.equal(results.first.value[0], "\n");
        assert.equal(results.second.done, true);
    });

    describe("on a runtime without Symbol.matchAll, a RegExp subclass is used like the native RegExp.prototype[Symbol.matchAll]", () => {
        // The classes (created from their source, as ES5 can't subclass RegExp), or null on a runtime without classes
        let classes: any;
        try {
            classes = new Function("log", [
                "class Other extends RegExp { exec(value) { log.push(\"other exec\"); return super.exec(value); } }",
                "class Logged extends RegExp {",
                "    static get [Symbol.species]() { log.push(\"species\"); return Other; }",
                "    exec(value) { log.push(\"exec\"); return super.exec(value); }",
                "}",
                "class BadExec extends RegExp { exec() { return \"x\"; } }",
                "class NotGlobal extends RegExp { get flags() { return \"g\"; } get global() { return false; } }",
                "return { Logged: Logged, BadExec: BadExec, NotGlobal: NotGlobal };"
            ].join("\n"));
        } catch (e) {
            classes = null;
        }

        function _count(iter: Iterator<any>): number {
            let count = 0;
            while (!iter.next().done) {
                count++;
            }

            return count;
        }

        it("creates the copy with its species constructor, and calls its exec for each match", function() {
            if (!classes || typeof Symbol !== "function" || !Symbol.species || !(String.prototype as any).matchAll) {
                this.skip();
                return;
            }

            const log: string[] = [];
            const theClasses = classes(log);
            const nativeCount = _count((String.prototype as any).matchAll.call("aa", new theClasses.Logged("a", "g")));
            const nativeLog = log.splice(0, log.length);
            const count = _withoutMatchAll(false, () => _count(polyStrMatchAll("aa", new theClasses.Logged("a", "g"))));

            assert.equal(count, nativeCount, "The same number of matches");
            assert.equal(count, 2);
            assert.deepEqual(log, nativeLog, "The species and exec were used like the native function");
            assert.deepEqual(log, ["species", "other exec", "other exec", "other exec"]);
        });

        it("throws a TypeError when exec returns a value which isn't an object or null", function() {
            if (!classes || typeof Symbol !== "function" || !Symbol.species || !(String.prototype as any).matchAll) {
                this.skip();
                return;
            }

            const theClasses = classes([]);
            assert.throws(() => (String.prototype as any).matchAll.call("aa", new theClasses.BadExec("a", "g")).next(), TypeError, undefined, "The native function");
            assert.throws(() => _withoutMatchAll(false, () => polyStrMatchAll("aa", new theClasses.BadExec("a", "g")).next()), TypeError);
        });

        it("identifies a global (and unicode) copy by its flags rather than its properties", function() {
            if (!classes || typeof Symbol !== "function" || !Symbol.species || !(String.prototype as any).matchAll) {
                this.skip();
                return;
            }

            const theClasses = classes([]);
            const nativeCount = _count((String.prototype as any).matchAll.call("aa", new theClasses.NotGlobal("a", "g")));
            const count = _withoutMatchAll(false, () => _count(polyStrMatchAll("aa", new theClasses.NotGlobal("a", "g"))));

            assert.equal(nativeCount, 2, "The native function used the flags");
            assert.equal(count, nativeCount, "Every match was returned");
        });
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
