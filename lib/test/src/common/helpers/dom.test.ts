/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isElement } from "../../../../src/helpers/dom";

describe("isElement helper", () => {
    // This test will be skipped in Node.js environments
    (typeof document === "undefined" ? it.skip : it)("should identify DOM Elements", () => {
        if (typeof document !== "undefined") {
            // Only run these tests in browser environments
            const div = document.createElement("div");
            assert.equal(isElement(div), true, "Should return true for div element");
            
            if (document.body) {
                assert.equal(isElement(document.body), true, "Should return true for body element");
            }
            
            const text = document.createTextNode("text");
            assert.equal(isElement(text), false, "Should return false for text node");
            
            assert.equal(isElement(document), false, "Should return false for document");
            assert.equal(isElement(window), false, "Should return false for window");
        }
    });

    it("should return false for non-Element values", () => {
        assert.equal(isElement({}), false, "Should return false for plain object");
        assert.equal(isElement([]), false, "Should return false for array");
        assert.equal(isElement(null), false, "Should return false for null");
        assert.equal(isElement(undefined), false, "Should return false for undefined");
        assert.equal(isElement(42), false, "Should return false for number");
        assert.equal(isElement("element"), false, "Should return false for string");
        assert.equal(isElement(true), false, "Should return false for boolean");
        assert.equal(isElement(function() {}), false, "Should return false for function");
    });

    it("should handle element-like objects", () => {
        const elementLike = {
            nodeType: 1,
            nodeName: "DIV"
        };
        
        // This will still return false because objToString() won't return '[object HTMLElement]'
        assert.equal(isElement(elementLike), false, "Should return false for element-like object");
    });
});
