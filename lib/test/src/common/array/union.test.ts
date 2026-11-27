/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrUnion } from "../../../../src/array/union";
import { getGlobal } from "../../../../src/helpers/environment";

describe("arrUnion", () => {
    it("should return unique elements from two arrays", () => {
        assert.deepEqual(arrUnion([1, 2], [2, 3]), [1, 2, 3]);
        assert.deepEqual(arrUnion(["a", "b"], ["b", "c"]), ["a", "b", "c"]);
    });

    it("should handle multiple arrays", () => {
        assert.deepEqual(arrUnion([1, 2], [3, 4], [4, 5]), [1, 2, 3, 4, 5]);
    });

    it("should remove duplicates", () => {
        assert.deepEqual(arrUnion([1, 1, 2], [2, 2, 3]), [1, 2, 3]);
    });

    it("should handle empty arrays", () => {
        assert.deepEqual(arrUnion([], [1, 2]), [1, 2]);
        assert.deepEqual(arrUnion([1, 2], []), [1, 2]);
        assert.deepEqual(arrUnion([], []), []);
    });

    it("should handle single array", () => {
        assert.deepEqual(arrUnion([1, 2, 3]), [1, 2, 3]);
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 2, 0: 1, 1: 2 };
        assert.deepEqual(arrUnion(arrayLike, [2, 3]), [1, 2, 3]);
    });

    it("should use strict equality", () => {
        assert.deepEqual(arrUnion<any>([1, 2], ["1", "2"]), [1, 2, "1", "2"]);
    });

    it("should preserve insertion order", () => {
        assert.deepEqual(arrUnion([3, 1], [2, 4]), [3, 1, 2, 4]);
    });

    it("should keep distinct objects", () => {
        const a = { a: 1 };
        const b = { b: 2 };
        const result = arrUnion([a], [b, a]);

        assert.equal(result.length, 2);
        assert.equal(result[0], a);
        assert.equal(result[1], b);
    });

    it("should ignore null and undefined arrays", () => {
        assert.deepEqual(arrUnion([1], null, [2], undefined), [1, 2]);
        assert.deepEqual(arrUnion(null, [1]), [1]);
        assert.deepEqual(arrUnion(null, undefined), []);
    });

    it("should find each value with the runtime's Set, rather than by searching the result", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const searched: any[] = [];
        let result: number[];

        // A Set which records the values it is searched for. It finds NaN and treats -0 and +0 as the same value, so
        // once it has been checked (by searching for NaN and -0) it is used directly
        theGlobal.Set = function () {
            const values = new orgSet();

            return {
                has: (value: any) => {
                    searched.push(value);
                    return values.has(value);
                },
                add: (value: any) => {
                    values.add(value);
                }
            };
        };

        try {
            result = arrUnion([1, 2], [2, 3]);
        } finally {
            theGlobal.Set = orgSet;
        }

        assert.deepEqual(result, [1, 2, 3]);
        assert.deepEqual(searched, [NaN, -0, 1, 2, 2, 3], "The check of NaN and -0, then each value");
    });

    it("should not use the Symbol.species of an array, so one which can't be written to doesn't throw", function() {
        if (typeof Symbol !== "function" || !Symbol.species) {
            this.skip();
            return;
        }

        // A species which creates a frozen array, so a copy made with it can't be written to (main and v0.16.0
        // copied the arrays with slice(), which uses it, and threw a TypeError)
        const values: any = [1, 2, 3];
        const ctor: any = {};
        ctor[Symbol.species] = function (len: number) {
            return Object.freeze(new Array(len));
        };
        values.constructor = ctor;

        assert.deepEqual(arrUnion(values), [1, 2, 3]);
        assert.deepEqual(arrUnion([0], values), [0, 1, 2, 3]);
    });
});

describe("arrUnion with array-likes", () => {
    it("reads any value except null and undefined like an array-like, converting its length like the native functions", () => {
        assert.deepEqual(arrUnion({ length: "2", 0: "x", 1: "y" } as any), ["x", "y"], "A string length");
        assert.deepEqual(arrUnion([1], { length: 1.5, 0: 2, 1: 3 } as any), [1, 2], "A fractional length");
        assert.deepEqual(arrUnion([1], function (value: any) {
            return value;
        } as any), [1, undefined], "A function's length");
        assert.deepEqual(arrUnion([1], 5 as any, {} as any, true as any), [1], "A value without a length adds nothing");
    });

    it("adds an empty slot as undefined (as in v0.16.0)", () => {
        // eslint-disable-next-line no-sparse-arrays
        assert.deepEqual(arrUnion([1, , 3], [3, 4]), [1, undefined, 3, 4]);
    });

    it("combines arrays with more values than apply() accepts as arguments", () => {
        const values: number[] = [];
        for (let lp = 0; lp < 300000; lp++) {
            values.push(lp);
        }

        const result = arrUnion(values, [0, 300000]);
        assert.equal(result.length, 300001);
        assert.equal(result[0], 0);
        assert.equal(result[300000], 300000);
    });

    it("treats -0 and +0 as the same value, keeping the first", () => {
        let result = arrUnion([-0, 1], [0, 2]);
        assert.deepEqual(result, [-0, 1, 2]);
        assert.equal(1 / result[0], -Infinity, "The first value (-0) is kept");

        result = arrUnion([0], [-0]);
        assert.deepEqual(result, [0]);
        assert.equal(1 / result[0], Infinity, "The first value (+0) is kept");
    });

    it("reads each index once, in order", () => {
        const reads: string[] = [];
        const first: any = {
            length: 2,
            get 0() {
                reads.push("a0");
                return 1;
            },
            get 1() {
                reads.push("a1");
                return 1;
            }
        };
        const second: any = {
            length: 2,
            get 0() {
                reads.push("b0");
                return 2;
            },
            get 1() {
                reads.push("b1");
                return 1;
            }
        };

        assert.deepEqual(arrUnion(first, second), [1, 2]);
        assert.deepEqual(reads, ["a0", "a1", "b0", "b1"]);
    });

    it("throws a RangeError for a length which is longer than an array can be, before reading an index (as before and in v0.16.0)", () => {
        // Reading an index throws, so without the check this fails (rather than reading indexes until the runtime runs
        // out of memory)
        const read = () => {
            throw new Error("Read");
        };

        assert.throws(() => arrUnion(Object.defineProperty({ length: 2 ** 32 }, 0, { get: read }) as any), RangeError);
        assert.throws(() => arrUnion([1], Object.defineProperty({ length: Infinity }, 0, { get: read }) as any), RangeError);
    });

    it("reads the length of an array once", () => {
        let lengthReads = 0;
        const values: any = {
            0: 1,
            1: 2,
            get length() {
                lengthReads++;
                return 2;
            }
        };

        assert.deepEqual(arrUnion(values, [2, 3]), [1, 2, 3]);
        assert.equal(lengthReads, 1);
    });

    it("reads an array-like with the longest length an array can be (2^32 - 1)", () => {
        const values = Object.defineProperty({ length: 2 ** 32 - 1 }, 0, {
            get: () => {
                throw new Error("Read");
            }
        });

        // It isn't a RangeError, as index 0 is read
        assert.throws(() => arrUnion(values as any), Error, "Read");
    });

    it("adds a missing index as undefined, rather than an index added to Array.prototype", () => {
        const arrProto: any = Array.prototype;
        const args = (function (a: any, b: any, c: any) {
            delete arguments[1];
            return arguments;
        })("a", "b", "c");
        let results: any[][];

        try {
            arrProto[1] = "P";
            results = [arrUnion({ length: 3, 0: "a", 2: "c" }), arrUnion(args as any)];
        } finally {
            delete arrProto[1];
        }

        assert.deepEqual(results, [["a", undefined, "c"], ["a", undefined, "c"]]);
    });
});
