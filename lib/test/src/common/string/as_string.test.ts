/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { asString } from "../../../../src/string/as_string";

describe("asString helper", () => {

    it("null/ undefined", () => {
        assert.equal(asString(null), "null");
        assert.equal(asString(undefined), "undefined");
        assert.equal(asString("null"), "null");
        assert.equal(asString("undefined"), "undefined");

        _expectThrow(() => {
            asString(Object.create(null));
        });
        _expectThrow(() => {
            asString(Object.create(undefined as any));
        });
    });

    it("values", () => {
        assert.equal(asString("Nevware21"), "Nevware21");
        assert.equal(asString(42), "42");
        assert.equal(asString([4, 5, 6]), "4,5,6");
        assert.equal(asString(Symbol.for("Hello")), "Symbol(Hello)");
        assert.equal(asString(Symbol.iterator), "Symbol(Symbol.iterator)");
        assert.equal(asString({}), "[object Object]");
    });

    function _expectThrow(cb: () => void): Error {
        try {
            cb();
        } catch (e) {
            assert.ok(true, "Expected an exception to be thrown");
            return e;
        }
    }
});

