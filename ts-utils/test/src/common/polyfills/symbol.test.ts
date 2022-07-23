import { assert } from "chai";
import { isUndefined } from "../../../../src/helpers/base";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { polySymbolFor, polySymbolKeyFor } from "../../../../src/polyfills/symbol";

describe("symbol polyfills", () => {
    it("polySymbolFor null / undefined", () => {
        _checkSymbolFor(null);
        _checkSymbolFor(undefined);
        _checkSymbolFor("null");
        _checkSymbolFor("undefined");
        _checkSymbolFor("");
    });

    it("polySymbolFor With values", () => {
        //_checkSymbolFor("");
        _checkSymbolFor("a");
        _checkSymbolFor("ab");
        _checkSymbolFor("abba");
        _checkSymbolFor("zyxyvutsrqponmlkjihgfedcba");
        _checkSymbolFor(0);
        _checkSymbolFor(10000);
    });

    it("polySymbolKeyFor null / undefined", () => {
        _checkSymbolKeyFor(null);
        _checkSymbolKeyFor(undefined);
        _checkSymbolKeyFor("null");
        _checkSymbolKeyFor("undefined");
        _checkSymbolKeyFor("");
    });

    it("polySymbolKeyFor With values", () => {
        // _checkSymbolKeyFor("");
        _checkSymbolKeyFor("a");
        _checkSymbolKeyFor("ab");
        _checkSymbolKeyFor("abba");
        _checkSymbolKeyFor("zyxyvutsrqponmlkjihgfedcba");
        _checkSymbolKeyFor(0);
        _checkSymbolKeyFor(10000);
    });


    function _checkSymbolFor(value: any) {
        let polyResult: any;
        let nativeResult: any;
        let polyThrew: any;
        let nativeThrew: any;
        try {
            polyResult = polySymbolFor(value);
        } catch (e) {
            polyThrew = e;
        }
        try {
            nativeResult = Symbol.for(value);
        } catch (e) {
            nativeThrew = e;
        }

        if (polyThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and polyfill threw or returned undefined [" + dumpObj(polyThrew || polyResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Symbol.for threw but polySymbolFor didn't [" + dumpObj(polyThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(polyResult.toString(), nativeResult.toString(), "Checking Symbol.for Native (" + dumpObj(nativeResult) + ") and polyfill result for [" + dumpObj(value) + "]");
            assert.equal(polyResult.description, nativeResult.description, "Checking Symbol.for Native (" + dumpObj(nativeResult) + ") and polyfill result for [" + dumpObj(value) + "]");
        }
    }

    function _checkSymbolKeyFor(value: any) {
        let polyResult: any;
        let nativeResult: any;
        let polyThrew: any;
        let nativeThrew: any;
        try {
            polyResult = polySymbolKeyFor(polySymbolFor(value));
        } catch (e) {
            polyThrew = e;
        }
        try {
            nativeResult = Symbol.keyFor(Symbol.for(value));
        } catch (e) {
            nativeThrew = e;
        }

        if (polyThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and polyfill threw or returned undefined [" + dumpObj(polyThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
        } else if(nativeThrew) {
            assert.ok(false,
                "Symbol.keyFor threw but polySymbolKeyFor didn't [" + dumpObj(polyResult) + "] - [" + dumpObj(nativeThrew) + "] for [" + dumpObj(value) + "]");
        } else {
            assert.equal(polyResult, nativeResult, "Checking Symbol.keyFor Native (" + dumpObj(nativeResult) + ") and polyfill result for [" + dumpObj(value) + "]");
        }

    }
});