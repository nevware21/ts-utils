/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isEmpty } from "../../../../src/helpers/is_empty";

describe("isEmpty helper", () => {
    it("should identify empty strings", () => {
        assert.equal(isEmpty(""), true, "Should return true for empty string");
        assert.equal(isEmpty("hello"), false, "Should return false for non-empty string");
    });

    it("should identify empty arrays", () => {
        assert.equal(isEmpty([]), true, "Should return true for empty array");
        assert.equal(isEmpty([1, 2, 3]), false, "Should return false for non-empty array");
    });

    it("should identify empty objects", () => {
        assert.equal(isEmpty({}), true, "Should return true for empty object");
        assert.equal(isEmpty({ key: "value" }), false, "Should return false for non-empty object");
        
        const obj = Object.create(null);
        assert.equal(isEmpty(obj), true, "Should return true for empty object with null prototype");
        
        obj.test = "value";
        assert.equal(isEmpty(obj), false, "Should return false for non-empty object with null prototype");
    });

    it("should identify empty Maps", () => {
        assert.equal(isEmpty(new Map()), true, "Should return true for empty Map");
        assert.equal(isEmpty(new Map([["key", "value"]])), false, "Should return false for non-empty Map");
    });

    it("should identify empty Sets", () => {
        assert.equal(isEmpty(new Set()), true, "Should return true for empty Set");
        assert.equal(isEmpty(new Set([1, 2, 3])), false, "Should return false for non-empty Set");
    });

    it("should handle null and undefined", () => {
        assert.equal(isEmpty(null), true, "Should return true for null");
        assert.equal(isEmpty(undefined), true, "Should return true for undefined");
    });

    it("should handle non-container values", () => {
        assert.equal(isEmpty(42), false, "Should return false for numbers");
        assert.equal(isEmpty(true), false, "Should return false for booleans");
        assert.equal(isEmpty(false), false, "Should return false for booleans");
        assert.equal(isEmpty(function() {}), false, "Should return false for functions");

        assert.equal(isEmpty(new Date()), true, "Should return true for dates");
    });

    it("should handle Map-like and Set-like objects", () => {
        const mapLike = {
            size: 0,
            get: () => null as any,
            set: () => mapLike,
            has: () => false,
            delete: () => false
        };
        assert.equal(isEmpty(mapLike), true, "Should return true for empty Map-like object");
        
        mapLike.size = 1;
        assert.equal(isEmpty(mapLike), false, "Should return false for non-empty Map-like object");
        
        const setLike = {
            size: 0,
            add: () => setLike,
            has: () => false,
            delete: () => false
        };
        assert.equal(isEmpty(setLike), true, "Should return true for empty Set-like object");
        
        setLike.size = 1;
        assert.equal(isEmpty(setLike), false, "Should return false for non-empty Set-like object");
    });
});
