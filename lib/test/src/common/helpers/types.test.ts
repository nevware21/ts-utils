/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import {
    DeepPartial, DeepReadonly, DeepRequired, IdleCallbackFn, IIdleDeadline, IIdleRequestOptions, Mutable,
    NonEmptyArray, ObjDefinePropDescriptorMap, objDefineProps, ReadonlyRecord, RequestIdleCallback, ValueOf
} from "../../../../src/index";

type IsEqual<T, U> =
    (<V>() => V extends T ? 1 : 2) extends
    (<V>() => V extends U ? 1 : 2) ? true : false;

type AssertTrue<T extends true> = T;

type ExampleType = {
    readonly id: string;
    profile?: {
        tags?: string[];
        contact?: {
            email?: string;
        };
    };
};

describe("typing helper aliases", () => {
    it("should compile expected alias mappings", () => {
        type ExampleValue = ValueOf<{ a: "a"; b: 10; c: false }>;
        type _valueOfCheck = AssertTrue<IsEqual<ExampleValue, "a" | 10 | false>>;

        type _readonlyRecordCheck = AssertTrue<IsEqual<ReadonlyRecord<"a" | "b", number>, Readonly<{ a: number; b: number }>>>;
        type _nonEmptyArrayCheck = AssertTrue<IsEqual<NonEmptyArray<string>, [string, ...string[]]>>;

        type MutableExample = Mutable<ExampleType>;
        type _mutableCheck = AssertTrue<IsEqual<MutableExample["id"], string>>;

        type DeepPartialExample = DeepPartial<ExampleType>;
        type _deepPartialCheck = AssertTrue<IsEqual<DeepPartialExample["profile"], {
            tags?: ReadonlyArray<string> | undefined;
            contact?: {
                email?: string | undefined;
            } | undefined;
        } | undefined>>;

        type DeepReadonlyExample = DeepReadonly<ExampleType>;
        type _deepReadonlyCheck = AssertTrue<IsEqual<DeepReadonlyExample["profile"], {
            readonly tags?: ReadonlyArray<string> | undefined;
            readonly contact?: {
                readonly email?: string | undefined;
            } | undefined;
        } | undefined>>;

        type DeepRequiredExample = DeepRequired<ExampleType>;
        type _deepRequiredCheck = AssertTrue<IsEqual<DeepRequiredExample["profile"], {
            tags: ReadonlyArray<string>;
            contact: {
                email: string;
            };
        }>>;

        const allGood = true;

        assert.equal(allGood, true, "Type alias compile checks should pass");
    });

    it("should map arrays to readonly arrays of the deep type", () => {
        type _partialArray = AssertTrue<IsEqual<DeepPartial<string[]>, ReadonlyArray<string>>>;
        type _partialReadonlyArray = AssertTrue<IsEqual<DeepPartial<ReadonlyArray<number>>, ReadonlyArray<number>>>;
        type _partialNestedArray = AssertTrue<IsEqual<DeepPartial<number[][]>, ReadonlyArray<ReadonlyArray<number>>>>;
        type _readonlyArray = AssertTrue<IsEqual<DeepReadonly<string[]>, ReadonlyArray<string>>>;
        type _readonlyNestedArray = AssertTrue<IsEqual<DeepReadonly<number[][]>, ReadonlyArray<ReadonlyArray<number>>>>;
        type _requiredArray = AssertTrue<IsEqual<DeepRequired<Array<string | undefined>>, ReadonlyArray<string>>>;
        type _partialUnion = AssertTrue<IsEqual<DeepPartial<string[] | number>, ReadonlyArray<string> | number>>;
        type _partialFunction = AssertTrue<IsEqual<DeepPartial<() => void>, () => void>>;
        type _readonlyTuple = AssertTrue<IsEqual<DeepReadonly<[string, number]>, ReadonlyArray<string | number>>>;
        type _partialTuple = AssertTrue<IsEqual<DeepPartial<[string, number]>, ReadonlyArray<string | number>>>;

        type ArrayOfObjects = DeepPartial<{ items: Array<{ id: number; tag: string }> }>;
        type _arrayOfObjects = AssertTrue<IsEqual<ArrayOfObjects["items"], ReadonlyArray<{ id?: number; tag?: string }> | undefined>>;

        type Node = { next: Node[]; value: string };
        const recursive: DeepPartial<Node> = { next: [ { next: [ { value: "c" } ] } ], value: "a" };
        const required: DeepRequired<Node> = { next: [], value: "b" };

        assert.equal(recursive.value, "a", "Recursive types can be used");
        assert.equal(required.next.length, 0, "Recursive types can be used");
    });

    it("should support string, number and symbol keys for ObjDefinePropDescriptorMap", () => {
        const theSymbol = Symbol("key");
        const props: ObjDefinePropDescriptorMap = {
            name: { v: "a" },
            1: { v: "b" },
            [theSymbol]: { v: "c" }
        };

        const target: any = objDefineProps({}, props);

        assert.equal(target.name, "a", "String key");
        assert.equal(target[1], "b", "Number key");
        assert.equal(target[theSymbol], "c", "Symbol key");
    });

    it("should be compatible with the native idle callback types", () => {
        let deadlines = 0;
        const nativeCallback: IdleRequestCallback = (deadline: IdleDeadline) => {
            deadlines += deadline.timeRemaining();
        };

        // Each of the types must be assignable in both directions
        const callback: IdleCallbackFn = nativeCallback;
        const nativeFromCallback: IdleRequestCallback = callback;
        const deadline: IIdleDeadline = { didTimeout: false, timeRemaining: () => 1 };
        const nativeDeadline: IdleDeadline = deadline;
        const deadlineFromNative: IIdleDeadline = nativeDeadline;
        const nativeOptions: IdleRequestOptions = { timeout: 10 };
        const options: IIdleRequestOptions = nativeOptions;
        const optionsToNative: IdleRequestOptions = options;

        // The native function can be used for the override type and vice-versa
        const nativeRequest: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number = () => 42;
        const request: RequestIdleCallback = nativeRequest;
        const requestToNative: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number = request;

        nativeFromCallback(deadlineFromNative);
        assert.equal(deadlines, 1, "The callback was called with the deadline");
        assert.equal(optionsToNative.timeout, 10, "The options are retained");
        assert.equal(requestToNative(callback), 42, "The native function was called");
    });
});
