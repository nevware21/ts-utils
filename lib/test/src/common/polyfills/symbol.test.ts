/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isUndefined } from "../../../../src/helpers/base";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { polyGetKnownSymbol, polyNewSymbol, polySymbolFor, polySymbolKeyFor } from "../../../../src/polyfills/symbol";
import { isSymbol } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";
import { asString } from "../../../../src/string/as_string";

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
        _checkSymbolKeyForDirect(null);
        _checkSymbolKeyForDirect(undefined);
        _checkSymbolKeyForDirect("null");
        _checkSymbolKeyForDirect("undefined");
        _checkSymbolKeyForDirect("");
    });

    it("polySymbolKeyFor With values", () => {
        // _checkSymbolKeyFor("");
        _checkSymbolKeyFor("a");
        _checkSymbolKeyFor("ab");
        _checkSymbolKeyFor("abba");
        _checkSymbolKeyFor("zyxyvutsrqponmlkjihgfedcba");
        _checkSymbolKeyFor(0);
        _checkSymbolKeyFor(10000);
        _checkSymbolKeyForDirect("a");
        _checkSymbolKeyForDirect("ab");
        _checkSymbolKeyForDirect("abba");
        _checkSymbolKeyForDirect("zyxyvutsrqponmlkjihgfedcba");
        _checkSymbolKeyForDirect(0);
        _checkSymbolKeyForDirect(10000);
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

    it("polySymbolFor check same instance returned", () => {
        assert.equal(polySymbolFor("Hello"), polySymbolFor("Hello"));
    });

    it("polySymbolKeyFor check does not return the same instance", () => {
        let theSymbol = polySymbolFor("Hello");
        let keyFor = polySymbolKeyFor(theSymbol);
        assert.equal(keyFor, theSymbol.description);

        let newSymbol = polyNewSymbol("Hello");
        assert.equal(polySymbolKeyFor(newSymbol), undefined);
    });

    it("polyNewSymbol", () => {
        let polySym = polyNewSymbol("Hello");
        let polySym2 = polyNewSymbol("Hello");

        assert.notEqual(polySym, polySym2, "Always creates a new symbol");
        assert.notEqual(polySym.valueOf(), polySym2.valueOf(), "While different they will look the same they are still different");
        assert.equal((polySym as any).v, (polySym2 as any).v, "While different they will look the same");
    });

    it("Symbol polyfill should work correctly with isSymbol function", () => {
        // Create a symbol using the polyfill
        const polySym = polyNewSymbol("testSymbol");
                
        // Check that the polyfill symbol passes the isSymbol check
        assert.isTrue(isSymbol(polySym), "The polyfill symbol should pass the isSymbol check");
        
        // Compare with native Symbol behavior if available
        if (typeof Symbol !== "undefined") {
            const nativeSym = Symbol("nativeSymbol");
            assert.equal(isSymbol(polySym), isSymbol(nativeSym),
                "The polyfill symbol should have the same isSymbol result as native Symbol");
        }
    });
    
    it("Symbol polyfill should have correct toString behavior", () => {
        // Create a symbol using the polyfill with a description
        const description = "testSymbolToString";
        const polySym = polyNewSymbol(description);
        
        // Verify toString behavior matches expected format
        const symbolString = polySym.toString();
        assert.include(symbolString, description, "Symbol toString should include its description");
        assert.include(symbolString, "Symbol(", "Symbol toString should include 'Symbol(' prefix");
        assert.include(symbolString, ")", "Symbol toString should include ')' suffix");
        
        // Compare with native Symbol behavior if available
        if (typeof Symbol !== "undefined") {
            const nativeSym = Symbol(description);
            
            // The fundamental format should match, even if implementations might slightly differ
            const basicFormat = symbolString.includes(description);
            const nativeFormat = nativeSym.toString().includes(description);
            assert.equal(basicFormat, nativeFormat,
                "The polyfill symbol toString should have similar format to native Symbol");
        }
    });
    
    it("Symbol polyfill should have correct valueOf behavior", () => {
        // Create a symbol using the polyfill
        const polySym = polyNewSymbol("testSymbolValueOf");
        
        // Verify valueOf returns the symbol itself
        const valueOfResult = polySym.valueOf();
        assert.strictEqual(valueOfResult.description, polySym.description, "Symbol valueOf should return the symbol itself");
        
        // Verify the valueOf result is also a symbol
        assert.isTrue(isSymbol(valueOfResult), "Symbol valueOf result should be a symbol");
        
        // Compare with native Symbol behavior if available
        if (typeof Symbol !== "undefined") {
            const nativeSym = Symbol("testNative");
            const nativeValueOf = nativeSym.valueOf();
            
            assert.strictEqual(nativeSym, nativeValueOf, "Native symbol valueOf returns itself");
            
            // The behavior should match
            const polyReturnsItself = valueOfResult === polySym;
            const nativeReturnsItself = nativeValueOf === nativeSym;
            assert.equal(polyReturnsItself, nativeReturnsItself,
                "Polyfill valueOf should behave the same as native valueOf");
        }
    });
    
    it("Registered Symbol polyfill should also work with isSymbol, toString, valueOf", () => {
        // Using polySymbolFor which creates a registered symbol
        const polySym = polySymbolFor("testRegisteredSymbol");
        
        // isSymbol check
        assert.isTrue(isSymbol(polySym), "Registered polyfill symbol should pass isSymbol check");
        
        // toString check
        const symbolString = polySym.toString();
        assert.include(symbolString, "testRegisteredSymbol",
            "Registered symbol toString should include its description");
        
        // valueOf check
        const valueOfResult = polySym.valueOf();
        assert.strictEqual(valueOfResult, polySym,
            "Registered symbol valueOf should return the symbol itself");
    });
    
    it("Well-known Symbol polyfill should also work with isSymbol, toString, valueOf", () => {
        // Using polyGetKnownSymbol which returns a well-known symbol
        const polySym = polyGetKnownSymbol("iterator");
        
        // isSymbol check
        assert.isTrue(isSymbol(polySym), "Well-known polyfill symbol should pass isSymbol check");
        
        // toString check
        const symbolString = polySym.toString();
        assert.include(symbolString, "Symbol.iterator",
            "Well-known symbol toString should include the symbol name");
        
        // valueOf check
        const valueOfResult = polySym.valueOf();
        assert.strictEqual(valueOfResult, polySym,
            "Well-known symbol valueOf should return the symbol itself");
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
            assert.equal(polyResult.v, asString(nativeResult), "Checking Symbol.for Native (" + dumpObj(nativeResult) + ") and polyfill result for [" + dumpObj(value) + "]");
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

    function _checkSymbolKeyForDirect(value: any) {
        let polyResult: any;
        let nativeResult: any;
        let polyThrew: any;
        let nativeThrew: any;
        try {
            polyResult = polySymbolKeyFor(value);
        } catch (e) {
            polyThrew = e;
        }
        try {
            nativeResult = Symbol.keyFor(value);
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