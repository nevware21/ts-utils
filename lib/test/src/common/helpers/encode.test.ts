/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import {
    encodeAsHtml, encodeAsJson, normalizeJsName, encodeAsBase64, decodeBase64, encodeAsBase64Url,
    decodeBase64Url, encodeAsHex, decodeHex, encodeAsUri, decodeUri, _encodeBase64Polyfill,
    _decodeBase64Polyfill
} from "../../../../src/helpers/encode";
import { arrContains } from "../../../../src/array/includes";
import { strRepeat } from "../../../../src/string/repeat";

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

describe("encodeAsBase64 / decodeBase64", () => {
    it("null / undefined / empty string", () => {
        assert.equal(encodeAsBase64(null as any), "");
        assert.equal(encodeAsBase64(undefined as any), "");
        assert.equal(encodeAsBase64(""), "");
        assert.equal(decodeBase64(""), "");
    });

    it("basic string encoding/decoding", () => {
        assert.equal(encodeAsBase64("Hello"), "SGVsbG8=");
        assert.equal(decodeBase64("SGVsbG8="), "Hello");
        
        assert.equal(encodeAsBase64("Hello World"), "SGVsbG8gV29ybGQ=");
        assert.equal(decodeBase64("SGVsbG8gV29ybGQ="), "Hello World");
        
        assert.equal(encodeAsBase64("A"), "QQ==");
        assert.equal(decodeBase64("QQ=="), "A");
        
        assert.equal(encodeAsBase64("AB"), "QUI=");
        assert.equal(decodeBase64("QUI="), "AB");
        
        assert.equal(encodeAsBase64("ABC"), "QUJD");
        assert.equal(decodeBase64("QUJD"), "ABC");
    });

    it("round-trip encoding/decoding", () => {
        let values = ["", "a", "ab", "abc", "test123", "The quick brown fox", "~!@#$%^&*()"];
        for (let i = 0; i < values.length; i++) {
            let val = values[i];
            assert.equal(decodeBase64(encodeAsBase64(val)), val, "Failed for: " + val);
        }
    });
});

describe("encodeAsBase64Url / decodeBase64Url", () => {
    it("null / undefined / empty string", () => {
        assert.equal(encodeAsBase64Url(null as any), "");
        assert.equal(encodeAsBase64Url(undefined as any), "");
        assert.equal(encodeAsBase64Url(""), "");
        assert.equal(decodeBase64Url(""), "");
    });

    it("URL safe encoding/decoding", () => {
        assert.equal(encodeAsBase64Url("Hello"), "SGVsbG8");
        assert.equal(decodeBase64Url("SGVsbG8"), "Hello");
        
        assert.equal(encodeAsBase64Url("Hello World"), "SGVsbG8gV29ybGQ");
        assert.equal(decodeBase64Url("SGVsbG8gV29ybGQ"), "Hello World");
    });

    it("special character handling for URL safety", () => {
        // Test strings that produce + or / in standard base64
        let values = ["", "?>>", "test"];
        for (let i = 0; i < values.length; i++) {
            let val = values[i];
            let encoded = encodeAsBase64Url(val);
            // Should not contain +, /, or =
            assert.ok(!encoded.includes("+"), "Should not contain + in: " + encoded);
            assert.ok(!encoded.includes("/"), "Should not contain / in: " + encoded);
            assert.ok(!encoded.includes("="), "Should not contain = in: " + encoded);
            assert.equal(decodeBase64Url(encoded), val, "Failed round-trip for: " + val);
        }
    });
});

describe("encodeAsHex / decodeHex", () => {
    it("null / undefined / empty string", () => {
        assert.equal(encodeAsHex(null as any), "");
        assert.equal(encodeAsHex(undefined as any), "");
        assert.equal(encodeAsHex(""), "");
        assert.equal(decodeHex(""), "");
    });

    it("basic hex encoding/decoding", () => {
        assert.equal(encodeAsHex("A"), "41");
        assert.equal(decodeHex("41"), "A");
        
        assert.equal(encodeAsHex("Hello"), "48656c6c6f");
        assert.equal(decodeHex("48656c6c6f"), "Hello");
        
        assert.equal(encodeAsHex("test"), "74657374");
        assert.equal(decodeHex("74657374"), "test");
        
        assert.equal(encodeAsHex("0"), "30");
        assert.equal(decodeHex("30"), "0");
    });

    it("round-trip hex encoding/decoding", () => {
        let values = ["", "a", "Hello", "Test123", "The quick brown fox"];
        for (let i = 0; i < values.length; i++) {
            let val = values[i];
            assert.equal(decodeHex(encodeAsHex(val)), val, "Failed for: " + val);
        }
    });

    it("special characters in hex", () => {
        assert.equal(encodeAsHex("!@#"), "214023");
    });
});

describe("encodeAsUri / decodeUri", () => {
    it("null / undefined / empty string", () => {
        assert.equal(encodeAsUri(null as any), "");
        assert.equal(encodeAsUri(undefined as any), "");
        assert.equal(encodeAsUri(""), "");
        assert.equal(decodeUri(""), "");
    });

    it("basic URI encoding/decoding", () => {
        assert.equal(encodeAsUri("Hello"), "Hello");
        assert.equal(decodeUri("Hello"), "Hello");
        
        assert.equal(encodeAsUri("Hello World"), "Hello%20World");
        assert.equal(decodeUri("Hello%20World"), "Hello World");
        
        assert.equal(encodeAsUri("a+b=c"), "a%2Bb%3Dc");
        assert.equal(decodeUri("a%2Bb%3Dc"), "a+b=c");
    });

    it("special URI characters", () => {
        assert.ok(encodeAsUri("?") !== "?");
        assert.equal(decodeUri(encodeAsUri("?")), "?");
        
        assert.ok(encodeAsUri("&") !== "&");
        assert.equal(decodeUri(encodeAsUri("&")), "&");
        
        assert.ok(encodeAsUri("#") !== "#");
        assert.equal(decodeUri(encodeAsUri("#")), "#");
    });

    it("round-trip URI encoding/decoding", () => {
        let values = ["", "test", "hello world", "a=b&c=d", "test?query=1"];
        for (let i = 0; i < values.length; i++) {
            let val = values[i];
            assert.equal(decodeUri(encodeAsUri(val)), val, "Failed for: " + val);
        }
    });
});

describe("Base64 Polyfill Coverage - Iteration & Padding", () => {
    it("various input lengths to exercise polyfill iteration", () => {
        // Test different lengths to ensure all code paths are hit
        for (let len = 1; len <= 30; len++) {
            let str = "";
            for (let i = 0; i < len; i++) {
                str += String.fromCharCode((i % 26) + 65); // A-Z cycle
            }
            let encoded = encodeAsBase64(str);
            let decoded = decodeBase64(encoded);
            assert.equal(decoded, str, "Round-trip failed for length: " + len);
        }
    });

    it("padding scenarios 1 byte (1 mod 3)", () => {
        // Lengths: 1, 4, 7, 10... should have 2 padding chars
        assert.equal(decodeBase64(encodeAsBase64("A")), "A");
        assert.equal(decodeBase64(encodeAsBase64("ABCD")), "ABCD");
        assert.equal(decodeBase64(encodeAsBase64("ABCDEFG")), "ABCDEFG");
        assert.equal(decodeBase64(encodeAsBase64("ABCDEFGHIJ")), "ABCDEFGHIJ");
    });

    it("padding scenarios 2 bytes (2 mod 3)", () => {
        // Lengths: 2, 5, 8, 11... should have 1 padding char
        assert.equal(decodeBase64(encodeAsBase64("AB")), "AB");
        assert.equal(decodeBase64(encodeAsBase64("ABCDE")), "ABCDE");
        assert.equal(decodeBase64(encodeAsBase64("ABCDEFGH")), "ABCDEFGH");
        assert.equal(decodeBase64(encodeAsBase64("ABCDEFGHIJK")), "ABCDEFGHIJK");
    });

    it("padding scenarios 0 bytes (0 mod 3)", () => {
        // Lengths: 3, 6, 9, 12... should have no padding
        assert.equal(decodeBase64(encodeAsBase64("ABC")), "ABC");
        assert.equal(decodeBase64(encodeAsBase64("ABCDEF")), "ABCDEF");
        assert.equal(decodeBase64(encodeAsBase64("ABCDEFGHI")), "ABCDEFGHI");
        assert.equal(decodeBase64(encodeAsBase64("ABCDEFGHIJKL")), "ABCDEFGHIJKL");
    });

    it("all ASCII characters", () => {
        // Test ASCII range to ensure polyfill handles all byte values
        let ascii = "";
        for (let i = 32; i < 127; i++) {
            ascii += String.fromCharCode(i);
        }
        let encoded = encodeAsBase64(ascii);
        let decoded = decodeBase64(encoded);
        assert.equal(decoded, ascii, "Failed for ASCII 32-126");
    });

    it("special byte values across full range", () => {
        // Test with various byte values (0-255 range)
        let binaryStr = "";
        for (let i = 0; i < 256; i++) {
            binaryStr += String.fromCharCode(i);
        }
        let encoded = encodeAsBase64(binaryStr);
        let decoded = decodeBase64(encoded);
        assert.equal(decoded, binaryStr, "Failed for full byte range 0-255");
    });

    it("large input to validate iteration logic", () => {
        // Test with larger inputs - 3000 bytes
        let large = "";
        for (let i = 0; i < 3000; i++) {
            large += String.fromCharCode((i % 256));
        }
        let encoded = encodeAsBase64(large);
        let decoded = decodeBase64(encoded);
        assert.equal(decoded, large, "Failed for large 3000-byte input");
    });

    it("repeated characters at different lengths", () => {
        // Ensures polyfill iteration works with repetitive data
        for (let len = 1; len <= 50; len++) {
            let str = strRepeat("X", len);
            assert.equal(decodeBase64(encodeAsBase64(str)), str, "Failed for " + len + " X's");
        }
    });

    it("polyfill cache initialization persistence", () => {
        // Verify cache works correctly across multiple calls
        let values = ["hello", "world", "test123", "base64encoding"];
        for (let i = 0; i < values.length; i++) {
            let val = values[i];
            let encoded = encodeAsBase64(val);
            let decoded = decodeBase64(encoded);
            assert.equal(decoded, val, "Failed for: " + val);
        }
    });

    it("inputs generating base64 special chars", () => {
        // Ensure proper handling of +, /, = in output
        let testCases = [
            "Q@@@@"
        ];
        for (let i = 0; i < testCases.length; i++) {
            let val = testCases[i];
            let encoded = encodeAsBase64(val);
            let decoded = decodeBase64(encoded);
            assert.equal(decoded, val, "Failed for: " + val);
        }
    });
});

describe("Base64 Polyfill Verification Against Native Implementation", () => {
    // Check if native implementations are available
    let hasNativeBase64 = typeof btoa !== "undefined" && typeof atob !== "undefined";

    if (hasNativeBase64) {
        it("_encodeBase64Polyfill matches native btoa encoding", () => {
            let testStrings = [
                "",
                "A",
                "AB",
                "ABC",
                "Hello",
                "Hello World",
                "The quick brown fox jumps over the lazy dog",
                "test123!@#$%^&*()",
                "0",
                "01",
                "012",
                "0123456789"
            ];

            for (let i = 0; i < testStrings.length; i++) {
                let str = testStrings[i];
                let polyfillResult = _encodeBase64Polyfill(str);
                let nativeResult = btoa(str);
                assert.equal(polyfillResult, nativeResult, "Polyfill encode mismatch for: " + str);
            }
        });

        it("_decodeBase64Polyfill matches native atob decoding", () => {
            let testStrings = [
                "",
                "QQ==",
                "QUI=",
                "QUJD",
                "SGVsbG8=",
                "SGVsbG8gV29ybGQ=",
                "VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw==",
                "dGVzdDEyMyFAIyQlXiYqKCk="
            ];

            for (let i = 0; i < testStrings.length; i++) {
                let str = testStrings[i];
                let polyfillResult = _decodeBase64Polyfill(str);
                let nativeResult = atob(str);
                assert.equal(polyfillResult, nativeResult, "Polyfill decode mismatch for: " + str);
            }
        });

        it("Polyfill encode/decode round-trip matches native", () => {
            let testStrings = [
                "",
                "a",
                "ab",
                "abc",
                "test",
                "Hello World",
                "The quick brown fox",
                "!@#$%^&*()",
                "0",
                "01",
                "012"
            ];

            for (let i = 0; i < testStrings.length; i++) {
                let original = testStrings[i];
                
                // Test polyfill consistency
                let polyfillEncoded = _encodeBase64Polyfill(original);
                let polyfillDecoded = _decodeBase64Polyfill(polyfillEncoded);
                assert.equal(polyfillDecoded, original, "Polyfill round-trip failed for: " + original);

                // Test native consistency
                let nativeEncoded = btoa(original);
                let nativeDecoded = atob(nativeEncoded);
                assert.equal(nativeDecoded, original, "Native round-trip failed for: " + original);

                // Test polyfill matches native
                assert.equal(polyfillEncoded, nativeEncoded, "Polyfill/native encode mismatch for: " + original);
                assert.equal(polyfillDecoded, nativeDecoded, "Polyfill/native decode mismatch for: " + original);
            }
        });

        it("Polyfill handles all byte values 0-255", () => {
            // Create string with all possible byte values
            let allBytes = "";
            for (let i = 0; i < 256; i++) {
                allBytes += String.fromCharCode(i);
            }

            let polyfillEncoded = _encodeBase64Polyfill(allBytes);
            let nativeEncoded = btoa(allBytes);
            assert.equal(polyfillEncoded, nativeEncoded, "Polyfill/native mismatch for byte range 0-255");

            let polyfillDecoded = _decodeBase64Polyfill(nativeEncoded);
            assert.equal(polyfillDecoded, allBytes, "Polyfill cannot decode native output for byte range");
        });

        it("Polyfill handles various input lengths to test padding", () => {
            // Test lengths 0-30 to ensure padding is correct
            for (let len = 0; len <= 30; len++) {
                let str = strRepeat("X", len);
                let polyfillEncoded = _encodeBase64Polyfill(str);
                let nativeEncoded = btoa(str);
                assert.equal(polyfillEncoded, nativeEncoded, "Padding mismatch for length: " + len);
            }
        });

        it("Polyfill handles large inputs consistently with native", () => {
            // Test with a 10KB input
            let large = "";
            for (let i = 0; i < 10000; i++) {
                large += String.fromCharCode(i % 256);
            }

            let polyfillEncoded = _encodeBase64Polyfill(large);
            let nativeEncoded = btoa(large);
            assert.equal(polyfillEncoded, nativeEncoded, "Large input encoding mismatch");

            let polyfillDecoded = _decodeBase64Polyfill(polyfillEncoded);
            assert.equal(polyfillDecoded, large, "Large input round-trip failed");
        });

        it("Polyfill decode works with both uppercase and standard characters", () => {
            // Generate some base64 and verify polyfill can decode it
            let testStrings = ["test", "hello world", "The quick brown fox"];
            
            for (let i = 0; i < testStrings.length; i++) {
                let original = testStrings[i];
                let nativeEncoded = btoa(original);
                let polyfillDecoded = _decodeBase64Polyfill(nativeEncoded);
                assert.equal(polyfillDecoded, original, "Polyfill cannot decode native encoding for: " + original);
            }
        });

        it("Polyfill encode produces output that native atob can decode", () => {
            let testStrings = ["", "a", "ab", "abc", "Hello", "Test123!"];
            
            for (let i = 0; i < testStrings.length; i++) {
                let original = testStrings[i];
                let polyfillEncoded = _encodeBase64Polyfill(original);
                let nativeDecoded = atob(polyfillEncoded);
                assert.equal(nativeDecoded, original, "Native atob cannot decode polyfill output for: " + original);
            }
        });
    } else {
        // Fallback if native implementations aren't available (very rare)
        it("Native btoa/atob are available", () => {
            assert.ok(hasNativeBase64, "Native btoa/atob should be available in this environment");
        });
    }
});