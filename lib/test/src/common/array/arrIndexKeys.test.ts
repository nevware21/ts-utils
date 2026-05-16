/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrIndexKeys } from "../../../../src/array/arrIndexKeys";

describe("arrIndexKeys", () => {
    it("should return all indexes for dense arrays", () => {
        assert.deepEqual(arrIndexKeys(["a", "b", "c"]), [0, 1, 2]);
    });

    it("should only return present keys for sparse arrays", () => {
        let sparse: any[] = [];
        sparse[0] = "a";
        sparse[1] = "b";
        sparse[2] = "c";
        sparse[10] = "z";

        assert.deepEqual(arrIndexKeys(sparse), [0, 1, 2, 10]);
    });

    it("should only return present keys for array-like objects", () => {
        let value: any = { length: 6, 0: "a", 3: "d", 5: "f" };
        assert.deepEqual(arrIndexKeys(value), [0, 3, 5]);
    });

    it("should ignore inherited keys", () => {
        let parent = { 1: "x" };
        let child: any = Object.create(parent);
        child.length = 3;
        child[0] = "a";

        assert.deepEqual(arrIndexKeys(child), [0]);
    });

    it("should return empty for empty or negative length", () => {
        assert.deepEqual(arrIndexKeys([]), []);
        assert.deepEqual(arrIndexKeys({ length: -2, 0: "a" } as any), []);
    });

    it("should normalize floating length", () => {
        let value: any = { length: 3.8, 0: "a", 1: "b", 2: "c", 3: "d" };
        assert.deepEqual(arrIndexKeys(value), [0, 1, 2]);
    });

    it("should throw for null and undefined", () => {
        assert.throws(() => arrIndexKeys(null as any));
        assert.throws(() => arrIndexKeys(undefined as any));
    });
});
