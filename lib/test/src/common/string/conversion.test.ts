/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { strCamelCase, strKebabCase, strLetterCase, strSnakeCase } from "../../../../src/string/conversion";

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
        assert.equal(strLetterCase(strKebabCase("_hello_darkness")), "-Hello-Darkness");
        assert.equal(strLetterCase(strKebabCase("hello darkness, my old friend.")), "Hello-Darkness-My-Old-Friend-");
    });

    it("Reverse snakecase Basic", () => {
        assert.equal(strLetterCase(strSnakeCase("hello darkness")), "Hello_Darkness");
        assert.equal(strLetterCase(strSnakeCase("hello_darkness")), "Hello_Darkness");
        assert.equal(strLetterCase(strSnakeCase("_hello_darkness")), "_Hello_Darkness");
        assert.equal(strLetterCase(strSnakeCase("hello darkness, my old friend.")), "Hello_Darkness_My_Old_Friend_");
    });

    it("Reverse camel case Basic", () => {
        assert.equal(strLetterCase(strCamelCase("hello darkness")), "HelloDarkness");
        assert.equal(strLetterCase(strCamelCase("hello_darkness")), "HelloDarkness");
        assert.equal(strLetterCase(strCamelCase("_hello_darkness")), "HelloDarkness");
        assert.equal(strLetterCase(strCamelCase("hello darkness, my old friend.")), "HelloDarknessMyOldFriend");
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
        assert.equal(strKebabCase("_hello_darkness"), "-hello-darkness");
        assert.equal(strKebabCase("hello darkness, my old friend."), "hello-darkness-my-old-friend-");
    });

    it("Scream Basic", () => {
        assert.equal(strKebabCase("hello darkness", true), "HELLO-DARKNESS");
        assert.equal(strKebabCase("hello_darkness", true), "HELLO-DARKNESS");
        assert.equal(strKebabCase("_hello_darkness", true), "-HELLO-DARKNESS");
        assert.equal(strKebabCase("hello darkness, my old friend.", true), "HELLO-DARKNESS-MY-OLD-FRIEND-");
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
        assert.equal(strKebabCase(strSnakeCase("_hello_darkness")), "-hello-darkness");
        assert.equal(strKebabCase(strSnakeCase("hello darkness, my old friend.")), "hello-darkness-my-old-friend-");
    });
});

describe("strSnakeCase", () => {
    it("null/undefined", () => {
        assert.equal(strSnakeCase(null), "null");
        assert.equal(strSnakeCase(undefined), "undefined");
    });

    it("Basic", () => {
        assert.equal(strSnakeCase("hello darkness"), "hello_darkness");
        assert.equal(strSnakeCase("hello_darkness"), "hello_darkness");
        assert.equal(strSnakeCase("_hello_darkness"), "_hello_darkness");
        assert.equal(strSnakeCase("hello-darkness"), "hello_darkness");
        assert.equal(strSnakeCase("-hello-darkness"), "_hello_darkness");
        assert.equal(strSnakeCase("hello darkness, my old friend."), "hello_darkness_my_old_friend_");
    });

    it("Scream Basic", () => {
        assert.equal(strSnakeCase("hello darkness", true), "HELLO_DARKNESS");
        assert.equal(strSnakeCase("hello_darkness", true), "HELLO_DARKNESS");
        assert.equal(strSnakeCase("_hello_darkness", true), "_HELLO_DARKNESS");
        assert.equal(strSnakeCase("hello-darkness", true), "HELLO_DARKNESS");
        assert.equal(strSnakeCase("-hello-darkness", true), "_HELLO_DARKNESS");
        assert.equal(strSnakeCase("hello darkness, my old friend.", true), "HELLO_DARKNESS_MY_OLD_FRIEND_");
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
        assert.equal(strSnakeCase(strKebabCase("_hello_darkness")), "_hello_darkness");
        assert.equal(strSnakeCase(strKebabCase("hello-darkness")), "hello_darkness");
        assert.equal(strSnakeCase(strKebabCase("-hello-darkness")), "_hello_darkness");
        assert.equal(strSnakeCase(strKebabCase("hello darkness, my old friend.")), "hello_darkness_my_old_friend_");
    });
});
