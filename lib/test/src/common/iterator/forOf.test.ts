/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { createArrayIterator } from "../../../../src/iterator/array";
import { iterForOf } from "../../../../src/iterator/forOf";
import { createRangeIterator } from "../../../../src/iterator/range";
import { objKeys } from "../../../../src/object/object";


describe("create iterator helpers", () => {
    describe("iterForOf", () => {
        it("null / undefined", () => {
            let cnt = 0;
            iterForOf(null as any, () => {
                assert.ok(false, "There should be no elements")
                cnt++;
            });

            assert.equal(cnt, 0, "No iterators should have occurred");

            cnt = 0;
            iterForOf(undefined as any, () => {
                assert.ok(false, "There should be no elements")
                cnt++;
            });
            assert.equal(cnt, 0, "No iterators should have occurred");

        });

        it("With iterable values", () => {
            let cnt = 0;
            iterForOf([], (value) => {
                assert.ok(false, "There should be no elements")
                cnt++;
            });

            assert.equal(cnt, 0, "No iterators should have occurred");

            cnt = 0;
            let values: number[] = [];
            iterForOf([1], (value) => {
                cnt++;
                values.push(value);
            });

            assert.equal(cnt, 1, "One iteration should have occurred");
            assert.equal(values[0], 1, "First value should be correct");

            cnt = 0;
            values = [];
            iterForOf([10, 20, 5, 15], (value) => {
                cnt++;
                values.push(value);
            });

            assert.equal(cnt, 4, "4 iterations should have occurred");
            assert.equal(values[0], 10);
            assert.equal(values[1], 20);
            assert.equal(values[2], 5);
            assert.equal(values[3], 15);

            cnt = 0;
            let testObj = {};
            iterForOf(objKeys(testObj), (value) => {
                assert.ok(false, "There should be no elements")
                cnt++;
            });
            assert.equal(cnt, 0, "No iterations should have occurred");

            cnt = 0;
            testObj = {
                item1: "value1",
                item2: "value2",
                item3: "value3"
            };
            
            let strValues: string[] = [];
            iterForOf(objKeys(testObj), (value) => {
                strValues.push(value);
                cnt++;
            });
            assert.equal(cnt, 3, "3 iterations should have occurred");
            assert.equal(strValues[0], "item1");
            assert.equal(strValues[1], "item2");
            assert.equal(strValues[2], "item3");

            cnt = 0;
            iterForOf({} as any, (value) => {
                assert.ok(false, "There should be no elements")
                cnt++;
            });
            assert.equal(cnt, 0, "No iterations should have occurred");
        });

        it("With iterator values", () => {
            let cnt = 0;
            iterForOf(createArrayIterator([]), (value) => {
                assert.ok(false, "There should be no elements")
                cnt++;
            });

            assert.equal(cnt, 0, "No iterations should have occurred");

            cnt = 0;
            iterForOf(createArrayIterator(null as any), (value) => {
                assert.ok(false, "There should be no elements")
                cnt++;
            });

            assert.equal(cnt, 0, "No iterations should have occurred");

            cnt = 0;
            iterForOf(createArrayIterator(undefined as any), (value) => {
                assert.ok(false, "There should be no elements")
                cnt++;
            });

            assert.equal(cnt, 0, "No iterations should have occurred");

            cnt = 0;
            let values: number[] = [];
            iterForOf(createArrayIterator([1]), (value) => {
                cnt++;
                values.push(value);
            });

            assert.equal(cnt, 1, "1 iterations should have occurred");
            assert.equal(values[0], 1, "First value should be correct");

            cnt = 0;
            values = [];
            iterForOf(createArrayIterator([10, 20, 5, 15]), (value) => {
                cnt++;
                values.push(value);
            });

            assert.equal(cnt, 4, "4 iterations should have occurred");
            assert.equal(values[0], 10);
            assert.equal(values[1], 20);
            assert.equal(values[2], 5);
            assert.equal(values[3], 15);
        });

        it("stop processing", () => {
            let cnt = 0;
            let values: number[] = [];
            iterForOf(createArrayIterator([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), (value) => {
                cnt++;
                values.push(value);
                if (cnt == 2) {
                    return -1;
                }
            });

            assert.equal(cnt, 2, "2 iterations should have occurred");
            assert.equal(values[0], 0);
            assert.equal(values[1], 1);

            cnt = 0;
            values = [];
            iterForOf(createRangeIterator(10, 2000, 10), (value) => {
                cnt++;
                values.push(value);
                if (cnt == 2) {
                    return -1;
                }
            });

            assert.equal(cnt, 2, "No iterations should have occurred");
            assert.equal(values[0], 10);
            assert.equal(values[1], 20);
        });
    });
});