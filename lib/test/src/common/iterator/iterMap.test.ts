/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { iterMap } from "../../../../src/iterator/iterMap";
import { iterToArray } from "../../../../src/iterator/iterToArray";
import { createArrayIterator } from "../../../../src/iterator/array";
import { iterEvery } from "../../../../src/iterator/iterEvery";
import { iterFilter } from "../../../../src/iterator/iterFilter";
import { iterForOf } from "../../../../src/iterator/forOf";
import { iterReduce } from "../../../../src/iterator/iterReduce";
import { iterSome } from "../../../../src/iterator/iterSome";
import { iterTake } from "../../../../src/iterator/iterTake";
import { getKnownSymbol } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";
import { iterIntersection } from "../../../../src/iterator/iterIntersection";
import { iterDifference } from "../../../../src/iterator/iterDifference";
import { iterUnion } from "../../../../src/iterator/iterUnion";
import { safe } from "../../../../src/helpers/safe";

describe("iterMap", () => {
    it("maps values lazily", () => {
        let values = iterToArray(iterMap([1, 2, 3], (value) => value * 10));
        assert.deepEqual(values, [10, 20, 30]);
    });

    it("does not call source.next after completion", () => {
        let callCount = 0;
        let source: Iterator<number> = {
            next: () => {
                callCount++;
                if (callCount === 1) {
                    return { done: false, value: 1 };
                }

                if (callCount === 2) {
                    return { done: true, value: undefined as any };
                }

                throw new Error("next called after completion");
            }
        };

        let mapped = iterMap(source, (value) => value * 2);
        assert.deepEqual(mapped.next(), { done: false, value: 2 });
        assert.equal(mapped.next().done, true);
        assert.equal(mapped.next().done, true);
        assert.equal(callCount, 2);
    });

    it("the iterator helpers process an iterable array-like using its iterator rather than its indexes, like iterForOf", () => {
        const value: any = { length: 2, 0: "index0", 1: "index1" };
        value[getKnownSymbol(WellKnownSymbols.iterator)] = () => createArrayIterator(["iterated"]);

        let forOfValues: string[] = [];
        iterForOf(value, (item: string) => {
            forOfValues.push(item);
        });

        assert.deepEqual(forOfValues, ["iterated"]);
        assert.deepEqual(iterToArray(iterMap(value, (item: string) => item)), ["iterated"]);
        assert.deepEqual(iterToArray(iterFilter(value, () => true)), ["iterated"]);
        assert.deepEqual(iterToArray(iterTake(value, 5)), ["iterated"]);
        assert.deepEqual(iterToArray(value), ["iterated"]);
        assert.equal(iterReduce(value, (acc: string, item: string) => acc + item, ""), "iterated");
        assert.isTrue(iterSome(value, (item: string) => item === "iterated"));
        assert.isTrue(iterEvery(value, (item: string) => item === "iterated"));

        // An array-like which is not iterable is still processed using its indexes
        assert.deepEqual(iterToArray(iterMap({ length: 2, 0: "a", 1: "b" } as any, (item: string) => item)), ["a", "b"]);
    });

    it("processes a string by its code points like iterForOf", function() {
        const str = "a" + String.fromCharCode(0xD83D, 0xDE00) + "b";
        if (!(str as any)[getKnownSymbol(WellKnownSymbols.iterator)]) {
            // A string is only iterable on a runtime which supports Symbol.iterator, otherwise it is processed by its
            // indexes (its UTF-16 code units)
            this.skip();
            return;
        }

        const expected = ["a", String.fromCharCode(0xD83D, 0xDE00), "b"];
        let forOfValues: string[] = [];
        iterForOf(str, (item: string) => {
            forOfValues.push(item);
        });

        assert.deepEqual(forOfValues, expected);
        assert.deepEqual(iterToArray(iterMap(str, (item: string) => item)), expected);
        assert.deepEqual(iterToArray(str), expected);
    });
});

describe("iterator helpers process the iterator returned by [Symbol.iterator]() like iterForOf", () => {
    const iteratorSymbol = getKnownSymbol(WellKnownSymbols.iterator);

    function _createIterator(values: any[], returnFn?: () => any): any {
        let idx = 0;
        let iterator: any = {
            next: () => idx < values.length ? { value: values[idx++], done: false } : { value: undefined, done: true }
        };

        if (returnFn) {
            iterator.return = returnFn;
        }

        return iterator;
    }

    function _createIterable(createIterator: () => any): any {
        const iterable: any = {};
        iterable[iteratorSymbol] = createIterator;

        return iterable;
    }

    it("throw a TypeError when [Symbol.iterator]() doesn't return an iterator", () => {
        const invalid: any[] = [undefined, null, 1, {}, { next: 1 }];
        for (let lp = 0; lp < invalid.length; lp++) {
            const bad = _createIterable(() => invalid[lp]);
            const name = "A [Symbol.iterator]() result of " + JSON.stringify(invalid[lp]);

            assert.throws(() => iterToArray(bad), TypeError, undefined, "iterToArray: " + name);
            assert.throws(() => iterSome(bad, () => true), TypeError, undefined, "iterSome: " + name);
            assert.throws(() => iterEvery(bad, () => false), TypeError, undefined, "iterEvery: " + name);
            assert.throws(() => iterReduce(bad, (acc: any) => acc, 0), TypeError, undefined, "iterReduce: " + name);
            assert.throws(() => iterIntersection(bad, [1]), TypeError, undefined, "iterIntersection: " + name);
            assert.throws(() => iterDifference(bad, [1]), TypeError, undefined, "iterDifference: " + name);
            assert.throws(() => iterUnion(bad), TypeError, undefined, "iterUnion: " + name);
            assert.throws(() => iterToArray(iterMap(bad, (value: any) => value)), TypeError, undefined, "iterMap: " + name);
            assert.throws(() => iterToArray(iterFilter(bad, () => true)), TypeError, undefined, "iterFilter: " + name);
            assert.throws(() => iterToArray(iterTake(bad, 2)), TypeError, undefined, "iterTake: " + name);
        }
    });

    it("process the iterator returned by [Symbol.iterator]() rather than that iterator's own [Symbol.iterator]", () => {
        function _createValue() {
            return _createIterable(() => {
                const iterator = _createIterator([1, 2]);
                iterator[iteratorSymbol] = () => _createIterator(["X", "Y"]);

                return iterator;
            });
        }

        let forOfValues: any[] = [];
        iterForOf(_createValue(), (value: any) => {
            forOfValues.push(value);
        });

        assert.deepEqual(forOfValues, [1, 2]);
        assert.deepEqual(iterToArray(_createValue()), [1, 2]);
        assert.deepEqual(iterToArray(iterMap(_createValue(), (value: any) => value)), [1, 2]);
        assert.equal(iterReduce(_createValue(), (acc: any, value: any) => acc + value, 0), 3);
        assert.isTrue(iterSome(_createValue(), (value: any) => value === 2));
        assert.isFalse(iterEvery(_createValue(), (value: any) => typeof value === "string"));
        assert.deepEqual(iterIntersection(_createValue(), [1, 2, "X"]), [1, 2]);
        assert.deepEqual(iterDifference<any>(_createValue(), ["X"]), [1, 2]);
    });

    it("only read [Symbol.iterator] once", () => {
        let reads = 0;
        const value: any = {};
        Object.defineProperty(value, iteratorSymbol, {
            get: () => {
                reads++;
                return () => _createIterator([1, 2]);
            }
        });

        assert.deepEqual(iterToArray(value), [1, 2]);
        assert.equal(reads, 1, "iterToArray should read [Symbol.iterator] once");

        reads = 0;
        assert.deepEqual(iterToArray(iterMap(value, (item: number) => item * 2)), [2, 4]);
        assert.equal(reads, 1, "iterMap should read [Symbol.iterator] once");
    });

    it("throw a TypeError when they stop early and return() doesn't return an object, like the native iterator helpers", () => {
        // A return() which doesn't return a result
        const sloppy = () => _createIterable(() => _createIterator([1, 2], () => undefined));

        assert.throws(() => iterSome(sloppy(), () => true), TypeError, undefined, "iterSome");
        assert.throws(() => iterEvery(sloppy(), () => false), TypeError, undefined, "iterEvery");
        assert.throws(() => iterToArray(iterTake(sloppy(), 1)), TypeError, undefined, "iterTake");

        // When every value is processed, return() is not called
        assert.isFalse(iterSome(sloppy(), () => false));
        assert.isTrue(iterEvery(sloppy(), () => true));
        assert.deepEqual(iterToArray(iterTake(sloppy(), 5)), [1, 2]);
    });

    it("read an array as it is iterated, rather than from a copy", function() {
        const values = [1, 2];
        if (!(values as any)[iteratorSymbol]) {
            // An array is only iterable on a runtime which supports Symbol.iterator, otherwise it is copied
            this.skip();
            return;
        }

        const mapped = iterMap(values, (value: number) => value);
        assert.equal(mapped.next().value, 1);

        values[1] = 5;
        values.push(6);
        assert.deepEqual(iterToArray(mapped), [5, 6]);
    });
});

describe("iterMap, iterFilter and iterTake use the source like the native iterator helpers", () => {
    function _createSource(nextFn: () => any, returnArgs?: any[][], returnFn?: () => any): any {
        const source: any = {
            next: nextFn
        };

        if (returnArgs) {
            source.return = function() {
                returnArgs.push(Array.prototype.slice.call(arguments));
                return returnFn ? returnFn() : { value: undefined, done: true };
            };
        }

        return source;
    }

    it("throw a TypeError when the source's next() returns a value which is not an object", () => {
        const invalid: any[] = [1, "result", true, null, undefined];
        for (let lp = 0; lp < invalid.length; lp++) {
            let calls = 0;
            const source = _createSource(() => {
                calls++;
                if (calls > 10) {
                    throw new Error("next() should not be called again");
                }

                return invalid[lp];
            });

            assert.throws(() => iterMap(source, (value: any) => value).next(), TypeError, undefined, "iterMap " + JSON.stringify(invalid[lp]));
            assert.throws(() => iterFilter(source, () => true).next(), TypeError, undefined, "iterFilter " + JSON.stringify(invalid[lp]));
            assert.throws(() => iterTake(source, 5).next(), TypeError, undefined, "iterTake " + JSON.stringify(invalid[lp]));
            assert.equal(calls, 3, "next() should be called once by each helper");
        }
    });

    it("close the source (with no arguments) when the callbackfn throws, and are then done", () => {
        const error = new Error("callbackfn error");
        const helpers: any[] = [
            ["iterMap", (source: any) => iterMap(source, () => {
                throw error;
            })],
            ["iterFilter", (source: any) => iterFilter(source, () => {
                throw error;
            })]
        ];

        for (let lp = 0; lp < helpers.length; lp++) {
            const returnArgs: any[][] = [];
            const helper = helpers[lp][1](_createSource(() => ({ value: 1, done: false }), returnArgs));

            let caught: any;
            try {
                helper.next();
            } catch (e) {
                caught = e;
            }

            assert.strictEqual(caught, error, helpers[lp][0] + ": the callbackfn's error should be thrown");
            assert.deepEqual(returnArgs, [[]], helpers[lp][0] + ": return() should be called once with no arguments");
            assert.isTrue(helper.next().done, helpers[lp][0] + ": should then be done");
            assert.deepEqual(returnArgs, [[]], helpers[lp][0] + ": return() should not be called again");
        }
    });

    it("throw the callbackfn's error rather than an error thrown by the source's return()", () => {
        const error = new Error("callbackfn error");
        const returnArgs: any[][] = [];
        const source = _createSource(() => ({ value: 1, done: false }), returnArgs, () => {
            throw new Error("return() error");
        });

        let caught: any;
        try {
            iterMap(source, () => {
                throw error;
            }).next();
        } catch (e) {
            caught = e;
        }

        assert.strictEqual(caught, error);
        assert.equal(returnArgs.length, 1);
    });

    it("close the source by calling its return() with no arguments", () => {
        let returnArgs: any[][] = [];
        const taken = iterTake(_createSource(() => ({ value: 1, done: false }), returnArgs), 1);
        assert.deepEqual(iterToArray(taken), [1]);
        assert.deepEqual(returnArgs, [[]], "iterTake should close the source once the count is reached");

        returnArgs = [];
        iterMap(_createSource(() => ({ value: 1, done: false }), returnArgs), (value: any) => value).return("value");
        assert.deepEqual(returnArgs, [[]], "iterMap's return() should close the source with no arguments");

        returnArgs = [];
        iterFilter(_createSource(() => ({ value: 1, done: false }), returnArgs), () => true).return();
        assert.deepEqual(returnArgs, [[]], "iterFilter's return() should close the source with no arguments");
    });

    it("throw a TypeError when the source's return() doesn't return an object", () => {
        const source = () => _createSource(() => ({ value: 1, done: false }), [], () => undefined);

        assert.throws(() => iterMap(source(), (value: any) => value).return(), TypeError, undefined, "iterMap");
        assert.throws(() => iterFilter(source(), () => true).return(), TypeError, undefined, "iterFilter");
        assert.throws(() => iterToArray(iterTake(source(), 1)), TypeError, undefined, "iterTake");
    });
});

describe("the lazy iterator helpers are done after their source or callbackfn throws", () => {
    const iteratorSymbol = getKnownSymbol(WellKnownSymbols.iterator);

    function _helpers(): any[] {
        return [
            ["iterMap", (source: any, callbackfn?: any) => iterMap(source, callbackfn || ((value: any) => value))],
            ["iterFilter", (source: any, callbackfn?: any) => iterFilter(source, callbackfn || (() => true))],
            ["iterTake", (source: any) => iterTake(source, 5)]
        ];
    }

    it("are done after the source's next() throws or returns a value which is not an object", () => {
        const helpers = _helpers();
        for (let lp = 0; lp < helpers.length; lp++) {
            for (let rp = 0; rp < 2; rp++) {
                let calls = 0;
                const source: any = {
                    next: () => {
                        calls++;
                        if (calls === 1) {
                            if (rp === 0) {
                                throw new Error("next() error");
                            }

                            return 1;
                        }

                        return { value: calls, done: false };
                    }
                };

                const helper = helpers[lp][1](source);
                assert.throws(() => helper.next(), rp === 0 ? Error : TypeError, undefined, helpers[lp][0]);
                assert.isTrue(helper.next().done, helpers[lp][0] + " should be done");
                assert.equal(calls, 1, helpers[lp][0] + " should not call the source's next() again");
            }
        }
    });

    it("only close the source when they are not already done", () => {
        const helpers = _helpers();
        for (let lp = 0; lp < helpers.length; lp++) {
            let returnCalls = 0;
            let idx = 0;
            const source: any = {
                next: () => idx++ < 1 ? { value: 1, done: false } : { value: undefined, done: true },
                // Doesn't return a result, so closing the source (again) would throw a TypeError
                return: () => {
                    returnCalls++;
                }
            };

            const helper = helpers[lp][1](source);
            assert.deepEqual(iterToArray(helper), [1]);

            // Like the native iterator helpers, return() does nothing once they are done (eg. a finally { it.return() })
            helper.return();
            helper.return();
            assert.equal(returnCalls, 0, helpers[lp][0] + " should not close the exhausted source");
        }

        // When the callbackfn throws the source is closed once
        let closes = 0;
        const source: any = {
            next: () => ({ value: 1, done: false }),
            return: () => {
                closes++;
                return { done: true };
            }
        };

        const mapped = iterMap(source, () => {
            throw new Error("callbackfn error");
        });

        assert.throws(() => mapped.next(), /callbackfn error/);
        mapped.return();
        assert.equal(closes, 1, "The source should only be closed once");

        // return() before the helper is done closes the source once
        closes = 0;
        const taken = iterTake(source, 5);
        taken.next();
        taken.return();
        taken.return();
        assert.equal(closes, 1, "iterTake's return() should only close the source once");
    });

    it("throw a TypeError when their next() or return() is called by the callbackfn", () => {
        let inner: any;
        const mapped: any = iterMap([1, 2, 3], (value: number) => {
            if (value === 1) {
                inner = { next: safe(() => mapped.next()), ret: safe(() => mapped.return()) };
            }

            return value;
        });

        assert.deepEqual(iterToArray(mapped), [1, 2, 3], "The helper should still process every value");
        assert.instanceOf(inner.next.e, TypeError, "next() from the callbackfn should throw a TypeError");
        assert.instanceOf(inner.ret.e, TypeError, "return() from the callbackfn should throw a TypeError");

        let innerFilter: any;
        const filtered: any = iterFilter([1, 2], (value: number) => {
            if (value === 1) {
                innerFilter = safe(() => filtered.next());
            }

            return true;
        });

        assert.deepEqual(iterToArray(filtered), [1, 2]);
        assert.instanceOf(innerFilter.e, TypeError, "iterFilter's next() from the callbackfn should throw a TypeError");
    });

    it("iterFilter reads each value of the source once", () => {
        let reads = 0;
        let idx = 0;
        const source: any = {
            next: () => {
                idx++;
                if (idx > 2) {
                    return { value: undefined, done: true };
                }

                let result: any = { done: false };
                Object.defineProperty(result, "value", {
                    get: () => {
                        reads++;
                        return idx;
                    }
                });

                return result;
            }
        };

        assert.deepEqual(iterToArray(iterFilter(source, () => true)), [1, 2]);
        assert.equal(reads, 2, "Each value should be read once");
    });

    it("iterMap, iterFilter and iterTake read the done of each result of the source once", () => {
        function _createSource() {
            let idx = 0;
            let reads = 0;
            const source: any = {
                next: () => {
                    idx++;
                    let value = idx;
                    let result: any = { value: value };
                    Object.defineProperty(result, "done", {
                        get: () => {
                            reads++;
                            return value > 3;
                        }
                    });

                    return result;
                }
            };

            return {
                source: source,
                reads: () => reads
            };
        }

        const mapSource = _createSource();
        assert.deepEqual(iterToArray(iterMap(mapSource.source, (value: number) => value * 10)), [10, 20, 30]);
        assert.equal(mapSource.reads(), 4, "iterMap should read each done once");

        const filterSource = _createSource();
        assert.deepEqual(iterToArray(iterFilter(filterSource.source, () => true)), [1, 2, 3]);
        assert.equal(filterSource.reads(), 4, "iterFilter should read each done once");

        const takeSource = _createSource();
        assert.deepEqual(iterToArray(iterTake(takeSource.source, 5)), [1, 2, 3]);
        assert.equal(takeSource.reads(), 4, "iterTake should read each done once");
    });

    it("use the iterator returned by [Symbol.iterator]() rather than an own next() function", () => {
        // A value which is iterable and also has a (bounded) next() function, like a jQuery collection
        let nextCalls = 0;
        const value: any = {
            next: () => {
                nextCalls++;
                return nextCalls > 3 ? { value: undefined, done: true } : { value: "next", done: false };
            }
        };

        value[iteratorSymbol] = () => createArrayIterator([1, 2]);
        assert.deepEqual(iterToArray(value), [1, 2]);
        assert.deepEqual(iterToArray(iterMap(value, (item: any) => item)), [1, 2]);
        assert.deepEqual(iterToArray(iterFilter(value, () => true)), [1, 2]);
        assert.deepEqual(iterToArray(iterTake(value, 5)), [1, 2]);
        assert.equal(nextCalls, 0, "The value's own next() should not be called");
    });
});
