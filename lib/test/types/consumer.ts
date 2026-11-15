/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

// This file is only compiled (never run) by lib/test/typescript-versions-check.js, against the generated
// lib/dist/types/ts-utils.d.ts with each TypeScript version, to check that a consumer can use the exported types.
// So it must only use syntax supported by TypeScript v3.4 (eg. no optional chaining, "import type" or template
// literal types), and should use the exported types which depend on newer TypeScript features.

import {
    arrFrom, arrGroupBy, arrIncludes, arrIndexOfSubset, arrLastIndexOfSubset, arrMap, arrReduce, arrSlice,
    BoundFunction, createCachedValue, createCustomError, createEnum, createIterable, DeepPartial, DeepReadonly,
    DeepRequired, deepExtend, fnApply, fnBind, fnCall, getLazy, IAsyncIterable, IIdleDeadline, isAsyncIterable,
    isPromiseLike, iterMap, iterToArray, Mutable, NonEmptyArray, objDeepCopy, objDefineProps, objEntries, objForEachKey,
    objFreeze, objFromEntries, objOmit, objPick, ReadonlyRecord, scheduleIdleCallback, scheduleTimeout, strCamelCase,
    strPadStart, ValueOf
} from "@nevware21/ts-utils";

interface ITest {
    name: string;
    count: number;
    nested: {
        values: number[];
        flag?: boolean;
    };
}

// Deep and mapped types
const partial: DeepPartial<ITest> = { nested: { values: [1] } };
const readonlyValue: DeepReadonly<ITest> = { name: "a", count: 1, nested: { values: [1, 2] } };
const required: DeepRequired<ITest> = { name: "a", count: 1, nested: { values: [1], flag: true } };
const mutable: Mutable<Readonly<ITest>> = { name: "a", count: 1, nested: { values: [] } };
mutable.count = 2;
const record: ReadonlyRecord<string, number> = { a: 1 };
const valueOf: ValueOf<{ a: string; b: number }> = "a";
const nonEmpty: NonEmptyArray<number> = [1, 2];
const firstValue: number = readonlyValue.nested.values[0] + required.nested.values[0] + nonEmpty[0] + record["a"];

// The deep types map an array to a readonly array
const requiredValues: ReadonlyArray<number> = required.nested.values;
const partialValues: ReadonlyArray<number> | undefined = partial.nested ? partial.nested.values : undefined;
const test: ITest = { name: "a", count: 1, nested: { values: [1] } };

// Arrays
const subsetIdx: number = arrIndexOfSubset([1, 2, 3], [2, 3]) + arrLastIndexOfSubset("abc", ["b"]);
const mapped: string[] = arrMap([1, 2, 3], (value) => String(value));
const total: number = arrReduce([1, 2, 3], (prev, value) => prev + value, 0);
const grouped: Record<string | number | symbol, number[]> = arrGroupBy([1, 2, 3], (value) => value % 2 ? "odd" : "even");
const sliced: number[] = arrSlice([1, 2, 3], 1);
const slicedStr: string = arrSlice("abc", 1);
const slicedTyped: Uint8Array = arrSlice(new Uint8Array(2), 1);
const fromValues: number[] = arrFrom({ length: 2, 0: 1, 1: 2 }, (value: number) => value * 2);
const hasValue: boolean = arrIncludes([1, 2], 2);

// Functions
function add(this: any, a: number, b: number): number {
    return a + b;
}

const bound: (b: number) => number = fnBind(add, null, 1);
const boundType: BoundFunction<typeof add, [number]> = bound;
const called: number = fnCall(add, null, 1, 2) + fnApply(add, null, [1, 2]) + boundType(2);
const lazy = getLazy(() => 42);
const lazyValue: number = lazy.v + createCachedValue(1).v;

// Objects
const picked: Pick<ITest, "name"> = objPick(test, ["name"]);
const omitted: Pick<ITest, Exclude<keyof ITest, "count">> = objOmit(test, ["count"]);
const copied: ITest = objDeepCopy(test);
const extended = deepExtend({ a: 1 }, { b: 2 });
const frozen: ITest = objFreeze(test);
const entries: [string, number][] = objEntries({ a: 1 });
const fromEntries: { [k: string]: number } = objFromEntries([["a", 1]]);
const defined = objDefineProps({}, { value: { v: 1 } });
objForEachKey(test, (key, value) => {
    return key === "name" && value ? -1 : undefined;
});

// Enums and errors
const enumValuesSrc = { Value1: 0, Value2: 1 };
const enumValues = createEnum<typeof enumValuesSrc>(enumValuesSrc);
const enumValue: number = enumValues.Value1;
const MyError = createCustomError("MyError");
const anError: Error = new MyError("message");

// Iterators and async values
const iterable: Iterable<number> = createIterable<number>({
    n: function () {
        return true;
    }
});
const iterValues: string[] = iterToArray(iterMap([1, 2], (value) => String(value)));

function _checkAsync(value: any): number {
    if (isAsyncIterable<number>(value)) {
        const asyncIterable: IAsyncIterable<number> = value;
        return asyncIterable ? 1 : 0;
    }

    return isPromiseLike<number>(value) ? 2 : 0;
}

// Timers and idle callbacks
const timer = scheduleTimeout((a: number, b: string) => {
    return a + b;
}, 10, 1, "a");
timer.cancel();
const idle = scheduleIdleCallback((deadline: IIdleDeadline) => {
    return deadline.timeRemaining() > 0 && !deadline.didTimeout;
}, { timeout: 10 });
idle.cancel();

// Strings
const strings: string = strCamelCase("hello-darkness") + strPadStart("a", 3, "-");

export const results = [
    partial, firstValue, requiredValues, partialValues, valueOf, subsetIdx, mapped, total, grouped, sliced, slicedStr, slicedTyped, fromValues,
    hasValue, called, lazyValue, picked, omitted, copied, extended, frozen, entries, fromEntries, defined, enumValue,
    anError, iterable, iterValues, _checkAsync, strings
];
