import { assert } from "chai";
import { getInst } from "../../../../src/helpers/environment";
import { hasSymbol, getSymbol, getKnownSymbol} from "../../../../src/symbol/symbol";
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

    describe("Remove Native", () => {

        it("getSymbol with noPoly", () => {
            // Get the native Symbol and force it to be cached
            let orgSymbol = getSymbol(false);
            let toStringTag = Symbol.toStringTag;

            try {

                Symbol = undefined;
                assert.equal(getSymbol(), theSymbol, "Check that the Symbol is returned");
                assert.equal(getKnownSymbol("toStringTag"), toStringTag, "Check that the expected symbol is returned");
                assert.equal(getKnownSymbol(WellKnownSymbols.toStringTag), toStringTag, "Check that the expected symbol is returned");

                // Force the cache Symbol to be dropped
                assert.equal(getSymbol(false), undefined, "Check that the Symbol is now not available");
                assert.equal(getKnownSymbol("toStringTag", true), undefined, "Check that the expected symbol is returned");
                assert.equal(getKnownSymbol(WellKnownSymbols.toStringTag, true), undefined, "Check that the expected symbol is returned");
            } finally {
                Symbol = orgSymbol;
            }
        });

        it("getSymbol - default noPoly", () => {
            // Get the native Symbol and force it to be cached
            let orgSymbol = getSymbol(false);
            let toStringTag = Symbol.toStringTag;

            try {

                Symbol = undefined;
                assert.equal(getSymbol(), theSymbol, "Check that the Symbol is returned");
                assert.equal(getKnownSymbol("toStringTag"), toStringTag, "Check that the expected symbol is returned");
                assert.equal(getKnownSymbol(WellKnownSymbols.toStringTag), toStringTag, "Check that the expected symbol is returned");

                // Force the cache Symbol to be dropped
                assert.equal(getSymbol(false), undefined, "Check that the Symbol is now not available");
                assert.equal(getKnownSymbol<any>("toStringTag", false)._polyfill, true, "Check that the expected symbol is returned");
                assert.equal(getKnownSymbol<any>(WellKnownSymbols.toStringTag, false)._polyfill, true, "Check that the expected symbol is returned");
            } finally {
                Symbol = orgSymbol;
            }
        });

        it("getSymbol - explicit noPoly false", () => {
            // Get the native Symbol and force it to be cached
            let orgSymbol = getSymbol(false);
            let toStringTag = Symbol.toStringTag;

            try {

                Symbol = undefined;
                assert.equal(getSymbol(), theSymbol, "Check that the Symbol is returned");
                assert.equal(getKnownSymbol("toStringTag"), toStringTag, "Check that the expected symbol is returned");
                assert.equal(getKnownSymbol(WellKnownSymbols.toStringTag), toStringTag, "Check that the expected symbol is returned");

                // Force the cache Symbol to be dropped
                assert.equal(getSymbol(false), undefined, "Check that the Symbol is now not available");
                assert.equal(getKnownSymbol<any>("toStringTag", false)._polyfill, true, "Check that the expected symbol is returned");
                assert.equal(getKnownSymbol<any>(WellKnownSymbols.toStringTag, false)._polyfill, true, "Check that the expected symbol is returned");
            } finally {
                Symbol = orgSymbol;
            }
        });
    });
});
