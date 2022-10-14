/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { isUndefined } from "../../../../src/helpers/base";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { polyGetKnownSymbol, polyNewSymbol, polySymbolFor, polySymbolKeyFor } from "../../../../src/polyfills/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";

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

    it("polyGetKnownSymbol", () => {
        let expectedSymbols = {
            asyncIterator: polyGetKnownSymbol("asyncIterator"),
            hasInstance: polyGetKnownSymbol("hasInstance"),
            isConcatSpreadable: polyGetKnownSymbol("isConcatSpreadable"),
            iterator: polyGetKnownSymbol("iterator"),
            match: polyGetKnownSymbol("match"),
            matchAll: polyGetKnownSymbol("matchAll"),
            replace: polyGetKnownSymbol("replace"),
            search: polyGetKnownSymbol("search"),
            species: polyGetKnownSymbol("species"),
            split: polyGetKnownSymbol("split"),
            toPrimitive: polyGetKnownSymbol("toPrimitive"),
            toStringTag: polyGetKnownSymbol("toStringTag"),
            unscopables: polyGetKnownSymbol("unscopables")
        };

        assert.equal(polyGetKnownSymbol("asyncIterator"), expectedSymbols.asyncIterator, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol("hasInstance"), expectedSymbols.hasInstance, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol("isConcatSpreadable"), expectedSymbols.isConcatSpreadable, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol("iterator"), expectedSymbols.iterator, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol("match"), expectedSymbols.match, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol("matchAll"), expectedSymbols.matchAll, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol("replace"), expectedSymbols.replace, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol("search"), expectedSymbols.search, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol("species"), expectedSymbols.species, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol("split"), expectedSymbols.split, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol("toPrimitive"), expectedSymbols.toPrimitive, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol("toStringTag"), expectedSymbols.toStringTag, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol("unscopables"), expectedSymbols.unscopables, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol(WellKnownSymbols.asyncIterator), expectedSymbols.asyncIterator, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol(WellKnownSymbols.hasInstance), expectedSymbols.hasInstance, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol(WellKnownSymbols.isConcatSpreadable), expectedSymbols.isConcatSpreadable, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol(WellKnownSymbols.iterator), expectedSymbols.iterator, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol(WellKnownSymbols.match), expectedSymbols.match, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol(WellKnownSymbols.matchAll), expectedSymbols.matchAll, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol(WellKnownSymbols.replace), expectedSymbols.replace, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol(WellKnownSymbols.search), expectedSymbols.search, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol(WellKnownSymbols.species), expectedSymbols.species, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol(WellKnownSymbols.split), expectedSymbols.split, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol(WellKnownSymbols.toPrimitive), expectedSymbols.toPrimitive, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol(WellKnownSymbols.toStringTag), expectedSymbols.toStringTag, "Check that the expected symbol is returned");
        assert.equal(polyGetKnownSymbol(WellKnownSymbols.unscopables), expectedSymbols.unscopables, "Check that the expected symbol is returned");
    });

    it("polyNewSymbol", () => {
        assert.notEqual(polyNewSymbol("Hello"), polyNewSymbol("Hello"), "Always creates a new symbol");
        assert.equal(polyNewSymbol("Hello").toString(), polyNewSymbol("Hello").toString(), "While different they will look the same");
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