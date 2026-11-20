/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "../../../../src/polyfills/trim";
import { strTrim, strTrimEnd, strTrimStart } from "../../../../src/string/trim";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isUndefined } from "../../../../src/helpers/base";

describe("string helpers", () => {
    it("trim null / undefined", () => {
        _checkTrim(null);
        _checkTrim(undefined);
    });

    it("polyTrim null / undefined", () => {
        _checkPolyTrim(null);
        _checkPolyTrim(undefined);
    });

    it("trimStart null / undefined", () => {
        _checkTrimStart(null);
        _checkTrimStart(undefined);
    });

    it("polyTrimStart null / undefined", () => {
        _checkPolyTrimStart(null);
        _checkPolyTrimStart(undefined);
    });

    it("trimEnd null / undefined", () => {
        _checkTrimEnd(null);
        _checkTrimEnd(undefined);
    });

    it("polyTrimEnd null / undefined", () => {
        _checkPolyTrimEnd(null);
        _checkPolyTrimEnd(undefined);
    });

    it("trim with non-nullish falsy values", () => {
        _checkTrim(0);
        _checkTrim(false);
    });

    it("polyTrim with non-nullish falsy values", () => {
        _checkPolyTrim(0);
        _checkPolyTrim(false);
    });

    it("trimStart with non-nullish falsy values", () => {
        _checkTrimStart(0);
        _checkTrimStart(false);
    });

    it("polyTrimStart with non-nullish falsy values", () => {
        _checkPolyTrimStart(0);
        _checkPolyTrimStart(false);
    });

    it("trimEnd with non-nullish falsy values", () => {
        _checkTrimEnd(0);
        _checkTrimEnd(false);
    });

    it("polyTrimEnd with non-nullish falsy values", () => {
        _checkPolyTrimEnd(0);
        _checkPolyTrimEnd(false);
    });

    it("trim With values", () => {
        _checkTrim("null");
        _checkTrim("undefined");
        _checkTrim("");
        _checkTrim(" ");
        _checkTrim("  ");
        _checkTrim("                  ");
        _checkTrim("a");
        _checkTrim("a ");
        _checkTrim(" a");
        _checkTrim(" a ");
        _checkTrim("ab");
        _checkTrim("  ab");
        _checkTrim("ab  ");
        _checkTrim("  ab  ");
        _checkTrim("abba");
        _checkTrim("     abba");
        _checkTrim("abba     ");
        _checkTrim(" abba     ");
        _checkTrim("zyxyvutsrqponmlkjihgfedcba");
        _checkTrim(" zyxyvutsrqponmlkjihgfedcba");
        _checkTrim(" abba     ");
    });

    it("polyTrim With values", () => {
        _checkPolyTrim("null");
        _checkPolyTrim("undefined");
        _checkPolyTrim("");
        _checkPolyTrim(" ");
        _checkPolyTrim("  ");
        _checkPolyTrim("                  ");
        _checkPolyTrim("a");
        _checkPolyTrim("a ");
        _checkPolyTrim(" a");
        _checkPolyTrim(" a ");
        _checkPolyTrim("ab");
        _checkPolyTrim("  ab");
        _checkPolyTrim("ab  ");
        _checkPolyTrim("  ab  ");
        _checkPolyTrim("abba");
        _checkPolyTrim("     abba");
        _checkPolyTrim("abba     ");
        _checkPolyTrim(" abba     ");
        _checkPolyTrim("zyxyvutsrqponmlkjihgfedcba");
        _checkPolyTrim(" zyxyvutsrqponmlkjihgfedcba");
        _checkPolyTrim(" abba     ");
    });

    it("trimStart With values", () => {
        _checkTrimStart("null");
        _checkTrimStart("undefined");
        _checkTrimStart("");
        _checkTrimStart(" ");
        _checkTrimStart("  ");
        _checkTrimStart("                  ");
        _checkTrimStart("a");
        _checkTrimStart("a ");
        _checkTrimStart(" a");
        _checkTrimStart(" a ");
        _checkTrimStart("ab");
        _checkTrimStart("  ab");
        _checkTrimStart("ab  ");
        _checkTrimStart("  ab  ");
        _checkTrimStart("abba");
        _checkTrimStart("     abba");
        _checkTrimStart("abba     ");
        _checkTrimStart(" abba     ");
        _checkTrimStart("zyxyvutsrqponmlkjihgfedcba");
        _checkTrimStart(" zyxyvutsrqponmlkjihgfedcba");
        _checkTrimStart(" abba     ");
    });

    it("polyTrimStart With values", () => {
        _checkPolyTrimStart("null");
        _checkPolyTrimStart("undefined");
        _checkPolyTrimStart("");
        _checkPolyTrimStart(" ");
        _checkPolyTrimStart("  ");
        _checkPolyTrimStart("                  ");
        _checkPolyTrimStart("a");
        _checkPolyTrimStart("a ");
        _checkPolyTrimStart(" a");
        _checkPolyTrimStart(" a ");
        _checkPolyTrimStart("ab");
        _checkPolyTrimStart("  ab");
        _checkPolyTrimStart("ab  ");
        _checkPolyTrimStart("  ab  ");
        _checkPolyTrimStart("abba");
        _checkPolyTrimStart("     abba");
        _checkPolyTrimStart("abba     ");
        _checkPolyTrimStart(" abba     ");
        _checkPolyTrimStart("zyxyvutsrqponmlkjihgfedcba");
        _checkPolyTrimStart(" zyxyvutsrqponmlkjihgfedcba");
        _checkPolyTrimStart(" abba     ");
    });

    it("trimEnd With values", () => {
        _checkTrimEnd("null");
        _checkTrimEnd("undefined");
        _checkTrimEnd("");
        _checkTrimEnd(" ");
        _checkTrimEnd("  ");
        _checkTrimEnd("                  ");
        _checkTrimEnd("a");
        _checkTrimEnd("a ");
        _checkTrimEnd(" a");
        _checkTrimEnd(" a ");
        _checkTrimEnd("ab");
        _checkTrimEnd("  ab");
        _checkTrimEnd("ab  ");
        _checkTrimEnd("  ab  ");
        _checkTrimEnd("abba");
        _checkTrimEnd("     abba");
        _checkTrimEnd("abba     ");
        _checkTrimEnd(" abba     ");
        _checkTrimEnd("zyxyvutsrqponmlkjihgfedcba");
        _checkTrimEnd(" zyxyvutsrqponmlkjihgfedcba");
        _checkTrimEnd(" abba     ");
    });

    it("polyTrimEnd With values", () => {
        _checkPolyTrimEnd("null");
        _checkPolyTrimEnd("undefined");
        _checkPolyTrimEnd("");
        _checkPolyTrimEnd(" ");
        _checkPolyTrimEnd("  ");
        _checkPolyTrimEnd("                  ");
        _checkPolyTrimEnd("a");
        _checkPolyTrimEnd("a ");
        _checkPolyTrimEnd(" a");
        _checkPolyTrimEnd(" a ");
        _checkPolyTrimEnd("ab");
        _checkPolyTrimEnd("  ab");
        _checkPolyTrimEnd("ab  ");
        _checkPolyTrimEnd("  ab  ");
        _checkPolyTrimEnd("abba");
        _checkPolyTrimEnd("     abba");
        _checkPolyTrimEnd("abba     ");
        _checkPolyTrimEnd(" abba     ");
        _checkPolyTrimEnd("zyxyvutsrqponmlkjihgfedcba");
        _checkPolyTrimEnd(" zyxyvutsrqponmlkjihgfedcba");
        _checkPolyTrimEnd(" abba     ");
    });

    it("trim with special whitespace", () => {
        _checkTrim("\t");
        _checkTrim("\t ");
        _checkTrim(" \t ");
        _checkTrim("\t\t");
        _checkTrim("\t \t");
        _checkTrim(" \t\t ");
        _checkTrim(" \t\f\t ");
        _checkTrim("\f");
        _checkTrim("\v");
    });

    it("polyTrim with special whitespace", () => {
        _checkPolyTrim("\t");
        _checkPolyTrim("\t ");
        _checkPolyTrim(" \t ");
        _checkPolyTrim("\t\t");
        _checkPolyTrim("\t \t");
        _checkPolyTrim(" \t\t ");
        _checkPolyTrim(" \t\f\t ");
        _checkPolyTrim("\f");
        _checkPolyTrim("\v");
    });

    it("trimStart with special whitespace", () => {
        _checkTrimStart("\t");
        _checkTrimStart("\t ");
        _checkTrimStart(" \t ");
        _checkTrimStart("\t\t");
        _checkTrimStart("\t \t");
        _checkTrimStart(" \t\t ");
        _checkTrimStart(" \t\f\t ");
        _checkTrimStart("\f");
        _checkTrimStart("\v");
    });

    it("polyTrimStart with special whitespace", () => {
        _checkPolyTrimStart("\t");
        _checkPolyTrimStart("\t ");
        _checkPolyTrimStart(" \t ");
        _checkPolyTrimStart("\t\t");
        _checkPolyTrimStart("\t \t");
        _checkPolyTrimStart(" \t\t ");
        _checkPolyTrimStart(" \t\f\t ");
        _checkPolyTrimStart("\f");
        _checkPolyTrimStart("\v");
    });

    it("trimEnd with special whitespace", () => {
        _checkTrimEnd("\t");
        _checkTrimEnd("\t ");
        _checkTrimEnd(" \t ");
        _checkTrimEnd("\t\t");
        _checkTrimEnd("\t \t");
        _checkTrimEnd(" \t\t ");
        _checkTrimEnd(" \t\f\t ");
        _checkTrimEnd("\f");
        _checkTrimEnd("\v");
    });

    it("polyTrimEnd with special whitespace", () => {
        _checkPolyTrimEnd("\t");
        _checkPolyTrimEnd("\t ");
        _checkPolyTrimEnd(" \t ");
        _checkPolyTrimEnd("\t\t");
        _checkPolyTrimEnd("\t \t");
        _checkPolyTrimEnd(" \t\t ");
        _checkPolyTrimEnd(" \t\f\t ");
        _checkPolyTrimEnd("\f");
        _checkPolyTrimEnd("\v");
    });

    function _checkTrim(value: any) {
        let trimResult: any;
        let nativeResult: any;
        let trimThrew: any;
        let nativeThrew: any;
        try {
            trimResult = strTrim(value);
        } catch (e) {
            trimThrew = e;
        }
        try {
            nativeResult = String.prototype.trim.call(value as any);
        } catch (e) {
            nativeThrew = e;
        }

        if (trimThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and strTrim threw or returned undefined [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but strTrim didn't [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(trimResult, nativeResult,
                "Checking whether the Native and strTrim returned the same [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }

    function _checkPolyTrim(value: any) {
        let trimResult: any;
        let nativeResult: any;
        let trimThrew: any;
        let nativeThrew: any;
        try {
            trimResult = polyStrTrim(value);
        } catch (e) {
            trimThrew = e;
        }
        try {
            nativeResult = String.prototype.trim.call(value as any);
        } catch (e) {
            nativeThrew = e;
        }

        if (trimThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and polyStrTrim threw or returned undefined [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but polyStrTrim didn't [" + dumpObj(trimThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(trimResult, nativeResult,
                "Checking whether the Native and polyStrTrim returned the same [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }

    function _checkTrimStart(value: any) {
        let trimResult: any;
        let nativeResult: any;
        let trimThrew: any;
        let nativeThrew: any;
        try {
            trimResult = strTrimStart(value);
        } catch (e) {
            trimThrew = e;
        }
        try {
            nativeResult = String.prototype.trimStart.call(value as any);
        } catch (e) {
            nativeThrew = e;
        }

        if (trimThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and strTrimStart threw or returned undefined [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but strTrimStart didn't [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(trimResult, nativeResult,
                "Checking whether the Native and strTrimStart returned the same [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }

    function _checkPolyTrimStart(value: any) {
        let trimResult: any;
        let nativeResult: any;
        let trimThrew: any;
        let nativeThrew: any;
        try {
            trimResult = polyStrTrimStart(value);
        } catch (e) {
            trimThrew = e;
        }
        try {
            nativeResult = String.prototype.trimStart.call(value as any);
        } catch (e) {
            nativeThrew = e;
        }

        if (trimThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and polyStrTrimStart threw or returned undefined [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but polyStrTrimStart didn't [" + dumpObj(trimThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(trimResult, nativeResult,
                "Checking whether the Native and polyStrTrimStart returned the same [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }

    function _checkTrimEnd(value: any) {
        let trimResult: any;
        let nativeResult: any;
        let trimThrew: any;
        let nativeThrew: any;
        try {
            trimResult = strTrimEnd(value);
        } catch (e) {
            trimThrew = e;
        }
        try {
            nativeResult = String.prototype.trimEnd.call(value as any);
        } catch (e) {
            nativeThrew = e;
        }

        if (trimThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and strTrimEnd threw or returned undefined [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but strTrimEnd didn't [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(trimResult, nativeResult,
                "Checking whether the Native and strTrimEnd returned the same [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }

    function _checkPolyTrimEnd(value: any) {
        let trimResult: any;
        let nativeResult: any;
        let trimThrew: any;
        let nativeThrew: any;
        try {
            trimResult = polyStrTrimEnd(value);
        } catch (e) {
            trimThrew = e;
        }
        try {
            nativeResult = String.prototype.trimEnd.call(value as any);
        } catch (e) {
            nativeThrew = e;
        }

        if (trimThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and polyStrTrimEnd threw or returned undefined [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but polyStrTrimEnd didn't [" + dumpObj(trimThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(trimResult, nativeResult,
                "Checking whether the Native and polyStrTrimEnd returned the same [" + dumpObj(trimThrew || trimResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }
});

describe("trim polyfills with a long run of whitespace", () => {
    it("quickly trim a string with a long run of whitespace before its end", () => {
        // A regular expression for the whitespace at the end (/\s+$/g) took quadratic time for this (~7s for 80k spaces)
        const spaces = new Array(100001).join(" ");

        assert.equal(polyStrTrimEnd(spaces + "x "), spaces + "x");
        assert.equal(polyStrTrim(spaces + "x " + spaces), "x");
        assert.equal(polyStrTrimStart(spaces + "x" + spaces), "x" + spaces);
        assert.equal(polyStrTrimEnd(spaces), "");
        assert.equal(polyStrTrim("a" + spaces + "b"), "a" + spaces + "b", "Whitespace inside the string is kept");
    });
});
