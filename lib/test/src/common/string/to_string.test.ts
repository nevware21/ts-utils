/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { toString } from "../../../../src/string/to_string";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isUndefined } from "../../../../src/helpers/base";

describe("toString helper", () => {

    it("null/ undefined", () => {
        assert.equal(toString(null), "null");
        assert.equal(toString(undefined), "undefined");
        assert.equal(toString("null"), "null");
        assert.equal(toString("undefined"), "undefined");

        _expectThrow(() => {
            toString(Object.create(null));
        });
        _expectThrow(() => {
            toString(Object.create(undefined as any));
        });
    });

    it("values", () => {
        assert.equal(toString("Nevware21"), "Nevware21");
        assert.equal(toString(42), "42");
        assert.equal(toString([4, 5, 6]), "4,5,6");
        assert.equal(toString(Symbol.for("Hello")), "Symbol(Hello)");
        assert.equal(toString(Symbol.iterator), "Symbol(Symbol.iterator)");
        assert.equal(toString({}), "[object Object]");
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

