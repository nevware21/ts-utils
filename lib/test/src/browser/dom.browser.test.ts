/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isElement } from "../../../src/helpers/dom";

describe("isElement browser helper tests", () => {

    // Will only run in browser environments
    it("should identify DOM Elements correctly", () => {
        // Standard HTML elements
        const div = document.createElement("div");
        assert.equal(isElement(div), true, "Should return true for div element");
        
        const span = document.createElement("span");
        assert.equal(isElement(span), true, "Should return true for span element");
        
        const input = document.createElement("input");
        assert.equal(isElement(input), true, "Should return true for input element");
        
        const button = document.createElement("button");
        assert.equal(isElement(button), true, "Should return true for button element");
        
        // Document elements
        assert.equal(isElement(document.documentElement), true, "Should return true for document.documentElement");
        assert.equal(isElement(document.head), true, "Should return true for document.head");
        assert.equal(isElement(document.body), true, "Should return true for document.body");
        
        // SVG elements
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        assert.equal(isElement(svg), true, "Should return true for SVG element");
        
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        assert.equal(isElement(circle), true, "Should return true for SVG circle element");
    });
    
    it("should return false for non-Element browser objects", () => {
        // Node objects that aren't Elements
        const text = document.createTextNode("text");
        assert.equal(isElement(text), false, "Should return false for text node");
        
        const comment = document.createComment("comment");
        assert.equal(isElement(comment), false, "Should return false for comment node");
        
        const fragment = document.createDocumentFragment();
        assert.equal(isElement(fragment), false, "Should return false for document fragment");
        
        // Document and window objects
        assert.equal(isElement(document), false, "Should return false for document");
        assert.equal(isElement(window), false, "Should return false for window");
        
        // Element-like objects
        const elementLike = {
            nodeType: 1,
            nodeName: "DIV"
        };
        assert.equal(isElement(elementLike), false, "Should return false for element-like object");
    });
    
    it("should properly handle Element instances and inheritance", () => {
        const div = document.createElement("div");
        // Verifying that instanceof Element works for comparison
        assert.isTrue(div instanceof Element, "div should be an instance of Element");
        assert.isTrue(isElement(div), "isElement should return true for Element instances");
        
        // // Testing with a custom element if supported by the browser
        // if (window.customElements && customElements.define) {
        //     try {
        //         // Define the custom element if it hasn't been defined yet
        //         if (!customElements.get("test-custom-element")) {
        //             customElements.define("test-custom-element", TestCustomElement as any);
        //         }
                
        //         // Create the custom element correctly
        //         var customEl = document.createElement("test-custom-element");
        //         assert.equal(isElement(customEl), true, "Should return true for custom element");
        //     } catch (e) {
        //         // Custom elements might not be fully supported, skip this test
        //         console.log("Custom elements not fully supported, skipping test:", e.message);
        //     }
        // }
    });
});
