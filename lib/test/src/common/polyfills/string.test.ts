/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { polyStrStartsWith } from "../../../../src/string/starts_with";
import { polyStrEndsWith } from "../../../../src/string/ends_with";
import { isUndefined } from "../../../../src/helpers/base";
import { arrForEach } from "../../../../src/array/forEach";

describe("string polyfills", () => {
    it("polyStrStartsWith null / undefined", () => {
        _checkStartsWith(null, null as any);
        _checkStartsWith(null, "" as any);
        _checkStartsWith(null, "n" as any);
        _checkStartsWith(null, "nu" as any);
        _checkStartsWith(null, "nul" as any);
        _checkStartsWith(null, "l" as any, 2);
        _checkStartsWith(undefined, undefined as any);
        _checkStartsWith(undefined, "");
        _checkStartsWith(undefined, "u");
        _checkStartsWith(undefined, "undef");
        _checkStartsWith(undefined, "fined", 4);
        _checkStartsWith("null", null as any);
        _checkStartsWith("undefined", undefined as any);
        _checkStartsWith("", null as any);
        _checkStartsWith("", undefined as any);
        _checkStartsWith(undefined, "fined", -4);
    });

    it("polyStrStartsWith With values", () => {
        _checkStartsWith("", "");
        _checkStartsWith("", "", 10);
        _checkStartsWith("", "a");
        _checkStartsWith("", "a", 10);
        _checkStartsWith("", "a", 11);
        _checkStartsWith("a", "");
        _checkStartsWith("a", "", 10);
        _checkStartsWith("a", "", 11);
        _checkStartsWith("a", "a");
        _checkStartsWith("a", "a", 10);
        _checkStartsWith("a", "ab");
        _checkStartsWith("a", "ab", 10);
        _checkStartsWith("a", "", 11);
        _checkStartsWith("a", "b", 10);
        _checkStartsWith("a", "b", 1);
        _checkStartsWith("a", "ba");
        _checkStartsWith("a", "ba", 10);
        _checkStartsWith("a", "ba", 1);
        _checkStartsWith("ab", "a");
        _checkStartsWith("ab", "a", 10);
        _checkStartsWith("ab", "b");
        _checkStartsWith("ab", "b", 10);
        _checkStartsWith("ab", "b", 1);
        _checkStartsWith("abba", "abc");
        _checkStartsWith("abba", "abc", 10);
        _checkStartsWith("abba", "abc", 1);
        _checkStartsWith("abba", "ab");
        _checkStartsWith("abba", "ab", 10);
        _checkStartsWith("abba", "ab", 1);
        _checkStartsWith("abba", "bb");
        _checkStartsWith("abba", "bb", 10);
        _checkStartsWith("abba", "bb", 1);
        _checkStartsWith("zyxyvutsrqponmlkjihgfedcba", "a");
        _checkStartsWith("zyxyvutsrqponmlkjihgfedcba", "a", 10);
        _checkStartsWith("zyxyvutsrqponmlkjihgfedcba", "p", 10);
        _checkStartsWith("zyxyvutsrqponmlkjihgfedcba", "zyxw");
        _checkStartsWith("zyxyvutsrqponmlkjihgfedcba", "zyxw", 10);
        _checkStartsWith("zyxyvutsrqponmlkjihgfedcba", "ponm", 10);
        _checkStartsWith("zyxyvutsrqponmlkjihgfedcba", "ponm", -10);
    });

    it("polyStrEndsWith null / undefined", () => {
        _checkEndsWith(null, null as any);
        _checkEndsWith(null, "" as any);
        _checkEndsWith(null, "n" as any);
        _checkEndsWith(null, "nu" as any);
        _checkEndsWith(null, "nul" as any);
        _checkEndsWith(null, "l" as any, 2);
        _checkEndsWith(null, "l" as any, 3);
        _checkEndsWith(undefined, undefined as any);
        _checkEndsWith(undefined, "");
        _checkEndsWith(undefined, "u");
        _checkEndsWith(undefined, "undef");
        _checkEndsWith(undefined, "fined", 4);
        _checkEndsWith(undefined, "unde", 4);
        _checkEndsWith(undefined, "unde", -4);
        _checkEndsWith("null", null as any);
        _checkEndsWith("undefined", undefined as any);
        _checkEndsWith("", null as any);
        _checkEndsWith("", undefined as any);
    });

    it("polyStrEndsWith With values", () => {
        _checkEndsWith("", "");
        _checkEndsWith("", "", 10);
        _checkEndsWith("", "a");
        _checkEndsWith("", "a", 10);
        _checkEndsWith("", "a", 11);
        _checkEndsWith("a", "");
        _checkEndsWith("a", "", 10);
        _checkEndsWith("a", "", 11);
        _checkEndsWith("a", "a");
        _checkEndsWith("a", "a", 10);
        _checkEndsWith("a", "ab");
        _checkEndsWith("a", "ab", 10);
        _checkEndsWith("a", "", 11);
        _checkEndsWith("a", "b", 10);
        _checkEndsWith("a", "b", 1);
        _checkEndsWith("a", "ba");
        _checkEndsWith("a", "ba", 10);
        _checkEndsWith("a", "ba", 1);
        _checkEndsWith("ab", "a");
        _checkEndsWith("ab", "a", 10);
        _checkEndsWith("ab", "b");
        _checkEndsWith("ab", "b", 10);
        _checkEndsWith("ab", "b", 1);
        _checkEndsWith("abba", "abc");
        _checkEndsWith("abba", "abc", 10);
        _checkEndsWith("abba", "abc", 1);
        _checkEndsWith("abba", "ab");
        _checkEndsWith("abba", "ab", 10);
        _checkEndsWith("abba", "ab", 2);
        _checkEndsWith("abba", "bb");
        _checkEndsWith("abba", "bb", 10);
        _checkEndsWith("abba", "bb", 1);
        _checkEndsWith("abba", "bb", -1);
        _checkEndsWith("zyxyvutsrqponmlkjihgfedcba", "a");
        _checkEndsWith("zyxyvutsrqponmlkjihgfedcba", "a", 10);
        _checkEndsWith("zyxyvutsrqponmlkjihgfedcba", "p", 10);
        _checkEndsWith("zyxyvutsrqponmlkjihgfedcba", "zyxw");
        _checkEndsWith("zyxyvutsrqponmlkjihgfedcba", "zyxw", 10);
        _checkEndsWith("zyxyvutsrqponmlkjihgfedcba", "ponm", 14);
    });

    describe("polyStrStartsWith / polyStrEndsWith value conversions", () => {
        it("should accept a String object, like the native functions", () => {
            let value: any = new String("abc");

            assert.isTrue(polyStrStartsWith(value, "ab"));
            assert.isFalse(polyStrStartsWith(value, "bc"));
            assert.isTrue(polyStrStartsWith(value, "bc", 1));
            assert.isTrue(polyStrEndsWith(value, "bc"));
            assert.isFalse(polyStrEndsWith(value, "ab"));
            assert.isTrue(polyStrEndsWith(value, "ab", 2));

            arrForEach(["", "a", "ab", "abc", "b", "bc", "c", "abcd"], (search) => {
                _checkNativeCall(value, search);
                _checkNativeCall(value, search, 1);
                _checkNativeCall(value, search, 2);
            });
        });

        it("should convert a value which is not a string (eg. a number), like the native functions", () => {
            assert.isTrue(polyStrStartsWith(123 as any, "12"));
            assert.isTrue(polyStrEndsWith(123 as any, "23"));

            arrForEach([123, true, ["a", "b"], { toString: () => "abc" }], (value) => {
                arrForEach(["", "1", "12", "23", "tr", "ue", "a,b", "ab", "bc"], (search) => {
                    _checkNativeCall(value, search);
                    _checkNativeCall(value, search, 1);
                });
            });
        });

        it("should convert the position and length to an integer, like the native functions", () => {
            // A position or length which is a string or NaN (or converts to NaN) is not used as-is
            assert.isTrue(polyStrStartsWith("abc", "c", "2.5" as any), "startsWith position \"2.5\" is 2");
            assert.isTrue(polyStrStartsWith("abc", "", "2" as any), "startsWith position \"2\" is 2");
            assert.isFalse(polyStrEndsWith("abc", "c", NaN), "endsWith length NaN is 0");
            assert.isFalse(polyStrEndsWith("abc", "c", "x" as any), "endsWith length \"x\" is 0");
            assert.isFalse(polyStrEndsWith("abc", "c", "undefined" as any), "endsWith length \"undefined\" is 0");
            assert.isTrue(polyStrEndsWith("abc", "c", undefined), "endsWith length undefined is the length of the value");

            arrForEach<any>([0, 1, 1.5, 2, 2.5, 3, 3.5, 4, -1, -0.5, NaN, Infinity, -Infinity, null, undefined, "2", "2.5", "x", "undefined", true, {}, [2], { valueOf: () => 2 }], (pos) => {
                arrForEach(["", "a", "b", "c", "ab", "bc", "abc", "abcd"], (search) => {
                    _checkNativeCall("abc", search, pos);
                });
            });
        });

        it("should throw a TypeError when the searchString is a RegExp, like the native functions", () => {
            arrForEach([/a/, /c/g, new RegExp("abc")], (search) => {
                assert.throws(() => String.prototype.startsWith.call("abc", search), TypeError);
                assert.throws(() => String.prototype.endsWith.call("abc", search), TypeError);
                assert.throws(() => polyStrStartsWith("abc", search as any), TypeError);
                assert.throws(() => polyStrEndsWith("abc", search as any), TypeError);
                assert.throws(() => polyStrStartsWith("abc", search as any, 1), TypeError);
                assert.throws(() => polyStrEndsWith("abc", search as any, 1), TypeError);
            });

            // The source of the RegExp is not matched as a string
            assert.throws(() => polyStrStartsWith("/a/", /a/ as any), TypeError);
            assert.throws(() => polyStrEndsWith("/c/g", /c/g as any), TypeError);
        });

        it("should only convert the searchString once, like the native functions", () => {
            // Each toString() call returns the next value, so a second conversion would use a different searchString
            function _createSearch(values: string[]) {
                let calls = 0;
                return {
                    search: { toString: () => values[calls++] } as any,
                    calls: () => calls
                };
            }

            let startsWith = _createSearch(["a", "abc"]);
            assert.isTrue(polyStrStartsWith("abc", startsWith.search), "startsWith uses the first conversion");
            assert.equal(startsWith.calls(), 1, "startsWith converts the searchString once");

            let endsWith = _createSearch(["c", "abc"]);
            assert.isTrue(polyStrEndsWith("abc", endsWith.search), "endsWith uses the first conversion");
            assert.equal(endsWith.calls(), 1, "endsWith converts the searchString once");

            let nativeStartsWith = _createSearch(["a", "abc"]);
            assert.isTrue(String.prototype.startsWith.call("abc", nativeStartsWith.search));
            assert.equal(nativeStartsWith.calls(), 1);

            let nativeEndsWith = _createSearch(["c", "abc"]);
            assert.isTrue(String.prototype.endsWith.call("abc", nativeEndsWith.search));
            assert.equal(nativeEndsWith.calls(), 1);
        });
    });

    function _checkNativeCall(value: any, search: any, pos?: any) {
        assert.equal(polyStrStartsWith(value, search, pos), String.prototype.startsWith.call(value, search, pos),
            "Checking startsWith of [" + dumpObj(value) + "] for [" + search + "] @ " + dumpObj(pos));
        assert.equal(polyStrEndsWith(value, search, pos), String.prototype.endsWith.call(value, search, pos),
            "Checking endsWith of [" + dumpObj(value) + "] for [" + search + "] with length " + dumpObj(pos));
    }

    function _checkStartsWith(value: any, search: any, position?: number) {
        let polyResult: any;
        let nativeResult: any;
        let polyThrew: any;
        let nativeThrew: any;
        try {
            polyResult = polyStrStartsWith(value, search, position);
        } catch (e) {
            polyThrew = e;
        }
        try {
            nativeResult = value.startsWith(search, position);
        } catch (e) {
            nativeThrew = e;
        }

        if (polyThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and polyfill threw or returned undefined [" + dumpObj(polyThrew || polyResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but poly didn't [" + dumpObj(polyThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(polyResult, nativeResult,
                "Checking whether the Native and polyfill returned the same result [" + dumpObj(polyThrew || polyResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }

    function _checkEndsWith(value: any, search: any, length?: number) {
        let polyResult: any;
        let nativeResult: any;
        let polyThrew: any;
        let nativeThrew: any;
        try {
            polyResult = polyStrEndsWith(value, search, length);
        } catch (e) {
            polyThrew = e;
        }
        try {
            nativeResult = value.endsWith(search, length);
        } catch (e) {
            nativeThrew = e;
        }

        if (polyThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and polyfill threw or returned undefined [" + dumpObj(polyThrew || polyResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but poly didn't [" + dumpObj(polyThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(polyResult,nativeResult,
                "Checking whether the Native and polyfill returned the same result [" + dumpObj(polyThrew || polyResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }
});

describe("polyStrStartsWith / polyStrEndsWith conversion order", () => {
    function _getLog(fn: (value: any, search: any, position: any) => boolean) {
        let log: string[] = [];
        fn({
            toString: () => {
                log.push("value");
                return "abc";
            }
        }, {
            toString: () => {
                log.push("search");
                return "a";
            }
        }, {
            valueOf: () => {
                log.push("position");
                return 1;
            }
        });

        return log;
    }

    it("convert the value, then the searchString and then the position, like the native functions", () => {
        const startsWith = _getLog((value, search, position) => polyStrStartsWith(value, search, position));
        const endsWith = _getLog((value, search, position) => polyStrEndsWith(value, search, position));

        assert.deepEqual(startsWith, ["value", "search", "position"]);
        assert.deepEqual(startsWith, _getLog((value, search, position) => String.prototype.startsWith.call(value, search, position)));
        assert.deepEqual(endsWith, ["value", "search", "position"]);
        assert.deepEqual(endsWith, _getLog((value, search, position) => String.prototype.endsWith.call(value, search, position)));
    });
});

describe("polyStrStartsWith fractional positions", () => {
    it("truncates a fractional position before adding the length, like the native function", () => {
        const cases: any[] = [
            ["abc", "a", 0.9999999999999999],
            ["abcabc", "a", 3.9999999999999996],
            ["xab", "ab", 0.9999999999999999],
            ["abc", "bc", 1.5],
            ["abc", "c", 2.9999999999999996],
            ["abc", "", Infinity]
        ];

        for (let lp = 0; lp < cases.length; lp++) {
            assert.equal(polyStrStartsWith(cases[lp][0], cases[lp][1], cases[lp][2]), String.prototype.startsWith.call(cases[lp][0], cases[lp][1], cases[lp][2]),
                "startsWith(" + JSON.stringify(cases[lp][0]) + ", " + JSON.stringify(cases[lp][1]) + ", " + cases[lp][2] + ")");
        }

        assert.isTrue(polyStrStartsWith("abc", "a", 0.9999999999999999));
    });
});
