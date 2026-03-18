/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { strReplace } from "../../../../src/string/replace";

describe("strReplace", () => {
    it("basic replacement", () => {
        assert.equal(strReplace("a-b-a", "a", "x"), "x-b-a");
    });

    it("supports regular expressions", () => {
        assert.equal(strReplace("abc123def", /\d+/g, "#"), "abc#def");
    });

    it("supports replacement function", () => {
        assert.equal(strReplace("a1b2", /\d/g, (_match, index) => "(" + index + ")"), "a(1)b(3)");
    });

    it("throws for null and undefined values", () => {
        assert.throws(() => strReplace(null as any, "a", "b"));
        assert.throws(() => strReplace(undefined as any, "a", "b"));
    });

    it("matches native replace semantics", () => {
        let replacer = (match: string, offset: number) => {
            return "(" + match + ":" + offset + ")";
        };

        let testCases: { value: any; searchValue: any; replaceValue: any }[] = [
            { value: "banana", searchValue: "a", replaceValue: "o" },
            { value: "abc123abc", searchValue: /abc/g, replaceValue: "X" },
            { value: "abc123abc", searchValue: /\d+/, replaceValue: replacer },
            { value: "a.b.a.b", searchValue: ".", replaceValue: "!" },
            { value: "aaa", searchValue: "a", replaceValue: "$$" }
        ];

        for (let lp = 0; lp < testCases.length; lp++) {
            let testCase = testCases[lp];
            _checkNativeParity(testCase.value, testCase.searchValue, testCase.replaceValue);
        }
    });

    function _checkNativeParity(value: any, searchValue: any, replaceValue: any) {
        let testResult: any;
        let nativeResult: any;
        let testThrew: any;
        let nativeThrew: any;

        try {
            testResult = strReplace(value, searchValue, replaceValue);
        } catch (e) {
            testThrew = e;
        }

        try {
            nativeResult = String.prototype.replace.call(value, searchValue, replaceValue);
        } catch (e) {
            nativeThrew = e;
        }

        if (testThrew) {
            assert.equal(true, !!nativeThrew,
                "Checking whether Native and strReplace both threw [" + dumpObj(testThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "] [" + dumpObj(searchValue) + "]");
        } else if (nativeThrew) {
            assert.ok(false,
                "Native threw but strReplace did not [" + dumpObj(testResult) + "] - [" + dumpObj(nativeThrew) + "] for [" + dumpObj(value) + "] [" + dumpObj(searchValue) + "]");
        } else {
            assert.equal(testResult, nativeResult,
                "Checking whether Native and strReplace returned the same [" + dumpObj(testResult) + "] - [" + dumpObj(nativeResult) + "] for [" + dumpObj(value) + "] [" + dumpObj(searchValue) + "]");
        }
    }
});
