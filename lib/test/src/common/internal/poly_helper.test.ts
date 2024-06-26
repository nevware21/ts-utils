/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { PROTOTYPE } from "../../../../src/internal/constants";
import { makePolyFn } from "../../../../src/internal/poly_helpers";

class TestClass {

    public theValue: any;

    constructor(value: any) {
        this.theValue = value;
    }
}

describe("polyfill helpers", () => {
    it("makePolyFn", () => {
        let resultThis;
        let result1;
        let result2;
        let result3;

        function dummyFunction(arg1: any, arg2: any, arg3: any) {
            resultThis = this;
            result1 = arg1;
            result2 = arg2;
            result3 = arg3;
        }

        TestClass[PROTOTYPE]["polyTest"] = makePolyFn(dummyFunction);
        
        let testObj1 = new TestClass(42);
        let testObj2 = new TestClass(53);

        assert.equal(42, testObj1.theValue, "test obj 1");
        assert.equal(53, testObj2.theValue, "test obj 2");
        assert.equal(undefined, resultThis);
        assert.equal(undefined, result1);
        assert.equal(undefined, result2);

        testObj2["polyTest"]("Hello", "World");
        assert.equal(testObj2, resultThis);
        assert.equal(testObj2, result1);
        assert.equal("Hello", result2);
        assert.equal("World", result3);

        testObj1["polyTest"]("Goodbye!");
        assert.equal(testObj1, resultThis);
        assert.equal(testObj1, result1);
        assert.equal("Goodbye!", result2);
        assert.equal(undefined, result3);
    });
});