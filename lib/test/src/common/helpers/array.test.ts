/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrAppend } from "../../../../src/array/append";
import { arrChunk } from "../../../../src/array/chunk";
import { arrCompact } from "../../../../src/array/compact";
import { arrFind, arrFindIndex, arrFindLast, arrFindLastIndex } from "../../../../src/array/find";
import { arrFlatten } from "../../../../src/array/flatten";
import { arrFrom } from "../../../../src/array/from";
import { arrGroupBy } from "../../../../src/array/groupBy";
import { arrSome } from "../../../../src/array/some";
import { arrForEach } from "../../../../src/array/forEach";
import { arrContains, arrIncludes } from "../../../../src/array/includes";
import { arrIndexOf, arrLastIndexOf } from "../../../../src/array/indexOf";
import { arrEvery, arrFilter } from "../../../../src/array/every";
import { arrMap } from "../../../../src/array/map";
import { arrReduce } from "../../../../src/array/reduce";
import { arrSlice } from "../../../../src/array/slice";
import { arrUnique } from "../../../../src/array/unique";
import { dumpObj } from "../../../../src/helpers/diagnostics";

describe("array helpers", () => {
    describe("arrForEach", () => {
        it("Validate passing null values doesn't throw", () => {
            arrForEach(null, null);
            arrForEach(null, null, null);
            assert.ok(true, "Passing null values");
        });
    
        it("Validate passing undefined values doesn't throw", () => {
            arrForEach(undefined, undefined);
            arrForEach(undefined, undefined, undefined);
            assert.ok(true, "Passing null values");
        });
    
        it("Validate passing undefined callback doesn't throw", () => {
            arrForEach([], undefined);
            arrForEach([], undefined, undefined);
            assert.ok(true, "Passing null values");
        });
    
        it("Validate passing processing all entries", () => {
            let values = [ 1, 2, 3, 4 ];
            let cnt = 0;
            arrForEach(values, (value) => {
                cnt++;
            });
    
            assert.equal(cnt, 4, "Expecting 4 callbacks");
        });

        it("example 3 - array like", () => {
            const arrayLike = {
                length: 3,
                0: 2,
                1: 7.3,
                2: 4
            };

            let cnt = 0;
            arrForEach(arrayLike, (value) => {
                cnt++;
            });

            assert.equal(cnt, 3, "Expecting 3 callbacks");
        });

    
        it("Validate passing processing all entries even when invalid or missing", () => {
            let values = [ 1, 2, 3, null, 4, undefined ];
            let expected = values.length;
            let cnt = 0;
            arrForEach(values, (value) => {
                cnt++;
            });
    
            assert.equal(cnt, expected, "Expecting " + expected + " callbacks");
    
            // validate deleting an entry
            values = [ 1, 2, 3, null, 4, undefined ];
            expected = values.length;
            delete values[1];
            expected --;
    
            cnt = 0;
            arrForEach(values, (value) => {
                cnt++;
            });
    
            assert.equal(cnt, expected, "Expecting " + expected + " callbacks after deleting");
    
            values = [ 1, 2, 3, null, 4, undefined ];
            expected = values.length;
            cnt = 0;
            arrForEach(values, (value) => {
                cnt++;
                if (cnt > 2) {
                    // delete older entries
                    delete values[cnt-2];
                }
            });
    
            assert.equal(cnt, expected, "Expecting " + expected + " callbacks after deleting already visited entries");
        });
    
        it("Validate stopping iteration ", () => {
            let values = [ 1, 2, -1, 4 ];
            let cnt = 0;
            arrForEach(values, (value) => {
                cnt++;
                if (value < 0) {
                    return -1;
                }
            });
    
            assert.equal(cnt, 3, "Expecting 3 callbacks");
    
            values = [ -1, 2, 3, 4 ];
            cnt = 0;
            arrForEach(values, (value) => {
                cnt++;
                if (value < 0) {
                    return -1;
                }
            });
    
            assert.equal(cnt, 1, "Expecting 1 callback");
        });

        it("Checking all params", () => {
            let values = [ 1, 2, 3, 4, 5 ];
            let result: number[] = [];
            let cnt = 0;
            arrForEach(values, (value, idx, theArray) => {
                assert.equal(values, theArray, "Check that the passed array is the actual array");
                assert.equal(value, values[idx], "Check that the passed value is the expected value");
                assert.equal(value, idx + 1, "Check the expected value matches");
                result.push(value);
                cnt++;
            });

            assert.equal(cnt, 5, "Check that we iterated the correct number of times");
            assert.equal(result.length, 5, "Check that the resulting array matches");
            for (let lp = 0; lp < result.length; lp++) {
                assert.equal(result[lp], values[lp], "Check that the resulting array matches");
            }

        });
    });

    describe("arrAppend", () => {
        it("Validate passing null values doesn't throw", () => {
            let target = arrAppend(null, null);
            assert.ok(true, "Passing null values");
            assert.equal(target, null, "Validate the target is returned");
            assert.equal(arrAppend(null, []), null, "Expected null response");
        });
    
        it("Validate passing undefined values doesn't throw", () => {
            let target = arrAppend(undefined, undefined);
            assert.ok(true, "Passing null values");
            assert.equal(target, undefined, "Validate the target is returned");
            assert.equal(arrAppend(undefined, []), null, "Expected null response");
        });

        it("Validate passing undefined values doesn't throw", () => {
            let target = arrAppend(undefined, undefined);
            assert.ok(true, "Passing null values");
            assert.equal(target, undefined, "Validate the target is returned");
            assert.equal(arrAppend(undefined, []), undefined, "Expected undefined response");
        });

        it("Should throw when passed target is not an array", () => {
            _expectThrow(() => {
                arrAppend({} as any, null);
            });
            _expectThrow(() => {
                arrAppend({} as any, []);
            });

            _expectThrow(() => {
                arrAppend("" as any, null);
            });
            _expectThrow(() => {
                arrAppend("" as any, []);
            });

            _expectThrow(() => {
                arrAppend(0 as any, null);
            });
            _expectThrow(() => {
                arrAppend(0 as any, []);
            });
        });

        it("Validate appending a single value", () => {
            let target: any[] = arrAppend([], undefined);
            assert.equal(target.length, 0, "Should have no elements");

            target = arrAppend([], 0);
            assert.equal(target.length, 1, "Should have 1 element");
            assert.equal(target[0], 0, "Should have value of zero");

            target = arrAppend([1], undefined);
            assert.equal(target.length, 1, "Should have 1 element");
            assert.equal(target[0], 1, "Should have value of 1");

            target = arrAppend([1], 2);
            assert.equal(target.length, 2, "Should have 1 element");
            assert.equal(target[0], 1, "Should have value of 1");
            assert.equal(target[1], 2, "Should have value of 2");
        });

        it("Validate appending values", () => {
            let target = arrAppend([], [] as number[]);
            assert.equal(target.length, 0, "Should have no elements");

            target = arrAppend([], [0]);
            assert.equal(target.length, 1, "Should have 1 element");
            assert.equal(target[0], 0, "Should have value of zero");

            target = arrAppend([1], []);
            assert.equal(target.length, 1, "Should have 1 element");
            assert.equal(target[0], 1, "Should have value of 1");

            target = arrAppend([1], [2]);
            assert.equal(target.length, 2, "Should have 1 element");
            assert.equal(target[0], 1, "Should have value of 1");
            assert.equal(target[1], 2, "Should have value of 2");
        });

        it("Validate with iterator", () => {
            let target = arrAppend([], ([] as number[]).values());
            assert.equal(target.length, 0, "Should have no elements");

            target = arrAppend([], [0].values());
            assert.equal(target.length, 1, "Should have 1 element");
            assert.equal(target[0], 0, "Should have value of zero");

            target = arrAppend([1], [].keys());
            assert.equal(target.length, 1, "Should have 1 element");
            assert.equal(target[0], 1, "Should have value of 1");

            target = arrAppend([1], [2].values());
            assert.equal(target.length, 2, "Should have 1 element");
            assert.equal(target[0], 1, "Should have value of 1");
            assert.equal(target[1], 2, "Should have value of 2");

            target = arrAppend([1], [2].keys());
            assert.equal(target.length, 2, "Should have 1 element");
            assert.equal(target[0], 1, "Should have value of 1");
            assert.equal(target[1], 0, "Should have value of 0 (the index from the first element)");
        });
    });

    describe("arrIndexOf", () => {

        it("with no args", () => {
            _expectThrow(() => {
                (arrIndexOf as any)();
            });
        });

        it("null / undefined", () => {
            _expectThrow(() => {
                arrIndexOf(null as any, null);
            });

            _expectThrow(() => {
                arrIndexOf(undefined as any, null);
            });
        });

        it("simple example 1", () => {
            const array = [2, 9, 9];
            assert.equal(arrIndexOf(array, 2), 0);
            assert.equal(arrIndexOf(array, 7), -1);
            assert.equal(arrIndexOf(array, 9, 2), 2);
            assert.equal(arrIndexOf(array, 2, -1), -1);
            assert.equal(arrIndexOf(array, 2, -3), 0);
        });
        
        it("example 2", () => {
            let indices: number[] = [];
            const array = ["a", "b", "a", "c", "a", "d"];
            const element = "a";
            let idx = arrIndexOf(array, element);
            while (idx !== -1) {
                indices.push(idx);
                idx = arrIndexOf(array, element, idx + 1);
            }

            assert.equal(indices.length, 3, "checking length");
            assert.equal(indices[0], 0, "1st");
            assert.equal(indices[1], 2, "2dn");
            assert.equal(indices[2], 4, "3rd");
        });

        it("example 3", () => {
            function updateVegetablesCollection (veggies: string[], veggie: string) {
                if (arrIndexOf(veggies, veggie) === -1) {
                    veggies.push(veggie);
                }
            }
            
            let veggies = ["potato", "tomato", "chillies", "green-pepper"];
            
            updateVegetablesCollection(veggies, "spinach");

            assert.equal(veggies.length, 5, "checking length - " + dumpObj(veggies));
            assert.equal(veggies[0], "potato");
            assert.equal(veggies[1], "tomato");
            assert.equal(veggies[2], "chillies");
            assert.equal(veggies[3], "green-pepper");
            assert.equal(veggies[4], "spinach");

            // New veggies collection is : potato,tomato,chillies,green-pepper,spinach
            updateVegetablesCollection(veggies, "spinach");
            assert.equal(veggies.length, 5, "checking length 2 - " + dumpObj(veggies));
            assert.equal(veggies[0], "potato");
            assert.equal(veggies[1], "tomato");
            assert.equal(veggies[2], "chillies");
            assert.equal(veggies[3], "green-pepper");
            assert.equal(veggies[4], "spinach");
        });

        it("array like", () => {
            let arrayLike = {
                length: 3,
                0: "potato",
                1: "tomato",
                2: "chillies",
                3: "green-pepper"
            };

            assert.equal(arrIndexOf(arrayLike, "potato"), 0);
            assert.equal(arrIndexOf(arrayLike, "tomato"), 1);
            assert.equal(arrIndexOf(arrayLike, "chillies"), 2);
            assert.equal(arrIndexOf(arrayLike, "green-pepper"), -1);
        });
    });

    describe("arrLastIndexOf", () => {

        it("with no args", () => {
            _expectThrow(() => {
                (arrLastIndexOf as any)();
            });
        });

        it("null / undefined", () => {
            _expectThrow(() => {
                arrLastIndexOf(null as any, null);
            });

            _expectThrow(() => {
                arrLastIndexOf(undefined as any, null);
            });
        });

        it("simple example 1", () => {
            const array = [2, 5, 9, 2];
            assert.equal(arrLastIndexOf(array, 2), 3);
            assert.equal(arrLastIndexOf(array, 7), -1);
            assert.equal(arrLastIndexOf(array, 2, 3), 3);
            assert.equal(arrLastIndexOf(array, 2, 2), 0);
            assert.equal(arrLastIndexOf(array, 2, -2), 0);
            assert.equal(arrLastIndexOf(array, 2, -1), 3);
        });
        
        it("example 2", () => {
            let indices: number[] = [];
            const array = ["a", "b", "a", "c", "a", "d"];
            const element = "a";
            let idx = arrLastIndexOf(array, element);
            while (idx !== -1) {
                indices.push(idx);
                idx = arrLastIndexOf(array, element, idx ? idx - 1 : -(array.length + 1));
            }

            assert.equal(indices.length, 3, "checking length");
            assert.equal(indices[0], 4, "1st");
            assert.equal(indices[1], 2, "2dn");
            assert.equal(indices[2], 0, "3rd");
        });

        it("example 3", () => {
            function updateVegetablesCollection (veggies: string[], veggie: string) {
                if (arrLastIndexOf(veggies, veggie) === -1) {
                    veggies.push(veggie);
                }
            }
            
            let veggies = ["potato", "tomato", "chillies", "green-pepper"];
            
            updateVegetablesCollection(veggies, "spinach");

            assert.equal(veggies.length, 5, "checking length - " + dumpObj(veggies));
            assert.equal(veggies[0], "potato");
            assert.equal(veggies[1], "tomato");
            assert.equal(veggies[2], "chillies");
            assert.equal(veggies[3], "green-pepper");
            assert.equal(veggies[4], "spinach");

            // New veggies collection is : potato,tomato,chillies,green-pepper,spinach
            updateVegetablesCollection(veggies, "spinach");
            assert.equal(veggies.length, 5, "checking length 2 - " + dumpObj(veggies));
            assert.equal(veggies[0], "potato");
            assert.equal(veggies[1], "tomato");
            assert.equal(veggies[2], "chillies");
            assert.equal(veggies[3], "green-pepper");
            assert.equal(veggies[4], "spinach");
        });

        it("array like", () => {
            let arrayLike = {
                length: 3,
                0: "potato",
                1: "tomato",
                2: "chillies",
                3: "green-pepper"
            };

            assert.equal(arrLastIndexOf(arrayLike, "potato"), 0);
            assert.equal(arrLastIndexOf(arrayLike, "tomato"), 1);
            assert.equal(arrLastIndexOf(arrayLike, "chillies"), 2);
            assert.equal(arrLastIndexOf(arrayLike, "green-pepper"), -1);
        });
    });

    describe("arrReduce", () => {
        it("example", () => {

            const getMax = (a: number, b: number) => Math.max(a, b);

            // callback is invoked for each element in the array starting at index 0
            assert.equal(arrReduce([1, 100], getMax, 50), 100);
            assert.equal(arrReduce([    50], getMax, 10), 50); // 50

            // callback is invoked once for element at index 1
            assert.equal(arrReduce([1, 100], getMax), 100);     // 100

            // callback is not invoked
            assert.equal(arrReduce([    50], getMax), 50);     // 50
            assert.equal(arrReduce([      ], getMax, 1), 1);  // 1
            _expectThrow(() => {
                arrReduce([      ], getMax);     // TypeError
            });
        });

        it("array like", () => {
            let arrayLike = {
                length: 3,
                0: 1,
                1: 50,
                2: 100,
                3: 200
            };

            const getMax = (a: number, b: number) => Math.max(a, b);

            assert.equal(arrReduce(arrayLike, getMax), 100);

            assert.equal(arrReduce({
                length: 3,
                0: 1,
                1: 50,
                3: 200
            }, getMax), 50);
        });

    });

    describe("arrMap", () => {
        it("example", () => {
            const kvArray = [
                { key: 1, value: 10 },
                { key: 2, value: 20 },
                { key: 3, value: 30 }
            ];

            const reformattedArray = arrMap(kvArray, ({ key, value}) => ({ [key]: value }));

            assert.equal(reformattedArray.length, 3);
            assert.equal(JSON.stringify(reformattedArray), "[{\"1\":10},{\"2\":20},{\"3\":30}]");
            assert.equal(JSON.stringify(kvArray), "[{\"key\":1,\"value\":10},{\"key\":2,\"value\":20},{\"key\":3,\"value\":30}]");

            // kvArray is still:
            // [{key: 1, value: 10},
            //  {key: 2, value: 20},
            //  {key: 3, value: 30}]
        });

        it("array like", () => {
            const kvArray = {
                length: 3,
                0: { key: 1, value: 10 },
                1: { key: 2, value: 20 },
                2: { key: 3, value: 30 }
            };

            const reformattedArray = arrMap(kvArray, ({ key, value}) => ({ [key]: value }));

            assert.equal(reformattedArray.length, 3);
            assert.equal(JSON.stringify(reformattedArray), "[{\"1\":10},{\"2\":20},{\"3\":30}]");
            assert.equal(JSON.stringify(kvArray), "{\"0\":{\"key\":1,\"value\":10},\"1\":{\"key\":2,\"value\":20},\"2\":{\"key\":3,\"value\":30},\"length\":3}");

            // kvArray is still:
            // [{key: 1, value: 10},
            //  {key: 2, value: 20},
            //  {key: 3, value: 30}]
        });
    });

    describe("arrEvery", () => {
        it("example", () => {
            function isBigEnough<T>(element: T, index: number, array: T[]) {
                return (element as any) >= 10;
            }

            assert.equal(arrEvery([12, 5, 8, 130, 44], isBigEnough), false); // false
            assert.equal(arrEvery([12, 54, 18, 130, 44], isBigEnough), true); // true

            const isSubset = <T>(array1: T[], array2: T[]) => arrEvery(array2, (element) => arrIncludes(array1, element));
          
            assert.equal(isSubset([1, 2, 3, 4, 5, 6, 7], [5, 7, 6]), true);
            assert.equal(isSubset([1, 2, 3, 4, 5, 6, 7], [5, 8, 7]), false);

            // eslint-disable-next-line no-sparse-arrays
            assert.equal(arrEvery([1, , 3], (x) => x !== undefined), true);

            // eslint-disable-next-line no-sparse-arrays
            assert.equal(arrEvery([2, , 2], (x) => x === 2), true);
        });

        it("array like", () => {
            function isBigEnough<T>(element: T, index: number, array: T[]) {
                return (element as any) >= 10;
            }

            assert.equal(arrEvery({ length: 5, 0: 12, 1: 5, 2: 8, 3: 130, 4: 44 }, isBigEnough), false); // false
            assert.equal(arrEvery({ length: 5, 0: 12, 1: 54, 2: 18, 3: 130, 4: 44 }, isBigEnough), true); // true

            const isSubset = <T>(array1: ArrayLike<T>, array2: ArrayLike<T>) => arrEvery(array2, (element) => arrIncludes(array1, element));
          
            assert.equal(isSubset([1, 2, 3, 4, 5, 6, 7], { length: 3, 0: 5, 1: 7, 2: 6}), true);
            assert.equal(isSubset([1, 2, 3, 4, 5, 6, 7], { length: 3, 0: 5, 1: 8, 2: 7}), false);

            assert.equal(isSubset({ length: 7, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 }, [ 5, 7, 6 ]), true);
            assert.equal(isSubset({ length: 7, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 }, [5, 8, 7]), false);

            assert.equal(isSubset({ length: 7, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 }, { length: 3, 0: 5, 1: 7, 2: 6}), true);
            assert.equal(isSubset({ length: 7, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 }, { length: 3, 0: 5, 1: 8, 2: 7}), false);

            // eslint-disable-next-line no-sparse-arrays
            assert.equal(arrEvery({ length: 3, 0: 1, 2: 3 }, (x) => x !== undefined), true);

            // eslint-disable-next-line no-sparse-arrays
            assert.equal(arrEvery({ length: 3, 0: 2, 2: 2}, (x) => x === 2), true);
        });
    });

    describe("arrSome", () => {
        it("example", () => {
            let called = 0;
            function isBigger<T>(element: T, index: number, array: T[]) {
                called++;
                return (element as any) >= 20;
            }

            called = 0;
            assert.equal(arrSome([12, 5, 8, 13, 19], isBigger), false); // false
            assert.equal(called, 5);
            called = 0;
            assert.equal(arrSome([12, 54, 18, 130, 44], isBigger), true); // true
            assert.equal(called, 2);
        });

        it("array like", () => {
            let called = 0;
            function checkAvailability<T>(chkValue: T) {
                return (theValue: T) => {
                    called++;
                    return theValue == chkValue;
                }
            }

            let arrayLike = {
                length: 30,
                0: "potato",
                10: "tomato",
                20: "chillies",
                30: "green-pepper"
            };

            called = 0;
            assert.equal(arrSome(arrayLike, checkAvailability("potato")), true);
            assert.equal(called, 1);
            called = 0;
            assert.equal(arrSome(arrayLike, checkAvailability("tomato")), true);
            assert.equal(called, 2);
            called = 0;
            assert.equal(arrSome(arrayLike, checkAvailability("chillies")), true);
            assert.equal(called, 3);
            called = 0;
            assert.equal(arrSome(arrayLike, checkAvailability("green-pepper")), false);
            assert.equal(called, 3);
        });
    });

    describe("arrIncludes", () => {
        it("example", () => {
            assert.equal(arrIncludes([1, 2, 3], 2), true);
            assert.equal(arrIncludes([1, 2, 3], 4), false);
            assert.equal(arrIncludes([1, 2, 3], 3, 3), false);
            assert.equal(arrIncludes([1, 2, 3], 3, -1), true);
            assert.equal(arrIncludes([1, 2, NaN], NaN), true);
            assert.equal(arrIncludes(["1", "2", "3"], 3 as any), false);
        });

        it("array like", () => {
            assert.equal(arrIncludes({ length: 3, 0: 1, 1: 2, 2: 3 }, 2), true);
            assert.equal(arrIncludes({ length: 3, 0: 1, 1: 2, 2: 3 }, 4), false);
            assert.equal(arrIncludes({ length: 3, 0: 1, 1: 2, 2: 3 }, 3, 3), false);
            assert.equal(arrIncludes({ length: 3, 0: 1, 1: 2, 2: 3 }, 3, -1), true);
            assert.equal(arrIncludes({ length: 3, 0: 1, 1: 2, 2: NaN }, NaN), true);
            assert.equal(arrIncludes({ length: 3, 0: "1", 1: "2", 2: "3"}, 3 as any), false);
        });
    });

    describe("arrContains", () => {
        it("example", () => {
            assert.equal(arrContains([1, 2, 3], 2), true);
            assert.equal(arrContains([1, 2, 3], 4), false);
            assert.equal(arrContains([1, 2, 3], 3, 3), false);
            assert.equal(arrContains([1, 2, 3], 3, -1), true);
            assert.equal(arrContains([1, 2, NaN], NaN), true);
            assert.equal(arrContains(["1", "2", "3"], 3 as any), false);
        });

        it("array like", () => {
            assert.equal(arrContains({ length: 3, 0: 1, 1: 2, 2: 3 }, 2), true);
            assert.equal(arrContains({ length: 3, 0: 1, 1: 2, 2: 3 }, 4), false);
            assert.equal(arrContains({ length: 3, 0: 1, 1: 2, 2: 3 }, 3, 3), false);
            assert.equal(arrContains({ length: 3, 0: 1, 1: 2, 2: 3 }, 3, -1), true);
            assert.equal(arrContains({ length: 3, 0: 1, 1: 2, 2: NaN }, NaN), true);
            assert.equal(arrContains({ length: 3, 0: "1", 1: "2", 2: "3"}, 3 as any), false);
        });
    });

    describe("arrFilter", () => {
        it("examples", () => {
            function isBigEnough<T>(value: T) {
                return (value as any) >= 10;
            }
            
            const filtered = arrFilter([12, 5, 8, 130, 44], isBigEnough);
            assert.deepEqual(filtered, [12, 130, 44]);

            const array = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
            
            function isPrime(num: number) {
                for (let i = 2; num > i; i++) {
                    if (num % i === 0) {
                        return false;
                    }
                }
                return num > 1;
            }

            assert.deepEqual(arrFilter(array, isPrime), [2, 3, 5, 7, 11, 13]);
        });

        it("array like", () => {
            function isBigEnough<T>(value: T) {
                return (value as any) >= 10;
            }
            
            const filtered = arrFilter({ length: 5, 0: 12, 1: 5, 2: 8, 3: 130, 4: 44 }, isBigEnough);
            assert.deepEqual(filtered, [12, 130, 44]);

            const arrayLike = { length: 17,
                0: -3,
                1: -2,
                2: -1,
                3: 0,
                4: 1,
                5: 2,
                6: 3,
                7: 4,
                8: 5,
                9: 6,
                10: 7,
                11: 8,
                12: 9,
                13: 10,
                14: 11,
                15: 12,
                16: 13
            };
            
            function isPrime(num: number) {
                for (let i = 2; num > i; i++) {
                    if (num % i === 0) {
                        return false;
                    }
                }
                return num > 1;
            }

            assert.deepEqual(arrFilter(arrayLike, isPrime), [2, 3, 5, 7, 11, 13]);
        });
    });

    describe("arrFind", () => {
        it ("example 1", () => {
            const inventory: Array<{ name: string, quantity: number}> = [
                { name: "apples", quantity: 2 },
                { name: "bananas", quantity: 0 },
                { name: "cherries", quantity: 5 }
            ];
            
            function isCherries(fruit: { name: string, quantity: number}) {
                return fruit.name === "cherries";
            }

            assert.deepEqual(arrFind(inventory, isCherries), { name: "cherries", quantity: 5 });
        });

        it("example 2", () => {
            function isPrime(element: number, index: number, array: number[]) {
                let start = 2;
                while (start <= Math.sqrt(element)) {
                    if (element % start++ < 1) {
                        return false;
                    }
                }

                return element > 1;
            }
              
            assert.equal(arrFind([4, 6, 8, 12], isPrime), undefined);
            assert.equal(arrFind([4, 5, 8, 12], isPrime), 5);
        });

        it("example 3 - array like", () => {
            const arrayLike = {
                length: 3,
                0: 2,
                1: 7.3,
                2: 4
            };

            assert.equal(arrFind(arrayLike, (x) => !Number.isInteger(x)), 7.3);
        });
    });

    describe("arrFindIndex", () => {
        it ("example 1", () => {
            const inventory: Array<{ name: string, quantity: number}> = [
                { name: "apples", quantity: 2 },
                { name: "bananas", quantity: 0 },
                { name: "cherries", quantity: 5 }
            ];
            
            function isCherries(fruit: { name: string, quantity: number}) {
                return fruit.name === "cherries";
            }

            assert.deepEqual(arrFindIndex(inventory, isCherries), 2);
        });

        it("example 2", () => {
            function isPrime(element: number) {
                if (element % 2 === 0 || element < 2) {
                    return false;
                }

                for (let factor = 3; factor <= Math.sqrt(element); factor += 2) {
                    if (element % factor === 0) {
                        return false;
                    }
                }

                return true;
            }
              
            assert.equal(arrFindIndex([4, 6, 8, 9, 12], isPrime), -1);
            assert.equal(arrFindIndex([4, 6, 7, 9, 12], isPrime), 2);
        });

        it("example 3 - array like", () => {
            const arrayLike = {
                length: 3,
                0: 2,
                1: 7.3,
                2: 4,
                3: "Hello"
            };

            assert.equal(arrFindIndex(arrayLike, (x) => !Number.isInteger(x)), 1);
        });
    });

    describe("arrFindLast", () => {
        it ("example 1", () => {
            const inventory: Array<{ name: string, quantity: number}> = [
                { name: "apples", quantity: 2 },
                { name: "bananas", quantity: 0 },
                { name: "cherries", quantity: 5 }
            ];
            
            function isCherries(fruit: { name: string, quantity: number}) {
                return fruit.name === "cherries";
            }

            assert.deepEqual(arrFindLast(inventory, isCherries), { name: "cherries", quantity: 5 });
        });

        it("example 2", () => {
            let called = 0;
            function isPrime(element: number, index: number, array: number[]) {
                called++;
                let start = 2;
                while (start <= Math.sqrt(element)) {
                    if (element % start++ < 1) {
                        return false;
                    }
                }

                return element > 1;
            }
              
            assert.equal(arrFindLast([4, 6, 8, 12], isPrime), undefined);
            assert.equal(called, 4);

            called = 0;
            assert.equal(arrFindLast([4, 5, 7, 12], isPrime), 7);
            assert.equal(called, 2);
        });

        it("example 3 - array like", () => {
            const arrayLike = {
                length: 3,
                0: 2,
                1: 7.3,
                2: 4,
                3: "Hello"
            };

            assert.equal(arrFindLast(arrayLike, (x) => !Number.isInteger(x)), 7.3);
        });
    });

    describe("arrFindLastIndex", () => {
        it ("example 1", () => {
            const inventory: Array<{ name: string, quantity: number}> = [
                { name: "apples", quantity: 2 },
                { name: "bananas", quantity: 0 },
                { name: "cherries", quantity: 5 }
            ];
            let called = 0;
            function isCherries(fruit: { name: string, quantity: number}) {
                called++;
                return fruit.name === "cherries";
            }

            assert.deepEqual(arrFindLastIndex(inventory, isCherries), 2);
            assert.equal(called, 1);
        });

        it("example 2", () => {
            let called = 0;
            function isPrime(element: number) {
                called++;
                if (element % 2 === 0 || element < 2) {
                    return false;
                }

                for (let factor = 3; factor <= Math.sqrt(element); factor += 2) {
                    if (element % factor === 0) {
                        return false;
                    }
                }

                return true;
            }
            called = 0;
            assert.equal(arrFindLastIndex([4, 6, 8, 9, 12], isPrime), -1);
            assert.equal(called, 5);
            called = 0;
            assert.equal(arrFindLastIndex([4, 6, 7, 9, 12], isPrime), 2);
            assert.equal(called, 3);
        });

        it("example 3 - array like", () => {
            const arrayLike = {
                length: 3,
                0: 2,
                1: 7.3,
                2: 4,
                3: "Hello"
            };

            assert.equal(arrFindLastIndex(arrayLike, (x) => !Number.isInteger(x)), 1);
        });
    });

    describe("arrFrom", () => {
        it("examples", () => {
            const map = new Map([
                [ 1, "Hello" ],
                [ 2, "Darkness" ],
                [ 3, "my" ],
                [ 4, "old" ],
                [ 5, "friend"]
            ]);

            assert.deepEqual(arrFrom("Hello"), [ "H", "e", "l", "l", "o" ]);
            assert.deepEqual(arrFrom(new Set(["Hello", "Darkness", "my", "old", "friend"])), ["Hello", "Darkness", "my", "old", "friend"]);
            assert.deepEqual(arrFrom(map.values()), ["Hello", "Darkness", "my", "old", "friend"]);
            assert.deepEqual(arrFrom(map.keys()), [ 1, 2, 3, 4, 5 ]);
            assert.deepEqual(arrFrom(map.entries()), [ [ 1, "Hello" ], [ 2, "Darkness" ], [ 3, "my" ], [ 4, "old" ], [ 5, "friend"] ]);
        });

        it("with mapFn", () => {
            const kvArray = [
                { key: 1, value: 10 },
                { key: 2, value: 20 },
                { key: 3, value: 30 }
            ];

            const reformattedArray = arrFrom(kvArray, ({ key, value}) => ({ [key]: value }));

            assert.equal(reformattedArray.length, 3);
            assert.equal(JSON.stringify(reformattedArray), "[{\"1\":10},{\"2\":20},{\"3\":30}]");
            assert.equal(JSON.stringify(kvArray), "[{\"key\":1,\"value\":10},{\"key\":2,\"value\":20},{\"key\":3,\"value\":30}]");

            // kvArray is still:
            // [{key: 1, value: 10},
            //  {key: 2, value: 20},
            //  {key: 3, value: 30}]
        });

        it("with mapFn using a map", () => {
            const map = new Map([
                [ 1, "Hello" ],
                [ 2, "Darkness" ],
                [ 3, "my" ],
                [ 4, "old" ],
                [ 5, "friend"]
            ]);

            const reformattedArray = arrFrom(map, ([ key, value ]) => ({ [key]: value }));

            assert.equal(reformattedArray.length, 5);
            assert.equal(JSON.stringify(reformattedArray), "[{\"1\":\"Hello\"},{\"2\":\"Darkness\"},{\"3\":\"my\"},{\"4\":\"old\"},{\"5\":\"friend\"}]");
        });
    });

    describe("arrSlice", () => {
        it("examples", () => {
            const lyrics = ["Hello", "Darkness", "my", "old", "friend.", "I've", "come", "to", "talk" ];

            assert.deepEqual(arrSlice(lyrics), [ "Hello", "Darkness", "my", "old", "friend.", "I've", "come", "to", "talk" ]);
            assert.deepEqual(arrSlice(lyrics, 1, 3), [ "Darkness", "my" ]);
            assert.deepEqual(arrSlice(lyrics, 2),  [ "my", "old", "friend.", "I've", "come", "to", "talk" ]);
            assert.deepEqual(arrSlice(lyrics, 2, 4), [ "my", "old" ]);
            assert.deepEqual(arrSlice(lyrics, 1, 5), [ "Darkness", "my", "old", "friend." ]);
            assert.deepEqual(arrSlice(lyrics, -2), [ "to", "talk" ]);
            assert.deepEqual(arrSlice(lyrics, 2, -1), [ "my", "old", "friend.", "I've", "come", "to" ]);
        });
    });

    describe("arrUnique", () => {
        it("removes duplicate primitives", () => {
            assert.deepEqual(arrUnique([1, 2, 2, 3, 1, 4]), [1, 2, 3, 4]);
            assert.deepEqual(arrUnique(["a", "b", "a", "c"]), ["a", "b", "c"]);
            assert.deepEqual(arrUnique([1, "1", 1, "1"]), [1, "1"]);
        });

        it("preserves insertion order", () => {
            assert.deepEqual(arrUnique([3, 1, 2, 1, 3]), [3, 1, 2]);
            assert.deepEqual(arrUnique(["z", "a", "z", "b"]), ["z", "a", "b"]);
        });

        it("handles empty and single element arrays", () => {
            assert.deepEqual(arrUnique([]), []);
            assert.deepEqual(arrUnique([1]), [1]);
        });

        it("handles null and undefined", () => {
            assert.deepEqual(arrUnique(null), []);
            assert.deepEqual(arrUnique(undefined), []);
        });

        it("handles array-like objects", () => {
            assert.deepEqual(arrUnique({ length: 4, 0: 1, 1: 2, 2: 2, 3: 3 }), [1, 2, 3]);
            assert.deepEqual(arrUnique({ length: 3, 0: "a", 1: "b", 2: "a" }), ["a", "b"]);
        });

        it("uses strict equality", () => {
            assert.deepEqual(arrUnique([0, false, 0, false]), [0, false]);
            assert.deepEqual(arrUnique([null, undefined, null]), [null, undefined]);
        });
    });

    describe("arrCompact", () => {
        it("removes falsy values", () => {
            assert.deepEqual(arrCompact([0, 1, false, 2, "", 3, null, undefined, 4]), [1, 2, 3, 4]);
            assert.deepEqual(arrCompact([false, 0, "", null, undefined]), []);
        });

        it("preserves truthy values", () => {
            assert.deepEqual(arrCompact([1, 2, 3]), [1, 2, 3]);
            assert.deepEqual(arrCompact(["a", "b", "c"]), ["a", "b", "c"]);
            assert.deepEqual(arrCompact([true, true, true]), [true, true, true]);
        });

        it("handles empty arrays", () => {
            assert.deepEqual(arrCompact([]), []);
        });

        it("handles null and undefined", () => {
            assert.deepEqual(arrCompact(null), []);
            assert.deepEqual(arrCompact(undefined), []);
        });

        it("handles array-like objects", () => {
            assert.deepEqual(arrCompact({ length: 5, 0: 0, 1: 1, 2: false, 3: 2, 4: null }), [1, 2]);
            assert.deepEqual(arrCompact({ length: 3, 0: "a", 1: "", 2: "b" }), ["a", "b"]);
        });

        it("preserves numbers and strings properly", () => {
            assert.deepEqual(arrCompact([1, 0, 2]), [1, 2]);
            assert.deepEqual(arrCompact(["hello", "", "world"]), ["hello", "world"]);
        });
    });

    describe("arrFlatten", () => {
        it("flattens with default depth of 1", () => {
            assert.deepEqual(arrFlatten([1, [2, 3], [4, [5, 6]]]), [1, 2, 3, 4, [5, 6]]);
            assert.deepEqual(arrFlatten([1, [2], 3]), [1, 2, 3]);
        });

        it("flattens with specified depth", () => {
            assert.deepEqual(arrFlatten([1, [2, 3], [4, [5, 6]]], 2), [1, 2, 3, 4, 5, 6]);
            assert.deepEqual(arrFlatten([1, [2, [3, [4]]]], 2), [1, 2, 3, [4]]);
        });

        it("flattens with infinite depth", () => {
            assert.deepEqual(arrFlatten([1, [2, 3], [4, [5, 6]]], Infinity), [1, 2, 3, 4, 5, 6]);
            assert.deepEqual(arrFlatten([1, [2, [3, [4, [5]]]]], Infinity), [1, 2, 3, 4, 5]);
        });

        it("handles non-arrays when depth is 0", () => {
            assert.deepEqual(arrFlatten([1, [2, 3]], 0), [1, [2, 3]]);
        });

        it("preserves non-nested arrays", () => {
            assert.deepEqual(arrFlatten([1, 2, 3]), [1, 2, 3]);
        });

        it("handles empty arrays", () => {
            assert.deepEqual(arrFlatten([]), []);
        });

        it("handles null and undefined", () => {
            assert.deepEqual(arrFlatten(null), []);
            assert.deepEqual(arrFlatten(undefined), []);
        });

        it("handles array-like objects", () => {
            assert.deepEqual(arrFlatten({ length: 2, 0: 1, 1: [2, 3] }), [1, 2, 3]);
        });
    });

    describe("arrGroupBy", () => {
        it("groups by simple criteria", () => {
            const numbers = [1, 2, 3, 4, 5, 6];
            const grouped = arrGroupBy(numbers, (n) => n % 2 === 0 ? "even" : "odd");
            assert.deepEqual(grouped["odd"], [1, 3, 5]);
            assert.deepEqual(grouped["even"], [2, 4, 6]);
        });

        it("groups objects by property", () => {
            const people = [
                { name: "Alice", age: 30 },
                { name: "Bob", age: 25 },
                { name: "Charlie", age: 30 }
            ];
            const byAge = arrGroupBy(people, (p) => p.age);
            assert.equal(byAge["25"].length, 1);
            assert.equal(byAge["30"].length, 2);
            assert.equal(byAge["25"][0].name, "Bob");
        });

        it("handles empty arrays", () => {
            const grouped = arrGroupBy([], (x) => x);
            assert.deepEqual(grouped, {});
        });

        it("handles null and undefined input", () => {
            assert.deepEqual(arrGroupBy(null as any, (x: any) => x), {});
            assert.deepEqual(arrGroupBy(undefined as any, (x: any) => x), {});
        });

        it("handles null callback", () => {
            assert.deepEqual(arrGroupBy([1, 2, 3], null as any), {});
        });

        it("supports thisArg parameter", () => {
            const context = { multiplier: 2 };
            const numbers = [1, 2, 3, 4];
            const grouped = arrGroupBy(numbers, function(n) {
                return (n * (this as any).multiplier) % 2 === 0 ? "even" : "odd";
            }, context);
            assert.ok(grouped["odd"] || grouped["even"]);
        });

        it("handles array-like objects", () => {
            const arrayLike = { length: 4, 0: 1, 1: 2, 2: 3, 3: 4 };
            const grouped = arrGroupBy(arrayLike, (n) => n % 2 === 0 ? "even" : "odd");
            assert.equal(grouped["odd"].length, 2);
            assert.equal(grouped["even"].length, 2);
        });
    });

    describe("arrChunk", () => {
        it("chunks array into specified size", () => {
            assert.deepEqual(arrChunk([1, 2, 3, 4, 5, 6, 7], 2), [[1, 2], [3, 4], [5, 6], [7]]);
            assert.deepEqual(arrChunk([1, 2, 3, 4, 5], 3), [[1, 2, 3], [4, 5]]);
        });

        it("handles chunk size of 1", () => {
            assert.deepEqual(arrChunk([1, 2, 3], 1), [[1], [2], [3]]);
        });

        it("handles chunk size larger than array", () => {
            assert.deepEqual(arrChunk([1, 2, 3], 5), [[1, 2, 3]]);
        });

        it("handles empty arrays", () => {
            assert.deepEqual(arrChunk([], 2), []);
        });

        it("handles null and undefined", () => {
            assert.deepEqual(arrChunk(null, 2), []);
            assert.deepEqual(arrChunk(undefined, 2), []);
        });

        it("handles invalid chunk size", () => {
            assert.deepEqual(arrChunk([1, 2, 3], 0), []);
            assert.deepEqual(arrChunk([1, 2, 3], -1), []);
        });

        it("handles array-like objects", () => {
            const arrayLike = { length: 5, 0: "a", 1: "b", 2: "c", 3: "d", 4: "e" };
            assert.deepEqual(arrChunk(arrayLike, 2), [["a", "b"], ["c", "d"], ["e"]]);
        });

        it("preserves exact chunk boundaries", () => {
            const data = [10, 20, 30, 40, 50, 60];
            const chunks = arrChunk(data, 3);
            assert.equal(chunks.length, 2);
            assert.deepEqual(chunks[0], [10, 20, 30]);
            assert.deepEqual(chunks[1], [40, 50, 60]);
        });
    });

    function _expectThrow(cb: () => void): Error {
        try {
            cb();
        } catch (e) {
            assert.ok(true, "Expected an exception to be thrown");
            return e;
        }
    }
});
