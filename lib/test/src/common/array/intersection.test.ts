/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrIntersection } from "../../../../src/array/intersection";
import { getGlobal } from "../../../../src/helpers/environment";

describe("arrIntersection", () => {
    it("should return common elements between two arrays", () => {
        assert.deepEqual(arrIntersection([1, 2, 3], [2, 3, 4]), [2, 3]);
        assert.deepEqual(arrIntersection(["a", "b"], ["b", "c"]), ["b"]);
    });

    it("should return common elements across multiple arrays", () => {
        assert.deepEqual(arrIntersection([1, 2, 3], [2, 3], [3, 4]), [3]);
        assert.deepEqual(arrIntersection([1, 2, 3, 4], [2, 3, 4], [3, 4, 5]), [3, 4]);
    });

    it("should return empty array when no common elements", () => {
        assert.deepEqual(arrIntersection([1, 2], [3, 4]), []);
    });

    it("should return empty array when any array is empty", () => {
        assert.deepEqual(arrIntersection([1, 2, 3], []), []);
    });

    it("should handle null and undefined", () => {
        assert.deepEqual(arrIntersection(), []);
        assert.deepEqual(arrIntersection(null, [1, 2]), []);
        assert.deepEqual(arrIntersection(undefined, [1, 2]), []);
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 3, 0: 1, 1: 2, 2: 3 };
        assert.deepEqual(arrIntersection(arrayLike, [2, 3]), [2, 3]);
    });

    it("should use strict equality", () => {
        assert.deepEqual(arrIntersection<any>([1, 2, 3], ["1", "2"]), []);
    });

    it("should preserve order from first array", () => {
        assert.deepEqual(arrIntersection([5, 3, 1, 4, 2], [1, 2, 3, 4, 5]), [5, 3, 1, 4, 2]);
    });

    it("should remove duplicates from result", () => {
        assert.deepEqual(arrIntersection([1, 2, 2, 3, 3], [2, 3]), [2, 3]);
    });

    it("should treat a later null or undefined array as empty", () => {
        assert.deepEqual(arrIntersection([1, 2], null), []);
        assert.deepEqual(arrIntersection([1, 2], [1], undefined), []);
        assert.deepEqual(arrIntersection(null, [1, 2]), []);
    });
});

describe("arrIntersection with a String object", () => {
    it("compares the characters of a String object, like a string", () => {
        assert.deepEqual(arrIntersection(["bc"], new String("abc") as any), []);
        assert.deepEqual(arrIntersection(["b", "z"], new String("abc") as any), ["b"]);
        assert.deepEqual(arrIntersection(["b", "z"], "abc" as any), ["b"]);
    });
});

describe("arrIntersection with later array-likes", () => {
    it("searches any later value except null and undefined like an array-like, converting its length like the native functions", () => {
        assert.deepEqual(arrIntersection(["x", "z"], { length: "2", 0: "x", 1: "y" } as any), ["x"], "A string length");
        assert.deepEqual(arrIntersection(["x", "y"], { length: 1.5, 0: "x", 1: "y" } as any), ["x"], "A fractional length");
        assert.deepEqual(arrIntersection(["x"], null as any), [], "null includes nothing");
        assert.deepEqual(arrIntersection(["x"], 5 as any), [], "A value without a length includes nothing");
    });

    it("compares the values of large arrays", () => {
        const first: number[] = [];
        const second: number[] = [];
        const third: number[] = [];
        for (let lp = 0; lp < 20000; lp++) {
            first.push(lp);
            second.push(lp * 2);
            third.push(lp * 3);
        }

        const result = arrIntersection(first, second, third);
        assert.equal(result.length, 3334, "The multiples of 6 below 20000");
        assert.equal(result[0], 0);
        assert.equal(result[1], 6);
        assert.equal(result[result.length - 1], 19998);
    });

    it("matches the values like includes() (SameValueZero), an empty slot is undefined", () => {
        // eslint-disable-next-line no-sparse-arrays
        const result = arrIntersection([NaN, -0, undefined, 1], [0, NaN, , 1]);
        assert.deepEqual(result, [NaN, -0, undefined, 1]);
        assert.equal(1 / result[1], -Infinity, "The value of the first array (-0) is included");
    });

    it("doesn't include a repeated value of the first array which isn't in a later array", () => {
        assert.deepEqual(arrIntersection([1, 1], [2]), []);
        assert.deepEqual(arrIntersection([1, 2, 1, 2], [2]), [2]);
        assert.deepEqual(arrIntersection([1, 2, 1], [1, 2], [3, 1]), [1]);
    });

    it("reads a later function like an array-like (as in v0.16.0)", () => {
        assert.deepEqual(arrIntersection([undefined, 1], function (a: any) {
            return a;
        } as any), [undefined], "A function's length, its indexes are undefined");
    });

    it("reads each index of a later array once, rather than searching it for every value", () => {
        const reads: number[] = [];
        const later: any = {
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

        assert.deepEqual(arrIntersection([1, 2, 3, 4], later), [1, 2, 3]);
        assert.deepEqual(reads, [0, 1, 2], "Each index is read once");
    });

    it("only reads a later array when a value is in all of the arrays before it (as in v0.16.0)", () => {
        const throwing: any = {
            length: 1,
            get 0() {
                throw new Error("Read");
            }
        };

        assert.deepEqual(arrIntersection([], throwing), [], "There are no values to compare");
        assert.deepEqual(arrIntersection([1], [], throwing), [], "No value is in the first later array");
        assert.deepEqual(arrIntersection([1, 2], [3], null as any, throwing), [], "No value is in [3], so the arrays after it aren't read");
        assert.throws(() => arrIntersection([1, 2], [2], throwing), Error, "Read");
    });

    it("compares the values of a later array-like, rather than calling its own includes()", () => {
        let includesCalls = 0;
        const arrayLike: any = {
            length: 2,
            0: "a",
            1: "b",
            includes: () => {
                includesCalls++;
                return true;
            }
        };

        assert.deepEqual(arrIntersection(["a", "c"], arrayLike), ["a"]);
        assert.equal(includesCalls, 0, "Its own includes() isn't called");
    });

    it("only reads a later array until the value is found (as before and in v0.16.0)", () => {
        const throwing: any = {
            length: 2,
            0: 1,
            get 1() {
                throw new Error("Read");
            }
        };

        assert.deepEqual(arrIntersection([1], throwing), [1], "The index after the value isn't read");
        assert.deepEqual(arrIntersection([1, 1], [2, 1], throwing), [1], "A repeated value is found without reading more");
        assert.throws(() => arrIntersection([1, 2], throwing), Error, "Read");
    });

    it("reads each index of a later array once and in order, only as far as each value", () => {
        const reads: number[] = [];
        const later: any = { length: 4 };
        [1, 2, 3, 4].forEach((value, idx) => {
            Object.defineProperty(later, idx, {
                get: () => {
                    reads.push(idx);
                    return value;
                }
            });
        });

        assert.deepEqual(arrIntersection([2, 1], later), [2, 1]);
        assert.deepEqual(reads, [0, 1], "2 is read at index 1, and 1 has already been read");

        reads.length = 0;
        assert.deepEqual(arrIntersection([2, 1, 4, 5], later), [2, 1, 4]);
        assert.deepEqual(reads, [0, 1, 2, 3], "4 is read after 2, and 5 doesn't read any more");
    });

    it("reads each index of the first array once", () => {
        const reads: number[] = [];
        const first: any = {
            length: 2,
            get 0() {
                reads.push(0);
                return 1;
            },
            get 1() {
                reads.push(1);
                return 2;
            }
        };

        assert.deepEqual(arrIntersection(first, [2, 1]), [1, 2]);
        assert.deepEqual(reads, [0, 1]);
    });

    it("reads the length of a later array once", () => {
        let lengthReads = 0;
        const later: any = {
            0: 1,
            1: 2,
            get length() {
                lengthReads++;
                return 2;
            }
        };

        assert.deepEqual(arrIntersection([1, 2, 3], later), [1, 2]);
        assert.equal(lengthReads, 1);
    });

    it("isn't changed by an index added to Array.prototype", () => {
        const arrProto: any = Array.prototype;
        const results: any[] = [];

        try {
            // An index of the internal state of the later arrays is never read from the prototype
            arrProto[1] = () => true;
            results.push(arrIntersection([1, 2], [3], [4]));
            arrProto[1] = 5;
            results.push(arrIntersection([1, 2], [3], [4]));
        } finally {
            delete arrProto[1];
        }

        assert.deepEqual(results, [[], []]);
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
            result = arrIntersection([objects[999], {}, objects[0]], objects);
        } finally {
            arrProto.indexOf = orgIndexOf;
            theGlobal.Set = orgSet;
            theGlobal.Map = orgMap;
        }

        assert.equal(result.length, 2);
        assert.equal(result[0], objects[999]);
        assert.equal(result[1], objects[0]);

        // Each object which is read is added without searching the objects already added, as that would be quadratic
        // (a search for each of the 1,000 objects), so there is only one search for each value of the first array
        // which is compared, and one for each matched value which is checked before it is included
        assert.equal(searches, 5);
    });

    it("only reads the length of a later array when a value reaches it (as before and in v0.16.0)", () => {
        const throwingLength: any = {
            get length() {
                throw new Error("Read");
            }
        };

        assert.deepEqual(arrIntersection([], throwingLength), [], "There are no values to compare");
        assert.deepEqual(arrIntersection([1], [2], throwingLength), [], "No value is in [2]");
        assert.throws(() => arrIntersection([1], [1], throwingLength), Error, "Read");
    });

    it("only matches NaN with NaN when comparing the values read from a later array", () => {
        assert.deepEqual(arrIntersection([1], [NaN]), [], "A later NaN doesn't include 1");
        assert.deepEqual(arrIntersection([NaN], [1, NaN]), [NaN], "NaN is found after 1 is read");
    });

    it("includes -0 and +0 of the first array once, keeping the first (as in v0.16.0)", () => {
        const result = arrIntersection([-0, 0], [0]);

        assert.equal(result.length, 1, "-0 and +0 are the same value");
        assert.equal(1 / result[0], -Infinity, "The first value (-0) is kept");
    });

    it("doesn't read a first value which isn't an array-like, eg. a function with an index (as in v0.16.0)", () => {
        const fn: any = function (value: any) {
            return value;
        };
        fn[0] = 1;

        assert.deepEqual(arrIntersection(fn, [1]), []);
    });

    it("doesn't read an index 0 inherited by the arguments when there are no arrays (as in v0.16.0)", () => {
        const objProto: any = Object.prototype;
        let result: any[];

        try {
            objProto[0] = [1, 2];
            result = arrIntersection();
        } finally {
            delete objProto[0];
        }

        assert.deepEqual(result, []);
    });

    it("finds the values of a later array with more than 5,000 values, in any of its sets", () => {
        const values: number[] = [];
        for (let lp = 0; lp < 15001; lp++) {
            values.push(lp);
        }

        // -1 reads every value, so 0 to 4,999 are in the first set, 5,000 to 14,999 in the second (of 10,000 values)
        // and 15,000 in a third, where each value is then found
        assert.deepEqual(arrIntersection([-1, 3, 4999, 5000, 14999, 15000, 15001], values), [3, 4999, 5000, 14999, 15000]);
        assert.deepEqual(arrIntersection([15000, 14999, 3, -1], values), [15000, 14999, 3]);
    });
});
