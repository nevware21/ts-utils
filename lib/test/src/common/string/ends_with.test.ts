/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import {
    strEndsWith
} from "../../../../src/string/ends_with";
import { dumpObj } from "../../../../src/helpers/diagnostics";

describe("string helpers", () => {
    describe("strEndsWith null / undefined", () => {
        _expectThrow(() => {
            _checkEndsWith(null, null as any);
        });
        _expectThrow(() => {
            _checkEndsWith(null, "" as any);
        });
        _expectThrow(() => {
            _checkEndsWith(null, "n" as any);
        });
        _expectThrow(() => {
            _checkEndsWith(null, "nu" as any);
        });
        _expectThrow(() => {
            _checkEndsWith(null, "nul" as any);
        });
        _expectThrow(() => {
            _checkEndsWith(null, "l" as any, 2);
        });
        _expectThrow(() => {
            _checkEndsWith(null, "l" as any, 3);
        });
        _expectThrow(() => {
            _checkEndsWith(null, null as any, 0);
        });
        _expectThrow(() => {
            _checkEndsWith(null, null as any, -1);
        });
        _expectThrow(() => {
            _checkEndsWith(undefined, undefined as any);
        });
        _expectThrow(() => {
            _checkEndsWith(undefined, "");
        });
        _expectThrow(() => {
            _checkEndsWith(undefined, "u");
        });
        _expectThrow(() => {
            _checkEndsWith(undefined, "undef");
        });
        _expectThrow(() => {
            _checkEndsWith(undefined, "fined", 4);
        });
        _expectThrow(() => {
            _checkEndsWith(undefined, "unde", 4);
        });
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
        let nativeResult = String.prototype.endsWith.call(value, search, length);

        assert.equal(helperResult, nativeResult, "Checking endsWith Native (" + nativeResult + ") and result for [" + dumpObj(value) + "] for [" + search + "] len:" + (length || 0));
    }

    function _expectThrow(cb: () => void): Error {
        try {
            cb();
        } catch (e) {
            assert.ok(true, "Expected an exception to be thrown");
            return e;
        }
    }
});

