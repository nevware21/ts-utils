import { assert } from "chai";
import {
    strEndsWith,
    strIsNullOrEmpty,
    strIsNullOrWhiteSpace,
    strStartsWith
} from "../../../../src/helpers/string";
import { dumpObj } from "../../../../src/helpers/diagnostics";

describe("string helpers", () => {
    describe("isNullOrWhiteSpace", () => {
        it("True values", () => {
            assert.ok(strIsNullOrWhiteSpace(undefined as any), "Checking undefined");
            assert.ok(strIsNullOrWhiteSpace(null as any), "Checking null");
            assert.ok(strIsNullOrWhiteSpace("" as any), "Checking ''");
            assert.ok(strIsNullOrWhiteSpace(" " as any), "Checking ' '");
            assert.ok(strIsNullOrWhiteSpace("  " as any), "Checking '  '");
            assert.ok(strIsNullOrWhiteSpace("   " as any), "Checking '   '");
            assert.ok(strIsNullOrWhiteSpace("\t" as any), "Checking '\\t'");
            assert.ok(strIsNullOrWhiteSpace(" \t" as any), "Checking ' \\t'");
            assert.ok(strIsNullOrWhiteSpace(" \t " as any), "Checking ' \\t '");
            assert.ok(strIsNullOrWhiteSpace("\r" as any), "Checking '\\r'");
            assert.ok(strIsNullOrWhiteSpace(" \r" as any), "Checking ' \\r'");
            assert.ok(strIsNullOrWhiteSpace(" \r " as any), "Checking ' \\r '");
            assert.ok(strIsNullOrWhiteSpace("\n" as any), "Checking '\\n'");
            assert.ok(strIsNullOrWhiteSpace(" \n" as any), "Checking ' \\n'");
            assert.ok(strIsNullOrWhiteSpace(" \n " as any), "Checking ' \\n '");
            assert.ok(strIsNullOrWhiteSpace("\f" as any), "Checking '\\f'");
            assert.ok(strIsNullOrWhiteSpace(" \f" as any), "Checking ' \\f'");
            assert.ok(strIsNullOrWhiteSpace(" \f " as any), "Checking ' \\f '");
            assert.ok(strIsNullOrWhiteSpace("\v" as any), "Checking '\\v'");
            assert.ok(strIsNullOrWhiteSpace(" \v" as any), "Checking ' \\v'");
            assert.ok(strIsNullOrWhiteSpace(" \v " as any), "Checking ' \\v '");
            assert.ok(strIsNullOrWhiteSpace(" \v \t \r \n \f" as any), "Checking ' \\v \\t \\r \\n \\f '");
        });

        it("False string values", () => {
            assert.ok(!strIsNullOrWhiteSpace("." as any), "Checking ' '");
            assert.ok(!strIsNullOrWhiteSpace("  . " as any), "Checking '   '");
            assert.ok(!strIsNullOrWhiteSpace(" \t." as any), "Checking ' \\t'");
            assert.ok(!strIsNullOrWhiteSpace(" \t. " as any), "Checking ' \\t '");
            assert.ok(!strIsNullOrWhiteSpace(" \s." as any), "Checking ' \\s'");
            assert.ok(!strIsNullOrWhiteSpace(" \s. " as any), "Checking ' \\s '");
            assert.ok(!strIsNullOrWhiteSpace(" \r." as any), "Checking ' \\r'");
            assert.ok(!strIsNullOrWhiteSpace(" \r. " as any), "Checking ' \\r '");
            assert.ok(!strIsNullOrWhiteSpace(" \n." as any), "Checking ' \\n'");
            assert.ok(!strIsNullOrWhiteSpace(" \n. " as any), "Checking ' \\n '");
            assert.ok(!strIsNullOrWhiteSpace(" \f." as any), "Checking ' \\f'");
            assert.ok(!strIsNullOrWhiteSpace(" \f. " as any), "Checking ' \\f '");
            assert.ok(!strIsNullOrWhiteSpace(" \v \t.\r \n \f" as any), "Checking ' \\v \\t.\\r \\n \\f '");
        });

        it("Non string values", () => {
            assert.ok(!strIsNullOrWhiteSpace({} as any), "Checking '{}'");
            assert.ok(!strIsNullOrWhiteSpace(new Date() as any), "Checking new Date()");
        });
    });

    describe("strIsNullOrEmpty", () => {
        it("True values", () => {
            assert.ok(strIsNullOrEmpty(undefined as any), "Checking undefined");
            assert.ok(strIsNullOrEmpty(null as any), "Checking null");
            assert.ok(strIsNullOrEmpty("" as any), "Checking ''");
        });

        it("False string values", () => {
            assert.ok(!strIsNullOrEmpty(" " as any), "Checking ' '");
            assert.ok(!strIsNullOrEmpty("   " as any), "Checking '   '");
            assert.ok(!strIsNullOrEmpty("\t" as any), "Checking '\\t'");
            assert.ok(!strIsNullOrEmpty(" \t" as any), "Checking ' \\t'");
            assert.ok(!strIsNullOrEmpty(" \t " as any), "Checking ' \\t '");
            assert.ok(!strIsNullOrEmpty("\s" as any), "Checking '\\s'");
            assert.ok(!strIsNullOrEmpty(" \s" as any), "Checking ' \\s'");
            assert.ok(!strIsNullOrEmpty(" \s " as any), "Checking ' \\s '");
            assert.ok(!strIsNullOrEmpty("\r" as any), "Checking '\\r'");
            assert.ok(!strIsNullOrEmpty(" \r" as any), "Checking ' \\r'");
            assert.ok(!strIsNullOrEmpty(" \r " as any), "Checking ' \\r '");
            assert.ok(!strIsNullOrEmpty("\n" as any), "Checking '\\n'");
            assert.ok(!strIsNullOrEmpty(" \n" as any), "Checking ' \\n'");
            assert.ok(!strIsNullOrEmpty(" \n " as any), "Checking ' \\n '");
            assert.ok(!strIsNullOrEmpty("\f" as any), "Checking '\\f'");
            assert.ok(!strIsNullOrEmpty(" \f" as any), "Checking ' \\f'");
            assert.ok(!strIsNullOrEmpty(" \f " as any), "Checking ' \\f '");
            assert.ok(!strIsNullOrEmpty("\v" as any), "Checking '\\v'");
            assert.ok(!strIsNullOrEmpty(" \v" as any), "Checking ' \\v'");
            assert.ok(!strIsNullOrEmpty(" \v " as any), "Checking ' \\v '");
        });

        it("Non string values", () => {
            assert.ok(!strIsNullOrEmpty({} as any), "Checking '{}'");
            assert.ok(!strIsNullOrEmpty(new Date() as any), "Checking new Date()");
        });
    });

    describe("strStartsWith null / undefined", () => {
        _checkStartsWith(null, null as any);
        _checkStartsWith(null, "" as any);
        _checkStartsWith(null, "n" as any);
        _checkStartsWith(null, "nu" as any);
        _checkStartsWith(null, "nul" as any);
        _checkStartsWith(null, "l" as any, 2);
        _checkStartsWith(null, "l" as any, -2);
        _checkStartsWith(null, null as any, -1);
        _checkStartsWith(undefined, undefined as any);
        _checkStartsWith(undefined, "");
        _checkStartsWith(undefined, "u");
        _checkStartsWith(undefined, "undef");
        _checkStartsWith(undefined, "fined", 4);
        _checkStartsWith("null", null as any);
        _checkStartsWith("undefined", undefined as any);
        _checkStartsWith("", null as any);
        _checkStartsWith("", undefined as any);
    });

    describe("strStartsWith With values", () => {
        _checkStartsWith("", "");
        _checkStartsWith("", "", 10);
        _checkStartsWith("", "", -1);
        _checkStartsWith("", "", -10);
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
        _checkStartsWith("zyxyvutsrqponmlkjihgfedcba", "zyxw", -10);
        _checkStartsWith("zyxyvutsrqponmlkjihgfedcba", "ponm", -10);
    });

    describe("strEndsWith null / undefined", () => {
        _checkEndsWith(null, null as any);
        _checkEndsWith(null, "" as any);
        _checkEndsWith(null, "n" as any);
        _checkEndsWith(null, "nu" as any);
        _checkEndsWith(null, "nul" as any);
        _checkEndsWith(null, "l" as any, 2);
        _checkEndsWith(null, "l" as any, 3);
        _checkEndsWith(null, null as any, 0);
        _checkEndsWith(null, null as any, -1);
        _checkEndsWith(undefined, undefined as any);
        _checkEndsWith(undefined, "");
        _checkEndsWith(undefined, "u");
        _checkEndsWith(undefined, "undef");
        _checkEndsWith(undefined, "fined", 4);
        _checkEndsWith(undefined, "unde", 4);
        _checkEndsWith("null", null as any);
        _checkEndsWith("undefined", undefined as any);
        _checkEndsWith("", null as any);
        _checkEndsWith("", undefined as any);
    });

    describe("strEndsWith With values", () => {
        _checkEndsWith("", "");
        _checkEndsWith("", "", 0);
        _checkEndsWith("", "", 10);
        _checkEndsWith("", "", -1);
        _checkEndsWith("", "a");
        _checkEndsWith("", "a", 10);
        _checkEndsWith("", "a", 11);
        _checkEndsWith("", "a", 0);
        _checkEndsWith("", "a", -1);
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
        _checkEndsWith("zyxyvutsrqponmlkjihgfedcba", "a");
        _checkEndsWith("zyxyvutsrqponmlkjihgfedcba", "a", 10);
        _checkEndsWith("zyxyvutsrqponmlkjihgfedcba", "p", 10);
        _checkEndsWith("zyxyvutsrqponmlkjihgfedcba", "zyxw");
        _checkEndsWith("zyxyvutsrqponmlkjihgfedcba", "zyxw", 10);
        _checkEndsWith("zyxyvutsrqponmlkjihgfedcba", "ponm", 14);
    });


    function _checkStartsWith(value: any, search: any, position?: number) {
        let helperResult = strStartsWith(value, search, position);
        let nativeResult = String.prototype.startsWith.call("" + value, search, position);

        assert.equal(helperResult, nativeResult, "Checking startsWith Native (" + nativeResult + ") and result for [" + dumpObj(value) + "] for [" + search + "] @ " + (position || 0));
    }

    function _checkEndsWith(value: any, search: any, length?: number) {
        let helperResult = strEndsWith(value, search, length);
        let nativeResult = String.prototype.endsWith.call("" + value, search, length);

        assert.equal(helperResult, nativeResult, "Checking endsWith Native (" + nativeResult + ") and result for [" + dumpObj(value) + "] for [" + search + "] len:" + (length || 0));
    }

});
