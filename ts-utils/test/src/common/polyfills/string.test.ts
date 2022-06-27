import { assert } from "chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { polyStrStartsWith } from "../../../../src/string/starts_with";
import { polyStrEndsWith } from "../../../../src/string/ends_with";

describe("string polyfills", () => {
    describe("polyStrStartsWith null / undefined", () => {
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

    describe("polyStrStartsWith With values", () => {
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

    describe("polyStrEndsWith null / undefined", () => {
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

    describe("polyStrEndsWith With values", () => {
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


    function _checkStartsWith(value: any, search: any, position?: number) {
        let polyResult = polyStrStartsWith(value, search, position);
        let nativeResult = String.prototype.startsWith.call("" + value, search, position);

        assert.equal(polyResult, nativeResult, "Checking startsWith Native (" + nativeResult + ") and polyfill result for [" + dumpObj(value) + "] for [" + search + "] @ " + (position || 0));
    }

    function _checkEndsWith(value: any, search: any, length?: number) {
        let polyResult = polyStrEndsWith(value, search, length);
        let nativeResult = String.prototype.endsWith.call("" + value, search, length);

        assert.equal(polyResult, nativeResult, "Checking endsWith Native (" + nativeResult + ") and polyfill result for [" + dumpObj(value) + "] for [" + search + "] len:" + (length || 0));
    }
});