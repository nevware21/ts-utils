/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrFrom } from "../../../../src/array/from";
import { arrKeys, polyArrKeys } from "../../../../src/array/arrKeys";

describe("arrKeys", () => {
    it("should iterate all indexes for dense arrays", () => {
        assert.deepEqual(arrFrom(arrKeys(["a", "b", "c"])), [0, 1, 2]);
    });

    it("should iterate all indexes including holes", () => {
        let sparse: any[] = [];
        sparse[0] = "a";
        sparse[1] = "b";
        sparse[2] = "c";
        sparse[10] = "z";

        assert.deepEqual(arrFrom(arrKeys(sparse)), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it("should handle empty arrays", () => {
        assert.deepEqual(arrFrom(arrKeys([])), []);
    });

    it("should work with array-like objects", () => {
        let value = { length: 3, 0: "a", 2: "c" };
        assert.deepEqual(arrFrom(arrKeys(value)), [0, 1, 2]);
    });

    it("should throw for null and undefined", () => {
        assert.throws(() => arrKeys(null as any));
        assert.throws(() => arrKeys(undefined as any));
    });
});

describe("polyArrKeys", () => {
    it("should iterate all indexes for dense arrays", () => {
        assert.deepEqual(arrFrom(polyArrKeys([10, 20, 30])), [0, 1, 2]);
    });

    it("should include holes based on length", () => {
        let sparse: any[] = [];
        sparse[0] = 1;
        sparse[10] = 2;

        assert.deepEqual(arrFrom(polyArrKeys(sparse)), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it("should work with array-like objects", () => {
        let value = { length: 4, 1: "b" };
        assert.deepEqual(arrFrom(polyArrKeys(value as any)), [0, 1, 2, 3]);
    });

    it("should treat negative length as empty", () => {
        assert.deepEqual(arrFrom(polyArrKeys({ length: -1 } as any)), []);
    });

    it("should match native Array.prototype.keys when available", () => {
        if (([] as any).keys) {
            let value = { length: 5, 0: "a", 3: "d" };
            let nativeResult = arrFrom((Array.prototype.keys as any).call(value));
            assert.deepEqual(arrFrom(polyArrKeys(value as any)), nativeResult);
        }
    });

    it("should throw for null and undefined", () => {
        assert.throws(() => polyArrKeys(null as any));
        assert.throws(() => polyArrKeys(undefined as any));
    });
});
