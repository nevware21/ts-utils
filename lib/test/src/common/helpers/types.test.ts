/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { DeepPartial, DeepReadonly, DeepRequired, Mutable, NonEmptyArray, ReadonlyRecord, ValueOf } from "../../../../src/index";

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
            tags?: ReadonlyArray<string | undefined> | undefined;
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
});
