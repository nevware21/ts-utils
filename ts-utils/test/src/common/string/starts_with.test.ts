import { assert } from "chai";
import { strStartsWith } from "../../../../src/string/starts_with";
import { dumpObj } from "../../../../src/helpers/diagnostics";

describe("string helpers", () => {
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

    function _checkStartsWith(value: any, search: any, position?: number) {
        let helperResult = strStartsWith(value, search, position);
        let nativeResult = String.prototype.startsWith.call("" + value, search, position);

        assert.equal(helperResult, nativeResult, "Checking startsWith Native (" + nativeResult + ") and result for [" + dumpObj(value) + "] for [" + search + "] @ " + (position || 0));
    }
});

