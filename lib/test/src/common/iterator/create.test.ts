/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { throwError } from "../../../../src/helpers/throw";
import { createArrayIterator } from "../../../../src/iterator/array";
import { createIterable, createIterator, CreateIteratorContext } from "../../../../src/iterator/create";
import { iterForOf } from "../../../../src/iterator/forOf";
import { objKeys } from "../../../../src/object/object";


describe("create iterator helpers", () => {
    describe("createArrayIterator", () => {
        it("null / undefined", () => {
            let cnt = 0;
            iterForOf(createArrayIterator(null as any), () => {
                assert.ok(false, "There should be no elements")
                cnt++;
            });

            assert.equal(cnt, 0, "No iterators should have occurred");

            cnt = 0;
            iterForOf(createArrayIterator(undefined as any), () => {
                assert.ok(false, "There should be no elements")
                cnt++;
            });
            assert.equal(cnt, 0, "No iterators should have occurred");

        });

        it("With values", () => {
            let cnt = 0;
            iterForOf(createArrayIterator([]), (value) => {
                assert.ok(false, "There should be no elements")
                cnt++;
            });

            assert.equal(cnt, 0, "No iterators should have occurred");

            cnt = 0;
            let values: number[] = [];
            iterForOf(createArrayIterator([1]), (value) => {
                cnt++;
                values.push(value);
            });

            assert.equal(cnt, 1, "No iterators should have occurred");
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

            cnt = 0;
            let testObj = {};
            iterForOf(createArrayIterator(objKeys(testObj)), (value) => {
                assert.ok(false, "There should be no elements")
                cnt++;
            });
            assert.equal(cnt, 0, "No iterators should have occurred");

            cnt = 0;
            testObj = {
                item1: "value1",
                item2: "value2",
                item3: "value3"
            };
            
            let strValues: string[] = [];
            iterForOf(createArrayIterator(objKeys(testObj)), (value) => {
                strValues.push(value);
                cnt++;
            });
            assert.equal(cnt, 3, "3 iterations should have occurred");
            assert.equal(strValues[0], "item1");
            assert.equal(strValues[1], "item2");
            assert.equal(strValues[2], "item3");
        });
    });

    describe("createIterable", () => {
        it("inline", () => {
            let idx = -1;
            let theValues = [ 5, 10, 15, 20, 25, 30 ];

            function getNextFn() {
                idx++;
                let isDone = idx >= theValues.length;
                if (!isDone) {
                    this.v = theValues[idx];
                }
                    
                return isDone;
            }

            let theIterator = createIterator<number>({ n: getNextFn });
            
            let values: number[] = [];
            iterForOf(theIterator, (value) => {
                values.push(value);
            });

            assert.equal(values.length, 6);
            assert.equal(values[0], 5);
            assert.equal(values[1], 10);
            assert.equal(values[2], 15);
            assert.equal(values[3], 20);
            assert.equal(values[4], 25);
            assert.equal(values[5], 30);
        });

        it("iterForOf", () => {
            let current = 0;
            let next = 1;
            let done = false;
            let fibCtx: CreateIteratorContext<number> = {
                n: function() {
                    fibCtx.v = current;
                    current = next;
                    next = fibCtx.v + next;

                    // Return not done
                    return false;
                },
                r: function(value) {
                    done = true;
                    return value;
                }
            };

            let values: number[] = [];
            iterForOf(createIterable(fibCtx), (value) => {
                values.push(value);
                if (values.length === 10) {
                    return -1;
                }
            });

            assert.equal(done, true, "Check that the return was called");
            assert.equal(values.length, 10, "" + dumpObj(values));
            assert.equal(values[0], 0, "0:" + dumpObj(values));
            assert.equal(values[1], 1, "1:" + dumpObj(values));
            assert.equal(values[2], 1, "2:" + dumpObj(values));
            assert.equal(values[3], 2, "3:" + dumpObj(values));
            assert.equal(values[4], 3, "4:" + dumpObj(values));
            assert.equal(values[5], 5, "5:" + dumpObj(values));
            assert.equal(values[6], 8, "6:" + dumpObj(values));
            assert.equal(values[7], 13, "7:" + dumpObj(values));
            assert.equal(values[8], 21, "8:" + dumpObj(values));
            assert.equal(values[9], 34, "9:" + dumpObj(values));
        });

        it("with no next function", () => {
            let done = false;
            let fibCtx: CreateIteratorContext<number> = {
                n: null as any,
                r: function(value) {
                    done = true;
                    return value;
                }
            };

            iterForOf(createIterable(fibCtx), (value) => {
                assert.ok(false, "Should not be called");
            });

            assert.equal(done, false, "Check that the return was not called as it doesn't need to be");
        });

        it("with throw", () => {
            let current = 0;
            let next = 1;
            let done = false;
            let thrown = false;
            let fibCtx: CreateIteratorContext<number> = {
                n: function() {
                    fibCtx.v = current;
                    current = next;
                    next = fibCtx.v + next;

                    // Return not done
                    return false;
                },
                r: function(value) {
                    done = true;
                    return value;
                },
                t: function (value) {
                    thrown = true;
                    return value;
                }
            };

            let values: number[] = [];
            try {
                iterForOf(createIterable(fibCtx), (value) => {
                    values.push(value);
                    if (values.length === 10) {
                        throwError("Fail!");
                    }
                });
                assert.ok(false, "The exception should have been thrown");
            } catch (e) {
                assert.ok(true, "Expected the exception to be thrown");
            }
    
            assert.equal(done, false, "Check that the return was called");
            assert.equal(thrown, true, "Check that the throw was called");
            assert.equal(values.length, 10, "" + dumpObj(values));
            assert.equal(values[0], 0, "0:" + dumpObj(values));
            assert.equal(values[1], 1, "1:" + dumpObj(values));
            assert.equal(values[2], 1, "2:" + dumpObj(values));
            assert.equal(values[3], 2, "3:" + dumpObj(values));
            assert.equal(values[4], 3, "4:" + dumpObj(values));
            assert.equal(values[5], 5, "5:" + dumpObj(values));
            assert.equal(values[6], 8, "6:" + dumpObj(values));
            assert.equal(values[7], 13, "7:" + dumpObj(values));
            assert.equal(values[8], 21, "8:" + dumpObj(values));
            assert.equal(values[9], 34, "9:" + dumpObj(values));
        });
    });
});