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
import { arrForEach } from "../../../../src/array/forEach";
import { getKnownSymbol } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";


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

        it("omitting or passing null/undefined thisArg falls back to the iterator", () => {
            let capturedThis: any;

            // omitted thisArg → falls back to the iterator
            const iter1 = createArrayIterator([1]);
            iterForOf(iter1, function(this: any) {
                capturedThis = this;
            });
            assert.strictEqual(capturedThis, iter1, "omitting thisArg should use the iterator as this");

            // explicit undefined → same as omitted
            const iter2 = createArrayIterator([1]);
            iterForOf(iter2, function(this: any) {
                capturedThis = this;
            }, undefined);
            assert.strictEqual(capturedThis, iter2, "explicit undefined thisArg should use the iterator as this");

            // null → same as undefined, falls back to iterator
            const iter3 = createArrayIterator([1]);
            iterForOf(iter3, function(this: any) {
                capturedThis = this;
            }, null);
            assert.strictEqual(capturedThis, iter3, "null thisArg should use the iterator as this");
        });

        it("falsy-but-not-null/undefined thisArg values are used as-is", () => {
            let capturedThis: any;

            iterForOf(createArrayIterator([1]), function(this: any) {
                capturedThis = this;
            }, 0);
            assert.strictEqual(capturedThis, 0, "thisArg of 0 should be used as-is");

            iterForOf(createArrayIterator([1]), function(this: any) {
                capturedThis = this;
            }, "");
            assert.strictEqual(capturedThis, "", "thisArg of empty string should be used as-is");

            iterForOf(createArrayIterator([1]), function(this: any) {
                capturedThis = this;
            }, false);
            assert.strictEqual(capturedThis, false, "thisArg of false should be used as-is");
        });

        it("an iterable which also has a next() function is processed using its [Symbol.iterator]()", () => {
            // Like a jQuery collection, whose next() function returns the next sibling elements (another collection)
            // rather than an iterator result, so using it as the iterator never finishes
            let nextCalls = 0;
            let collection: any = {
                0: "a",
                1: "b",
                length: 2,
                next: function() {
                    nextCalls++;
                    return collection;
                }
            };

            collection[getKnownSymbol(WellKnownSymbols.iterator)] = function() {
                return createArrayIterator(["a", "b"]);
            };

            let values: string[] = [];
            iterForOf(collection, (value: string) => {
                values.push(value);
            });

            assert.deepEqual(values, ["a", "b"], "The values from the [Symbol.iterator]() iterator should be processed");
            assert.equal(nextCalls, 0, "The next() function of the iterable should not be called");
        });

        it("an iterator whose [Symbol.iterator]() returns itself is processed once", () => {
            let idx = 0;
            let iter: any = {
                next: function() {
                    idx++;
                    return idx > 3 ? { done: true, value: undefined } : { done: false, value: idx };
                }
            };

            iter[getKnownSymbol(WellKnownSymbols.iterator)] = function() {
                return iter;
            };

            let values: number[] = [];
            iterForOf(iter, (value: number) => {
                values.push(value);
            });

            assert.deepEqual(values, [1, 2, 3]);
        });

        it("throws a TypeError when next() returns a value which is not an object", () => {
            arrForEach([undefined, null, 1, true, "result"], (result) => {
                let returnCalls = 0;
                let callbackCalls = 0;
                let iter = {
                    next: () => result,
                    return: (): IteratorResult<number> => {
                        returnCalls++;
                        return { done: true, value: undefined };
                    }
                };

                assert.throws(() => {
                    iterForOf(iter as any, () => {
                        callbackCalls++;
                    });
                }, TypeError);

                assert.equal(callbackCalls, 0, "The callbackfn should not be called for a next() result of " + result);
                assert.equal(returnCalls, 0, "The iterator should not be closed for a next() result of " + result);
            });
        });

        it("closes the iterator by calling return() with no arguments when the callbackfn returns -1", () => {
            let idx = 0;
            let returnArgs: any[] = [];
            let iter: Iterator<number> = {
                next: () => {
                    return { done: false, value: idx++ };
                },
                return: function() {
                    returnArgs.push(arguments.length);
                    return { done: true, value: undefined };
                }
            };

            let values: number[] = [];
            iterForOf(iter, (value) => {
                values.push(value);
                if (values.length === 2) {
                    return -1;
                }
            });

            assert.deepEqual(values, [0, 1]);
            assert.equal(returnArgs.length, 1, "return() should be called once");
            assert.equal(returnArgs[0], 0, "return() should be called with no arguments");
        });

        it("closes the iterator by calling return() rather than throw() when the callbackfn throws", () => {
            let returnCalls = 0;
            let throwCalls = 0;
            let iter = {
                next: (): IteratorResult<number> => {
                    return { done: false, value: 1 };
                },
                return: (): IteratorResult<number> => {
                    returnCalls++;
                    return { done: true, value: undefined };
                },
                throw: (): IteratorResult<number> => {
                    throwCalls++;
                    return { done: true, value: undefined };
                }
            };

            let error = new Error("callbackfn failed");
            let caught: any;
            try {
                iterForOf(iter, () => {
                    throw error;
                });
            } catch (e) {
                caught = e;
            }

            assert.strictEqual(caught, error, "The error thrown by the callbackfn should be thrown");
            assert.equal(returnCalls, 1, "return() should be called once");
            assert.equal(throwCalls, 0, "throw() should not be called");
        });

        it("throws the error from the callbackfn rather than the error thrown by return()", () => {
            let iter = {
                next: () => {
                    return { done: false, value: 1 };
                },
                return: (): IteratorResult<number> => {
                    throw new Error("return failed");
                }
            };

            let error = new Error("callbackfn failed");
            let caught: any;
            try {
                iterForOf(iter, () => {
                    throw error;
                });
            } catch (e) {
                caught = e;
            }

            assert.strictEqual(caught, error, "The error thrown by the callbackfn should be thrown");
        });

        it("throws the error thrown by return() when the callbackfn returns -1", () => {
            let returnError = new Error("return failed");
            let iter = {
                next: () => {
                    return { done: false, value: 1 };
                },
                return: (): IteratorResult<number> => {
                    throw returnError;
                }
            };

            let caught: any;
            try {
                iterForOf(iter, () => {
                    return -1;
                });
            } catch (e) {
                caught = e;
            }

            assert.strictEqual(caught, returnError, "The error thrown by return() should be thrown");
        });

        it("does not close the iterator when next() throws", () => {
            let returnCalls = 0;
            let error = new Error("next failed");
            let iter = {
                next: (): IteratorResult<number> => {
                    throw error;
                },
                return: (): IteratorResult<number> => {
                    returnCalls++;
                    return { done: true, value: undefined };
                }
            };

            let caught: any;
            try {
                iterForOf(iter, () => {
                    assert.ok(false, "The callbackfn should not be called");
                });
            } catch (e) {
                caught = e;
            }

            assert.strictEqual(caught, error, "The error thrown by next() should be thrown");
            assert.equal(returnCalls, 0, "return() should not be called");
        });

        it("does not close the iterator when it is done", () => {
            let returnCalls = 0;
            let idx = 0;
            let iter: Iterator<number> = {
                next: (): IteratorResult<number> => {
                    idx++;
                    return idx > 2 ? { done: true, value: undefined } : { done: false, value: idx };
                },
                return: (): IteratorResult<number> => {
                    returnCalls++;
                    return { done: true, value: undefined };
                }
            };

            let values: number[] = [];
            iterForOf(iter, (value: number) => {
                values.push(value);
            });

            assert.deepEqual(values, [1, 2]);
            assert.equal(returnCalls, 0, "return() should not be called");
        });
    });
});