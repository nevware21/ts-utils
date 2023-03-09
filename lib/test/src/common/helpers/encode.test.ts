/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { encodeAsHtml, encodeAsJson, normalizeJsName } from "../../../../src/helpers/encode";
import { arrContains } from "../../../../src/array/includes";

describe("encodeAsJson helper", () => {
    it("null/undefined", () => {
        assert.equal(encodeAsJson(null), "null");
        assert.equal(encodeAsJson(undefined), undefined);
    });

    it("string values", () => {
        assert.equal(encodeAsJson("null"), "\"null\"");
        assert.equal(encodeAsJson("undefined"), "\"undefined\"");
        assert.equal(encodeAsJson("abc"), "\"abc\"");
        assert.equal(encodeAsJson("abc.123"), "\"abc.123\"");
        assert.equal(encodeAsJson("321-abc"), "\"321-abc\"");
        assert.equal(encodeAsJson("Hello darkness, my \"old\" friend..."), "\"Hello darkness, my \\\"old\\\" friend...\"");
        assert.equal(encodeAsJson("Hello: Darkness"), "\"Hello: Darkness\"");
        assert.equal(encodeAsJson("Hello\\u003A Darkness"), "\"Hello\\\\u003A Darkness\"");
        assert.equal(encodeAsJson("`!@#$%^&*()_-+=[]{}:;'<>?"), "\"\\u0060!@#$%^&*()_-+=[]{}:;\\u0027<>?\"");
        assert.equal(encodeAsJson("0"), "\"0\"", "Checking '0'");
        assert.equal(encodeAsJson("1"), "\"1\"", "Checking '1'");
        assert.equal(encodeAsJson("aa"), "\"aa\"", "Checking 'aa'");
        assert.equal(encodeAsJson(0), "0", "Checking 0");
        assert.equal(encodeAsJson(1), "1", "Checking 1");
        assert.equal(encodeAsJson(""), "\"\"", "Checking ''");
        assert.equal(encodeAsJson("true"), "\"true\"", "Checking 'true'");
        assert.equal(encodeAsJson("false"), "\"false\"", "Checking 'false'");
    });

    it("non-string values", () => {
        assert.equal(encodeAsJson({}), "{}");
        assert.equal(encodeAsJson({
            Hello: "Darkness"
        }), "{\"Hello\":\"Darkness\"}");

        let dt = new Date();
        assert.equal(encodeAsJson(dt), JSON.stringify(dt));
        //assert.equal(encodeAsJson(_dummyFunction), true, "Checking _dummyFunction");
        assert.equal(encodeAsJson([]), "[]", "Checking []");
        assert.equal(encodeAsJson(["A"]), "[\"A\"]", "Checking ['A']");
        assert.equal(encodeAsJson([0]), "[0]", "Checking [0]");
        assert.equal(encodeAsJson([false]), "[false]", "Checking [false]");
        assert.equal(encodeAsJson(new Array(1)), "[null]", "Checking new Array(1)");
        assert.equal(encodeAsJson(true), "true", "Checking true");
        assert.equal(encodeAsJson(false), "false", "Checking false");
    });

    it("invalid values", () => {
        let invalid = {
            a: {
                b: 1
            },
            c: null as any
        };
        invalid.c = invalid;

        let invalidJson = encodeAsJson(invalid);
        assert.ok(arrContains(invalidJson, "[object Error]"), "Contains Error: " + invalidJson);
        assert.ok(arrContains(invalidJson, "circular structure"), "Contains circular structure " + invalidJson);
    });
});

describe("normalizeJsName", () => {
    it("null / undefined", () => {
        assert.equal(normalizeJsName(null as any), "null");
        assert.equal(normalizeJsName(undefined as any), "undefined");
    });

    it("basic non-camel names", () => {
        assert.equal(normalizeJsName("HelloDarkness"), "HelloDarkness");
        assert.equal(normalizeJsName("Hello Darkness"), "Hello_Darkness");
        assert.equal(normalizeJsName("hello Darkness"), "hello_Darkness");
        assert.equal(normalizeJsName("hello Darkness"), "hello_Darkness");
        assert.equal(normalizeJsName("hello.Darkness"), "hello_Darkness");
        assert.equal(normalizeJsName("hello-Darkness"), "hello_Darkness");
        assert.equal(normalizeJsName("hello_Darkness"), "hello_Darkness");
        assert.equal(normalizeJsName("abc-123"), "abc_123");
        assert.equal(normalizeJsName("0abc0"), "0abc0");
        assert.equal(normalizeJsName("\"HelloDarkness\""), "_HelloDarkness_");
        assert.equal(normalizeJsName("\"Hello Darkness\""), "_Hello_Darkness_");
        assert.equal(normalizeJsName("\"hello Darkness\""), "_hello_Darkness_");
        assert.equal(normalizeJsName("\"hello Darkness\""), "_hello_Darkness_");
        assert.equal(normalizeJsName("\"hello .,#[]Darkness\""), "_hello______Darkness_");
    });

    it("basic camel names - true", () => {
        assert.equal(normalizeJsName("HelloDarkness", true), "helloDarkness");
        assert.equal(normalizeJsName("Hello Darkness", true), "helloDarkness");
        assert.equal(normalizeJsName("hello Darkness", true), "helloDarkness");
        assert.equal(normalizeJsName("hello Darkness", true), "helloDarkness");
        assert.equal(normalizeJsName("hello.Darkness", true), "helloDarkness");
        assert.equal(normalizeJsName("hello-Darkness", true), "helloDarkness");
        assert.equal(normalizeJsName("hello_Darkness", true), "helloDarkness");
        assert.equal(normalizeJsName("abc-123", true), "abc123");
        assert.equal(normalizeJsName("0abc0", true), "0abc0");
        assert.equal(normalizeJsName("\"HelloDarkness\"", true), "helloDarkness");
        assert.equal(normalizeJsName("\"Hello Darkness\"", true), "helloDarkness");
        assert.equal(normalizeJsName("hello \"Darkness\"", true), "helloDarkness");
        assert.equal(normalizeJsName("hello \"Darkness\"", true), "helloDarkness");
        assert.equal(normalizeJsName("\"hello .,#[]Darkness\"", true), "helloDarkness");
    });

    it("basic camel names - false", () => {
        assert.equal(normalizeJsName("HelloDarkness", false), "HelloDarkness");
        assert.equal(normalizeJsName("Hello Darkness", false), "HelloDarkness");
        assert.equal(normalizeJsName("hello Darkness", false), "HelloDarkness");
        assert.equal(normalizeJsName("hello Darkness", false), "HelloDarkness");
        assert.equal(normalizeJsName("hello.Darkness", false), "HelloDarkness");
        assert.equal(normalizeJsName("hello-Darkness", false), "HelloDarkness");
        assert.equal(normalizeJsName("hello_Darkness", false), "HelloDarkness");
        assert.equal(normalizeJsName("abc-123", false), "Abc123");
        assert.equal(normalizeJsName("0abc0", false), "0abc0");
        assert.equal(normalizeJsName("\"HelloDarkness\"", false), "HelloDarkness");
        assert.equal(normalizeJsName("\"Hello Darkness\"", false), "HelloDarkness");
        assert.equal(normalizeJsName("hello \"Darkness\"", false), "HelloDarkness");
        assert.equal(normalizeJsName("hello \"Darkness\"", false), "HelloDarkness");
        assert.equal(normalizeJsName("\"hello .,#[]Darkness\"", false), "HelloDarkness");
    });
});

describe("encodeAsHtml", () => {
    it("null / undefined", () => {
        assert.equal(encodeAsHtml(null as any), "null");
        assert.equal(encodeAsHtml(undefined as any), "undefined");
    });

    it("basic encoding names", () => {
        assert.equal(encodeAsHtml("HelloDarkness"), "HelloDarkness");
        assert.equal(encodeAsHtml("Hello Darkness"), "Hello Darkness");
        assert.equal(encodeAsHtml("hello Darkness"), "hello Darkness");
        assert.equal(encodeAsHtml("hello Darkness"), "hello Darkness");
        assert.equal(encodeAsHtml("hello.Darkness"), "hello.Darkness");
        assert.equal(encodeAsHtml("hello-Darkness"), "hello-Darkness");
        assert.equal(encodeAsHtml("hello_Darkness"), "hello_Darkness");
        assert.equal(encodeAsHtml("abc-123"), "abc-123");
        assert.equal(encodeAsHtml("0abc0"), "0abc0");
        assert.equal(encodeAsHtml("\"HelloDarkness\""), "&quot;HelloDarkness&quot;");
        assert.equal(encodeAsHtml("\"Hello Darkness\""), "&quot;Hello Darkness&quot;");
        assert.equal(encodeAsHtml("\"hello Darkness\""), "&quot;hello Darkness&quot;");
        assert.equal(encodeAsHtml("\"hello Darkness\""), "&quot;hello Darkness&quot;");
        assert.equal(encodeAsHtml("\"hello .,#<[]>Darkness\""), "&quot;hello .,#&lt;[]&gt;Darkness&quot;");
    });

    it("Basic html encoding", () => {
        assert.equal(encodeAsHtml("<script src=\"javascript:alert('Hello');\"></script>"), "&lt;script src=&quot;javascript:alert(&#39;Hello&#39;);&quot;&gt;&lt;/script&gt;");
    });
});