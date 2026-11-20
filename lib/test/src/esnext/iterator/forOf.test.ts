/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrForEach } from "../../../../src/array/forEach";
import { iterForOf } from "../../../../src/iterator/forOf";
import { iterMap } from "../../../../src/iterator/iterMap";
import { iterToArray } from "../../../../src/iterator/iterToArray";
import { iterFilter } from "../../../../src/iterator/iterFilter";
import { iterTake } from "../../../../src/iterator/iterTake";

describe("ESNext iterForOf tests", () => {
    // The generators (like the collection below) are typed as any, so this file also type checks with the ES5 test
    // tsconfig (which includes it), as without downlevelIteration an ES5 target only allows for...of of an array
    function _createGenerator(log: string[]): any {
        return (function* () {
            try {
                yield 1;
                yield 2;
                yield 3;
            } finally {
                log.push("finally");
            }
        })();
    }

    // Like a jQuery collection, which is array-like and iterable (using the native array iterator) but also has a
    // next() function, which returns the next sibling elements (another collection) rather than an iterator result
    function _createCollection(): any {
        let collection: any = {
            0: "a",
            1: "b",
            length: 2,
            next: function() {
                return collection;
            }
        };

        collection[Symbol.iterator] = Array.prototype[Symbol.iterator];

        return collection;
    }

    it("processes a generator like for...of", () => {
        let log: string[] = [];
        let values: number[] = [];
        iterForOf<number>(_createGenerator(log), (value) => {
            values.push(value);
        });

        let nativeLog: string[] = [];
        let nativeValues: number[] = [];
        for (let value of _createGenerator(nativeLog)) {
            nativeValues.push(value);
        }

        assert.deepEqual(values, nativeValues);
        assert.deepEqual(log, nativeLog);
        assert.deepEqual(values, [1, 2, 3]);
        assert.deepEqual(log, ["finally"]);
    });

    it("runs the generator's finally block when the callbackfn returns -1, like break in for...of", () => {
        let log: string[] = [];
        let values: number[] = [];
        iterForOf<number>(_createGenerator(log), (value) => {
            values.push(value);
            if (value === 2) {
                return -1;
            }
        });

        let nativeLog: string[] = [];
        let nativeValues: number[] = [];
        for (let value of _createGenerator(nativeLog)) {
            nativeValues.push(value);
            if (value === 2) {
                break;
            }
        }

        assert.deepEqual(values, nativeValues);
        assert.deepEqual(log, nativeLog);
        assert.deepEqual(values, [1, 2]);
        assert.deepEqual(log, ["finally"], "The generator's finally block should be run");
    });

    it("runs the generator's finally block when the callbackfn throws, like for...of", () => {
        let error = new Error("callbackfn failed");
        let log: string[] = [];
        let caught: any;
        try {
            iterForOf<number>(_createGenerator(log), (value) => {
                if (value === 2) {
                    throw error;
                }
            });
        } catch (e) {
            caught = e;
        }

        let nativeLog: string[] = [];
        let nativeCaught: any;
        try {
            for (let value of _createGenerator(nativeLog)) {
                if (value === 2) {
                    throw error;
                }
            }
        } catch (e) {
            nativeCaught = e;
        }

        assert.strictEqual(caught, error, "The error thrown by the callbackfn should be thrown");
        assert.strictEqual(nativeCaught, error);
        assert.deepEqual(log, nativeLog);
        assert.deepEqual(log, ["finally"], "The generator's finally block should be run");
    });

    it("throws the callbackfn's error rather than an error thrown by the generator's finally block, like for...of", () => {
        let error = new Error("callbackfn failed");
        function* failingGenerator(): any {
            try {
                yield 1;
            } finally {
                // eslint-disable-next-line no-unsafe-finally
                throw new Error("finally failed");
            }
        }

        let caught: any;
        try {
            iterForOf(failingGenerator(), () => {
                throw error;
            });
        } catch (e) {
            caught = e;
        }

        let nativeCaught: any;
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (let value of failingGenerator()) {
                throw error;
            }
        } catch (e) {
            nativeCaught = e;
        }

        assert.strictEqual(nativeCaught, error);
        assert.strictEqual(caught, error, "The error thrown by the callbackfn should be thrown");
    });

    it("processes an iterable which also has a next() function (eg. a jQuery collection) like for...of", () => {
        let values: string[] = [];
        iterForOf(_createCollection(), (value: string) => {
            values.push(value);
        });

        let nativeValues: string[] = [];
        for (let value of _createCollection()) {
            nativeValues.push(value);
        }

        assert.deepEqual(values, nativeValues);
        assert.deepEqual(values, ["a", "b"]);
    });

    it("iterMap and iterToArray process an iterable which also has a next() function like for...of", () => {
        assert.deepEqual(iterToArray(iterMap(_createCollection(), (value: string) => value + "!")), ["a!", "b!"]);
        assert.deepEqual(iterToArray(_createCollection()), ["a", "b"]);
    });

    it("processes a Map, Set and string like for...of", () => {
        let map = new Map<string, number>([["a", 1], ["b", 2]]);
        let set = new Set<number>([1, 2, 2, 3]);
        let str = "a\uD83D\uDE00b";

        arrForEach([map, set, str], (source: any) => {
            let values: any[] = [];
            iterForOf(source, (value) => {
                values.push(value);
            });

            let nativeValues: any[] = [];
            for (let value of source) {
                nativeValues.push(value);
            }

            assert.deepEqual(values, nativeValues);
        });
    });

    it("throws a TypeError when return() doesn't return an object after the callbackfn returns -1 like for...of", () => {
        function _createIterable(returnValue: any): any {
            return {
                [Symbol.iterator]: () => ({
                    next: () => ({ value: 1, done: false }),
                    return: () => returnValue
                })
            };
        }

        arrForEach([undefined, null, 1, "done"], (returnValue) => {
            assert.throws(() => {
                iterForOf(_createIterable(returnValue), () => -1);
            }, TypeError);

            assert.throws(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                for (let value of _createIterable(returnValue)) {
                    break;
                }
            }, TypeError);
        });

        // An object is a valid return() result for both
        iterForOf(_createIterable({}), () => -1);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (let value of _createIterable({})) {
            break;
        }
    });

    it("throws a TypeError when [Symbol.iterator]() doesn't return an iterator like for...of", () => {
        arrForEach([undefined, null, 1, {}, { next: 1 }], (iterator) => {
            const iterable: any = {
                [Symbol.iterator]: () => iterator
            };

            let calls = 0;
            assert.throws(() => {
                iterForOf(iterable, () => {
                    calls++;
                });
            }, TypeError);

            assert.throws(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                for (let value of iterable) {
                    calls++;
                }
            }, TypeError);

            assert.equal(calls, 0);
        });
    });

    it("iterMap, iterFilter and iterToArray process a string by its code points like for...of", () => {
        let str = "a" + String.fromCharCode(0xD83D, 0xDE00) + "b";
        let nativeValues: string[] = [];
        for (let value of str) {
            nativeValues.push(value);
        }

        assert.equal(nativeValues.length, 3, "The surrogate pair is one value");
        assert.deepEqual(iterToArray(iterMap(str, (value: string) => value)), nativeValues);
        assert.deepEqual(iterToArray(iterFilter(str, () => true)), nativeValues);
        assert.deepEqual(iterToArray(str), nativeValues);
    });
});

describe("ESNext iterator helpers", () => {
    it("iterMap and iterFilter use the source like the native iterator helpers", function() {
        // The native iterator helpers (Iterator.prototype.map etc) are on the prototype of the array iterator's prototype
        const iteratorProto: any = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));
        if (!iteratorProto || !iteratorProto.map || !iteratorProto.filter) {
            this.skip();
            return;
        }

        // A next() result which is not an object throws a TypeError
        const primitiveSource = () => ({
            next: (): any => 1
        });

        assert.throws(() => iterMap(primitiveSource() as any, (value: any) => value).next(), TypeError);
        assert.throws(() => iteratorProto.map.call(primitiveSource(), (value: any) => value).next(), TypeError);
        assert.throws(() => iterFilter(primitiveSource() as any, () => true).next(), TypeError);
        assert.throws(() => iteratorProto.filter.call(primitiveSource(), () => true).next(), TypeError);

        // The source is closed (by calling its return() with no arguments) when the callbackfn throws
        const helpers: any[] = [
            [iterMap, iteratorProto.map],
            [iterFilter, iteratorProto.filter]
        ];

        arrForEach(helpers, (helper) => {
            function _createSource(log: number[]): any {
                return {
                    next: () => ({ value: 1, done: false }),
                    return: function() {
                        log.push(arguments.length);
                        return {};
                    }
                };
            }

            function _throwError(): any {
                throw new Error("callbackfn error");
            }

            let ours: number[] = [];
            let native: number[] = [];
            assert.throws(() => helper[0](_createSource(ours), _throwError).next(), /callbackfn error/);
            assert.throws(() => helper[1].call(_createSource(native), _throwError).next(), /callbackfn error/);

            assert.deepEqual(native, [0], "The native helper calls return() once with no arguments");
            assert.deepEqual(ours, native);
        });
    });
});

describe("ESNext lazy iterator helpers state", () => {
    it("iterMap, iterFilter and iterTake are done and closed like the native iterator helpers", function() {
        const iteratorProto: any = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));
        if (!iteratorProto || !iteratorProto.map || !iteratorProto.filter || !iteratorProto.take) {
            this.skip();
            return;
        }

        const helpers: any[] = [
            ["iterMap", (source: any, cb: any) => iterMap(source, cb || ((value: any) => value)), (source: any, cb: any) => iteratorProto.map.call(source, cb || ((value: any) => value))],
            ["iterFilter", (source: any, cb: any) => iterFilter(source, cb || (() => true)), (source: any, cb: any) => iteratorProto.filter.call(source, cb || (() => true))],
            ["iterTake", (source: any) => iterTake(source, 5), (source: any) => iteratorProto.take.call(source, 5)]
        ];

        arrForEach(helpers, (helper) => {
            // Done after the source's next() throws
            function _afterThrow(create: any) {
                let calls = 0;
                const source = {
                    next: (): any => {
                        calls++;
                        if (calls === 1) {
                            throw new Error("next() error");
                        }

                        return { value: calls, done: false };
                    }
                };

                const it = create(source);
                let threw = false;
                try {
                    it.next();
                } catch (e) {
                    threw = true;
                }

                return { threw: threw, done: it.next().done, calls: calls };
            }

            assert.deepEqual(_afterThrow(helper[1]), _afterThrow(helper[2]), helper[0] + " after the source's next() throws");

            // return() after it is exhausted doesn't close the source
            function _returnAfterDone(create: any) {
                let returns = 0;
                let idx = 0;
                const source = {
                    next: (): any => idx++ < 1 ? { value: 1, done: false } : { value: undefined, done: true },
                    return: (): any => {
                        returns++;
                    }
                };

                const it = create(source);
                it.next();
                it.next();
                it.return();

                return returns;
            }

            assert.equal(_returnAfterDone(helper[1]), _returnAfterDone(helper[2]), helper[0] + " return() after it is done");
        });

        // Calling the helper's next() from its callbackfn throws a TypeError
        arrForEach([helpers[0], helpers[1]], (helper) => {
            function _reentrant(create: any) {
                let it: any;
                let error: any;
                it = create([1, 2].values(), (value: any) => {
                    if (value === 1 && !error) {
                        try {
                            it.next();
                        } catch (e) {
                            error = e;
                        }
                    }

                    return value;
                });

                it.next();
                return error instanceof TypeError;
            }

            assert.isTrue(_reentrant(helper[2]), helper[0] + " the native helper throws a TypeError");
            assert.isTrue(_reentrant(helper[1]), helper[0] + " throws a TypeError");
        });
    });
});
