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
import { getInst } from "../../../../src/helpers/environment";
import { _initTestHooks, setBypassLazyCache } from "../../../../src/helpers/lazy";
import { hasSymbol, getSymbol, getKnownSymbol, symbolKeyFor, symbolFor, newSymbol } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";

declare var Symbol: any;

function tryCatch(cb: () => void) {
    try {
        cb();
    } catch(e) {
        // Node Environment
    }
}

describe("symbol helpers", () => {

    let theSymbol: any = null;

    tryCatch(() => theSymbol = Symbol);

    it("hasSymbol", () => {
        assert.equal(hasSymbol(), !!theSymbol, "Check if we have a Symbol instance");
    });

    it("getInst", () => {
        assert.equal(getInst("Symbol"), theSymbol, "Check that the Symbol is returned");
    });

    it("getSymbol", () => {
        assert.equal(getSymbol(), Symbol, "Check that the Symbol is returned");
    });

    it("symbolFor null / undefined", () => {
        _checkSymbolFor(null);
        _checkSymbolFor(undefined);
        _checkSymbolFor("null");
        _checkSymbolFor("undefined");
        _checkSymbolFor("");
    });

    it("symbolFor With values", () => {
        //_checkSymbolFor("");
        _checkSymbolFor("a");
        _checkSymbolFor("ab");
        _checkSymbolFor("abba");
        _checkSymbolFor("zyxyvutsrqponmlkjihgfedcba");
        _checkSymbolFor(0);
        _checkSymbolFor(10000);
    });

    it("symbolKeyFor null / undefined", () => {
        _checkSymbolKeyFor(null);
        _checkSymbolKeyFor(undefined);
        _checkSymbolKeyFor("null");
        _checkSymbolKeyFor("undefined");
        _checkSymbolKeyFor("");
    });

    it("symbolKeyFor With values", () => {
        // _checkSymbolKeyFor("");
        _checkSymbolKeyFor("a");
        _checkSymbolKeyFor("ab");
        _checkSymbolKeyFor("abba");
        _checkSymbolKeyFor("zyxyvutsrqponmlkjihgfedcba");
        _checkSymbolKeyFor(0);
        _checkSymbolKeyFor(10000);
    });

    it("Symbol.toStringTag", () => {
        assert.equal(getKnownSymbol("toStringTag"), Symbol.toStringTag, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol(WellKnownSymbols.toStringTag), Symbol.toStringTag, "Check that the expected symbol is returned");
    });

    it("Well known symbols", () => {
        assert.equal(getKnownSymbol("asyncIterator"), Symbol.asyncIterator, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol("hasInstance"), Symbol.hasInstance, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol("isConcatSpreadable"), Symbol.isConcatSpreadable, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol("iterator"), Symbol.iterator, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol("match"), Symbol.match, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol("matchAll"), Symbol.matchAll, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol("replace"), Symbol.replace, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol("search"), Symbol.search, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol("species"), Symbol.species, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol("split"), Symbol.split, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol("toPrimitive"), Symbol.toPrimitive, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol("toStringTag"), Symbol.toStringTag, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol("unscopables"), Symbol.unscopables, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol(WellKnownSymbols.asyncIterator), Symbol.asyncIterator, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol(WellKnownSymbols.hasInstance), Symbol.hasInstance, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol(WellKnownSymbols.isConcatSpreadable), Symbol.isConcatSpreadable, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol(WellKnownSymbols.iterator), Symbol.iterator, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol(WellKnownSymbols.match), Symbol.match, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol(WellKnownSymbols.matchAll), Symbol.matchAll, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol(WellKnownSymbols.replace), Symbol.replace, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol(WellKnownSymbols.search), Symbol.search, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol(WellKnownSymbols.species), Symbol.species, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol(WellKnownSymbols.split), Symbol.split, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol(WellKnownSymbols.toPrimitive), Symbol.toPrimitive, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol(WellKnownSymbols.toStringTag), Symbol.toStringTag, "Check that the expected symbol is returned");
        assert.equal(getKnownSymbol(WellKnownSymbols.unscopables), Symbol.unscopables, "Check that the expected symbol is returned");
    });

    it("check same instance returned", () => {
        assert.equal(symbolFor("Hello"), symbolFor("Hello"));
    });

    it("symbolKeyFor check does not return the same instance", () => {
        let theSymbol = symbolFor("Hello");
        assert.equal(symbolKeyFor(theSymbol), theSymbol.description);
        assert.equal(symbolKeyFor(newSymbol("Hello")), undefined);
    });

    it("newSymbol", () => {
        assert.notEqual(newSymbol("Hello"), newSymbol("Hello"), "Always creates a new symbol");
        assert.equal(newSymbol("Hello").toString(), newSymbol("Hello").toString(), "While different they will look the same");
    });

    describe("Remove Native", () => {
        let _orgSymbol = Symbol;
        beforeEach(() => {
            _orgSymbol = Symbol;
            _initTestHooks();
        });

        afterEach(() => {
            Symbol = _orgSymbol;
        });

        it("getSymbol with noPoly", () => {
            // Disable lazy caching so we get the true global version
            setBypassLazyCache(true);

            // Get the native Symbol
            let orgSymbol = getSymbol();
            let toStringTag = Symbol.toStringTag;

            // Re-enabling caching and force the symbol to be cached
            setBypassLazyCache(false);

            try {
                assert.equal(getSymbol(), _orgSymbol, "Check that the Symbol is returned");
                Symbol = undefined;
                assert.equal(getSymbol(), theSymbol, "Check that the Symbol is returned");
                assert.equal(getKnownSymbol("toStringTag"), toStringTag, "Check that the expected symbol is returned");
                assert.equal(getKnownSymbol(WellKnownSymbols.toStringTag), toStringTag, "Check that the expected symbol is returned");

                // Force the cache Symbol to be dropped
                setBypassLazyCache(true);
                assert.equal(getSymbol(), undefined, "Check that the Symbol is now not available");
                assert.equal(getKnownSymbol("toStringTag", true), undefined, "Check that the expected symbol is returned");
                assert.equal(getKnownSymbol(WellKnownSymbols.toStringTag, true), undefined, "Check that the expected symbol is returned");
            } finally {
                Symbol = orgSymbol;
                // Re-enable lazy caching
                setBypassLazyCache(false);
            }
        });

        it("getSymbol - default noPoly", () => {
            // Disable lazy caching so we get the true global version
            setBypassLazyCache(true);

            // Get the native Symbol
            let orgSymbol = getSymbol();
            let toStringTag = Symbol.toStringTag;

            // Re-enabling caching and force the symbol to be cached
            setBypassLazyCache(false);

            try {
                assert.equal(getSymbol(), _orgSymbol, "Check that the Symbol is returned");
                Symbol = undefined;
                assert.equal(getSymbol(), theSymbol, "Check that the Symbol is returned");
                assert.equal(getKnownSymbol("toStringTag"), toStringTag, "Check that the expected symbol is returned");
                assert.equal(getKnownSymbol(WellKnownSymbols.toStringTag), toStringTag, "Check that the expected symbol is returned");

                // Force the cache Symbol to be dropped
                setBypassLazyCache(true);
                assert.equal(getSymbol(), undefined, "Check that the Symbol is now not available");
                assert.equal(getKnownSymbol<any>("toStringTag", false)._polyfill, true, "Check that the expected symbol is returned");
                assert.equal(getKnownSymbol<any>(WellKnownSymbols.toStringTag, false)._polyfill, true, "Check that the expected symbol is returned");
            } finally {
                Symbol = orgSymbol;

                // Re-enable lazy caching
                setBypassLazyCache(false);
            }
        });

        it("getSymbol - explicit noPoly false", () => {
            // Disable lazy caching so we get the true global version
            setBypassLazyCache(true);

            // Get the native Symbol
            let orgSymbol = getSymbol();
            let toStringTag = Symbol.toStringTag;

            // Re-enabling caching and force the symbol to be cached
            setBypassLazyCache(false);

            try {
                assert.equal(getSymbol(), _orgSymbol, "Check that the Symbol is returned");
                Symbol = undefined;
                assert.equal(getSymbol(), theSymbol, "Check that the Symbol is returned");
                assert.equal(getKnownSymbol("toStringTag"), toStringTag, "Check that the expected symbol is returned");
                assert.equal(getKnownSymbol(WellKnownSymbols.toStringTag), toStringTag, "Check that the expected symbol is returned");

                // Force the cache Symbol to be dropped
                setBypassLazyCache(true);
                assert.equal(getSymbol(), undefined, "Check that the Symbol is now not available");
                assert.equal(getKnownSymbol<any>("toStringTag", false)._polyfill, true, "Check that the expected symbol is returned");
                assert.equal(getKnownSymbol<any>(WellKnownSymbols.toStringTag, false)._polyfill, true, "Check that the expected symbol is returned");
            } finally {
                Symbol = orgSymbol;
                // Re-enable lazy caching
                setBypassLazyCache(false);
            }
        });

        it("newSymbol", () => {
            // Disable lazy caching so we get the true global version
            setBypassLazyCache(true);

            // Get the native Symbol
            let orgSymbol = getSymbol();

            // Re-enabling caching and force the symbol to be cached
            setBypassLazyCache(false);

            try {
                assert.equal(getSymbol(), _orgSymbol, "Check that the Symbol is returned");
                assert.notEqual(newSymbol("Hello"), newSymbol("Hello"), "Always creates a new symbol");
                assert.equal(newSymbol("Hello").toString(), newSymbol("Hello").toString(), "While different they will look the same");
            } finally {
                Symbol = orgSymbol;
                // Re-enable lazy caching
                setBypassLazyCache(false);
            }
        });
    });

    function _checkSymbolFor(value: any) {
        let polyResult: any;
        let nativeResult: any;
        let polyThrew: any;
        let nativeThrew: any;
        try {
            polyResult = symbolFor(value);
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
            polyResult = symbolKeyFor(symbolFor(value));
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
