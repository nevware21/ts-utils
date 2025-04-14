/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isWeakMap, isWeakSet } from "../../../../src/helpers/base";

describe("isWeakMap helper", () => {
    it("should return true for WeakMap objects", () => {
        assert.equal(isWeakMap(new WeakMap()), true, "new WeakMap() should be identified as a WeakMap");
        
        // Create a WeakMap with initial values
        const obj1 = {};
        const obj2 = {};
        const weakMap = new WeakMap([[obj1, "value1"], [obj2, "value2"]]);
        assert.equal(isWeakMap(weakMap), true, "WeakMap with values should be identified as a WeakMap");
    });

    it("should return false for non-WeakMap objects", () => {
        assert.equal(isWeakMap({}), false, "Empty object should not be identified as a WeakMap");
        assert.equal(isWeakMap(new Map()), false, "Map should not be identified as a WeakMap");
        assert.equal(isWeakMap(new Set()), false, "Set should not be identified as a WeakMap");
        assert.equal(isWeakMap(new WeakSet()), false, "WeakSet should not be identified as a WeakMap");
        assert.equal(isWeakMap([]), false, "Array should not be identified as a WeakMap");
        assert.equal(isWeakMap(null), false, "null should not be identified as a WeakMap");
        assert.equal(isWeakMap(undefined), false, "undefined should not be identified as a WeakMap");
        assert.equal(isWeakMap(42), false, "number should not be identified as a WeakMap");
        assert.equal(isWeakMap("weakmap"), false, "string should not be identified as a WeakMap");
        assert.equal(isWeakMap(true), false, "boolean should not be identified as a WeakMap");
        assert.equal(isWeakMap(() => {}), false, "function should not be identified as a WeakMap");
        
        // Test map-like objects that aren't WeakMaps
        const mapLike = {
            get: (key: any) => null as any,
            set: (key: any, value: any) => mapLike,
            has: (key: any) => false,
            delete: (key: any) => false
        };
        assert.equal(isWeakMap(mapLike), false, "Object with Map methods should not be identified as a WeakMap");
    });
});

describe("isWeakSet helper", () => {
    it("should return true for WeakSet objects", () => {
        assert.equal(isWeakSet(new WeakSet()), true, "new WeakSet() should be identified as a WeakSet");
        
        // Create a WeakSet with initial values
        const obj1 = {};
        const obj2 = {};
        const weakSet = new WeakSet([obj1, obj2]);
        assert.equal(isWeakSet(weakSet), true, "WeakSet with values should be identified as a WeakSet");
    });

    it("should return false for non-WeakSet objects", () => {
        assert.equal(isWeakSet({}), false, "Empty object should not be identified as a WeakSet");
        assert.equal(isWeakSet(new Map()), false, "Map should not be identified as a WeakSet");
        assert.equal(isWeakSet(new WeakMap()), false, "WeakMap should not be identified as a WeakSet");
        assert.equal(isWeakSet(new Set()), false, "Set should not be identified as a WeakSet");
        assert.equal(isWeakSet([]), false, "Array should not be identified as a WeakSet");
        assert.equal(isWeakSet(null), false, "null should not be identified as a WeakSet");
        assert.equal(isWeakSet(undefined), false, "undefined should not be identified as a WeakSet");
        assert.equal(isWeakSet(42), false, "number should not be identified as a WeakSet");
        assert.equal(isWeakSet("weakset"), false, "string should not be identified as a WeakSet");
        assert.equal(isWeakSet(true), false, "boolean should not be identified as a WeakSet");
        assert.equal(isWeakSet(() => {}), false, "function should not be identified as a WeakSet");
        
        // Test set-like objects that aren't WeakSets
        const setLike = {
            add: (value: any) => setLike,
            has: (value: any) => false,
            delete: (value: any) => false
        };
        assert.equal(isWeakSet(setLike), false, "Object with Set methods should not be identified as a WeakSet");
    });
});
