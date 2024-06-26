/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
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
            assert.equal(dumpObj(null, 2), "[object Null]: null");
        });

        it("validate type numbers", () => {
            assert.equal(dumpObj(0), "[object Number]: 0");
            assert.equal(dumpObj(1, true), "[object Number]: 1");
            assert.equal(dumpObj(2, 2), "[object Number]: 2");
        });

        it("validate object", () => {
            let value = {
                hello: "darkness"
            };

            assert.equal(dumpObj(value), "[object Object]: {hello: \"darkness\"}");
            assert.equal(dumpObj(value, true), "[object Object]: {\n    hello: \"darkness\"\n}");
            assert.equal(dumpObj(value, 2), "[object Object]: {\n  hello: \"darkness\"\n}");
        });

        it("Validate circular dump - which throws", () => {
            var ug: any = {};
            ug.ug = {};
            ug.ug.ug = ug;

            assert.ok(dumpObj(ug).indexOf("[object Object]: ") === 0);
            assert.ok(dumpObj(ug, 2).indexOf("[object Object]: ") === 0);
            assert.ok(dumpObj(ug, true).indexOf("[object Object]: ") === 0);
        });

        it("validate array", () => {
            let value = [1, 2, 3];

            assert.equal(dumpObj(value), "[object Array]: [1,2,3]");
            assert.equal(dumpObj(value, true), "[object Array]: [\n    1,\n    2,\n    3\n]");
            assert.equal(dumpObj(value, 2), "[object Array]: [\n  1,\n  2,\n  3\n]");
        });

        it("validate string", () => {
            let value = "Hello Darkness";
            let result = JSON.stringify(value);

            assert.equal(dumpObj(value), "[object String]: " + result);
            assert.equal(dumpObj(value, true), "[object String]: " + result);
            assert.equal(dumpObj(value, 2), "[object String]: " + result);
        });

        it("validate boolean", () => {
            let value = true;

            assert.equal(dumpObj(value), "[object Boolean]: true");
            assert.equal(dumpObj(value, true), "[object Boolean]: true");
            assert.equal(dumpObj(value, 2), "[object Boolean]: true");
        });

        it("validate date", () => {
            let value = new Date();
            let result = JSON.stringify(value);

            assert.equal(dumpObj(value), "[object Date]: " + result);
            assert.equal(dumpObj(value, true), "[object Date]: " + result);
            assert.equal(dumpObj(value, 2), "[object Date]: " + result);
        });

        it("validate function", () => {
            let value = () => { };
            let result = String(value);

            assert.equal(dumpObj(value), "[object Function]: " + result);
            assert.equal(dumpObj(value, true), "[object Function]: " + result);
            assert.equal(dumpObj(value, 2), "[object Function]: " + result);
        });

        it("validate symbol", () => {
            let value = Symbol("hello darkness");

            assert.equal(dumpObj(value), "[object Symbol]: Symbol(hello darkness)");
            assert.equal(dumpObj(value, true), "[object Symbol]: Symbol(hello darkness)");
            assert.equal(dumpObj(value, 2), "[object Symbol]: Symbol(hello darkness)");
        });

        it("validate bigint", () => {
            let value = BigInt(42);

            assert.ok(dumpObj(value).startsWith("[object BigInt]: "), dumpObj(value));
            assert.ok(dumpObj(value, true).startsWith("[object BigInt]: "), dumpObj(value, true));
            assert.ok(dumpObj(value, 2).startsWith("[object BigInt]: "), dumpObj(value, 2));
        });

        it("validate error", () => {
            let value = new Error("Hello Darkness");

            let dumpValue = dumpObj(value);
            assert.equal(dumpValue.indexOf("[object Error]: {stack: \"Error: Hello Darkness") === 0, true, dumpObj(value));
            assert.equal(dumpValue.indexOf("message: \"Hello Darkness\"") > 0, true, dumpObj(value));
            assert.equal(dumpValue.indexOf("name: \"Error\"") > 0, true, dumpObj(value));

            dumpValue = dumpObj(value, true);
            assert.equal(dumpValue.indexOf("[object Error]: {\n    stack: \"Error: Hello Darkness") === 0, true, dumpObj(value, true));
            assert.equal(dumpValue.indexOf("message: \"Hello Darkness\"") > 0, true, dumpObj(value, true));
            assert.equal(dumpValue.indexOf("name: \"Error\"") > 0, true, dumpObj(value, true));

            dumpValue = dumpObj(value, 2);
            assert.equal(dumpValue.indexOf("[object Error]: {\n  stack: \"Error: Hello Darkness") === 0, true, dumpObj(value, 2));
            assert.equal(dumpValue.indexOf("message: \"Hello Darkness\"") > 0, true, dumpObj(value, 2));
            assert.equal(dumpValue.indexOf("name: \"Error\"") > 0, true, dumpObj(value, 2));
        });

        it("validate error - with circular reference", () => {
            let value = new Error("Hello Darkness");
            (value as any).stack = value;

            let stackValue = String(value.stack);

            assert.equal(dumpObj(value), "[object Error]: {stack: \"" + stackValue + "\",message: \"Hello Darkness\",name: \"Error\"}");
            assert.equal(dumpObj(value, true), "[object Error]: {\n    stack: \"" + stackValue + "\",\n    message: \"Hello Darkness\",\n    name: \"Error\"\n}");
            assert.equal(dumpObj(value, 2), "[object Error]: {\n  stack: \"" + stackValue + "\",\n  message: \"Hello Darkness\",\n  name: \"Error\"\n}");
        });

        it("validate error - with circular reference - with circular reference", () => {
            let value = new Error("Hello Darkness");
            (value as any).stack = value;
            (value as any).circular = { value };

            let stackValue = String(value.stack);

            assert.equal(dumpObj(value), "[object Error]: {stack: \"" + stackValue + "\",message: \"Hello Darkness\",name: \"Error\"}");
            assert.equal(dumpObj(value, true), "[object Error]: {\n    stack: \"" + stackValue + "\",\n    message: \"Hello Darkness\",\n    name: \"Error\"\n}");
            assert.equal(dumpObj(value, 2), "[object Error]: {\n  stack: \"" + stackValue + "\",\n  message: \"Hello Darkness\",\n  name: \"Error\"\n}");
        });

        it("validate object - with circular reference - with circular reference", () => {
            let value: any = { name: "Hello Darkness" };
            (value as any).stack = value;
            (value as any).circular = { value };

            assert.ok(dumpObj(value).startsWith("[object Object]: "), dumpObj(value));
            assert.ok(dumpObj(value).indexOf("Converting circular structure to JSON") != -1, dumpObj(value));
            assert.ok(dumpObj(value, true).startsWith("[object Object]: "), dumpObj(value, true));
            assert.ok(dumpObj(value, true).indexOf("Converting circular structure to JSON") != -1, dumpObj(value));
            assert.ok(dumpObj(value, 2).startsWith("[object Object]: "), dumpObj(value, 2));
            assert.ok(dumpObj(value, 2).indexOf("Converting circular structure to JSON") != -1, dumpObj(value));
        });
    });
});

