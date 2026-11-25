/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrDifference } from "../../../../src/array/difference";
import { getGlobal } from "../../../../src/helpers/environment";

describe("arrDifference", () => {
    it("should return elements in first array not in second array", () => {
        assert.deepEqual(arrDifference([1, 2, 3, 4], [2, 4]), [1, 3]);
        assert.deepEqual(arrDifference(["a", "b", "c"], ["b"]), ["a", "c"]);
    });

    it("should handle multiple exclude arrays", () => {
        assert.deepEqual(arrDifference([1, 2, 3], [2], [3]), [1]);
        assert.deepEqual(arrDifference([1, 2, 3, 4, 5], [2, 4], [3, 5]), [1]);
    });

    it("should return all elements when exclude arrays are empty", () => {
        assert.deepEqual(arrDifference([1, 2, 3], []), [1, 2, 3]);
        assert.deepEqual(arrDifference([1, 2, 3]), [1, 2, 3]);
    });

    it("should return empty array when source is empty", () => {
        assert.deepEqual(arrDifference([], [1, 2]), []);
    });

    it("should handle null source array", () => {
        assert.deepEqual(arrDifference(null, [1, 2]), []);
        assert.deepEqual(arrDifference(undefined, [1, 2]), []);
    });

    it("should handle null exclude arrays", () => {
        assert.deepEqual(arrDifference([1, 2, 3], null), [1, 2, 3]);
        assert.deepEqual(arrDifference([1, 2, 3], undefined), [1, 2, 3]);
        assert.deepEqual(arrDifference([1, 2, 3], [2], null), [1, 3]);
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 3, 0: 1, 1: 2, 2: 3 };
        assert.deepEqual(arrDifference(arrayLike, [2]), [1, 3]);
    });

    it("should use strict equality", () => {
        assert.deepEqual(arrDifference<any>([1, 2, 3], ["1", "2"]), [1, 2, 3]);
        assert.deepEqual(arrDifference<any>(["1", "2", "3"], [1, 2]), ["1", "2", "3"]);
    });

    it("should preserve order from source array", () => {
        assert.deepEqual(arrDifference([5, 3, 1, 4, 2], [3, 1]), [5, 4, 2]);
    });

    it("should handle duplicate values in source array", () => {
        assert.deepEqual(arrDifference([1, 2, 2, 3, 3, 3], [2]), [1, 3, 3, 3]);
    });
});

describe("arrDifference with a String object", () => {
    it("compares the characters of a String object, like a string", () => {
        assert.deepEqual(arrDifference(["bc", "z"], new String("abc") as any), ["bc", "z"]);
        assert.deepEqual(arrDifference(["b", "z"], new String("abc") as any), ["z"]);
    });
});

describe("arrDifference with large or array-like values", () => {
    it("excludes the values of large arrays", () => {
        const values: number[] = [];
        const evens: number[] = [];
        const threes: number[] = [];
        for (let lp = 0; lp < 20000; lp++) {
            values.push(lp);
            evens.push(lp * 2);
            threes.push(lp * 3);
        }

        const result = arrDifference(values, evens, threes);
        assert.equal(result.length, 6667, "The values which are not a multiple of 2 or 3");
        assert.deepEqual(result.slice(0, 4), [1, 5, 7, 11]);
    });

    it("matches the values like includes() (SameValueZero), an empty slot is undefined", () => {
        // eslint-disable-next-line no-sparse-arrays
        assert.deepEqual(arrDifference([NaN, -0, undefined, 1, 2], [0, NaN, , 1]), [2]);
    });

    it("compares the values of an array-like, rather than calling its own includes()", () => {
        let includesCalls = 0;
        const arrayLike: any = {
            length: 1,
            0: "a",
            includes: () => {
                includesCalls++;
                return true;
            }
        };

        assert.deepEqual(arrDifference(["a", "c"], arrayLike), ["c"]);
        assert.equal(includesCalls, 0, "Its own includes() isn't called");
    });

    it("converts the length of an array-like like the native functions, and ignores a function (as in v0.16.0)", () => {
        assert.deepEqual(arrDifference([1, 2, undefined], { length: 1.5, 0: 1, 1: 2 } as any), [2, undefined], "A fractional length");
        assert.deepEqual(arrDifference([undefined, 1], function (a: any) {
            return a;
        } as any), [undefined, 1], "A function isn't an array-like");
    });

    it("reads each index of an array to exclude once, rather than searching it for every value", () => {
        const reads: number[] = [];
        const excluded: any = {
            length: 3,
            get 0() {
                reads.push(0);
                return 3;
            },
            get 1() {
                reads.push(1);
                return 2;
            },
            get 2() {
                reads.push(2);
                return 1;
            }
        };

        assert.deepEqual(arrDifference([1, 2, 3, 4], excluded), [4]);
        assert.deepEqual(reads, [0, 1, 2], "Each index is read once");
    });

    it("only reads an array to exclude when a value isn't in the arrays before it (as in v0.16.0)", () => {
        const throwing: any = {
            length: 1,
            get 0() {
                throw new Error("Read");
            }
        };

        assert.deepEqual(arrDifference([], throwing), [], "There are no values to exclude");
        assert.deepEqual(arrDifference([1], [1], throwing), [], "Every value is excluded by the first array");
        assert.deepEqual(arrDifference([1, 2], [1], [2], throwing), [], "Every value is excluded before the last array");
        assert.deepEqual(arrDifference([1, 2], [3], 5 as any, [1, 2], throwing), [], "A value which isn't an array-like is ignored");
        assert.throws(() => arrDifference([1, 3], [1], throwing), Error, "Read");
    });

    it("keeps -0 of the first array when it isn't excluded", () => {
        const result = arrDifference([-0, 1], [1]);
        assert.deepEqual(result, [-0]);
        assert.equal(1 / result[0], -Infinity, "The value of the first array (-0) is kept");
    });

    it("only reads an array to exclude until the value is found (as before and in v0.16.0)", () => {
        const throwing: any = {
            length: 2,
            0: 1,
            get 1() {
                throw new Error("Read");
            }
        };

        assert.deepEqual(arrDifference([1], throwing), [], "The index after the value isn't read");
        assert.deepEqual(arrDifference([1, 2, 1], [2], throwing), [], "A repeated value is found without reading more");
        assert.throws(() => arrDifference([1, 3], throwing), Error, "Read");
    });

    it("reads each index of an array to exclude once and in order, only as far as each value", () => {
        const reads: number[] = [];
        const excluded: any = { length: 4 };
        [1, 2, 3, 4].forEach((value, idx) => {
            Object.defineProperty(excluded, idx, {
                get: () => {
                    reads.push(idx);
                    return value;
                }
            });
        });

        assert.deepEqual(arrDifference([2, 1], excluded), []);
        assert.deepEqual(reads, [0, 1], "2 is read at index 1, and 1 has already been read");

        reads.length = 0;
        assert.deepEqual(arrDifference([2, 1, 4, 5], excluded), [5]);
        assert.deepEqual(reads, [0, 1, 2, 3], "4 is read after 2, and 5 doesn't read any more");
    });

    it("reads the length of an array to exclude when it is reached, rather than for each value", () => {
        let lengthReads = 0;
        const excluded: any = {
            0: 1,
            1: 2,
            get length() {
                lengthReads++;
                return 2;
            }
        };

        assert.deepEqual(arrDifference([3], excluded), [3]);
        const oneValueReads = lengthReads;

        lengthReads = 0;
        assert.deepEqual(arrDifference([3, 4, 5, 6], excluded), [3, 4, 5, 6]);
        assert.isAbove(oneValueReads, 0, "The length is read");
        assert.equal(lengthReads, oneValueReads, "The length isn't read again for each value");
    });

    it("isn't changed by an index added to Array.prototype", () => {
        const arrProto: any = Array.prototype;
        const results: any[] = [];

        try {
            // An index of the internal state of the arrays to exclude is never read from the prototype
            arrProto[1] = () => true;
            results.push(arrDifference([1, 2], [3], [4]));
            arrProto[1] = 5;
            results.push(arrDifference([1, 2], [3], [4]));
        } finally {
            delete arrProto[1];
        }

        assert.deepEqual(results, [[1, 2], [1, 2]]);
    });

    it("compares an array of objects without a native Set or Map (IE 9 / 10), only searching for the values", () => {
        const objects: any[] = [];
        for (let lp = 0; lp < 1000; lp++) {
            objects.push({ lp });
        }
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const orgMap = theGlobal.Map;
        const arrProto: any = Array.prototype;
        const orgIndexOf = arrProto.indexOf;
        const other = {};
        let searches = 0;
        let result: any[];

        theGlobal.Set = undefined;
        theGlobal.Map = undefined;

        // Without a Set the objects which have been added are searched with indexOf()
        arrProto.indexOf = function () {
            searches++;
            return orgIndexOf.apply(this, arguments);
        };
        try {
            result = arrDifference([objects[999], other, objects[0]], objects);
        } finally {
            arrProto.indexOf = orgIndexOf;
            theGlobal.Set = orgSet;
            theGlobal.Map = orgMap;
        }

        assert.equal(result.length, 1);
        assert.equal(result[0], other);

        // Each object which is read is added without searching the objects already added, as that would be quadratic
        // (a search for each of the 1,000 objects), so there is only one search for each value of the first array
        assert.equal(searches, 3);
    });

    it("only reads the length of an array to exclude when a value reaches it (as before and in v0.16.0)", () => {
        const throwingLength: any = {
            get length() {
                throw new Error("Read");
            }
        };

        assert.deepEqual(arrDifference([], throwingLength), [], "There are no values to exclude");
        assert.deepEqual(arrDifference([1], [1], throwingLength), [], "Every value is excluded by [1]");
        assert.throws(() => arrDifference([1], [2], throwingLength), Error, "Read");
    });

    it("only matches NaN with NaN when comparing the values read from an array to exclude", () => {
        assert.deepEqual(arrDifference([1], [NaN]), [1], "A NaN to exclude doesn't exclude 1");
        assert.deepEqual(arrDifference([NaN, 2], [1, 2]), [NaN], "1 doesn't exclude NaN");
    });

    it("excludes the values of a later array with more than 5,000 values, in any of its sets", () => {
        const values: number[] = [];
        for (let lp = 0; lp < 15001; lp++) {
            values.push(lp);
        }

        // -1 reads every value, so 0 to 4,999 are in the first set, 5,000 to 14,999 in the second (of 10,000 values)
        // and 15,000 in a third, where each value is then found
        assert.deepEqual(arrDifference([-1, 3, 4999, 5000, 14999, 15000, 15001], values), [-1, 15001]);
        assert.deepEqual(arrDifference([15000, 14999, 3, -1], values), [-1]);
    });
});
