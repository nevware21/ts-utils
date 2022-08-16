/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { getLength } from "../../../../src/helpers/length";


describe("getLength helper", () => {

    it("Validate null / undefined", () => {
        _expectThrow(() => {
            assert.equal(getLength(null as any), false, "Checking null");
        });
        _expectThrow(() => {
            assert.equal(getLength(undefined as any), false, "Checking null");
        });
    });

    it("Validate with values", () => {
        assert.equal(getLength(""), 0, "Testing ''");
        assert.equal(getLength("a"), 1, "Testing 'a'");
        assert.equal(getLength("abcdefghijklmnopqrstuvwxyz"), 26, "Testing 'abcdefghijklmnopqrstuvwxyz'");
        assert.equal(getLength([]), 0, "Testing []");
        assert.equal(getLength([0, 1, 2, 3, 4]), 5, "Testing [0, 1, 2, 3, 4]");
        assert.equal(getLength({ length: 42}), 42, "Testing { length: 42 }");
        assert.equal(getLength({ length: _dummyLength}), _dummyLength, "Testing { length: _dummyLength }");
    });

    it("Validate with no length property", () => {
        assert.equal(getLength({} as any), undefined, "Testing {}");
        assert.equal(getLength(new Date() as any), undefined, "Testing new Date()");
    });


    function _dummyLength() {
        return 53;
    }

    function _expectThrow(cb: () => void): Error {
        try {
            cb();
        } catch (e) {
            assert.ok(true, "Expected an exception to be thrown");
            return e;
        }
    }
});
