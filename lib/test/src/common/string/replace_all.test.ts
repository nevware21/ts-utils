/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { polyStrReplaceAll, strReplaceAll } from "../../../../src/string/replace_all";
import { getKnownSymbol } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";
import { isNode } from "../../../../src/helpers/environment";

describe("strReplaceAll helper", () => {
    it("basic string replacement", () => {
        assert.equal(strReplaceAll("a-b-a-b", "a", "x"), "x-b-x-b");
        assert.equal(polyStrReplaceAll("a-b-a-b", "a", "x"), "x-b-x-b");
    });

    it("supports empty search string", () => {
        assert.equal(strReplaceAll("abc", "", "-"), "-a-b-c-");
        assert.equal(polyStrReplaceAll("abc", "", "-"), "-a-b-c-");
    });

    it("supports replacement patterns", () => {
        assert.equal(strReplaceAll("abc", "b", "[$&]"), "a[b]c");
        assert.equal(polyStrReplaceAll("abc", "b", "[$&]"), "a[b]c");
    });

    it("supports function replacements", () => {
        assert.equal(strReplaceAll("abca", "a", (value, index) => value.toUpperCase() + index), "A0bcA3");
        assert.equal(polyStrReplaceAll("abca", "a", (value, index) => value.toUpperCase() + index), "A0bcA3");
    });

    it("supports global regular expressions", () => {
        assert.equal(strReplaceAll("abc123def456", /\d+/g, "#"), "abc#def#");
        assert.equal(polyStrReplaceAll("abc123def456", /\d+/g, "#"), "abc#def#");
    });

    it("delegates to @@replace for non-RegExp search objects", () => {
        const replaceSym = getKnownSymbol(WellKnownSymbols.replace);
        const searchValue = {
            [replaceSym]: (value: string, replaceValue: string | ((substring: string, ...args: any[]) => string)) => {
                return "custom:" + value + ":" + dumpObj(replaceValue);
            }
        };

        const expected = "custom:abcabc:" + dumpObj("X");
        assert.equal(polyStrReplaceAll("abcabc", searchValue as any, "X"), expected);
        assert.equal(strReplaceAll("abcabc", searchValue as any, "X"), expected);
    });

    it("treats RegExp with @@match false as non-RegExp for global check", () => {
        const matchSym = getKnownSymbol(WellKnownSymbols.match);
        const searchValue = /a/;
        (searchValue as any)[matchSym] = false;

        assert.equal(strReplaceAll("a_a", searchValue as any, "x"), "x_a");
        assert.equal(polyStrReplaceAll("a_a", searchValue as any, "x"), "x_a");
    });

    if (isNode()) {
        // Browser environment is not "letting" us override built-in prototypes to test delegation for falsey values,
        // but currently we can test in Node, this may fail if Node adds a native implementation, but we can address at that time if needed.
        it("delegates to @@replace for falsey non-null search values", () => {
            const replaceSym = getKnownSymbol(WellKnownSymbols.replace);
            const numberReplace = (Number.prototype as any)[replaceSym];
            const booleanReplace = (Boolean.prototype as any)[replaceSym];
            const stringReplace = (String.prototype as any)[replaceSym];

            (Number.prototype as any)[replaceSym] = function(value: string, replaceValue: any) {
                return "number:" + value + ":" + dumpObj(replaceValue);
            };
            (Boolean.prototype as any)[replaceSym] = function(value: string, replaceValue: any) {
                return "boolean:" + value + ":" + dumpObj(replaceValue);
            };
            (String.prototype as any)[replaceSym] = function(value: string, replaceValue: any) {
                return "string:" + value + ":" + dumpObj(replaceValue);
            };

            try {
                const expectedReplace = dumpObj("X");

                assert.equal(strReplaceAll("abc", 0 as any, "X"), "number:abc:" + expectedReplace);
                assert.equal(polyStrReplaceAll("abc", 0 as any, "X"), "number:abc:" + expectedReplace);

                assert.equal(strReplaceAll("abc", false as any, "X"), "boolean:abc:" + expectedReplace);
                assert.equal(polyStrReplaceAll("abc", false as any, "X"), "boolean:abc:" + expectedReplace);

                assert.equal(strReplaceAll("abc", "" as any, "X"), "string:abc:" + expectedReplace);
                assert.equal(polyStrReplaceAll("abc", "" as any, "X"), "string:abc:" + expectedReplace);
            } finally {
                (Number.prototype as any)[replaceSym] = numberReplace;
                (Boolean.prototype as any)[replaceSym] = booleanReplace;
                (String.prototype as any)[replaceSym] = stringReplace;
            }
        });
    }

    it("throws for non-global regular expressions", () => {
        _expectThrow(() => {
            strReplaceAll("abc123", /\d+/, "#");
        });

        _expectThrow(() => {
            polyStrReplaceAll("abc123", /\d+/, "#");
        });
    });

    it("throws for null and undefined values", () => {
        _expectThrow(() => {
            strReplaceAll(null as any, "a", "b");
        });

        _expectThrow(() => {
            polyStrReplaceAll(undefined as any, "a", "b");
        });
    });

    it("matches native replaceAll semantics", () => {
        let replacer = (match: string, index: number) => {
            return "(" + match + ":" + index + ")";
        };

        let testCases: { value: any; searchValue: any; replaceValue: any }[] = [
            { value: "banana", searchValue: "a", replaceValue: "o" },
            { value: "banana", searchValue: "", replaceValue: "-" },
            { value: "abc123abc", searchValue: "abc", replaceValue: "X" },
            { value: "abc123abc", searchValue: /abc/g, replaceValue: "X" },
            { value: "abc123abc", searchValue: /\d+/g, replaceValue: replacer },
            { value: "a*b*a", searchValue: "*", replaceValue: "-" },
            { value: "a[b]c[d]", searchValue: "[", replaceValue: "(" },
            { value: "a.b.a.b", searchValue: ".", replaceValue: "!" },
            { value: "null value", searchValue: null, replaceValue: "nil" },
            { value: "undefined value", searchValue: undefined, replaceValue: "undef" },
            { value: 12341234, searchValue: "34", replaceValue: "x" },
            { value: "aaa", searchValue: "a", replaceValue: "$$" }
        ];

        for (let lp = 0; lp < testCases.length; lp++) {
            let testCase = testCases[lp];
            _checkNativeParity("strReplaceAll", (value, searchValue, replaceValue) => {
                return strReplaceAll(value, searchValue, replaceValue);
            }, testCase.value, testCase.searchValue, testCase.replaceValue);

            _checkNativeParity("polyStrReplaceAll", (value, searchValue, replaceValue) => {
                return polyStrReplaceAll(value, searchValue, replaceValue);
            }, testCase.value, testCase.searchValue, testCase.replaceValue);
        }
    });

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

    function _checkNativeParity(testName: string, testFn: (value: any, searchValue: any, replaceValue: any) => string, value: any, searchValue: any, replaceValue: any) {
        let testResult: any;
        let nativeResult: any;
        let testThrew: any;
        let nativeThrew: any;

        try {
            testResult = testFn(value, searchValue, replaceValue);
        } catch (e) {
            testThrew = e;
        }

        try {
            nativeResult = (String.prototype as any).replaceAll.call(value, searchValue, replaceValue);
        } catch (e) {
            nativeThrew = e;
        }

        if (testThrew) {
            assert.equal(true, !!nativeThrew,
                "Checking whether Native and " + testName + " both threw [" + dumpObj(testThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "] [" + dumpObj(searchValue) + "]");
        } else if (nativeThrew) {
            assert.ok(false,
                "Native threw but " + testName + " did not [" + dumpObj(testResult) + "] - [" + dumpObj(nativeThrew) + "] for [" + dumpObj(value) + "] [" + dumpObj(searchValue) + "]");
        } else {
            assert.equal(testResult, nativeResult,
                "Checking whether Native and " + testName + " returned the same [" + dumpObj(testResult) + "] - [" + dumpObj(nativeResult) + "] for [" + dumpObj(value) + "] [" + dumpObj(searchValue) + "]");
        }
    }
});
