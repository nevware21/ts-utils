import { assert } from "chai";
import {
    strEndsWith
} from "../../../../src/string/ends_with";
import { dumpObj } from "../../../../src/helpers/diagnostics";

describe("string helpers", () => {
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

    function _checkEndsWith(value: any, search: any, length?: number) {
        let helperResult = strEndsWith(value, search, length);
        let nativeResult = String.prototype.endsWith.call("" + value, search, length);

        assert.equal(helperResult, nativeResult, "Checking endsWith Native (" + nativeResult + ") and result for [" + dumpObj(value) + "] for [" + search + "] len:" + (length || 0));
    }

});

