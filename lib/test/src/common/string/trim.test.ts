/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "../../../../src/polyfills/trim";
import { strTrim, strTrimEnd, strTrimStart } from "../../../../src/string/trim";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isUndefined } from "../../../../src/helpers/base";

describe("string helpers", () => {
    describe("trim null / undefined", () => {
        _checkTrim(null);
        _checkTrim(undefined);
    });

    describe("polyTrim null / undefined", () => {
        _checkPolyTrim(null);
        _checkPolyTrim(undefined);
    });

    describe("trimStart null / undefined", () => {
        _checkTrimStart(null);
        _checkTrimStart(undefined);
    });

    describe("polyTrimStart null / undefined", () => {
        _checkPolyTrimStart(null);
        _checkPolyTrimStart(undefined);
    });

    describe("trimEnd null / undefined", () => {
        _checkTrimEnd(null);
        _checkTrimEnd(undefined);
    });

    describe("polyTrimEnd null / undefined", () => {
        _checkPolyTrimEnd(null);
        _checkPolyTrimEnd(undefined);
    });

    describe("trim With values", () => {
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

    describe("polyTrim With values", () => {
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

    describe("trimStart With values", () => {
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

    describe("polyTrimStart With values", () => {
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

    describe("trimEnd With values", () => {
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
        _checkTrimStart(" abba     ");
    });

    describe("polyTrimEnd With values", () => {
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

    describe("trim with special whitespace", () => {
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

    describe("polyTrim with special whitespace", () => {
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

    describe("trimStart with special whitespace", () => {
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

    describe("polyTrimStart with special whitespace", () => {
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

    describe("trimEnd with special whitespace", () => {
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

    describe("polyTrimEnd with special whitespace", () => {
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

