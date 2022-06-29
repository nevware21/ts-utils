import { assert } from "chai";
import { getInst } from "../../../../src/helpers/environment";
import { hasSymbol, getSymbol, getSymbolInst } from "../../../../src/helpers/symbol";

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
        assert.equal(getSymbolInst("toStringTag"), Symbol.toStringTag, "Check that the expected symbol is returned");
    });

    describe("Remove Native", () => {

        it("getSymbol", () => {
            let orgSymbol = Symbol;
            let toStringTag = Symbol.toStringTag;

            try {

                Symbol = undefined;
                assert.equal(getSymbol(), theSymbol, "Check that the Symbol is returned");
                assert.equal(getSymbolInst("toStringTag"), toStringTag, "Check that the expected symbol is returned");

                assert.equal(getSymbol(false), undefined, "Check that the Symbol is now not available");
                assert.equal(getSymbolInst("toStringTag"), undefined, "Check that the expected symbol is returned");
            } finally {
                Symbol = orgSymbol;
            }
        });
    });
});
