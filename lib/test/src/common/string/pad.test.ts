/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { strPadStart, polyStrPadStart, strPadEnd, polyStrPadEnd } from "../../../../src/string/pad";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isUndefined } from "../../../../src/helpers/base";

describe("string helpers", () => {

    describe("strPadStart null / undefined", () => {
        _checkPadStart(null, 0);
        _checkPadStart(null, 2);
        _checkPadStart(null, -2);
        _checkPadStart(null, 10);
        _checkPadStart(null, 100);
        _checkPadStart(undefined, 0);
        _checkPadStart(undefined, 2);
        _checkPadStart(undefined, -2);
        _checkPadStart(undefined, 10);
        _checkPadStart(undefined, 100);
    });

    describe("polyStrPadStart null / undefined", () => {
        _checkPolyPadStart(null, 0);
        _checkPolyPadStart(null, 2);
        _checkPolyPadStart(null, -2);
        _checkPolyPadStart(null, 10);
        _checkPolyPadStart(null, 100);
        _checkPolyPadStart(undefined, 0);
        _checkPolyPadStart(undefined, 2);
        _checkPolyPadStart(undefined, -2);
        _checkPolyPadStart(undefined, 10);
        _checkPolyPadStart(undefined, 100);
    });

    describe("implStrPadStart null / undefined", () => {
        _checkImplPadStart(null, 0);
        _checkImplPadStart(null, 2);
        _checkImplPadStart(null, -2);
        _checkImplPadStart(null, 10);
        _checkImplPadStart(null, 100);
        _checkImplPadStart(undefined, 0);
        _checkImplPadStart(undefined, 2);
        _checkImplPadStart(undefined, -2);
        _checkImplPadStart(undefined, 10);
        _checkImplPadStart(undefined, 100);
    });

    describe("strPadStart With values", () => {
        _checkPadStart("", 0);
        _checkPadStart("null", 0);
        _checkPadStart("abcdefg", 0);
        _checkPadStart("abcdefg", 10);
        _checkPadStart("abcdefg", 100);
        _checkPadStart("abcdefg", -1);
        _checkPadStart("abcdefg", -10);
        _checkPadStart("abcdefg", -100);
        _checkPadStart("abc", 3.5);
        _checkPadStart("abc", 1/0);

        assert.equal("       abc", strPadStart("abc", 10));
        assert.equal("abc", strPadStart("abc", 3));
        assert.equal(" abc", strPadStart("abc", 4));
        assert.equal("abc", strPadStart("abc", 1));
    });

    describe("polyStrPadStart With values", () => {
        _checkPolyPadStart("", 0);
        _checkPolyPadStart("null", 0);
        _checkPolyPadStart("abcdefg", 0);
        _checkPolyPadStart("abcdefg", 10);
        _checkPolyPadStart("abcdefg", 100);
        _checkPolyPadStart("abcdefg", -1);
        _checkPolyPadStart("abcdefg", -10);
        _checkPolyPadStart("abcdefg", -100);
        _checkPolyPadStart("abc", 3.5);
        _checkPolyPadStart("abc", 1/0);

        assert.equal("       abc", polyStrPadStart("abc", 10));
        assert.equal("abc", polyStrPadStart("abc", 3));
        assert.equal(" abc", polyStrPadStart("abc", 4));
        assert.equal("abc", polyStrPadStart("abc", 1));
    });

    describe("implStrPadStart With values", () => {
        _checkImplPadStart("", 0);
        _checkImplPadStart("null", 0);
        _checkImplPadStart("abcdefg", 0);
        _checkImplPadStart("abcdefg", 10);
        _checkImplPadStart("abcdefg", 100);
        _checkImplPadStart("abcdefg", -1);
        _checkImplPadStart("abcdefg", -10);
        _checkImplPadStart("abcdefg", -100);
        _checkImplPadStart("abc", 3.5);
        _checkImplPadStart("abc", 1/0);
    });

    describe("strPadStart With padding", () => {
        _checkPadStart("", 0, "foo");
        _checkPadStart("null", 0, "foo");
        _checkPadStart("abcdefg", 0, "foo");
        _checkPadStart("abcdefg", 10, "foo");
        _checkPadStart("abcdefg", 100, "foo");
        _checkPadStart("abcdefg", -1, "foo");
        _checkPadStart("abcdefg", -10, "foo");
        _checkPadStart("abcdefg", -100, "foo");
        _checkPadStart("abc", 3.5, "foo");
        _checkPadStart("abc", 1/0, "foo");

        assert.equal("foofoofabc", strPadStart("abc", 10, "foo"));
        assert.equal("abc", strPadStart("abc", 3, "foo"));
        assert.equal("fabc", strPadStart("abc", 4, "foo"));
        assert.equal("abc", strPadStart("abc", 1, "foo"));
    });

    describe("polyStrPadStart With padding", () => {
        _checkPolyPadStart("", 0, "foo");
        _checkPolyPadStart("null", 0, "foo");
        _checkPolyPadStart("abcdefg", 0, "foo");
        _checkPolyPadStart("abcdefg", 10, "foo");
        _checkPolyPadStart("abcdefg", 100, "foo");
        _checkPolyPadStart("abcdefg", -1, "foo");
        _checkPolyPadStart("abcdefg", -10, "foo");
        _checkPolyPadStart("abcdefg", -100, "foo");
        _checkPolyPadStart("abc", 3.5, "foo");
        _checkPolyPadStart("abc", 1/0, "foo");

        assert.equal("foofoofabc", polyStrPadStart("abc", 10, "foo"));
        assert.equal("abc", polyStrPadStart("abc", 3, "foo"));
        assert.equal("fabc", polyStrPadStart("abc", 4, "foo"));
        assert.equal("abc", polyStrPadStart("abc", 1, "foo"));
    });

    describe("implStrPadStart With padding", () => {
        _checkImplPadStart("", 0, "foo");
        _checkImplPadStart("null", 0, "foo");
        _checkImplPadStart("abcdefg", 0, "foo");
        _checkImplPadStart("abcdefg", 10, "foo");
        _checkImplPadStart("abcdefg", 100, "foo");
        _checkImplPadStart("abcdefg", -1, "foo");
        _checkImplPadStart("abcdefg", -10, "foo");
        _checkImplPadStart("abcdefg", -100, "foo");
        _checkImplPadStart("abc", 3.5, "foo");
        _checkImplPadStart("abc", 1/0, "foo");
    });

    describe("strPadEnd null / undefined", () => {
        _checkPadEnd(null, 0);
        _checkPadEnd(null, 2);
        _checkPadEnd(null, -2);
        _checkPadEnd(null, 10);
        _checkPadEnd(null, 100);
        _checkPadEnd(undefined, 0);
        _checkPadEnd(undefined, 2);
        _checkPadEnd(undefined, -2);
        _checkPadEnd(undefined, 10);
        _checkPadEnd(undefined, 100);
    });

    describe("polyStrPadEnd null / undefined", () => {
        _checkPolyPadEnd(null, 0);
        _checkPolyPadEnd(null, 2);
        _checkPolyPadEnd(null, -2);
        _checkPolyPadEnd(null, 10);
        _checkPolyPadEnd(null, 100);
        _checkPolyPadEnd(undefined, 0);
        _checkPolyPadEnd(undefined, 2);
        _checkPolyPadEnd(undefined, -2);
        _checkPolyPadEnd(undefined, 10);
        _checkPolyPadEnd(undefined, 100);
    });

    describe("implStrPadEnd null / undefined", () => {
        _checkImplPadEnd(null, 0);
        _checkImplPadEnd(null, 2);
        _checkImplPadEnd(null, -2);
        _checkImplPadEnd(null, 10);
        _checkImplPadEnd(null, 100);
        _checkImplPadEnd(undefined, 0);
        _checkImplPadEnd(undefined, 2);
        _checkImplPadEnd(undefined, -2);
        _checkImplPadEnd(undefined, 10);
        _checkImplPadEnd(undefined, 100);
    });

    describe("strPadEnd With values", () => {
        _checkPadEnd("", 0);
        _checkPadEnd("null", 0);
        _checkPadEnd("abcdefg", 0);
        _checkPadEnd("abcdefg", 10);
        _checkPadEnd("abcdefg", 100);
        _checkPadEnd("abcdefg", -1);
        _checkPadEnd("abcdefg", -10);
        _checkPadEnd("abcdefg", -100);
        _checkPadEnd("abc", 3.5);
        _checkPadEnd("abc", 1/0);

        assert.equal("abc       ", strPadEnd("abc", 10));
        assert.equal("abc", strPadEnd("abc", 3));
        assert.equal("abc ", strPadEnd("abc", 4));
        assert.equal("abc", strPadEnd("abc", 1));
    });

    describe("polyStrPadEnd With values", () => {
        _checkPolyPadEnd("", 0);
        _checkPolyPadEnd("null", 0);
        _checkPolyPadEnd("abcdefg", 0);
        _checkPolyPadEnd("abcdefg", 10);
        _checkPolyPadEnd("abcdefg", 100);
        _checkPolyPadEnd("abcdefg", -1);
        _checkPolyPadEnd("abcdefg", -10);
        _checkPolyPadEnd("abcdefg", -100);
        _checkPolyPadEnd("abc", 3.5);
        _checkPolyPadEnd("abc", 1/0);

        assert.equal("abc       ", polyStrPadEnd("abc", 10));
        assert.equal("abc", polyStrPadEnd("abc", 3));
        assert.equal("abc ", polyStrPadEnd("abc", 4));
        assert.equal("abc", polyStrPadEnd("abc", 1));
    });

    describe("implStrPadEnd With values", () => {
        _checkImplPadEnd("", 0);
        _checkImplPadEnd("null", 0);
        _checkImplPadEnd("abcdefg", 0);
        _checkImplPadEnd("abcdefg", 10);
        _checkImplPadEnd("abcdefg", 100);
        _checkImplPadEnd("abcdefg", -1);
        _checkImplPadEnd("abcdefg", -10);
        _checkImplPadEnd("abcdefg", -100);
        _checkImplPadEnd("abc", 3.5);
        _checkImplPadEnd("abc", 1/0);
    });

    describe("strPadEnd With padding", () => {
        _checkPadEnd("", 0, "foo");
        _checkPadEnd("null", 0, "foo");
        _checkPadEnd("abcdefg", 0, "foo");
        _checkPadEnd("abcdefg", 10, "foo");
        _checkPadEnd("abcdefg", 100, "foo");
        _checkPadEnd("abcdefg", -1, "foo");
        _checkPadEnd("abcdefg", -10, "foo");
        _checkPadEnd("abcdefg", -100, "foo");
        _checkPadEnd("abc", 3.5, "foo");
        _checkPadEnd("abc", 1/0, "foo");

        assert.equal("abcfoofoof", strPadEnd("abc", 10, "foo"));
        assert.equal("abc", strPadEnd("abc", 3, "foo"));
        assert.equal("abcf", strPadEnd("abc", 4, "foo"));
        assert.equal("abc", strPadEnd("abc", 1, "foo"));
    });

    describe("polyStrPadEnd With padding", () => {
        _checkPolyPadEnd("", 0, "foo");
        _checkPolyPadEnd("null", 0, "foo");
        _checkPolyPadEnd("abcdefg", 0, "foo");
        _checkPolyPadEnd("abcdefg", 10, "foo");
        _checkPolyPadEnd("abcdefg", 100, "foo");
        _checkPolyPadEnd("abcdefg", -1, "foo");
        _checkPolyPadEnd("abcdefg", -10, "foo");
        _checkPolyPadEnd("abcdefg", -100, "foo");
        _checkPolyPadEnd("abc", 3.5, "foo");
        _checkPolyPadEnd("abc", 1/0, "foo");

        assert.equal("abcfoofoof", polyStrPadEnd("abc", 10, "foo"));
        assert.equal("abc", polyStrPadEnd("abc", 3, "foo"));
        assert.equal("abcf", polyStrPadEnd("abc", 4, "foo"));
        assert.equal("abc", polyStrPadEnd("abc", 1, "foo"));
    });

    describe("implStrPadEnd With padding", () => {
        _checkImplPadEnd("", 0, "foo");
        _checkImplPadEnd("null", 0, "foo");
        _checkImplPadEnd("abcdefg", 0, "foo");
        _checkImplPadEnd("abcdefg", 10, "foo");
        _checkImplPadEnd("abcdefg", 100, "foo");
        _checkImplPadEnd("abcdefg", -1, "foo");
        _checkImplPadEnd("abcdefg", -10, "foo");
        _checkImplPadEnd("abcdefg", -100, "foo");
        _checkImplPadEnd("abc", 3.5, "foo");
        _checkImplPadEnd("abc", 1/0, "foo");
    });

    function _checkPadStart(value: any, count: number, fill?: string) {
        let padStartResult: any;
        let nativeResult: any;
        let padStartThrew: any;
        let nativeThrew: any;
        try {
            padStartResult = strPadStart(value, count, fill);
        } catch (e) {
            padStartThrew = e;
        }
        try {
            nativeResult = String.prototype.padStart.call(value as any, count, fill);
        } catch (e) {
            nativeThrew = e;
        }

        if (padStartThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and strPadStart threw or returned undefined [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but strPadStart didn't [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(padStartResult, nativeResult,
                "Checking whether the Native and strPadStart returned the same [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }

    function _checkPolyPadStart(value: any, count: number, fill?: string) {
        let padStartResult: any;
        let nativeResult: any;
        let padStartThrew: any;
        let nativeThrew: any;
        try {
            padStartResult = polyStrPadStart(value, count, fill);
        } catch (e) {
            padStartThrew = e;
        }
        try {
            nativeResult = String.prototype.padStart.call(value as any, count, fill);
        } catch (e) {
            nativeThrew = e;
        }

        if (padStartThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and polyStrPadStart threw or returned undefined [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but polyStrPadStart didn't [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(padStartResult, nativeResult,
                "Checking whether the Native and polyStrPadStart returned the same [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }

    function _checkImplPadStart(value: any, count: number, fill?: string) {
        let padStartResult: any;
        let implResult: any;
        let padStartThrew: any;
        let implThrew: any;
        try {
            padStartResult = polyStrPadStart(value, count, fill);
        } catch (e) {
            padStartThrew = e;
        }
        try {
            implResult = strPadStart(value as any, count, fill);
        } catch (e) {
            implThrew = e;
        }

        if (padStartThrew) {
            assert.equal(true, !!implThrew || isUndefined(implResult) || !!implResult,
                "Checking whether the Impl and polyStrPadStart threw or returned undefined [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(implThrew || implResult) + "] for [" + dumpObj(value) + "]");
        } else if(implThrew) {
            assert.ok(false,
                "Impl threw but polyStrPadStart didn't [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(implThrew || implResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(padStartResult, implResult,
                "Checking whether the Impl and polyStrPadStart returned the same [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(implThrew || implResult) + "] for [" + dumpObj(value) + "]");
        }
    }

    function _checkPadEnd(value: any, count: number, fill?: string) {
        let padStartResult: any;
        let nativeResult: any;
        let padStartThrew: any;
        let nativeThrew: any;
        try {
            padStartResult = strPadEnd(value, count, fill);
        } catch (e) {
            padStartThrew = e;
        }
        try {
            nativeResult = String.prototype.padEnd.call(value as any, count, fill);
        } catch (e) {
            nativeThrew = e;
        }

        if (padStartThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and strPadEnd threw or returned undefined [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but strPadEnd didn't [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(padStartResult, nativeResult,
                "Checking whether the Native and strPadEnd returned the same [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }

    function _checkPolyPadEnd(value: any, count: number, fill?: string) {
        let padStartResult: any;
        let nativeResult: any;
        let padStartThrew: any;
        let nativeThrew: any;
        try {
            padStartResult = polyStrPadEnd(value, count, fill);
        } catch (e) {
            padStartThrew = e;
        }
        try {
            nativeResult = String.prototype.padEnd.call(value as any, count, fill);
        } catch (e) {
            nativeThrew = e;
        }

        if (padStartThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and polyStrPadEnd threw or returned undefined [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but polyStrPadEnd didn't [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(padStartResult, nativeResult,
                "Checking whether the Native and polyStrPadEnd returned the same [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        }
    }

    function _checkImplPadEnd(value: any, count: number, fill?: string) {
        let padStartResult: any;
        let implResult: any;
        let padStartThrew: any;
        let implThrew: any;
        try {
            padStartResult = polyStrPadEnd(value, count, fill);
        } catch (e) {
            padStartThrew = e;
        }
        try {
            implResult = strPadEnd(value as any, count, fill);
        } catch (e) {
            implThrew = e;
        }

        if (padStartThrew) {
            assert.equal(true, !!implThrew || isUndefined(implResult) || !!implResult,
                "Checking whether the Impl and polyStrPadEnd threw or returned undefined [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(implThrew || implResult) + "] for [" + dumpObj(value) + "]");
        } else if(implThrew) {
            assert.ok(false,
                "Impl threw but polyStrPadEnd didn't [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(implThrew || implResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(padStartResult, implResult,
                "Checking whether the Impl and polyStrPadEnd returned the same [" + dumpObj(padStartThrew || padStartResult) + "] - [" + dumpObj(implThrew || implResult) + "] for [" + dumpObj(value) + "]");
        }
    }
});
