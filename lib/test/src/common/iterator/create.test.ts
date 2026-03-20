/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { throwError } from "../../../../src/helpers/throw";
import { createArrayIterator } from "../../../../src/iterator/array";
import { iterForOf } from "../../../../src/iterator/forOf";
import { createIterable, createIterableIterator, createIterator, CreateIteratorContext } from "../../../../src/iterator/create";
import { getKnownSymbol } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";
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
            assert.equal(done, false, "Check that the return was called");
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

    describe("createIterableIterator", () => {
        it("satisfies Iterator protocol via next()", () => {
            let theValues = [5, 10, 15];
            let idx = -1;
            let theIterator = createIterableIterator<number>({
                n: function() {
                    idx++;
                    let isDone = idx >= theValues.length;
                    if (!isDone) {
                        this.v = theValues[idx];
                    }
                    return isDone;
                }
            });

            let r1 = theIterator.next();
            assert.equal(r1.done, false);
            assert.equal(r1.value, 5);

            let r2 = theIterator.next();
            assert.equal(r2.done, false);
            assert.equal(r2.value, 10);

            let r3 = theIterator.next();
            assert.equal(r3.done, false);
            assert.equal(r3.value, 15);

            let r4 = theIterator.next();
            assert.equal(r4.done, true);
        });

        it("Symbol.iterator() returns itself", () => {
            let theIterator = createIterableIterator<number>({
                n: function() {
                    return true;
                }
            });

            let itSymbol = getKnownSymbol(WellKnownSymbols.iterator);
            let iterFn = (theIterator as any)[itSymbol];
            assert.ok(typeof iterFn === "function", "[Symbol.iterator] must be a function");
            assert.strictEqual(iterFn.call(theIterator), theIterator,
                "[Symbol.iterator]() must return the iterator itself");
        });

        it("satisfies Iterable protocol via iterForOf", () => {
            let theValues = [5, 10, 15, 20, 25, 30];
            let idx = -1;
            let theIterator = createIterableIterator<number>({
                n: function() {
                    idx++;
                    let isDone = idx >= theValues.length;
                    if (!isDone) {
                        this.v = theValues[idx];
                    }
                    return isDone;
                }
            });

            let values: number[] = [];
            iterForOf(theIterator, (value) => {
                values.push(value);
            });

            assert.equal(values.length, 6, "" + dumpObj(values));
            assert.equal(values[0], 5);
            assert.equal(values[1], 10);
            assert.equal(values[2], 15);
            assert.equal(values[3], 20);
            assert.equal(values[4], 25);
            assert.equal(values[5], 30);
        });

        it("partial next() then iterForOf continues from same position", () => {
            // [Symbol.iterator]() returns self, so the iterable and iterator share state.
            let theValues = [1, 2, 3, 4, 5];
            let idx = -1;
            let theIterator = createIterableIterator<number>({
                n: function() {
                    idx++;
                    let isDone = idx >= theValues.length;
                    if (!isDone) {
                        this.v = theValues[idx];
                    }
                    return isDone;
                }
            });

            // Consume first two elements via direct next() calls.
            assert.equal(theIterator.next().value, 1);
            assert.equal(theIterator.next().value, 2);

            // iterForOf should see only the remaining three elements.
            let remaining: number[] = [];
            iterForOf(theIterator, (value) => {
                remaining.push(value);
            });

            assert.equal(remaining.length, 3);
            assert.equal(remaining[0], 3);
            assert.equal(remaining[1], 4);
            assert.equal(remaining[2], 5);
        });

        it("return callback is invoked on early iterForOf exit", () => {
            let done = false;
            let idx = -1;
            let theValues = [1, 2, 3, 4, 5];
            let theIterator = createIterableIterator<number>({
                n: function() {
                    idx++;
                    let isDone = idx >= theValues.length;
                    if (!isDone) {
                        this.v = theValues[idx];
                    }
                    return isDone;
                },
                r: function(value) {
                    done = true;
                    return value;
                }
            });

            let values: number[] = [];
            iterForOf(theIterator, (value) => {
                values.push(value);
                if (values.length === 2) {
                    return -1; // signal early exit
                }
            });

            assert.equal(done, true, "return callback must be called on early exit");
            assert.equal(values.length, 2);
        });

        it("throw callback is invoked on iterForOf error", () => {
            let thrown = false;
            let idx = -1;
            let theValues = [1, 2, 3];
            let theIterator = createIterableIterator<number>({
                n: function() {
                    idx++;
                    let isDone = idx >= theValues.length;
                    if (!isDone) {
                        this.v = theValues[idx];
                    }
                    return isDone;
                },
                t: function(value) {
                    thrown = true;
                    return value;
                }
            });

            try {
                iterForOf(theIterator, (value) => {
                    if (value === 2) {
                        throwError("stop!");
                    }
                });
                assert.ok(false, "exception should have propagated");
            } catch (e) {
                assert.ok(true, "expected exception caught");
            }

            assert.equal(thrown, true, "throw callback must be called when iterForOf body throws");
        });

        it("empty sequence returns done immediately", () => {
            let theIterator = createIterableIterator<number>({
                n: function() {
                    return true;
                }
            });

            let values: number[] = [];
            iterForOf(theIterator, (value) => {
                values.push(value);
            });

            assert.equal(values.length, 0, "no values should have been produced");
            assert.equal(theIterator.next().done, true, "next() must also be done");
        });

        it("with no next function returns done immediately", () => {
            let theIterator = createIterableIterator<number>({
                n: null as any
            });

            let values: number[] = [];
            iterForOf(theIterator, (value) => {
                values.push(value);
            });

            assert.equal(values.length, 0, "null next should produce no values");
        });
    });
});