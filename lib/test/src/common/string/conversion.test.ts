/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { strCamelCase, strCapitalizeWords, strKebabCase, strLetterCase, strSnakeCase } from "../../../../src/string/conversion";

describe("strLetterCase", () => {
    it("null/undefined", () => {
        assert.equal(strLetterCase(null), "Null");
        assert.equal(strLetterCase(undefined), "Undefined");
    });

    it("Basic", () => {
        assert.equal(strLetterCase("hello darkness"), "Hello Darkness");
        assert.equal(strLetterCase("hello_darkness"), "Hello_Darkness");
        assert.equal(strLetterCase("_hello_darkness"), "_Hello_Darkness");
        assert.equal(strLetterCase("hello darkness, my old friend."), "Hello Darkness, My Old Friend.");
    });

    it("Reverse kebabcase Basic", () => {
        assert.equal(strLetterCase(strKebabCase("hello darkness")), "Hello-Darkness");
        assert.equal(strLetterCase(strKebabCase("hello_darkness")), "Hello-Darkness");
        assert.equal(strLetterCase(strKebabCase("_hello_darkness")), "Hello-Darkness");
        assert.equal(strLetterCase(strKebabCase("hello darkness, my old friend.")), "Hello-Darkness-My-Old-Friend");
    });

    it("Reverse snakecase Basic", () => {
        assert.equal(strLetterCase(strSnakeCase("hello darkness")), "Hello_Darkness");
        assert.equal(strLetterCase(strSnakeCase("hello_darkness")), "Hello_Darkness");
        assert.equal(strLetterCase(strSnakeCase("_hello_darkness")), "Hello_Darkness");
        assert.equal(strLetterCase(strSnakeCase("hello darkness, my old friend.")), "Hello_Darkness_My_Old_Friend");
    });

    it("Reverse camel case Basic", () => {
        assert.equal(strLetterCase(strCamelCase("hello darkness")), "HelloDarkness");
        assert.equal(strLetterCase(strCamelCase("hello_darkness")), "HelloDarkness");
        assert.equal(strLetterCase(strCamelCase("_hello_darkness")), "HelloDarkness");
        assert.equal(strLetterCase(strCamelCase("hello darkness, my old friend.")), "HelloDarknessMyOldFriend");
    });
});

describe("strCapitalizeWords", () => {
    it("null/undefined", () => {
        assert.equal(strCapitalizeWords(null), "Null");
        assert.equal(strCapitalizeWords(undefined), "Undefined");
    });

    it("Basic", () => {
        assert.equal(strCapitalizeWords("hello darkness"), "Hello Darkness");
        assert.equal(strCapitalizeWords("hELLo dARKness"), "Hello Darkness");
        assert.equal(strCapitalizeWords("hello_darkness"), "Hello_Darkness");
        assert.equal(strCapitalizeWords("_hello_darkness"), "_Hello_Darkness");
        assert.equal(strCapitalizeWords("hello-darkness"), "Hello-Darkness");
        assert.equal(strCapitalizeWords("hello darkness, my old friend."), "Hello Darkness, My Old Friend.");
    });

    it("Reverse kebabcase Basic", () => {
        assert.equal(strCapitalizeWords(strKebabCase("hello darkness")), "Hello-Darkness");
        assert.equal(strCapitalizeWords(strKebabCase("hello_darkness")), "Hello-Darkness");
        assert.equal(strCapitalizeWords(strKebabCase("_hello_darkness")), "Hello-Darkness");
        assert.equal(strCapitalizeWords(strKebabCase("hello darkness, my old friend.")), "Hello-Darkness-My-Old-Friend");
    });

    it("Reverse snakecase Basic", () => {
        assert.equal(strCapitalizeWords(strSnakeCase("hello darkness")), "Hello_Darkness");
        assert.equal(strCapitalizeWords(strSnakeCase("hello_darkness")), "Hello_Darkness");
        assert.equal(strCapitalizeWords(strSnakeCase("_hello_darkness")), "Hello_Darkness");
        assert.equal(strCapitalizeWords(strSnakeCase("hello darkness, my old friend.")), "Hello_Darkness_My_Old_Friend");
    });

    it("Differs from strLetterCase by normalizing word casing", () => {
        assert.equal(strLetterCase("hELLo dARKness"), "HELLo DARKness");
        assert.equal(strCapitalizeWords("hELLo dARKness"), "Hello Darkness");
    });

    it("Differs from strCamelCase by preserving separators", () => {
        assert.equal(strCamelCase("hello-darkness"), "helloDarkness");
        assert.equal(strCapitalizeWords("hello-darkness"), "Hello-Darkness");
    });
});

describe("strCamelCase", () => {
    it("null/undefined", () => {
        assert.equal(strCamelCase(null), "null");
        assert.equal(strCamelCase(undefined), "undefined");
    });

    it("Basic", () => {
        assert.equal(strCamelCase("hello darkness"), "helloDarkness");
        assert.equal(strCamelCase("hello_darkness"), "helloDarkness");
        assert.equal(strCamelCase("_hello_darkness"), "helloDarkness");
        assert.equal(strCamelCase("hello-darkness"), "helloDarkness");
        assert.equal(strCamelCase("-hello-darkness"), "helloDarkness");
        assert.equal(strCamelCase("hello darkness, my old friend."), "helloDarknessMyOldFriend");
    });

    it("Pascal Case Basic", () => {
        assert.equal(strCamelCase("hello darkness", true), "HelloDarkness");
        assert.equal(strCamelCase("hello_darkness", true), "HelloDarkness");
        assert.equal(strCamelCase("_hello_darkness", true), "HelloDarkness");
        assert.equal(strCamelCase("hello-darkness", true), "HelloDarkness");
        assert.equal(strCamelCase("-hello-darkness", true), "HelloDarkness");
        assert.equal(strCamelCase("hello darkness, my old friend.", true), "HelloDarknessMyOldFriend");
    });

    it("Reverse Snake", () => {
        assert.equal(strCamelCase(strSnakeCase("hello darkness")), "helloDarkness");
        assert.equal(strCamelCase(strSnakeCase("hello_darkness")), "helloDarkness");
        assert.equal(strCamelCase(strSnakeCase("_hello_darkness")), "helloDarkness");
        assert.equal(strCamelCase(strSnakeCase("hello-darkness")), "helloDarkness");
        assert.equal(strCamelCase(strSnakeCase("-hello-darkness")), "helloDarkness");
        assert.equal(strCamelCase(strSnakeCase("hello darkness, my old friend.")), "helloDarknessMyOldFriend");
    });

    it("Reverse Kebab", () => {
        assert.equal(strCamelCase(strKebabCase("hello darkness")), "helloDarkness");
        assert.equal(strCamelCase(strKebabCase("hello_darkness")), "helloDarkness");
        assert.equal(strCamelCase(strKebabCase("_hello_darkness")), "helloDarkness");
        assert.equal(strCamelCase(strKebabCase("hello-darkness")), "helloDarkness");
        assert.equal(strCamelCase(strKebabCase("-hello-darkness")), "helloDarkness");
        assert.equal(strCamelCase(strKebabCase("hello darkness, my old friend.")), "helloDarknessMyOldFriend");
    });
});

describe("strKebabCase", () => {
    it("null/undefined", () => {
        assert.equal(strKebabCase(null), "null");
        assert.equal(strKebabCase(undefined), "undefined");
    });

    it("Basic", () => {
        assert.equal(strKebabCase("hello darkness"), "hello-darkness");
        assert.equal(strKebabCase("hello_darkness"), "hello-darkness");
        assert.equal(strKebabCase("_hello_darkness"), "hello-darkness");
        assert.equal(strKebabCase("hello darkness, my old friend."), "hello-darkness-my-old-friend");
    });

    it("Scream Basic", () => {
        assert.equal(strKebabCase("hello darkness", true), "HELLO-DARKNESS");
        assert.equal(strKebabCase("hello_darkness", true), "HELLO-DARKNESS");
        assert.equal(strKebabCase("_hello_darkness", true), "HELLO-DARKNESS");
        assert.equal(strKebabCase("hello darkness, my old friend.", true), "HELLO-DARKNESS-MY-OLD-FRIEND");
    });

    it("Reverse Camelcase Basic", () => {
        assert.equal(strKebabCase(strCamelCase("hello darkness")), "hello-darkness");
        assert.equal(strKebabCase(strCamelCase("hello_darkness")), "hello-darkness");
        assert.equal(strKebabCase(strCamelCase("_hello_darkness")), "hello-darkness");
        assert.equal(strKebabCase(strCamelCase("hello darkness, my old friend.")), "hello-darkness-my-old-friend");
    });

    it("Reverse Snakecase Basic", () => {
        assert.equal(strKebabCase(strSnakeCase("hello darkness")), "hello-darkness");
        assert.equal(strKebabCase(strSnakeCase("hello_darkness")), "hello-darkness");
        assert.equal(strKebabCase(strSnakeCase("_hello_darkness")), "hello-darkness");
        assert.equal(strKebabCase(strSnakeCase("hello darkness, my old friend.")), "hello-darkness-my-old-friend");
    });
});

describe("strSnakeCase", () => {
    it("null/undefined", () => {
        assert.equal(strSnakeCase(null), "null");
        assert.equal(strSnakeCase(undefined), "undefined");
    });

    describe("case conversion word boundaries", () => {
        it("normalizes mixed case and all-uppercase words", () => {
            assert.equal(strCamelCase("hELLo dARKness-my old_friend"), "helloDarknessMyOldFriend");
            assert.equal(strKebabCase("hELLo dARKness-my old_friend"), "hello-darkness-my-old-friend");
            assert.equal(strSnakeCase("hELLo dARKness-my old_friend"), "hello_darkness_my_old_friend");
            assert.equal(strCamelCase("ABC def"), "abcDef");
            assert.equal(strCamelCase("HELLO WORLD"), "helloWorld");
            assert.equal(strCamelCase("EFTPOS PURCHASE 1234"), "eftposPurchase1234");
            assert.equal(strCamelCase("HELLO WORLD", true), "HelloWorld");
        });

        it("recognizes camel case, acronyms and digit-to-uppercase boundaries consistently", () => {
            assert.equal(strKebabCase("ABCDef"), "abc-def");
            assert.equal(strKebabCase("XMLHttpRequest"), "xml-http-request");
            assert.equal(strSnakeCase("XMLHttpRequest"), "xml_http_request");
            assert.equal(strCamelCase("XMLHttpRequest"), "xmlHttpRequest");
            assert.equal(strKebabCase("fooBar2Baz"), "foo-bar2-baz");
            assert.equal(strSnakeCase("fooBar2Baz", true), "FOO_BAR2_BAZ");
            assert.equal(strCamelCase("fooBar2Baz"), "fooBar2Baz");
            assert.equal(strKebabCase("aBC"), "abc");
        });

        it("preserves Unicode letters, numbers and combining marks", () => {
            assert.equal(strCamelCase("café crème"), "caféCrème");
            assert.equal(strKebabCase("café crème"), "café-crème");
            assert.equal(strSnakeCase("über straße"), "über_straße");
            assert.equal(strCamelCase("über straße"), "überStraße");
            assert.equal(strCamelCase("über straße", true), "ÜberStraße");
            assert.equal(strCapitalizeWords("café crème"), "Café Crème");
            assert.equal(strLetterCase("café crème"), "Café Crème");
            assert.equal(strCamelCase("cafe\u0301 crème"), "cafe\u0301Crème");
            assert.equal(strKebabCase("cafe\u0301Crème"), "cafe\u0301-crème");
            assert.equal(strKebabCase("foo١Bar"), "foo١-bar");
            assert.equal(strKebabCase("東京・大阪"), "東京-大阪");
            assert.equal(strKebabCase("hello😀world"), "hello-world");
            assert.equal(strCamelCase("𐐀𐐨 test"), "𐐨𐐨Test");
        });

        it("removes edge separators while preserving capitalization separators", () => {
            assert.equal(strKebabCase("__init__"), "init");
            assert.equal(strKebabCase("--foo--"), "foo");
            assert.equal(strSnakeCase("O'Brien & Sons, Ltd."), "o_brien_sons_ltd");
            assert.equal(strCamelCase("O'Brien & Sons, Ltd."), "oBrienSonsLtd");
            assert.equal(strKebabCase("---"), "");
            assert.equal(strSnakeCase("___", true), "");
            assert.equal(strCamelCase(""), "");
            assert.equal(strCapitalizeWords("fooBarBaz"), "Foobarbaz");
            assert.equal(strCapitalizeWords("foo_bar-baz qux"), "Foo_Bar-Baz Qux");
        });
    });

    it("Basic", () => {
        assert.equal(strSnakeCase("hello darkness"), "hello_darkness");
        assert.equal(strSnakeCase("hello_darkness"), "hello_darkness");
        assert.equal(strSnakeCase("_hello_darkness"), "hello_darkness");
        assert.equal(strSnakeCase("hello-darkness"), "hello_darkness");
        assert.equal(strSnakeCase("-hello-darkness"), "hello_darkness");
        assert.equal(strSnakeCase("hello darkness, my old friend."), "hello_darkness_my_old_friend");
    });

    it("Scream Basic", () => {
        assert.equal(strSnakeCase("hello darkness", true), "HELLO_DARKNESS");
        assert.equal(strSnakeCase("hello_darkness", true), "HELLO_DARKNESS");
        assert.equal(strSnakeCase("_hello_darkness", true), "HELLO_DARKNESS");
        assert.equal(strSnakeCase("hello-darkness", true), "HELLO_DARKNESS");
        assert.equal(strSnakeCase("-hello-darkness", true), "HELLO_DARKNESS");
        assert.equal(strSnakeCase("hello darkness, my old friend.", true), "HELLO_DARKNESS_MY_OLD_FRIEND");
    });

    it("reverse camelcase Basic", () => {
        assert.equal(strSnakeCase(strCamelCase("hello darkness")), "hello_darkness");
        assert.equal(strSnakeCase(strCamelCase("hello_darkness")), "hello_darkness");
        assert.equal(strSnakeCase(strCamelCase("_hello_darkness")), "hello_darkness");
        assert.equal(strSnakeCase(strCamelCase("hello-darkness")), "hello_darkness");
        assert.equal(strSnakeCase(strCamelCase("-hello-darkness")), "hello_darkness");
        assert.equal(strSnakeCase(strCamelCase("hello darkness, my old friend.")), "hello_darkness_my_old_friend");
    });

    it("reverse kebab Basic", () => {
        assert.equal(strSnakeCase(strKebabCase("hello darkness")), "hello_darkness");
        assert.equal(strSnakeCase(strKebabCase("hello_darkness")), "hello_darkness");
        assert.equal(strSnakeCase(strKebabCase("_hello_darkness")), "hello_darkness");
        assert.equal(strSnakeCase(strKebabCase("hello-darkness")), "hello_darkness");
        assert.equal(strSnakeCase(strKebabCase("-hello-darkness")), "hello_darkness");
        assert.equal(strSnakeCase(strKebabCase("hello darkness, my old friend.")), "hello_darkness_my_old_friend");
    });
});
