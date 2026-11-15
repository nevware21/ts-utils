/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrZip } from "../../../../src/array/zip";
import { arrUnzip } from "../../../../src/array/unzip";

describe("arrZip", () => {
    it("should combine arrays by index", () => {
        assert.deepEqual(arrZip([1, 2], ["a", "b"]), [[1, "a"], [2, "b"]]);
        assert.deepEqual(arrZip([1, 2, 3], ["a", "b", "c"]), [[1, "a"], [2, "b"], [3, "c"]]);
    });

    it("should handle arrays of different lengths", () => {
        const result = arrZip([1, 2, 3], ["a", "b"]);
        assert.equal(result.length, 2);
        assert.deepEqual(result, [[1, "a"], [2, "b"]]);
    });

    it("should handle three or more arrays", () => {
        assert.deepEqual(
            arrZip([1, 2], ["a", "b"], [true, false]),
            [[1, "a", true], [2, "b", false]]
        );
    });

    it("should handle single array", () => {
        assert.deepEqual(arrZip([1, 2, 3]), [[1], [2], [3]]);
    });

    it("should return empty array when empty arrays provided", () => {
        assert.deepEqual(arrZip([], []), []);
    });

    it("should handle null and undefined", () => {
        assert.deepEqual(arrZip(null), []);
        assert.deepEqual(arrZip(undefined), []);
        assert.deepEqual(arrZip([1, 2], null), [[1], [2]]);
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 2, 0: 1, 1: 2 };
        assert.deepEqual(arrZip(arrayLike, ["a", "b"]), [[1, "a"], [2, "b"]]);
    });
});

describe("arrZip array-like lengths", () => {
    it("should truncate a fractional length, like the native functions", () => {
        // Previously a length of 1.5 included the value at index 1
        assert.deepEqual(arrZip({ length: 1.5, 0: 1, 1: 2 } as any, { length: 1.5, 0: 3, 1: 4 } as any), [[1, 3]]);
        assert.deepEqual(arrZip({ length: 2.5, 0: 1, 1: 2, 2: 3 } as any, [4, 5, 6]), [[1, 4], [2, 5]]);
        assert.deepEqual(arrZip({ length: 0.5, 0: 1 } as any, [2]), []);
    });

    it("should return an empty array when the result would be longer than an array can be", () => {
        assert.deepEqual(arrZip({ length: Infinity } as any, { length: Infinity } as any), []);
        assert.deepEqual(arrZip({ length: 4294967296 } as any), []);

        // The shortest array still sets the length of the result
        assert.deepEqual(arrZip({ length: Infinity, 0: 1 } as any, ["a"]), [[1, "a"]]);
    });
});

describe("arrZip arguments", () => {
    it("should return an empty array when called with no arrays", () => {
        assert.deepEqual((arrZip as any)(), []);
    });

    it("should wrap each value when called with one array", () => {
        assert.deepEqual(arrZip([1, 2]), [[1], [2]]);
        assert.deepEqual(arrZip([]), []);
    });
});

describe("arrUnzip", () => {
    it("should reverse zip operation", () => {
        const zipped = [[1, "a"], [2, "b"], [3, "c"]];
        assert.deepEqual(arrUnzip(zipped), [[1, 2, 3], ["a", "b", "c"]]);
    });

    it("should handle arrays with more than 2 elements", () => {
        const zipped = [[1, "a", true], [2, "b", false]];
        assert.deepEqual(arrUnzip(zipped), [[1, 2], ["a", "b"], [true, false]]);
    });

    it("should handle irregular arrays", () => {
        const irregular = [[1, "a"], [2], [3, "c", true]];
        const result = arrUnzip(irregular);
        assert.equal(result[0][0], 1);
        assert.equal(result[0][1], 2);
        assert.equal(result[0][2], 3);
        assert.equal(result[1][0], "a");
        assert.isUndefined(result[1][1]);
        assert.equal(result[1][2], "c");
    });

    it("should return empty array for empty array", () => {
        assert.deepEqual(arrUnzip([]), []);
    });

    it("should handle null and undefined", () => {
        assert.deepEqual(arrUnzip(null), []);
        assert.deepEqual(arrUnzip(undefined), []);
    });

    it("should handle single element arrays", () => {
        assert.deepEqual(arrUnzip([[1], [2], [3]]), [[1, 2, 3]]);
    });

    it("should be inverse of arrZip", () => {
        const arr1 = [1, 2, 3];
        const arr2 = ["a", "b", "c"];
        const zipped = arrZip(arr1, arr2);
        const unzipped = arrUnzip(zipped);
        
        assert.deepEqual(unzipped[0], arr1);
        assert.deepEqual(unzipped[1], arr2);
    });

    it("should truncate a fractional length, like the native functions", () => {
        // Previously a sub-array length of 1.5 or 2.5 added an extra group
        assert.deepEqual(arrUnzip([{ length: 1.5, 0: 1, 1: 2 }, { length: 1.5, 0: 3, 1: 4 }] as any), [[1, 3]]);
        assert.deepEqual(arrUnzip([{ length: 2.5, 0: 1, 1: 2, 2: 3 }, [4, 5]] as any), [[1, 4], [2, 5]]);
        assert.deepEqual(arrUnzip({ length: 1.5, 0: [1, 2], 1: [3, 4] } as any), [[1], [2]]);
    });
});
