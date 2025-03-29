/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isMap, isMapLike } from "../../../../src/helpers/base";

describe("isMap helper", () => {
    it("should return true for Map objects", () => {
        assert.equal(isMap(new Map()), true, "new Map() should be identified as a Map");
        assert.equal(isMap(new Map([["key", "value"]])), true, "Map with values should be identified as a Map");
    });

    it("should return false for non-Map objects", () => {
        assert.equal(isMap({}), false, "Empty object should not be identified as a Map");
        assert.equal(isMap(new WeakMap()), false, "WeakMap should not be identified as a Map");
        assert.equal(isMap(new Set()), false, "Set should not be identified as a Map");
        assert.equal(isMap([]), false, "Array should not be identified as a Map");
        assert.equal(isMap(null), false, "null should not be identified as a Map");
        assert.equal(isMap(undefined), false, "undefined should not be identified as a Map");
        assert.equal(isMap(42), false, "number should not be identified as a Map");
        assert.equal(isMap("map"), false, "string should not be identified as a Map");
        assert.equal(isMap(true), false, "boolean should not be identified as a Map");
        assert.equal(isMap(() => {}), false, "function should not be identified as a Map");
    });
});

describe("isMapLike helper", () => {
    it("should return true for Map objects", () => {
        assert.equal(isMapLike(new Map()), true, "new Map() should be identified as MapLike");
        assert.equal(isMapLike(new Map([["key", "value"]])), true, "Map with values should be identified as MapLike");
    });

    it("should return true for objects implementing Map-like interface", () => {
        const mapLike = {
            get: (key: any) => null as any,
            set: (key: any, value: any) => mapLike,
            has: (key: any) => false,
            delete: (key: any) => false,
            size: 0
        };
        assert.equal(isMapLike(mapLike), true, "Object with Map methods should be identified as MapLike");
        
        // Test with different implementations
        const mapLikeWithDifferentImpl = {
            get: function(key: any) {
                return null as any;
            },
            set: function(key: any, value: any) {
                return this;
            },
            has: function(key: any) {
                return false;
            },
            delete: function(key: any) {
                return false;
            },
            size: 10
        };
        assert.equal(isMapLike(mapLikeWithDifferentImpl), true, "Object with different Map implementation should be identified as MapLike");
    });

    it("should return false for objects missing Map-like methods", () => {
        // Missing 'get' method
        const missingGet = {
            set: (key: any, value: any) => missingGet,
            has: (key: any) => false,
            delete: (key: any) => false,
            size: 0
        };
        assert.equal(isMapLike(missingGet), false, "Object missing get method should not be identified as MapLike");

        // Missing 'set' method
        const missingSet = {
            get: (key: any) => null as any,
            has: (key: any) => false,
            delete: (key: any) => false,
            size: 0
        };
        assert.equal(isMapLike(missingSet), false, "Object missing set method should not be identified as MapLike");

        // Missing 'has' method
        const missingHas = {
            get: (key: any) => null as any,
            set: (key: any, value: any) => missingHas,
            delete: (key: any) => false,
            size: 0
        };
        assert.equal(isMapLike(missingHas), false, "Object missing has method should not be identified as MapLike");

        // Missing 'delete' method
        const missingDelete = {
            get: (key: any) => null as any,
            set: (key: any, value: any) => missingDelete,
            has: (key: any) => false,
            size: 0
        };
        assert.equal(isMapLike(missingDelete), false, "Object missing delete method should not be identified as MapLike");

        // Missing 'size' property
        const missingSize = {
            get: (key: any) => null as any,
            set: (key: any, value: any) => missingSize,
            has: (key: any) => false,
            delete: (key: any) => false
        };
        assert.equal(isMapLike(missingSize), false, "Object missing size property should not be identified as MapLike");

        // With undefined size
        const undefinedSize = {
            get: (key: any) => null as any,
            set: (key: any, value: any) => undefinedSize,
            has: (key: any) => false,
            delete: (key: any) => false,
            size: undefined as any
        };
        assert.equal(isMapLike(undefinedSize), false, "Object with undefined size should not be identified as MapLike");
    });

    it("should return false for non-Map-like objects", () => {
        assert.equal(isMapLike({}), false, "Empty object should not be identified as MapLike");
        assert.equal(isMapLike(new WeakMap()), false, "WeakMap should not be identified as MapLike");
        assert.equal(isMapLike(new Set()), false, "Set should not be identified as MapLike");
        assert.equal(isMapLike([]), false, "Array should not be identified as MapLike");
        assert.equal(isMapLike(null), false, "null should not be identified as MapLike");
        assert.equal(isMapLike(undefined), false, "undefined should not be identified as MapLike");
        assert.equal(isMapLike(42), false, "number should not be identified as MapLike");
        assert.equal(isMapLike("map"), false, "string should not be identified as MapLike");
        assert.equal(isMapLike(true), false, "boolean should not be identified as MapLike");
        assert.equal(isMapLike(() => {}), false, "function should not be identified as MapLike");
    });

    it("should handle edge cases", () => {
        // Object with functions that aren't really map methods
        const wrongFunctions = {
            get: "not a function",
            set: (key: any, value: any) => wrongFunctions,
            has: (key: any) => false,
            delete: (key: any) => false,
            size: 0
        };
        assert.equal(isMapLike(wrongFunctions as any), false, "Object with non-function get should not be identified as MapLike");
    });
});
