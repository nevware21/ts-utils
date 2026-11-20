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
});
