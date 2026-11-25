/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { iterEvery } from "../../../../src/iterator/iterEvery";
import { iterFilter } from "../../../../src/iterator/iterFilter";
import { iterMap } from "../../../../src/iterator/iterMap";
import { iterReduce } from "../../../../src/iterator/iterReduce";
import { iterSome } from "../../../../src/iterator/iterSome";
import { iterTake } from "../../../../src/iterator/iterTake";
import { iterToArray } from "../../../../src/iterator/iterToArray";
import { createArrayIterator } from "../../../../src/iterator/array";
import { createRangeIterator } from "../../../../src/iterator/range";
import { iterForOf } from "../../../../src/iterator/forOf";

// Like Array.from() (and iterForOf / polyArrFrom) the iterator helpers only ignore a [Symbol.iterator] which is null or
// undefined (an array-like is then processed using its indexes), any other value which isn't a function throws a
// TypeError, rather than the value being used as an iterator or an array-like
describe("iterator helpers with a [Symbol.iterator] which isn't a function", () => {
    // Each helper, run to the end
    const helpers: { [name: string]: (value: any) => any } = {
        iterToArray: (value) => iterToArray(value),
        iterMap: (value) => iterToArray(iterMap(value, (item: any) => item)),
        iterFilter: (value) => iterToArray(iterFilter(value, () => true)),
        iterTake: (value) => iterToArray(iterTake(value, 5)),
        iterSome: (value) => iterSome(value, () => false),
        iterEvery: (value) => iterEvery(value, () => true),
        iterReduce: (value) => iterReduce(value, (result: string, item: string) => result + item, "")
    };

    // An array-like or an iterator (which has a next() function) with a [Symbol.iterator] which isn't a function
    function _notCallable(iterFn: any): any[] {
        let count = 0;
        let arrayLike: any = { length: 1, 0: "a" };
        let iterator: any = {
            next: () => ({ done: count++ > 0, value: "n" })
        };

        arrayLike[Symbol.iterator] = iterFn;
        iterator[Symbol.iterator] = iterFn;

        return [arrayLike, iterator];
    }

    Object.keys(helpers).forEach((name) => {
        const helper = helpers[name];

        it(name + " throws a TypeError, like Array.from", function() {
            if (typeof Symbol !== "function" || !Symbol.iterator) {
                this.skip();
                return;
            }

            const nativeFrom = (Array as any).from;
            [5, {}, true, "fn"].forEach((iterFn) => {
                _notCallable(iterFn).forEach((value, idx) => {
                    const details = "[Symbol.iterator] is " + JSON.stringify(iterFn) + " (" + (idx ? "an iterator" : "an array-like") + ")";

                    assert.throws(() => helper(value), TypeError, undefined, details);
                    if (nativeFrom) {
                        assert.throws(() => nativeFrom(value), TypeError, undefined, "Array.from: " + details);
                    }
                });
            });
        });

        it(name + " processes an array-like with a null or undefined [Symbol.iterator] by its indexes", function() {
            if (typeof Symbol !== "function" || !Symbol.iterator) {
                this.skip();
                return;
            }

            [null, undefined].forEach((iterFn) => {
                let arrayLike: any = { length: 2, 0: "a", 1: "b" };
                arrayLike[Symbol.iterator] = iterFn;

                const expected: any = {
                    iterToArray: ["a", "b"],
                    iterMap: ["a", "b"],
                    iterFilter: ["a", "b"],
                    iterTake: ["a", "b"],
                    iterSome: false,
                    iterEvery: true,
                    iterReduce: "ab"
                };

                assert.deepEqual(helper(arrayLike), expected[name], "[Symbol.iterator] is " + String(iterFn));
            });
        });
    });

    it("iterMap, iterFilter and iterTake throw when they are created (like Iterator.from())", function() {
        if (typeof Symbol !== "function" || !Symbol.iterator) {
            this.skip();
            return;
        }

        const value = _notCallable(5)[0];

        assert.throws(() => iterMap(value, (item: any) => item), TypeError);
        assert.throws(() => iterFilter(value, () => true), TypeError);
        assert.throws(() => iterTake(value, 1), TypeError);
    });

    it("each helper throws a TypeError for a falsy, Symbol or object (with a call property) [Symbol.iterator], like Array.from", function() {
        if (typeof Symbol !== "function" || !Symbol.iterator) {
            this.skip();
            return;
        }

        const nativeFrom = (Array as any).from;

        // Only null and undefined are ignored (any other falsy value isn't), and an object with a call property isn't a
        // function
        const iterFns: any[] = [0, false, "", NaN, Symbol("s"), { call: () => createArrayIterator(["x"]) }];

        Object.keys(helpers).forEach((name) => {
            iterFns.forEach((iterFn) => {
                _notCallable(iterFn).forEach((value, idx) => {
                    const iterName = typeof iterFn === "object" ? "an object with a call property" : (typeof iterFn === "string" ? JSON.stringify(iterFn) : String(iterFn));
                    const details = name + " with a [Symbol.iterator] of " + iterName + " (" + (idx ? "an iterator" : "an array-like") + ")";

                    assert.throws(() => helpers[name](value), TypeError, undefined, details);
                    if (nativeFrom) {
                        assert.throws(() => nativeFrom(value), TypeError, undefined, "Array.from: " + details);
                    }
                });
            });
        });
    });
});

describe("iterators with an Object.prototype value or v property", () => {
    it("return their values (each result and context has its own value / v), like the native iterators", () => {
        const kinds: { [name: string]: PropertyDescriptor } = {
            accessor: {
                get: () => "P",
                set: () => {
                    // Ignored
                },
                configurable: true
            },
            "read-only": {
                value: "RO",
                writable: false,
                configurable: true
            }
        };
        const results: any[] = [];

        ["value", "v"].forEach((prop) => {
            Object.keys(kinds).forEach((kind) => {
                // The results are compared after the property is removed again (the assertions use Object.prototype)
                Object.defineProperty(Object.prototype, prop, kinds[kind]);
                let result: any;
                try {
                    result = {
                        range: iterToArray(createRangeIterator(1, 3)),
                        array: iterToArray(createArrayIterator([1, 2])),
                        map: iterToArray(iterMap([1, 2], (item: number) => item * 10)),
                        filter: iterToArray(iterFilter([1, 2, 3], (item: number) => item > 1)),
                        take: iterToArray(iterTake([1, 2, 3], 2))
                    };
                } catch (e) {
                    result = (e as any).name;
                } finally {
                    delete (Object.prototype as any)[prop];
                }

                results.push([prop + " " + kind, result]);
            });
        });

        results.forEach(([name, result]) => {
            assert.deepEqual(result, {
                range: [1, 2, 3],
                array: [1, 2],
                map: [10, 20],
                filter: [2, 3],
                take: [1, 2]
            }, "Object.prototype." + name);
        });
    });
});

describe("closing an iterator whose return isn't a function", () => {
    // A plain iterator (it isn't iterable, so this doesn't need Symbol) which never ends
    function _iterator(ret: any): any {
        return {
            next: () => ({ done: false, value: 1 }),
            return: ret
        };
    }

    it("iterForOf throws a TypeError for a return which isn't null, undefined or a function (incl. a falsy one), like for...of", () => {
        [0, false, "", 5, {}].forEach((ret) => {
            assert.throws(() => iterForOf(_iterator(ret), () => -1), TypeError, undefined, "return is " + JSON.stringify(ret));
        });

        [null, undefined].forEach((ret) => {
            let count = 0;
            iterForOf(_iterator(ret), () => {
                count++;
                return -1;
            });

            assert.equal(count, 1, "return is " + ret + ", which is ignored");
        });

        if (typeof Symbol === "function" && Symbol.iterator) {
            [0, false].forEach((ret) => {
                const iterable: any = {};
                iterable[Symbol.iterator] = () => _iterator(ret);

                // The native for...of (ES2015 syntax isn't used, so this compiles to ES5)
                const nativeForOf = new Function("iterable", "for (const value of iterable) { break; }");
                assert.throws(() => nativeForOf(iterable), TypeError, undefined, "for...of with return " + JSON.stringify(ret));
            });
        }
    });

    it("iterTake and iterMap's return() close the source like the native iterator helpers", () => {
        assert.throws(() => iterToArray(iterTake(_iterator(0), 1)), TypeError, undefined, "iterTake closes the source when the count is reached");
        assert.throws(() => iterMap(_iterator(false), (item: any) => item).return(), TypeError, undefined, "iterMap's return()");
        assert.deepEqual(iterToArray(iterTake(_iterator(null), 2)), [1, 1], "A null return is ignored");
    });
});
