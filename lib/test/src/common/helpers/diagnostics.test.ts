/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";

describe("diagnostic helpers", () => {
    describe("dumpObj", () => {
        it("validate type null or undefined", () => {
            assert.equal(dumpObj(undefined), "[object Undefined]: undefined");
            assert.equal(dumpObj(undefined, true), "[object Undefined]: undefined");
            assert.equal(dumpObj(undefined, 2), "[object Undefined]: undefined");
            assert.equal(dumpObj(null), "[object Null]: null");
            assert.equal(dumpObj(null, true), "[object Null]: null");
            assert.equal(dumpObj(null, 2), "[object Null]: null");
        });

        it("validate type numbers", () => {
            assert.equal(dumpObj(0), "[object Number]: 0");
            assert.equal(dumpObj(1, true), "[object Number]: 1");
            assert.equal(dumpObj(2, 2), "[object Number]: 2");
        });

        it("validate object", () => {
            assert.equal(dumpObj({ hello: "world" }), "[object Object]: {\"hello\":\"world\"}");
            assert.equal(dumpObj({ hello: "world" }, true), "[object Object]: {\n    \"hello\": \"world\"\n}");
            assert.equal(dumpObj({ hello: "world" }, 2), "[object Object]: {\n  \"hello\": \"world\"\n}");
        });

    });
});

