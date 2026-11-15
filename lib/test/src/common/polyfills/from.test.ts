/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { polyArrFrom } from "../../../../src/polyfills/array";
import { getKnownSymbol } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";

describe("polyArrFrom array-like inputs", () => {
    it("copies indexed objects without requiring an iterator", () => {
        const value = { length: 2, 0: "x", 1: "y" };
        assert.deepEqual(polyArrFrom(value), ["x", "y"]);
        assert.deepEqual(polyArrFrom(value), Array.from(value));
        assert.deepEqual(value, { length: 2, 0: "x", 1: "y" });
    });

    it("fills missing array-like indexes with own undefined elements", () => {
        const result = polyArrFrom({ length: 3 });
        assert.deepEqual(result, Array.from({ length: 3 }));
        assert.deepEqual(Object.keys(result), ["0", "1", "2"]);
    });

    it("densifies sparse arrays without modifying the source", () => {
        const value = new Array(4);
        value[1] = "b";
        const result = polyArrFrom(value);
        assert.deepEqual(result, Array.from(value));
        assert.deepEqual(Object.keys(result), ["0", "1", "2", "3"]);
        assert.deepEqual(Object.keys(value), ["1"]);
    });

    it("maps every sparse index in order", () => {
        const value = new Array(3);
        value[1] = 10;
        const visits: any[] = [];
        const result = polyArrFrom(value, (item, index) => {
            visits.push([item, index]);
            return index;
        });
        assert.deepEqual(result, [0, 1, 2]);
        assert.deepEqual(visits, [[undefined, 0], [10, 1], [undefined, 2]]);
    });

    it("passes array-like values, indexes and thisArg to the mapper", () => {
        const receiver = { scale: 10 };
        const result = polyArrFrom({ length: 2, 0: 1, 1: 2 }, function(value, index) {
            assert.strictEqual(this, receiver);
            assert.equal(arguments.length, 2);
            return value * this.scale + index;
        }, receiver);
        assert.deepEqual(result, [10, 21]);
    });

    it("preserves falsy mapping receivers", () => {
        const receivers: any[] = [false, 0, ""];
        for (let idx = 0; idx < receivers.length; idx++) {
            const receiver = receivers[idx];
            let calls = 0;
            assert.deepEqual(polyArrFrom({ length: 1, 0: "a" }, function(value) {
                calls++;
                assert.strictEqual(this, receiver);
                return value;
            }, receiver), ["a"]);
            assert.equal(calls, 1);
        }
    });

    it("normalizes finite lengths like Array.from", () => {
        const lengths: any[] = [3, 2.8, "2", true, false, 0, -1, -2.5, NaN, "bad", null, undefined];
        for (let idx = 0; idx < lengths.length; idx++) {
            const value = { length: lengths[idx], 0: "a", 1: "b", 2: "c" };
            assert.deepEqual(polyArrFrom(value), Array.from(value), "Length " + String(lengths[idx]));
        }
    });

    it("rejects lengths that cannot be represented by an array before reading elements", () => {
        const lengths = [0x100000000, Infinity, 1e100];
        for (let idx = 0; idx < lengths.length; idx++) {
            const value: any = { length: lengths[idx] };
            Object.defineProperty(value, "0", { get: () => {
                throw new Error("element must not be read");
            } });
            assert.throws(() => polyArrFrom(value), RangeError);
            assert.throws(() => Array.from(value), RangeError);
        }
    });

    it("reads inherited indexed values", () => {
        const value = Object.create({ 1: "inherited" });
        value.length = 3;
        value[0] = "own";
        assert.deepEqual(polyArrFrom(value), ["own", "inherited", undefined]);
        assert.deepEqual(Object.keys(polyArrFrom(value)), ["0", "1", "2"]);
    });

    it("reads array-like length once before accessing its indexes", () => {
        let lengthReads = 0;
        const value: any = { 0: "a", 1: "b" };
        Object.defineProperty(value, "length", { get: () => {
            lengthReads++;
            return 2;
        } });
        assert.deepEqual(polyArrFrom(value), ["a", "b"]);
        assert.equal(lengthReads, 1);
    });

    it("uses the initial array-like length and reads elements as they are visited", () => {
        const run = (copy: typeof polyArrFrom) => {
            const value: any = { length: 3, 0: "a", 1: "b", 2: "c" };
            return copy(value, (item, index) => {
                if (index === 0) {
                    value.length = 1;
                    delete value[1];
                    value[2] = "changed";
                }
                return item;
            });
        };
        assert.deepEqual(run(polyArrFrom), ["a", undefined, "changed"]);
        assert.deepEqual(run(polyArrFrom), run(Array.from));
    });

    it("does not swallow indexed getter or mapping errors", () => {
        const failure = new Error("expected failure");
        const value: any = { length: 1 };
        Object.defineProperty(value, "0", { get: () => {
            throw failure;
        } });
        assert.throws(() => polyArrFrom(value), /expected failure/);
        assert.throws(() => polyArrFrom({ length: 1, 0: "a" }, () => {
            throw failure;
        }), /expected failure/);
    });

    it("uses a non-array iterable instead of its indexed length", () => {
        const value: any = { length: 2, 0: "ignored" };
        value[getKnownSymbol(WellKnownSymbols.iterator)] = () => {
            let index = 0;
            return { next: () => index++ === 0 ? { value: "iterated", done: false } : { done: true } };
        };
        assert.deepEqual(polyArrFrom(value), ["iterated"]);
    });

    it("preserves the existing direct iterator input support", () => {
        let index = 0;
        const iterator: any = { next: () => index++ === 0 ? { value: "iterated", done: false } : { done: true } };
        assert.deepEqual(polyArrFrom(iterator), ["iterated"]);
    });

    it("preserves direct iterator precedence over its iterable property", () => {
        let index = 0;
        const iterator: any = { next: () => index++ === 0 ? { value: "iterated", done: false } : { done: true } };
        Object.defineProperty(iterator, getKnownSymbol(WellKnownSymbols.iterator), { get: () => {
            throw new Error("iterable property must not be read");
        } });
        assert.deepEqual(polyArrFrom(iterator), ["iterated"]);
    });

    it("resolves an iterable method once", () => {
        let reads = 0;
        let index = 0;
        const value: any = { length: 1, 0: "ignored" };
        Object.defineProperty(value, getKnownSymbol(WellKnownSymbols.iterator), { get: () => {
            reads++;
            if (reads > 2) {
                throw new Error("unexpected extra iterable read");
            }
            return () => ({ next: () => index++ === 0 ? { value: "iterated", done: false } : { done: true } });
        } });
        assert.deepEqual(polyArrFrom(value), ["iterated"]);
        assert.equal(reads, 1);
    });

    it("does not add next getter reads to direct iterator consumption", () => {
        let reads = 0;
        let index = 0;
        const iterator: any = {};
        Object.defineProperty(iterator, "next", { get: () => {
            reads++;
            if (reads > 4) {
                throw new Error("unexpected extra next read");
            }
            return () => index++ === 0 ? { value: "iterated", done: false } : { done: true };
        } });
        assert.deepEqual(polyArrFrom(iterator), ["iterated"]);
        assert.equal(reads, 4);
    });

    it("rejects non-callable iterable methods instead of using array-like indexes", () => {
        const invalid: any[] = [true, false, 0, "invalid", {}];
        for (let idx = 0; idx < invalid.length; idx++) {
            const value: any = { length: 1, 0: "ignored" };
            value[getKnownSymbol(WellKnownSymbols.iterator)] = invalid[idx];
            assert.throws(() => polyArrFrom(value), TypeError);
            assert.throws(() => Array.from(value), TypeError);
        }
    });

    it("creates own data properties over read-only inherited array indexes", () => {
        const input = ["own"];
        const previous = Object.getOwnPropertyDescriptor(Array.prototype, "0");
        let result: string[];
        let failure: any;
        try {
            Object.defineProperty(Array.prototype, "0", { value: "inherited", writable: false, configurable: true });
            result = polyArrFrom(input);
        } catch (error) {
            failure = error;
        } finally {
            if (previous) {
                Object.defineProperty(Array.prototype, "0", previous);
            } else {
                delete Array.prototype[0];
            }
        }
        assert.equal(failure, undefined);
        assert.deepEqual(result, ["own"]);
        assert.deepEqual(Object.getOwnPropertyDescriptor(result, "0"), { value: "own", writable: true, enumerable: true, configurable: true });
    });

    it("does not invoke inherited array index setters", () => {
        const input = ["own"];
        const previous = Object.getOwnPropertyDescriptor(Array.prototype, "0");
        let setterCalls = 0;
        let result: string[];
        let failure: any;
        try {
            Object.defineProperty(Array.prototype, "0", { set: () => {
                setterCalls++;
            }, configurable: true });
            result = polyArrFrom(input);
        } catch (error) {
            failure = error;
        } finally {
            if (previous) {
                Object.defineProperty(Array.prototype, "0", previous);
            } else {
                delete Array.prototype[0];
            }
        }
        assert.equal(failure, undefined);
        assert.equal(setterCalls, 0);
        assert.deepEqual(result, ["own"]);
        assert.equal(Object.prototype.hasOwnProperty.call(result, "0"), true);
    });

    it("invokes a mapper independently of its own call property", () => {
        const mapper = (value: number) => value * 2;
        (mapper as any).call = null;
        assert.deepEqual(polyArrFrom([1, 2], mapper), [2, 4]);
        assert.deepEqual(polyArrFrom({ length: 2, 0: 1, 1: 2 }, mapper), [2, 4]);
    });

    it("retains iterator cleanup when mapping throws", () => {
        const failure = new Error("mapping failed");
        let returned = 0;
        const iterator: any = {
            next: () => ({ value: "value", done: false }),
            return: () => {
                returned++; return { done: true };
            }
        };
        assert.throws(() => polyArrFrom(iterator, () => {
            throw failure;
        }), /mapping failed/);
        assert.equal(returned, 1);
    });

    it("retains shallow element references and creates a fresh empty array", () => {
        const element = { value: 1 };
        assert.strictEqual(polyArrFrom({ length: 1, 0: element })[0], element);
        const empty: any[] = [];
        const result = polyArrFrom(empty);
        assert.deepEqual(result, []);
        assert.notStrictEqual(result, empty);
    });
});
