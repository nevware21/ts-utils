/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrIndexOfSubset, arrLastIndexOfSubset } from "../../../../src/array/arrIndexOfSubset";

describe("arrIndexOfSubset", () => {

    it("null / undefined", () => {
        assert.equal(arrIndexOfSubset(null as any, [1]), -1);
        assert.equal(arrIndexOfSubset(undefined as any, [1]), -1);
        assert.equal(arrIndexOfSubset([1, 2], null as any), -1);
        assert.equal(arrIndexOfSubset([1, 2], undefined as any), -1);
    });

    it("empty subset", () => {
        assert.equal(arrIndexOfSubset([1, 2, 3], []), 0);
        assert.equal(arrIndexOfSubset([1, 2, 3], [], 2), 2);
        assert.equal(arrIndexOfSubset([1, 2, 3], [], 10), 3);
        assert.equal(arrIndexOfSubset([], []), 0);
    });

    it("simple example", () => {
        assert.equal(arrIndexOfSubset([1, 2, 3, 4, 5], [3, 4]), 2);
        assert.equal(arrIndexOfSubset([1, 2, 3, 4, 5], [4, 3]), -1);
        assert.equal(arrIndexOfSubset([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]), 0);
        assert.equal(arrIndexOfSubset([1, 2, 3, 4, 5], [5]), 4);
        assert.equal(arrIndexOfSubset([1, 2, 3, 4, 5], [6]), -1);
        // subset overruns theArray's end, so it matches against the available prefix
        assert.equal(arrIndexOfSubset([1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6]), 0);
    });

    it("truncated subset matches available prefix", () => {
        assert.equal(arrIndexOfSubset([1, 2, 3], [3, 4, 5]), 2);
        assert.equal(arrIndexOfSubset([1, 2, 3], [2, 3, 99, 100]), 1);
    });

    it("fromIndex", () => {
        const array = ["a", "b", "a", "b", "c"];
        assert.equal(arrIndexOfSubset(array, ["a", "b"]), 0);
        assert.equal(arrIndexOfSubset(array, ["a", "b"], 1), 2);
        assert.equal(arrIndexOfSubset(array, ["a", "b"], -2), -1);
        assert.equal(arrIndexOfSubset(array, ["b", "c"], -2), 3);
    });

    it("repeated leading value requires re-searching later occurrences", () => {
        const haystack = ["at foo", "at bar", "at foo", "at bar", "at baz"];
        assert.equal(arrIndexOfSubset(haystack, ["at foo", "at bar", "at baz"]), 2);
        assert.equal(arrIndexOfSubset(haystack, ["at foo", "at qux"]), -1);
    });

    it("NaN / non-integer fromIndex", () => {
        const array = [1, 2, 3, 4, 5];
        assert.equal(arrIndexOfSubset(array, [3, 4], NaN), 2);
        assert.equal(arrIndexOfSubset(array, [1, 2], NaN), 0);
        assert.equal(arrIndexOfSubset(array, [3, 4], 1.9), 2);
        assert.equal(arrIndexOfSubset(array, [3, 4], -1.9), -1);
        assert.equal(arrIndexOfSubset(array, [], NaN), 0);
    });

    it("null fromIndex coerces to 0, unlike omitted (undefined) fromIndex", () => {
        const array = [1, 2, 3, 4, 5];
        assert.equal(arrIndexOfSubset(array, [1, 2], null as any), 0);
        assert.equal(arrIndexOfSubset(array, [3, 4], null as any), 2);
        assert.equal(arrIndexOfSubset(array, [], null as any), 0);
    });

    it("array like", () => {
        let arrayLike = {
            length: 4,
            0: "potato",
            1: "tomato",
            2: "chillies",
            3: "green-pepper"
        };

        assert.equal(arrIndexOfSubset(arrayLike, ["tomato", "chillies"]), 1);
        assert.equal(arrIndexOfSubset(arrayLike, ["chillies", "tomato"]), -1);
    });
});

describe("arrLastIndexOfSubset", () => {

    it("null / undefined", () => {
        assert.equal(arrLastIndexOfSubset(null as any, [1]), -1);
        assert.equal(arrLastIndexOfSubset(undefined as any, [1]), -1);
        assert.equal(arrLastIndexOfSubset([1, 2], null as any), -1);
        assert.equal(arrLastIndexOfSubset([1, 2], undefined as any), -1);
    });

    it("empty subset", () => {
        assert.equal(arrLastIndexOfSubset([1, 2, 3], []), 3);
        assert.equal(arrLastIndexOfSubset([1, 2, 3], [], 2), 2);
        assert.equal(arrLastIndexOfSubset([1, 2, 3], [], 10), 3);
        assert.equal(arrLastIndexOfSubset([], []), 0);
    });

    it("simple example", () => {
        assert.equal(arrLastIndexOfSubset([1, 2, 3, 4, 5], [3, 4]), 2);
        assert.equal(arrLastIndexOfSubset([1, 2, 3, 4, 5], [4, 3]), -1);
        assert.equal(arrLastIndexOfSubset([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]), 0);
        assert.equal(arrLastIndexOfSubset([1, 2, 3, 4, 5], [5]), 4);
        assert.equal(arrLastIndexOfSubset([1, 2, 3, 4, 5], [6]), -1);
        // subset overruns theArray's end, so it matches against the available prefix
        assert.equal(arrLastIndexOfSubset([1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6]), 0);
    });

    it("truncated subset matches available prefix", () => {
        assert.equal(arrLastIndexOfSubset([1, 2, 3], [3, 4, 5]), 2);
        assert.equal(arrLastIndexOfSubset([1, 2, 3], [2, 3, 99, 100]), 1);
    });

    it("returns the later occurrence, unlike arrIndexOfSubset", () => {
        const array = ["a", "b", "a", "b", "c"];
        assert.equal(arrLastIndexOfSubset(array, ["a", "b"]), 2);
        assert.equal(arrLastIndexOfSubset(array, ["b", "c"]), 3);

        const haystack = ["at foo", "at bar", "at foo", "at bar", "at baz"];
        assert.equal(arrLastIndexOfSubset(haystack, ["at foo", "at bar"]), 2);
        assert.equal(arrLastIndexOfSubset(haystack, ["at foo", "at qux"]), -1);
    });

    it("fromIndex", () => {
        const array = ["a", "b", "a", "b", "c"];
        assert.equal(arrLastIndexOfSubset(array, ["a", "b"], 1), 0);
        assert.equal(arrLastIndexOfSubset(array, ["a", "b"], 4), 2);
        assert.equal(arrLastIndexOfSubset(array, ["a", "b"], -2), 2);
        assert.equal(arrLastIndexOfSubset(array, ["a", "b"], -4), 0);
    });

    it("array like", () => {
        let arrayLike = {
            length: 4,
            0: "potato",
            1: "tomato",
            2: "chillies",
            3: "green-pepper"
        };

        assert.equal(arrLastIndexOfSubset(arrayLike, ["tomato", "chillies"]), 1);
        assert.equal(arrLastIndexOfSubset(arrayLike, ["chillies", "tomato"]), -1);
    });

    it("NaN / non-integer fromIndex", () => {
        const array = [1, 2, 3, 4, 5];
        // NaN fromIndex normalizes to 0 (matching native lastIndexOf), not the default (array length)
        assert.equal(arrLastIndexOfSubset(array, [1, 2], NaN), 0);
        assert.equal(arrLastIndexOfSubset(array, [3, 4], NaN), -1);
        assert.equal(arrLastIndexOfSubset(array, [3, 4], 2.9), 2);
        assert.equal(arrLastIndexOfSubset(array, [3, 4], -1.9), 2);
        assert.equal(arrLastIndexOfSubset(array, [], NaN), 0);
    });

    it("null fromIndex coerces to 0, unlike omitted (undefined) fromIndex", () => {
        const array = [1, 2, 3, 4, 5];
        assert.equal(arrLastIndexOfSubset(array, [1, 2], null as any), 0);
        assert.equal(arrLastIndexOfSubset(array, [3, 4], null as any), -1);
        assert.equal(arrLastIndexOfSubset(array, [], null as any), 0);
    });

    it("null fromIndex searches from index 0, not from the end (regression)", () => {
        // [3, 4] genuinely exists (at index 2), so this only returns -1 if null caused the
        // search to start from index 0 rather than defaulting to theArray's length like an
        // omitted fromIndex would.
        const array = [1, 2, 3, 4, 5];
        assert.equal(arrLastIndexOfSubset(array, [3, 4]), 2, "omitted fromIndex finds it from the end");
        assert.equal(arrLastIndexOfSubset(array, [3, 4], null as any), -1, "null fromIndex only searches index 0");
    });
});
