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

    it("should read the length for each next(), like the native iterator", () => {
        const getKeys = (keysFn: (value: any) => Iterator<number>) => {
            let values = ["a"];
            let iter = keysFn(values);
            let result: number[] = [];
            let next = iter.next();
            while (!next.done) {
                result.push(next.value);
                if (values.length < 3) {
                    // Grow the array while it is being iterated
                    values.push("b");
                }

                next = iter.next();
            }

            // Once done, it stays done (even when the array grows again)
            values.push("c");
            assert.isTrue(iter.next().done, "Stays done");

            return result;
        };

        assert.deepEqual(getKeys(polyArrKeys), [0, 1, 2]);

        if (([] as any).keys) {
            assert.deepEqual(getKeys((value) => (Array.prototype.keys as any).call(value)), [0, 1, 2], "Array.prototype.keys");
        }
    });

    it("should not read the length until next() is called, and only move the index once it has been read", () => {
        let reads = 0;
        let fail = false;
        let value: any = {
            0: "a",
            1: "b",
            get length() {
                reads++;
                if (fail) {
                    fail = false;
                    throw new Error("length");
                }

                return 2;
            }
        };

        const check = (keysFn: (value: any) => Iterator<number>, name: string) => {
            reads = 0;
            let iter = keysFn(value);
            assert.equal(reads, 0, name + ": the length isn't read when the iterator is created");
            assert.deepEqual(iter.next(), { value: 0, done: false }, name);
            fail = true;
            assert.throws(() => iter.next(), "length");
            assert.deepEqual(iter.next(), { value: 1, done: false }, name + ": the index didn't move when the length threw");
            let last = iter.next();
            assert.isTrue(last.done, name + ": done");
            assert.isUndefined(last.value, name + ": no value");
            assert.equal(reads, 4, name + ": the length is read by each next()");
        };

        check(polyArrKeys, "polyArrKeys");
        if (([] as any).keys) {
            check((theValue) => (Array.prototype.keys as any).call(theValue), "Array.prototype.keys");
        }
    });
});
