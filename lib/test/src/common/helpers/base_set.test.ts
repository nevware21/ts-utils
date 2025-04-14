/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isSet, isSetLike } from "../../../../src/helpers/base";

describe("isSet helper", () => {
    it("should return true for Set objects", () => {
        assert.equal(isSet(new Set()), true, "new Set() should be identified as a Set");
        assert.equal(isSet(new Set(["value1", "value2"])), true, "Set with values should be identified as a Set");
    });

    it("should return false for non-Set objects", () => {
        assert.equal(isSet({}), false, "Empty object should not be identified as a Set");
        assert.equal(isSet(new Map()), false, "Map should not be identified as a Set");
        assert.equal(isSet(new WeakMap()), false, "WeakMap should not be identified as a Set");
        assert.equal(isSet(new WeakSet()), false, "WeakSet should not be identified as a Set");
        assert.equal(isSet([]), false, "Array should not be identified as a Set");
        assert.equal(isSet(null), false, "null should not be identified as a Set");
        assert.equal(isSet(undefined), false, "undefined should not be identified as a Set");
        assert.equal(isSet(42), false, "number should not be identified as a Set");
        assert.equal(isSet("set"), false, "string should not be identified as a Set");
        assert.equal(isSet(true), false, "boolean should not be identified as a Set");
        assert.equal(isSet(() => {}), false, "function should not be identified as a Set");
    });
});

describe("isSetLike helper", () => {
    it("should return true for Set objects", () => {
        assert.equal(isSetLike(new Set()), true, "new Set() should be identified as SetLike");
        assert.equal(isSetLike(new Set(["value1", "value2"])), true, "Set with values should be identified as SetLike");
    });

    it("should return true for objects implementing Set-like interface", () => {
        const setLike = {
            add: (value: any) => setLike,
            has: (value: any) => false,
            delete: (value: any) => false,
            size: 0
        };
        assert.equal(isSetLike(setLike), true, "Object with Set methods should be identified as SetLike");
        
        // Test with different implementations
        const setLikeWithDifferentImpl = {
            add: function(value: any) {
                return this;
            },
            has: function(value: any) {
                return false;
            },
            delete: function(value: any) {
                return false;
            },
            size: 10
        };
        assert.equal(isSetLike(setLikeWithDifferentImpl), true, "Object with different Set implementation should be identified as SetLike");
    });

    it("should return false for objects missing Set-like methods", () => {
        // Missing 'add' method
        const missingAdd = {
            has: (value: any) => false,
            delete: (value: any) => false,
            size: 0
        };
        assert.equal(isSetLike(missingAdd), false, "Object missing add method should not be identified as SetLike");

        // Missing 'has' method
        const missingHas = {
            add: (value: any) => missingHas,
            delete: (value: any) => false,
            size: 0
        };
        assert.equal(isSetLike(missingHas), false, "Object missing has method should not be identified as SetLike");

        // Missing 'delete' method
        const missingDelete = {
            add: (value: any) => missingDelete,
            has: (value: any) => false,
            size: 0
        };
        assert.equal(isSetLike(missingDelete), false, "Object missing delete method should not be identified as SetLike");

        // Missing 'size' property
        const missingSize = {
            add: (value: any) => missingSize,
            has: (value: any) => false,
            delete: (value: any) => false
        };
        assert.equal(isSetLike(missingSize), false, "Object missing size property should not be identified as SetLike");

        // With undefined size
        const undefinedSize = {
            add: (value: any) => undefinedSize,
            has: (value: any) => false,
            delete: (value: any) => false,
            size: undefined as any
        };
        assert.equal(isSetLike(undefinedSize), false, "Object with undefined size should not be identified as SetLike");
    });

    it("should return false for non-Set-like objects", () => {
        assert.equal(isSetLike({}), false, "Empty object should not be identified as SetLike");
        assert.equal(isSetLike(new Map()), false, "Map should not be identified as SetLike");
        assert.equal(isSetLike(new WeakMap()), false, "WeakMap should not be identified as SetLike");
        assert.equal(isSetLike(new WeakSet()), false, "WeakSet should not be identified as SetLike");
        assert.equal(isSetLike([]), false, "Array should not be identified as SetLike");
        assert.equal(isSetLike(null), false, "null should not be identified as SetLike");
        assert.equal(isSetLike(undefined), false, "undefined should not be identified as SetLike");
        assert.equal(isSetLike(42), false, "number should not be identified as SetLike");
        assert.equal(isSetLike("set"), false, "string should not be identified as SetLike");
        assert.equal(isSetLike(true), false, "boolean should not be identified as SetLike");
        assert.equal(isSetLike(() => {}), false, "function should not be identified as SetLike");
    });

    it("should handle edge cases", () => {
        // Object with functions that aren't really set methods
        const wrongFunctions = {
            add: "not a function",
            has: (value: any) => false,
            delete: (value: any) => false,
            size: 0
        };
        assert.equal(isSetLike(wrongFunctions as any), false, "Object with non-function add should not be identified as SetLike");
    });
});
