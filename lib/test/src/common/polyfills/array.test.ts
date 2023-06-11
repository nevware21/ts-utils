/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { polyArrFind, polyArrFindIndex, polyArrFindLast, polyArrFindLastIndex, polyArrFrom, polyArrIncludes, polyIsArray } from "../../../../src/polyfills/array";
import { dumpObj } from "../../../../src/helpers/diagnostics";

describe("array polyfills", () => {
    it("polyIsArray", () => {
        _checkIsArray(null);
        _checkIsArray(undefined);
        _checkIsArray("null");
        _checkIsArray("undefined");
        _checkIsArray("1");
        _checkIsArray("aa");
        _checkIsArray(new Date());
        _checkIsArray(1);
        _checkIsArray("");
        _checkIsArray(_dummyFunction);
        _checkIsArray([]);
        _checkIsArray(new Array(1));
        _checkIsArray(true);
        _checkIsArray(false);
        _checkIsArray("true");
        _checkIsArray("false");
        _checkIsArray(new Boolean(true));
        _checkIsArray(new Boolean(false));
        _checkIsArray(new Boolean("true"));
        _checkIsArray(new Boolean("false"));
        _checkIsArray(/[a-z]/g);
        _checkIsArray(new RegExp(""));
        _checkIsArray(_getFile());
        _checkIsArray(_getFormData());
        _checkIsArray(_getBlob());
        _checkIsArray(new ArrayBuffer(0));
        _checkIsArray(new Error("Test Error"));
        _checkIsArray(new TypeError("Test TypeError"));
        _checkIsArray(new TestError("Test TestError"));
        _checkIsArray(_dummyError());
        _checkIsArray(Promise.reject());
        _checkIsArray(Promise.resolve());
        _checkIsArray(new Promise(() => {}));
        _checkIsArray(_simplePromise());
        _checkIsArray(_simplePromiseLike());
    });

    describe("polyArrIncludes", () => {
        assert.equal(polyArrIncludes([1, 2, 3], 2), true);
        assert.equal(polyArrIncludes([1, 2, 3], 4), false);
        assert.equal(polyArrIncludes([1, 2, 3], 3, 3), false);
        assert.equal(polyArrIncludes([1, 2, 3], 3, -1), true);
        assert.equal(polyArrIncludes(["1", "2", "3"], 3 as any), false);

        // Note: This (should) be true, but the polyfill does not handle NaN comparison correctly
        assert.equal(polyArrIncludes([1, 2, NaN], NaN), false);
    });

    describe("polyArrFind", () => {
        it ("example 1", () => {
            const inventory: Array<{ name: string, quantity: number}> = [
                { name: "apples", quantity: 2 },
                { name: "bananas", quantity: 0 },
                { name: "cherries", quantity: 5 }
            ];
            
            function isCherries(fruit: { name: string, quantity: number}) {
                return fruit.name === "cherries";
            }

            assert.deepEqual(polyArrFind(inventory, isCherries), { name: "cherries", quantity: 5 });
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
              
            assert.equal(polyArrFind([4, 6, 8, 12], isPrime), undefined);
            assert.equal(polyArrFind([4, 5, 8, 12], isPrime), 5);
        });

        it("example 3 - array like", () => {
            const arrayLike = {
                length: 3,
                0: 2,
                1: 7.3,
                2: 4
            };

            assert.equal(polyArrFind(arrayLike, (x) => !Number.isInteger(x)), 7.3);
        });
    });

    describe("polyArrFindIndex", () => {
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

            assert.deepEqual(polyArrFindIndex(inventory, isCherries), 2);
            assert.equal(called, 3);
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
            assert.equal(polyArrFindIndex([4, 6, 8, 9, 12], isPrime), -1);
            assert.equal(called, 5);
            called = 0;
            assert.equal(polyArrFindIndex([4, 6, 7, 9, 12], isPrime), 2);
            assert.equal(called, 3);
        });
    });

    describe("polyArrFindLast", () => {
        it ("example 1", () => {
            let called = 0;
            const inventory: Array<{ name: string, quantity: number}> = [
                { name: "apples", quantity: 2 },
                { name: "bananas", quantity: 0 },
                { name: "cherries", quantity: 5 }
            ];
            
            function isCherries(fruit: { name: string, quantity: number}) {
                called++;
                return fruit.name === "cherries";
            }

            assert.deepEqual(polyArrFindLast(inventory, isCherries), { name: "cherries", quantity: 5 });
            assert.equal(called, 1);
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
              
            assert.equal(called, 0);
            assert.equal(polyArrFindLast([4, 6, 8, 12], isPrime), undefined);
            assert.equal(called, 4);

            called = 0;
            assert.equal(called, 0);
            assert.equal(polyArrFindLast([4, 5, 8, 12], isPrime), 5);
            assert.equal(called, 3);
        });
    });

    describe("polyArrFindLastIndex", () => {
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

            assert.deepEqual(polyArrFindLastIndex(inventory, isCherries), 2);
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
            assert.equal(polyArrFindLastIndex([4, 6, 8, 9, 12], isPrime), -1);
            assert.equal(called, 5);
            called = 0;
            assert.equal(polyArrFindLastIndex([4, 6, 7, 9, 12], isPrime), 2);
            assert.equal(called, 3);
        });
    });

    describe("polyArrFrom", () => {
        it("examples", () => {
            const map = new Map([
                [ 1, "Hello" ],
                [ 2, "Darkness" ],
                [ 3, "my" ],
                [ 4, "old" ],
                [ 5, "friend"]
            ]);

            assert.deepEqual(polyArrFrom("Hello"), [ "H", "e", "l", "l", "o" ]);
            assert.deepEqual(polyArrFrom(new Set(["Hello", "Darkness", "my", "old", "friend"])), ["Hello", "Darkness", "my", "old", "friend"]);
            assert.deepEqual(polyArrFrom(map.values()), ["Hello", "Darkness", "my", "old", "friend"]);
            assert.deepEqual(polyArrFrom(map.keys()), [ 1, 2, 3, 4, 5 ]);
            assert.deepEqual(polyArrFrom(map.entries()), [ [ 1, "Hello" ], [ 2, "Darkness" ], [ 3, "my" ], [ 4, "old" ], [ 5, "friend"] ]);
        });


        it("with mapFn", () => {
            const kvArray = [
                { key: 1, value: 10 },
                { key: 2, value: 20 },
                { key: 3, value: 30 }
            ];

            const reformattedArray = polyArrFrom(kvArray, ({ key, value}) => ({ [key]: value }));

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

            const reformattedArray = polyArrFrom(map, ([ key, value ]) => ({ [key]: value }));

            assert.equal(reformattedArray.length, 5);
            assert.equal(JSON.stringify(reformattedArray), "[{\"1\":\"Hello\"},{\"2\":\"Darkness\"},{\"3\":\"my\"},{\"4\":\"old\"},{\"5\":\"friend\"}]");
        });
    });

    function _checkIsArray(value: any) {
        let polyResult = polyIsArray(value);
        let nativeResult = Array.isArray(value);

        assert.equal(polyResult, nativeResult, "Checking Native and polyfill result for [" + dumpObj(value) + "]");
    }

    function _dummyFunction() {

    }

    function _dummyError(): Error {
        return {
            name: "Dummy Error",
            message: "Dummy Message"
        };
    }

    function _getFile(): File {
        let theFile: File = null;
        try {
            theFile = new File([], "text.txt");
        } catch (e) {
            // Node doesn't have the file class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
        }

        return theFile;
    }

    function _getFormData(): FormData {
        let formData: FormData = null;
        try {
            formData = new FormData();
        } catch (e) {
            // Node doesn't have the FormData class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
        }

        return formData;
    }

    function _getBlob(): Blob {
        let blob: Blob = null;
        try {
            blob = new Blob();
        } catch (e) {
            // Node doesn't have the Blob class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
        }

        return blob;
    }

    function _simplePromise(): any {
        return {
            then: _dummyFunction,
            catch: _dummyFunction
        };
    }

    function _simplePromiseLike(): any {
        return {
            then: _dummyFunction
        };
    }

    class TestError extends Error {
        public constructor(message: string) {
            super(message);
        }
    }
});
