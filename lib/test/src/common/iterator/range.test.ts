/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { createRangeIterator } from "../../../../src/iterator/range";
import { iterForOf } from "../../../../src/iterator/forOf";
import { dumpObj } from "../../../../src/helpers/diagnostics";


describe("create iterator helpers", () => {
    it("range iterator", () => {
        let cnt = 0;
        iterForOf(createRangeIterator(0, -1, 1), (value) => {
            assert.ok(false, "There should be no elements")
            cnt++;
        });

        assert.equal(cnt, 0, "No iterators should have occurred");

        cnt = 0;
        let values: number[] = [];
        iterForOf(createRangeIterator(1, 1), (value) => {
            cnt++;
            values.push(value);
        });

        assert.equal(cnt, 1, "No iterators should have occurred");
        assert.equal(values[0], 1, "First value should be correct");

        cnt = 0;
        values = [];
        iterForOf(createRangeIterator(10, null as any), (value) => {
            cnt++;
            values.push(value);
        });

        assert.equal(cnt, 1, "No iterators should have occurred");
        assert.equal(values[0], 10, "First value should be correct");

        cnt = 0;
        values = [];
        iterForOf(createRangeIterator(-10, undefined as any), (value) => {
            cnt++;
            values.push(value);
        });

        assert.equal(cnt, 1, "No iterators should have occurred");
        assert.equal(values[0], -10, "First value should be correct");

        cnt = 0;
        values = [];
        iterForOf(createRangeIterator(5, 20, 5), (value) => {
            cnt++;
            values.push(value);
        });

        assert.equal(cnt, 4, "4 iterations should have occurred - " + dumpObj(values));
        assert.equal(values[0], 5);
        assert.equal(values[1], 10);
        assert.equal(values[2], 15);
        assert.equal(values[3], 20);

        cnt = 0;
        values = [];
        iterForOf(createRangeIterator(20, 5, -5), (value) => {
            cnt++;
            values.push(value);
        });

        assert.equal(cnt, 4, "4 iterations should have occurred");
        assert.equal(values[0], 20);
        assert.equal(values[1], 15);
        assert.equal(values[2], 10);
        assert.equal(values[3], 5);

        cnt = 0;
        values = [];
        iterForOf(createRangeIterator(20, 15), (value) => {
            cnt++;
            values.push(value);
        });

        assert.equal(cnt, 6, "6 iterations should have occurred");
        assert.equal(values[0], 20);
        assert.equal(values[1], 19);
        assert.equal(values[2], 18);
        assert.equal(values[3], 17);
        assert.equal(values[4], 16);
        assert.equal(values[5], 15);

        cnt = 0;
        values = [];
        iterForOf(createRangeIterator(-1, 1), (value) => {
            cnt++;
            values.push(value);
        });

        assert.equal(cnt, 3, "3 iterations should have occurred");
        assert.equal(values[0], -1);
        assert.equal(values[1], 0);
        assert.equal(values[2], 1);


        cnt = 0;
        values = [];
        iterForOf(createRangeIterator(1, -1), (value) => {
            cnt++;
            values.push(value);
        });

        assert.equal(cnt, 3, "3 iterations should have occurred");
        assert.equal(values[0], 1);
        assert.equal(values[1], 0);
        assert.equal(values[2], -1);
    });
});