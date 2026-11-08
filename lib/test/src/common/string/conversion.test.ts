/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { strCamelCase, strCapitalizeWords, strKebabCase, strLetterCase, strSnakeCase } from "../../../../src/string/conversion";
import { strLower } from "../../../../src/string/upper_lower";

describe("strLetterCase", () => {
    it("null/undefined", () => {
        assert.equal(strLetterCase(null), "Null");
        assert.equal(strLetterCase(undefined), "Undefined");
    });

    it("Basic", () => {
        assert.equal(strLetterCase(""), "");
        assert.equal(strLetterCase("hello darkness"), "Hello Darkness");
        assert.equal(strLetterCase("hello_darkness"), "Hello_Darkness");
        assert.equal(strLetterCase("_hello_darkness"), "_Hello_Darkness");
        assert.equal(strLetterCase("hello darkness, my old friend."), "Hello Darkness, My Old Friend.");
        assert.equal(strLetterCase("1st place"), "1st Place");
    });

    it("Non-ASCII letters", () => {
        assert.equal(strLetterCase("café crème"), "Café Crème");
        assert.equal(strLetterCase("über straße"), "Über Straße");
        assert.equal(strLetterCase("cafe\u0301 cre\u0300me"), "Cafe\u0301 Cre\u0300me");
        assert.equal(strLetterCase("привет мир"), "Привет Мир");
    });

    it("Reverse kebabcase Basic", () => {
        assert.equal(strLetterCase(strKebabCase("hello darkness")), "Hello-Darkness");
        assert.equal(strLetterCase(strKebabCase("hello_darkness")), "Hello-Darkness");
        assert.equal(strLetterCase(strKebabCase("_hello_darkness")), "-Hello-Darkness");
        assert.equal(strLetterCase(strKebabCase("hello darkness, my old friend.")), "Hello-Darkness-My-Old-Friend-");
        assert.equal(strLetterCase(strKebabCase("fooBarBaz")), "Foo-Bar-Baz");
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

describe("strCapitalizeWords", () => {
    it("null/undefined", () => {
        assert.equal(strCapitalizeWords(null), "Null");
        assert.equal(strCapitalizeWords(undefined), "Undefined");
    });

    it("Basic", () => {
        assert.equal(strCapitalizeWords(""), "");
        assert.equal(strCapitalizeWords("hello darkness"), "Hello Darkness");
        assert.equal(strCapitalizeWords("hELLo dARKness"), "Hello Darkness");
        assert.equal(strCapitalizeWords("hello_darkness"), "Hello_Darkness");
        assert.equal(strCapitalizeWords("_hello_darkness"), "_Hello_Darkness");
        assert.equal(strCapitalizeWords("hello-darkness"), "Hello-Darkness");
        assert.equal(strCapitalizeWords("hello darkness, my old friend."), "Hello Darkness, My Old Friend.");
        assert.equal(strCapitalizeWords("  HELLO   WORLD  "), "  Hello   World  ");
    });

    it("Non-ASCII letters", () => {
        assert.equal(strCapitalizeWords("café crème"), "Café Crème");
        assert.equal(strCapitalizeWords("CAFÉ CRÈME"), "Café Crème");
        assert.equal(strCapitalizeWords("über STRASSE"), "Über Strasse");
        assert.equal(strCapitalizeWords("cafe\u0301 cre\u0300me"), "Cafe\u0301 Cre\u0300me");
    });

    it("Only splits words at separators", () => {
        assert.equal(strCapitalizeWords("fooBarBaz"), "Foobarbaz");
        assert.equal(strCapitalizeWords("foo_bar-baz qux"), "Foo_Bar-Baz Qux");
    });

    it("Reverse kebabcase Basic", () => {
        assert.equal(strCapitalizeWords(strKebabCase("hello darkness")), "Hello-Darkness");
        assert.equal(strCapitalizeWords(strKebabCase("hello_darkness")), "Hello-Darkness");
        assert.equal(strCapitalizeWords(strKebabCase("_hello_darkness")), "-Hello-Darkness");
        assert.equal(strCapitalizeWords(strKebabCase("hello darkness, my old friend.")), "Hello-Darkness-My-Old-Friend-");
    });

    it("Reverse snakecase Basic", () => {
        assert.equal(strCapitalizeWords(strSnakeCase("hello darkness")), "Hello_Darkness");
        assert.equal(strCapitalizeWords(strSnakeCase("hello_darkness")), "Hello_Darkness");
        assert.equal(strCapitalizeWords(strSnakeCase("_hello_darkness")), "_Hello_Darkness");
        assert.equal(strCapitalizeWords(strSnakeCase("hello darkness, my old friend.")), "Hello_Darkness_My_Old_Friend_");
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
        assert.equal(strCamelCase(""), "");
        assert.equal(strCamelCase(" -_. "), "");
        assert.equal(strCamelCase("hello darkness"), "helloDarkness");
        assert.equal(strCamelCase("hello_darkness"), "helloDarkness");
        assert.equal(strCamelCase("_hello_darkness"), "helloDarkness");
        assert.equal(strCamelCase("hello-darkness"), "helloDarkness");
        assert.equal(strCamelCase("-hello-darkness"), "helloDarkness");
        assert.equal(strCamelCase("hello darkness, my old friend."), "helloDarknessMyOldFriend");
        assert.equal(strCamelCase("helloDarkness"), "helloDarkness");
        assert.equal(strCamelCase("HelloDarkness"), "helloDarkness");
    });

    it("Retains the case within each word", () => {
        assert.equal(strCamelCase("ABC def"), "aBCDef");
        assert.equal(strCamelCase("HELLO WORLD"), "hELLOWORLD");
        assert.equal(strCamelCase("EFTPOS PURCHASE 1234"), "eFTPOSPURCHASE1234");
        assert.equal(strCamelCase("MAX_SAFE_INTEGER"), "mAXSAFEINTEGER");
        assert.equal(strCamelCase("hello DARKNESS"), "helloDARKNESS");
    });

    it("Normalizing the value first", () => {
        assert.equal(strCamelCase(strLower("HELLO WORLD")), "helloWorld");
        assert.equal(strCamelCase(strLower("HELLO WORLD"), true), "HelloWorld");
        assert.equal(strKebabCase("XMLHttpRequest"), "xml-http-request");
        assert.equal(strCamelCase(strKebabCase("XMLHttpRequest")), "xmlHttpRequest");
        assert.equal(strCamelCase(strKebabCase("XMLHttpRequest"), true), "XmlHttpRequest");
    });

    it("Only the first letter of each word is changed", () => {
        assert.equal(strCamelCase("XMLHttpRequest"), "xMLHttpRequest");
        assert.equal(strCamelCase("ABCDef"), "aBCDef");
        assert.equal(strCamelCase("fooBar2Baz"), "fooBar2Baz");
        assert.equal(strCamelCase("ABC123"), "aBC123");
        assert.equal(strCamelCase("xPosition"), "xPosition");
        assert.equal(strCamelCase("hELLo dARKness-my old_friend"), "hELLoDARKnessMyOldFriend");
    });

    it("Non-ASCII letters", () => {
        assert.equal(strCamelCase("café crème"), "caféCrème");
        assert.equal(strCamelCase("über straße"), "überStraße");
        assert.equal(strCamelCase("ÉCOLE normale"), "éCOLENormale");
        assert.equal(strCamelCase("E\u0301COLE normale"), "e\u0301COLENormale");
        assert.equal(strCamelCase("cafe\u0301 cre\u0300me"), "cafe\u0301Cre\u0300me");
        assert.equal(strCamelCase("привет мир"), "приветМир");
        assert.equal(strCamelCase("приветМир"), "приветМир");
        assert.equal(strCamelCase("5µm"), "5µm");
    });

    it("Leading and trailing separators are removed", () => {
        assert.equal(strCamelCase("__init__"), "init");
        assert.equal(strCamelCase("--foo--"), "foo");
        assert.equal(strCamelCase("O'Brien & Sons, Ltd."), "oBrienSonsLtd");
    });

    it("Pascal Case Basic", () => {
        assert.equal(strCamelCase("hello darkness", true), "HelloDarkness");
        assert.equal(strCamelCase("hello_darkness", true), "HelloDarkness");
        assert.equal(strCamelCase("_hello_darkness", true), "HelloDarkness");
        assert.equal(strCamelCase("hello-darkness", true), "HelloDarkness");
        assert.equal(strCamelCase("-hello-darkness", true), "HelloDarkness");
        assert.equal(strCamelCase("hello darkness, my old friend.", true), "HelloDarknessMyOldFriend");
        assert.equal(strCamelCase("HELLO WORLD", true), "HELLOWORLD");
        assert.equal(strCamelCase("XMLHttpRequest", true), "XMLHttpRequest");
        assert.equal(strCamelCase("über straße", true), "ÜberStraße");
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
        assert.equal(strCamelCase(strKebabCase("XMLHttpRequest")), "xmlHttpRequest");
    });
});

describe("strKebabCase", () => {
    it("null/undefined", () => {
        assert.equal(strKebabCase(null), "null");
        assert.equal(strKebabCase(undefined), "undefined");
    });

    it("Basic", () => {
        assert.equal(strKebabCase(""), "");
        assert.equal(strKebabCase(" -_. "), "-");
        assert.equal(strKebabCase("hello darkness"), "hello-darkness");
        assert.equal(strKebabCase("hello_darkness"), "hello-darkness");
        assert.equal(strKebabCase("_hello_darkness"), "-hello-darkness");
        assert.equal(strKebabCase("hello darkness, my old friend."), "hello-darkness-my-old-friend-");
        assert.equal(strKebabCase("hello  --  darkness"), "hello-darkness");
    });

    it("Word boundaries", () => {
        assert.equal(strKebabCase("helloDarkness"), "hello-darkness");
        assert.equal(strKebabCase("HelloDarkness"), "hello-darkness");
        assert.equal(strKebabCase("ABCDef"), "abc-def");
        assert.equal(strKebabCase("ABCdef"), "ab-cdef");
        assert.equal(strKebabCase("XMLHttpRequest"), "xml-http-request");
        assert.equal(strKebabCase("fooBar2Baz"), "foo-bar2-baz");
        assert.equal(strKebabCase("abc123Def"), "abc123-def");
        assert.equal(strKebabCase("ABC123"), "abc123");
        assert.equal(strKebabCase("abc_123"), "abc-123");
        assert.equal(strKebabCase("HELLO WORLD"), "hello-world");
        assert.equal(strKebabCase("xPosition"), "x-position");
        assert.equal(strKebabCase("iOSApp"), "i-os-app");
        assert.equal(strKebabCase("hELLo dARKness-my old_friend"), "h-el-lo-d-ar-kness-my-old-friend");
    });

    it("Non-ASCII letters", () => {
        assert.equal(strKebabCase("café crème"), "café-crème");
        assert.equal(strKebabCase("über straße"), "über-straße");
        assert.equal(strKebabCase("ÉCOLENormale"), "école-normale");
        assert.equal(strKebabCase("E\u0301COLENormale"), "e\u0301cole-normale");
        assert.equal(strKebabCase("cafe\u0301 Cre\u0300me"), "cafe\u0301-cre\u0300me");
        assert.equal(strKebabCase("приветМир"), "привет-мир");
        assert.equal(strKebabCase("αβγΔέλτα"), "αβγ-δέλτα");
        assert.equal(strKebabCase("日本 Tokyo"), "日本-tokyo");
    });

    it("Leading and trailing whitespace is removed, other separators are retained", () => {
        assert.equal(strKebabCase("__init__"), "-init-");
        assert.equal(strKebabCase("--foo--"), "-foo-");
        assert.equal(strKebabCase("  foo bar  "), "foo-bar");
        assert.equal(strKebabCase("  _foo_  "), "-foo-");
        assert.equal(strKebabCase(" _ foo _ "), "-foo-");
        assert.equal(strKebabCase("foo , "), "foo-");
        assert.equal(strKebabCase("_"), "-");
        assert.equal(strKebabCase("   "), "");
        assert.equal(strKebabCase("O'Brien & Sons, Ltd."), "o-brien-sons-ltd-");
    });

    it("Scream Basic", () => {
        assert.equal(strKebabCase("hello darkness", true), "HELLO-DARKNESS");
        assert.equal(strKebabCase("hello_darkness", true), "HELLO-DARKNESS");
        assert.equal(strKebabCase("_hello_darkness", true), "-HELLO-DARKNESS");
        assert.equal(strKebabCase("hello darkness, my old friend.", true), "HELLO-DARKNESS-MY-OLD-FRIEND-");
        assert.equal(strKebabCase("XMLHttpRequest", true), "XML-HTTP-REQUEST");
        assert.equal(strKebabCase("café crème", true), "CAFÉ-CRÈME");
    });

    it("Reverse Camelcase Basic", () => {
        assert.equal(strKebabCase(strCamelCase("hello darkness")), "hello-darkness");
        assert.equal(strKebabCase(strCamelCase("hello_darkness")), "hello-darkness");
        assert.equal(strKebabCase(strCamelCase("_hello_darkness")), "hello-darkness");
        assert.equal(strKebabCase(strCamelCase("hello darkness, my old friend.")), "hello-darkness-my-old-friend");
        assert.equal(strKebabCase(strCamelCase("café crème")), "café-crème");
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
        assert.equal(strSnakeCase(""), "");
        assert.equal(strSnakeCase("hello darkness"), "hello_darkness");
        assert.equal(strSnakeCase("hello_darkness"), "hello_darkness");
        assert.equal(strSnakeCase("_hello_darkness"), "_hello_darkness");
        assert.equal(strSnakeCase("hello-darkness"), "hello_darkness");
        assert.equal(strSnakeCase("-hello-darkness"), "_hello_darkness");
        assert.equal(strSnakeCase("hello darkness, my old friend."), "hello_darkness_my_old_friend_");
    });

    it("Word boundaries", () => {
        assert.equal(strSnakeCase("XMLHttpRequest"), "xml_http_request");
        assert.equal(strSnakeCase("fooBar2Baz"), "foo_bar2_baz");
        assert.equal(strSnakeCase("maxSafeInteger"), "max_safe_integer");
    });

    it("Non-ASCII letters", () => {
        assert.equal(strSnakeCase("café crème"), "café_crème");
        assert.equal(strSnakeCase("über straße"), "über_straße");
    });

    it("Leading and trailing whitespace is removed, other separators are retained", () => {
        assert.equal(strSnakeCase("__init__"), "_init_");
        assert.equal(strSnakeCase("  -foo-  "), "_foo_");
        assert.equal(strSnakeCase("  foo  "), "foo");
        assert.equal(strSnakeCase("O'Brien & Sons, Ltd."), "o_brien_sons_ltd_");
    });

    it("Scream Basic", () => {
        assert.equal(strSnakeCase("hello darkness", true), "HELLO_DARKNESS");
        assert.equal(strSnakeCase("hello_darkness", true), "HELLO_DARKNESS");
        assert.equal(strSnakeCase("_hello_darkness", true), "_HELLO_DARKNESS");
        assert.equal(strSnakeCase("hello-darkness", true), "HELLO_DARKNESS");
        assert.equal(strSnakeCase("-hello-darkness", true), "_HELLO_DARKNESS");
        assert.equal(strSnakeCase("hello darkness, my old friend.", true), "HELLO_DARKNESS_MY_OLD_FRIEND_");
        assert.equal(strSnakeCase("maxSafeInteger", true), "MAX_SAFE_INTEGER");
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

describe("case conversion round trips", () => {
    // The conversions MUST be reversible, passing a value through the opposite conversion returns the original
    function _roundTrip(values: string[], there: (value: string) => string, back: (value: string) => string) {
        for (let lp = 0; lp < values.length; lp++) {
            assert.equal(back(there(values[lp])), values[lp], JSON.stringify(values[lp]) + " -> " + JSON.stringify(there(values[lp])));
        }
    }

    it("snake_case <-> kebab-case", () => {
        _roundTrip(["hello_darkness", "_hello_darkness", "_hello_darkness_", "_private", "max_safe_integer", "foo_bar2_baz", "café_crème"],
            (v) => strKebabCase(v), (v) => strSnakeCase(v));
        _roundTrip(["hello-darkness", "-hello-darkness", "-hello-darkness-", "hello-darkness-my-old-friend-", "foo-bar2-baz"],
            (v) => strSnakeCase(v), (v) => strKebabCase(v));
        _roundTrip(["MAX_SAFE_INTEGER", "_MAX_SAFE_INTEGER_"], (v) => strKebabCase(v, true), (v) => strSnakeCase(v, true));
    });

    it("camelCase <-> kebab-case / snake_case", () => {
        _roundTrip(["helloDarkness", "myOldFriend", "fooBar2Baz", "abc123Def", "caféCrème", "überStraße", "приветМир"],
            (v) => strKebabCase(v), (v) => strCamelCase(v));
        _roundTrip(["helloDarkness", "maxSafeInteger", "fooBar2Baz"], (v) => strSnakeCase(v), (v) => strCamelCase(v));
        _roundTrip(["hello-darkness", "foo-bar2-baz", "xml-http-request", "café-crème"], (v) => strCamelCase(v), (v) => strKebabCase(v));
        _roundTrip(["max_safe_integer", "hello_darkness_my_old_friend"], (v) => strCamelCase(v), (v) => strSnakeCase(v));
    });

    it("PascalCase <-> kebab-case / snake_case", () => {
        _roundTrip(["HelloDarkness", "MaxSafeInteger", "FooBar2Baz", "ÜberStraße"], (v) => strSnakeCase(v), (v) => strCamelCase(v, true));
        _roundTrip(["HelloDarkness", "MyOldFriend"], (v) => strKebabCase(v), (v) => strCamelCase(v, true));
    });

    it("Converting a value that is already in the target case is unchanged", () => {
        _roundTrip(["helloDarkness", "xMLHttpRequest", "fooBAR", "hELLo", "caféCrème"], (v) => v, (v) => strCamelCase(v));
        _roundTrip(["HelloDarkness", "XMLHttpRequest", "FooBAR", "ÜberStraße"], (v) => v, (v) => strCamelCase(v, true));
        _roundTrip(["hello-darkness", "-hello-darkness-", "foo-bar2-baz", "café-crème"], (v) => v, (v) => strKebabCase(v));
        _roundTrip(["hello_darkness", "_hello_darkness_", "foo_bar2_baz"], (v) => v, (v) => strSnakeCase(v));
        _roundTrip(["MAX_SAFE_INTEGER", "_MAX_SAFE_INTEGER_"], (v) => v, (v) => strSnakeCase(v, true));
    });
});

describe("case conversion character ranges", () => {
    it("Uppercase letters outside of the Latin-1, Greek and Cyrillic ranges", () => {
        // Retained and case converted, but not detected as a word boundary
        assert.equal(strKebabCase("łódźŁódź"), "łódźłódź");
        assert.equal(strKebabCase("łódź Łódź"), "łódź-łódź");
        assert.equal(strCamelCase("łódź łódź"), "łódźŁódź");
        assert.equal(strKebabCase("łódź", true), "ŁÓDŹ");
    });

    it("Symbols are separators", () => {
        assert.equal(strKebabCase("I \u2764 JS"), "i-js");
        assert.equal(strKebabCase("price \u20AC5"), "price-5");
        assert.equal(strKebabCase("foo\u2192bar"), "foo-bar");
        assert.equal(strKebabCase("\u00A9 2024 Acme"), "-2024-acme");
    });

    it("Letters, numbers and marks within the punctuation and symbol blocks are word characters", () => {
        // Latin-1
        assert.equal(strLetterCase("a²b"), "A²b");
        assert.equal(strCapitalizeWords("1ª VEZ"), "1ª Vez");
        assert.equal(strCamelCase("x² plus y²"), "x²PlusY²");
        assert.equal(strKebabCase("x²Y"), "x²-y");
        assert.equal(strSnakeCase("¼ cup"), "¼_cup");
        // Enclosed Alphanumerics (the circled letters are cased) and the Dingbat numbers
        assert.equal(strKebabCase("① first ❷ second"), "①-first-❷-second");
        assert.equal(strCamelCase("step ①"), "step①");
        assert.equal(strLetterCase("ⓐbc ⓓ"), "Ⓐbc Ⓓ");
        assert.equal(strKebabCase("ⒶⒷ"), "ⓐⓑ");
        // CJK Symbols and Punctuation
        assert.equal(strCamelCase("佐々木"), "佐々木");
        assert.equal(strCamelCase("佐々木 太郎"), "佐々木太郎");
        assert.equal(strKebabCase("佐々木、太郎"), "佐々木-太郎");
        assert.equal(strLetterCase("〇x"), "〇x");
        assert.equal(strCapitalizeWords("〆X"), "〆x");
        assert.equal(strSnakeCase("a\u302Ab"), "a\u302Ab");
    });

    it("The punctuation and symbols next to the excluded characters are separators", () => {
        assert.equal(strKebabCase("«a±b»"), "-a-b-");
        assert.equal(strKebabCase("a´b¶c¸d"), "a-b-c-d");
        assert.equal(strCamelCase("¿qué?"), "qué");
        assert.equal(strKebabCase("a\u245Fb\u2500c\u2794d"), "a-b-c-d");
        assert.equal(strKebabCase("a\u3004b\u3008c\u3020d\u3030e\u3036f\u303Dg"), "a-b-c-d-e-f-g");
    });

    it("Greek final sigma is lowercased within the context of the word", () => {
        assert.equal(strCapitalizeWords("\u039F\u03A3"), "\u039F\u03C2");
        assert.equal(strCapitalizeWords("A\u03A3"), "A\u03C2");
        assert.equal(strCapitalizeWords("\u03A3\u03A3"), "\u03A3\u03C2");
        assert.equal(strCapitalizeWords("\u039F\u0394\u039F\u03A3 \u0391\u0398\u0397\u039D\u0391"), "\u039F\u03B4\u03BF\u03C2 \u0391\u03B8\u03B7\u03BD\u03B1");
        assert.equal(strKebabCase("\u039F\u0394\u039F\u03A3 \u0391\u0398\u0397\u039D\u0391"), "\u03BF\u03B4\u03BF\u03C2-\u03B1\u03B8\u03B7\u03BD\u03B1");
        assert.equal(strSnakeCase("\u039F\u0394\u039F\u03A3"), "\u03BF\u03B4\u03BF\u03C2");
    });

    it("Accented Greek capitals start a new word in both the precomposed and decomposed forms", () => {
        // [precomposed, base letter, combining mark]
        let capitals = [
            ["\u0386", "\u0391", "\u0301"], ["\u0388", "\u0395", "\u0301"], ["\u0389", "\u0397", "\u0301"],
            ["\u038A", "\u0399", "\u0301"], ["\u038C", "\u039F", "\u0301"], ["\u038E", "\u03A5", "\u0301"],
            ["\u038F", "\u03A9", "\u0301"], ["\u03AA", "\u0399", "\u0308"], ["\u03AB", "\u03A5", "\u0308"]
        ];
        for (let lp = 0; lp < capitals.length; lp++) {
            let precomposed = capitals[lp][0];
            let decomposed = capitals[lp][1] + capitals[lp][2];
            let lowerPrecomposed = strLower(precomposed);
            let lowerDecomposed = strLower(capitals[lp][1]) + capitals[lp][2];
            assert.equal(strKebabCase("a" + precomposed + "b"), "a-" + lowerPrecomposed + "b", precomposed);
            assert.equal(strKebabCase("a" + decomposed + "b"), "a-" + lowerDecomposed + "b", decomposed);
            assert.equal(strSnakeCase("AB" + precomposed + "c"), "ab_" + lowerPrecomposed + "c", precomposed);
            assert.equal(strSnakeCase("AB" + decomposed + "c"), "ab_" + lowerDecomposed + "c", decomposed);
        }

        // "ώραΈναρξης" and "ΆλφαΏμέγα"
        assert.equal(strKebabCase("\u03CE\u03C1\u03B1\u0388\u03BD\u03B1\u03C1\u03BE\u03B7\u03C2"), "\u03CE\u03C1\u03B1-\u03AD\u03BD\u03B1\u03C1\u03BE\u03B7\u03C2");
        assert.equal(strKebabCase("\u03CE\u03C1\u03B1\u0395\u0301\u03BD\u03B1\u03C1\u03BE\u03B7\u03C2"), "\u03CE\u03C1\u03B1-\u03B5\u0301\u03BD\u03B1\u03C1\u03BE\u03B7\u03C2");
        assert.equal(strSnakeCase("\u0386\u03BB\u03C6\u03B1\u038F\u03BC\u03AD\u03B3\u03B1"), "\u03AC\u03BB\u03C6\u03B1_\u03CE\u03BC\u03AD\u03B3\u03B1");
        assert.equal(strKebabCase(strCamelCase("\u03CE\u03C1\u03B1-\u03AD\u03BD\u03B1\u03C1\u03BE\u03B7\u03C2")), "\u03CE\u03C1\u03B1-\u03AD\u03BD\u03B1\u03C1\u03BE\u03B7\u03C2");

        // The lowercase ΐ ends an uppercase run like its decomposed form
        assert.equal(strKebabCase("\u0391\u0392\u0390"), "\u03B1-\u03B2\u0390");
        assert.equal(strKebabCase("\u0391\u0392\u03B9\u0308\u0301"), "\u03B1-\u03B2\u03B9\u0308\u0301");
    });

    it("Supplementary plane letters (surrogate pairs) are case converted as a complete character", () => {
        // Deseret capital and small long i (U+10400 / U+10428)
        let upper = "\uD801\uDC00";
        let lower = "\uD801\uDC28";
        assert.equal(strLetterCase(lower), upper);
        assert.equal(strLetterCase(lower + "x " + lower + lower), upper + "x " + upper + lower);
        assert.equal(strCapitalizeWords(upper), upper);
        assert.equal(strCapitalizeWords(upper + upper + " " + lower + lower), upper + lower + " " + upper + lower);
        assert.equal(strCamelCase(upper + "foo"), lower + "foo");
        assert.equal(strCamelCase(lower + "foo", true), upper + "foo");
        assert.equal(strCamelCase("foo " + lower + "bar"), "foo" + upper + "bar");
        assert.equal(strKebabCase(upper + "Foo"), lower + "-foo");

        // Characters without a case mapping are unchanged
        assert.equal(strLetterCase("\uD83D\uDE00x"), "\uD83D\uDE00x");
        assert.equal(strCamelCase("foo \uD83D\uDE00x"), "foo\uD83D\uDE00x");

        // Unpaired surrogates are a single code unit
        assert.equal(strLetterCase("\uD801x"), "\uD801x");
        assert.equal(strLetterCase("\uD801"), "\uD801");
        assert.equal(strLetterCase("\uDC28x"), "\uDC28x");
        assert.equal(strCamelCase("\uD801X"), "\uD801X");
    });

    it("Characters outside of the ranges are retained as word characters", () => {
        assert.equal(strKebabCase("a\uD83D\uDE00b"), "a\uD83D\uDE00b");
        assert.equal(strKebabCase("\u0915\u093E\u0930 \u0915\u0940"), "\u0915\u093E\u0930-\u0915\u0940");
        assert.equal(strCapitalizeWords("\u0301abc"), "\u0301abc");
    });
});
