/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { arrForEach } from "../../../../src/array/forEach";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { createFilenameRegex, createWildcardRegex, makeGlobRegex } from "../../../../src/helpers/regexp";
import { EMPTY } from "../../../../src/internal/constants";

function _checkResult(theRegEx: RegExp, theValue: any, isMatch: boolean, expected: Array<string|undefined> | null) {
    assert.equal(theRegEx.test(theValue), isMatch, dumpObj(theRegEx));
    let result = theRegEx.exec(theValue);
    if (result !== null && expected !== null) {
        assert.equal(result.length, expected.length);
        arrForEach(expected, (value, idx) => {
            assert.equal(value, result[idx])
        });
    } else {
        assert.equal(result, expected, "Act:" + dumpObj(result) + "\Exp:" + dumpObj(expected));
    }
}

describe("createWildcardRegex", () => {
    it("null/undefined", () => {
        let regex = createWildcardRegex(null as any);

        assert.equal(regex.source, "null", dumpObj(regex));
        _checkResult(regex, "null", true, ["null"]);
        _checkResult(regex, "Null", false, null);
        _checkResult(regex, " . null . ", true, ["null"]);
        _checkResult(regex, ". Null. ", false, null);

        regex = createWildcardRegex(undefined as any);

        assert.equal(regex.source, "undefined", dumpObj(regex));
        _checkResult(regex, "undefined", true, ["undefined"]);
        _checkResult(regex, "Undefined", false, null);
        _checkResult(regex, " undefined ", true, ["undefined"]);
        _checkResult(regex, " Undefined ", false, null);

        regex = createWildcardRegex(EMPTY);

        assert.equal(regex.source, "(?:)", dumpObj(regex));
        _checkResult(regex, "", true, [""]);
        _checkResult(regex, "", true, [""]);
        _checkResult(regex, "a", true, [""]);
        _checkResult(regex, "Hello", true, [""]);
        _checkResult(regex, null, true, [""]);
    });

    it("null/undefined ignoreCase", () => {
        let regex = createWildcardRegex(null as any, true);

        assert.equal(regex.source, "null", dumpObj(regex));
        _checkResult(regex, "null", true, ["null"]);
        _checkResult(regex, "Null", true, ["Null"]);
        _checkResult(regex, ". null. ", true, ["null"]);
        _checkResult(regex, " Null.", true, ["Null"]);

        regex = createWildcardRegex(undefined as any, true);

        assert.equal(regex.source, "undefined", dumpObj(regex));
        _checkResult(regex, "undefined", true, ["undefined"]);
        _checkResult(regex, "Undefined", true, ["Undefined"]);
        _checkResult(regex, ",undefined.", true, ["undefined"]);
        _checkResult(regex, " Undefined ", true, ["Undefined"]);

        regex = createWildcardRegex(EMPTY);

        assert.equal(regex.source, "(?:)", dumpObj(regex));
        _checkResult(regex, "", true, [""]);
        _checkResult(regex, "a", true, [""]);
        _checkResult(regex, "Hello", true, [""]);
        _checkResult(regex, null, true, [""]);
    });

    it("null/undefined full match", () => {
        let regex = createWildcardRegex(null as any, true, true);

        assert.equal(regex.source, "^null$", dumpObj(regex));
        _checkResult(regex, "null", true, ["null"]);
        _checkResult(regex, "Null", true, ["Null"]);
        _checkResult(regex, ". null. ", false, null);
        _checkResult(regex, " Null.", false, null);

        regex = createWildcardRegex(undefined as any, true, true);

        assert.equal(regex.source, "^undefined$", dumpObj(regex));
        _checkResult(regex, "undefined", true, ["undefined"]);
        _checkResult(regex, "Undefined", true, ["Undefined"]);
        _checkResult(regex, ",undefined.", false, null);
        _checkResult(regex, " Undefined ", false, null);

        regex = createWildcardRegex(EMPTY, true, true);

        assert.equal(regex.source, "^$", dumpObj(regex));
        _checkResult(regex, "", true, [""]);
        _checkResult(regex, "a", false, null);
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, null, false, null);
    });

    it("Simple wildcard", () => {
        let regex = createWildcardRegex("Hello*");

        assert.equal(regex.source, "Hello(.*)", dumpObj(regex));
        _checkResult(regex, "Hello", true, ["Hello", ""]);
        _checkResult(regex, "Hello Darkness", true, ["Hello Darkness", " Darkness"]);
        _checkResult(regex, "Darkness Hello", true, ["Hello", ""]);
        _checkResult(regex, "Darkness Hello.", true, ["Hello.", "."]);

        _checkResult(regex, "hello", false, null);
        _checkResult(regex, "hello Darkness", false, null);
        _checkResult(regex, "Darkness hello", false, null);
        _checkResult(regex, "Darkness hello.", false, null);
    });

    it("Simple wildcard - ignorecase", () => {
        let regex = createWildcardRegex("Hello*", true);

        assert.equal(regex.source, "Hello(.*)", dumpObj(regex));
        _checkResult(regex, "Hello", true, ["Hello", ""]);
        _checkResult(regex, "Hello Darkness", true, ["Hello Darkness", " Darkness"]);
        _checkResult(regex, "Darkness Hello", true, ["Hello", ""]);
        _checkResult(regex, "Darkness Hello.", true, ["Hello.", "."]);

        _checkResult(regex, "hello", true, ["hello", ""]);
        _checkResult(regex, "hello Darkness", true, ["hello Darkness", " Darkness"]);
        _checkResult(regex, "Darkness hello", true, ["hello", ""]);
        _checkResult(regex, "Darkness hello.", true, ["hello.", "."]);
    });

    it("Simple wildcard - full match", () => {
        let regex = createWildcardRegex("Hello*", true, true);

        assert.equal(regex.source, "^Hello(.*)$", dumpObj(regex));
        _checkResult(regex, "Hello", true, ["Hello", ""]);
        _checkResult(regex, "Hello Darkness", true, ["Hello Darkness", " Darkness"]);
        _checkResult(regex, "Darkness Hello", false, null);
        _checkResult(regex, "Darkness Hello.", false, null);
    });

    it("Multiple wildcards", () => {
        let regex = createWildcardRegex("H*o*", true);

        assert.equal(regex.source, "H(.*)o(.*)", dumpObj(regex));
        _checkResult(regex, "Hello", true, ["Hello", "ell", ""]);
        _checkResult(regex, "Hello Darkness", true, ["Hello Darkness", "ell", " Darkness"]);
        _checkResult(regex, "Darkness Hello", true, ["Hello", "ell", ""]);
        _checkResult(regex, "Darkness Hello.", true, ["Hello.", "ell", "."]);
    });

    it("Escaping tokens", () => {
        let regex = createWildcardRegex("[-+|^$#.?{}()]\\/\"\'*");
        assert.equal(regex.source, "\\[\\-\\+\\|\\^\\$\\#\\.\\?\\{\\}\\(\\)\\]\\\\\\/\\\"\\\'(.*)");

        regex = createWildcardRegex("[-+|^$#.?{}()]\\/\"\'*", true);
        assert.equal(regex.source, "\\[\\-\\+\\|\\^\\$\\#\\.\\?\\{\\}\\(\\)\\]\\\\\\/\\\"\\\'(.*)");

        regex = createWildcardRegex("[-+|^$#.?{}()]\\/\"\'*", true, true);
        assert.equal(regex.source, "^\\[\\-\\+\\|\\^\\$\\#\\.\\?\\{\\}\\(\\)\\]\\\\\\/\\\"\\\'(.*)$");
    });
});

describe("createFilenameRegex", () => {
    it("null/undefined", () => {
        let regex = createFilenameRegex(null as any);
        assert.equal(regex.source, "null", dumpObj(regex));

        regex = createWildcardRegex(undefined as any);
        assert.equal(regex.source, "undefined", dumpObj(regex));

        regex = createWildcardRegex(EMPTY);
        assert.equal(regex.source, "(?:)", dumpObj(regex));
    });

    it("Simple filename matching", () => {
        let regex = createFilenameRegex("*.txt");

        assert.equal(regex.source, "(.*)\\.txt", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "ug.txt", true, ["ug.txt", "ug"]);
        _checkResult(regex, " ug.txt ", true, [" ug.txt", " ug"]);
        _checkResult(regex, "C:\\temp\\ug.txt", true, ["C:\\temp\\ug.txt", "C:\\temp\\ug"]);
        _checkResult(regex, "/var/log/ug.txt", true, ["/var/log/ug.txt", "/var/log/ug"]);

        regex = createFilenameRegex("?:*.t??");

        assert.equal(regex.source, "(.):(.*)\\.t(.)(.)", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "ug.txt", false, null);
        _checkResult(regex, "C:\\temp\\ug.txt", true, ["C:\\temp\\ug.txt", "C", "\\temp\\ug", "x", "t"]);
        _checkResult(regex, " c:\\temp\\ug.txt ", true, ["c:\\temp\\ug.txt", "c", "\\temp\\ug", "x", "t"]);
        _checkResult(regex, "/var/log/ug.txt", false, null);
    });

    it("Simple filename matching - ignore case", () => {
        let regex = createFilenameRegex("*.Txt", true);

        assert.equal(regex.source, "(.*)\\.Txt", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "ug.txt", true, ["ug.txt", "ug"]);
        _checkResult(regex, " ug.txt ", true, [" ug.txt", " ug"]);
        _checkResult(regex, "C:\\temp\\ug.txt", true, ["C:\\temp\\ug.txt", "C:\\temp\\ug"]);
        _checkResult(regex, "/var/log/ug.txt", true, ["/var/log/ug.txt", "/var/log/ug"]);

        regex = createFilenameRegex("?:*.T??", true);

        assert.equal(regex.source, "(.):(.*)\\.T(.)(.)", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "ug.txt", false, null);
        _checkResult(regex, "C:\\temp\\ug.txt", true, ["C:\\temp\\ug.txt", "C", "\\temp\\ug", "x", "t"]);
        _checkResult(regex, " c:\\temp\\ug.Txt ", true, ["c:\\temp\\ug.Txt", "c", "\\temp\\ug", "x", "t"]);
        _checkResult(regex, "/var/log/ug.txt", false, null);
    });

    it("Simple filename matching - full", () => {
        let regex = createFilenameRegex("*.Txt", true, true);

        assert.equal(regex.source, "^(.*)\\.Txt$", dumpObj(regex));

        regex = createFilenameRegex("?:*.T??", true, true);

        assert.equal(regex.source, "^(.):(.*)\\.T(.)(.)$", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "ug.txt", false, null);
        _checkResult(regex, "C:\\temp\\ug.txt", true, ["C:\\temp\\ug.txt", "C", "\\temp\\ug", "x", "t"]);
        _checkResult(regex, " c:\\temp\\ug.Txt ", false, null);
        _checkResult(regex, "/var/log/ug.txt", false, null);
    });

    it("Escaping tokens", () => {
        let regex = createFilenameRegex("**[-+|^$#.?{}()]\\/\"\'*");
        assert.equal(regex.source, "(.*)(.*)\\[\\-\\+\\|\\^\\$\\#\\.(.)\\{\\}\\(\\)\\][\\\\\\/]{1}[\\\\\\/]{1}\\\"\\\'(.*)");

        regex = createFilenameRegex("**[-+|^$#.?{}()]\\/\"\'*", true);
        assert.equal(regex.source, "(.*)(.*)\\[\\-\\+\\|\\^\\$\\#\\.(.)\\{\\}\\(\\)\\][\\\\\\/]{1}[\\\\\\/]{1}\\\"\\\'(.*)");
        
        regex = createFilenameRegex("**[-+|^$#.?{}()]\\/\"\'*", true, true);
        assert.equal(regex.source, "^(.*)(.*)\\[\\-\\+\\|\\^\\$\\#\\.(.)\\{\\}\\(\\)\\][\\\\\\/]{1}[\\\\\\/]{1}\\\"\\\'(.*)$");
    });
});

describe("makeGlobRegex", () => {

    it("null/undefined", () => {
        let regex = makeGlobRegex(null as any);
        assert.equal(regex.source, "null", dumpObj(regex));

        regex = makeGlobRegex(undefined as any);
        assert.equal(regex.source, "undefined", dumpObj(regex));

        regex = makeGlobRegex(EMPTY);
        assert.equal(regex.source, "(?:)", dumpObj(regex));
    });

    it("Simple glob matching", () => {
        let regex = makeGlobRegex("**/*.txt");

        //'(.*[\\\/])([^\\\/]*)\.txt
        assert.equal(regex.source, "(.*[\\\\\\/])*([^\\\\\\/]*)\\.txt", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "ug.txt", true, ["ug.txt", undefined, "ug"]);
        _checkResult(regex, " ug.txt ", true, [" ug.txt", undefined, " ug"]);
        _checkResult(regex, "C:\\temp\\ug.txt", true, ["C:\\temp\\ug.txt", "C:\\temp\\", "ug"]);
        _checkResult(regex, "/var/log/ug.txt", true, ["/var/log/ug.txt", "/var/log/", "ug"]);
        _checkResult(regex, "/a/b\\c/log/ug.txt", true, ["/a/b\\c/log/ug.txt", "/a/b\\c/log/", "ug"]);

        regex = makeGlobRegex("src/**/*.ts");

        //'(.*[\\\/])([^\\\/]*)\.txt
        assert.equal(regex.source, "src[\\\\\\/]{1}(.*[\\\\\\/])*([^\\\\\\/]*)\\.ts", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "Src/index.ts", false, null);
        _checkResult(regex, "Src\\index.ts", false, null);
        _checkResult(regex, "src/index.ts", true, ["src/index.ts", undefined, "index"]);
        _checkResult(regex, "src//index.ts", true, ["src//index.ts", "/", "index"]);
        _checkResult(regex, "src\\index.ts", true, ["src\\index.ts", undefined, "index"]);
        _checkResult(regex, "src/helpers/regexp.ts", true, ["src/helpers/regexp.ts", "helpers/", "regexp"]);
        _checkResult(regex, "src//helpers/regexp.ts", true, ["src//helpers/regexp.ts", "/helpers/", "regexp"]);
        _checkResult(regex, "src\\helpers/regexp.ts", true, ["src\\helpers/regexp.ts", "helpers/", "regexp"]);
        _checkResult(regex, " src/index.tsx ", true, ["src/index.ts", undefined, "index"]);
        _checkResult(regex, " src\\index.tsx ", true, ["src\\index.ts", undefined, "index"]);
        _checkResult(regex, " src/helpers/regexp.ts. ", true, ["src/helpers/regexp.ts", "helpers/", "regexp"]);
        _checkResult(regex, " src\\helpers/regexp.ts. ", true, ["src\\helpers/regexp.ts", "helpers/", "regexp"]);
        _checkResult(regex, " src/Index.tsx ", true, ["src/Index.ts", undefined, "Index"]);
        _checkResult(regex, " src\\Index.tsx ", true, ["src\\Index.ts", undefined, "Index"]);
        _checkResult(regex, " src/Helpers/regexp.ts. ", true, ["src/Helpers/regexp.ts", "Helpers/", "regexp"]);
        _checkResult(regex, " src\\Helpers/regexp.ts. ", true, ["src\\Helpers/regexp.ts", "Helpers/", "regexp"]);

        regex = makeGlobRegex("?:*.t??");

        assert.equal(regex.source, "([^\\\\\\/]{1}):([^\\\\\\/]*)\\.t([^\\\\\\/]{1})([^\\\\\\/]{1})", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "ug.txt", false, null);
        _checkResult(regex, "C:\\temp\\ug.txt", false, null);
        _checkResult(regex, " c:\\temp\\ug.txt ", false, null);
        _checkResult(regex, "/var/log/ug.txt", false, null);
        _checkResult(regex, "C:ug.txt", true, ["C:ug.txt", "C", "ug", "x", "t"]);
        _checkResult(regex, " c:ug.txt ", true, ["c:ug.txt", "c", "ug", "x", "t"]);
        _checkResult(regex, "C:ug.Txt", false, null);
        _checkResult(regex, " c:ug.Txt ", false, null);

        regex = makeGlobRegex("?:**/*.t??");

        assert.equal(regex.source, "([^\\\\\\/]{1}):(.*[\\\\\\/])*([^\\\\\\/]*)\\.t([^\\\\\\/]{1})([^\\\\\\/]{1})", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "ug.txt", false, null);
        _checkResult(regex, "C:\\temp\\ug.txt", true, ["C:\\temp\\ug.txt", "C", "\\temp\\", "ug", "x", "t"]);
        _checkResult(regex, " c:\\temp\\ug.txt ", true, ["c:\\temp\\ug.txt", "c", "\\temp\\", "ug", "x", "t"]);
        _checkResult(regex, " c:\\ug.txt ", true, ["c:\\ug.txt", "c", "\\", "ug", "x", "t"]);
        _checkResult(regex, "/var/log/ug.txt", false, null);
    });

    it("Simple glob matching - ignorecase", () => {
        let regex = makeGlobRegex("**/*.Txt", true);

        //'(.*[\\\/])([^\\\/]*)\.txt
        assert.equal(regex.source, "(.*[\\\\\\/])*([^\\\\\\/]*)\\.Txt", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "ug.txt", true, ["ug.txt", undefined, "ug"]);
        _checkResult(regex, " ug.txt ", true, [" ug.txt", undefined, " ug"]);
        _checkResult(regex, "C:\\temp\\ug.txt", true, ["C:\\temp\\ug.txt", "C:\\temp\\", "ug"]);
        _checkResult(regex, "/var/log/ug.txt", true, ["/var/log/ug.txt", "/var/log/", "ug"]);
        _checkResult(regex, "/a/b\\c/log/ug.txt", true, ["/a/b\\c/log/ug.txt", "/a/b\\c/log/", "ug"]);

        regex = makeGlobRegex("src/**/*.Ts", true);

        //'(.*[\\\/])([^\\\/]*)\.txt
        assert.equal(regex.source, "src[\\\\\\/]{1}(.*[\\\\\\/])*([^\\\\\\/]*)\\.Ts", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "Src/index.ts", true, ["Src/index.ts", undefined, "index"]);
        _checkResult(regex, "Src\\index.ts", true, ["Src\\index.ts", undefined, "index"]);
        _checkResult(regex, "src/index.ts", true, ["src/index.ts", undefined, "index"]);
        _checkResult(regex, "src\\index.ts", true, ["src\\index.ts", undefined, "index"]);
        _checkResult(regex, "src/helpers/regexp.ts", true, ["src/helpers/regexp.ts", "helpers/", "regexp"]);
        _checkResult(regex, "src\\helpers/regexp.ts", true, ["src\\helpers/regexp.ts", "helpers/", "regexp"]);
        _checkResult(regex, " src/index.tsx ", true, ["src/index.ts", undefined, "index"]);
        _checkResult(regex, " src\\index.tsx ", true, ["src\\index.ts", undefined, "index"]);
        _checkResult(regex, " src/helpers/regexp.ts. ", true, ["src/helpers/regexp.ts", "helpers/", "regexp"]);
        _checkResult(regex, " src\\helpers/regexp.ts. ", true, ["src\\helpers/regexp.ts", "helpers/", "regexp"]);
        _checkResult(regex, " src/Index.tsx ", true, ["src/Index.ts", undefined, "Index"]);
        _checkResult(regex, " src\\Index.tsx ", true, ["src\\Index.ts", undefined, "Index"]);
        _checkResult(regex, " src/Helpers/regexp.ts. ", true, ["src/Helpers/regexp.ts", "Helpers/", "regexp"]);
        _checkResult(regex, " src\\Helpers/regexp.ts. ", true, ["src\\Helpers/regexp.ts", "Helpers/", "regexp"]);

        regex = makeGlobRegex("?:*.T??", true);

        assert.equal(regex.source, "([^\\\\\\/]{1}):([^\\\\\\/]*)\\.T([^\\\\\\/]{1})([^\\\\\\/]{1})", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "ug.txt", false, null);
        _checkResult(regex, "C:\\temp\\ug.txt", false, null);
        _checkResult(regex, " c:\\temp\\ug.txt ", false, null);
        _checkResult(regex, "/var/log/ug.txt", false, null);
        _checkResult(regex, "C:ug.txt", true, ["C:ug.txt", "C", "ug", "x", "t"]);
        _checkResult(regex, " c:ug.txt ", true, ["c:ug.txt", "c", "ug", "x", "t"]);
        _checkResult(regex, "C:ug.Txt", true, ["C:ug.Txt", "C", "ug", "x", "t"]);
        _checkResult(regex, " c:ug.Txt ", true, ["c:ug.Txt", "c", "ug", "x", "t"]);

        regex = makeGlobRegex("?:**/*.T??", true);

        assert.equal(regex.source, "([^\\\\\\/]{1}):(.*[\\\\\\/])*([^\\\\\\/]*)\\.T([^\\\\\\/]{1})([^\\\\\\/]{1})", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "ug.txt", false, null);
        _checkResult(regex, "C:\\temp\\ug.txt", true, ["C:\\temp\\ug.txt", "C", "\\temp\\", "ug", "x", "t"]);
        _checkResult(regex, " c:\\temp\\ug.txt ", true, ["c:\\temp\\ug.txt", "c", "\\temp\\", "ug", "x", "t"]);
        _checkResult(regex, " c:\\ug.txt ", true, ["c:\\ug.txt", "c", "\\", "ug", "x", "t"]);
        _checkResult(regex, "/var/log/ug.txt", false, null);
    });

    it("Simple glob matching - ignorecase and full", () => {
        let regex = makeGlobRegex("**/*.Txt", true, true);

        //'(.*[\\\/])([^\\\/]*)\.txt
        assert.equal(regex.source, "^(.*[\\\\\\/])*([^\\\\\\/]*)\\.Txt$", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "ug.txt", true, ["ug.txt", undefined, "ug"]);
        _checkResult(regex, " ug.txt ", false, null);
        _checkResult(regex, "C:\\temp\\ug.txt", true, ["C:\\temp\\ug.txt", "C:\\temp\\", "ug"]);
        _checkResult(regex, "/var/log/ug.txt", true, ["/var/log/ug.txt", "/var/log/", "ug"]);
        _checkResult(regex, "/a/b\\c/log/ug.txt", true, ["/a/b\\c/log/ug.txt", "/a/b\\c/log/", "ug"]);

        regex = makeGlobRegex("src/**/*.Ts", true, true);

        //'(.*[\\\/])([^\\\/]*)\.txt
        assert.equal(regex.source, "^src[\\\\\\/]{1}(.*[\\\\\\/])*([^\\\\\\/]*)\\.Ts$", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "Src/index.ts", true, ["Src/index.ts", undefined, "index"]);
        _checkResult(regex, "Src\\index.ts", true, ["Src\\index.ts", undefined, "index"]);
        _checkResult(regex, "src/index.ts", true, ["src/index.ts", undefined, "index"]);
        _checkResult(regex, "src\\index.ts", true, ["src\\index.ts", undefined, "index"]);
        _checkResult(regex, "src/helpers/regexp.ts", true, ["src/helpers/regexp.ts", "helpers/", "regexp"]);
        _checkResult(regex, "src\\helpers/regexp.ts", true, ["src\\helpers/regexp.ts", "helpers/", "regexp"]);
        _checkResult(regex, " src/index.tsx ", false, null);
        _checkResult(regex, " src\\index.tsx ", false, null);
        _checkResult(regex, " src/helpers/regexp.ts. ", false, null);
        _checkResult(regex, " src\\helpers/regexp.ts. ", false, null);
        _checkResult(regex, " src/Index.tsx ", false, null);
        _checkResult(regex, " src\\Index.tsx ", false, null);
        _checkResult(regex, " src/Helpers/regexp.ts. ", false, null);
        _checkResult(regex, " src\\Helpers/regexp.ts. ", false, null);

        regex = makeGlobRegex("?:*.T??", true, true);

        assert.equal(regex.source, "^([^\\\\\\/]{1}):([^\\\\\\/]*)\\.T([^\\\\\\/]{1})([^\\\\\\/]{1})$", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "ug.txt", false, null);
        _checkResult(regex, "C:\\temp\\ug.txt", false, null);
        _checkResult(regex, " c:\\temp\\ug.txt ", false, null);
        _checkResult(regex, "/var/log/ug.txt", false, null);
        _checkResult(regex, "C:ug.txt", true, ["C:ug.txt", "C", "ug", "x", "t"]);
        _checkResult(regex, " c:ug.txt ", false, null);
        _checkResult(regex, "C:ug.Txt", true, ["C:ug.Txt", "C", "ug", "x", "t"]);
        _checkResult(regex, " c:ug.Txt ", false, null);

        regex = makeGlobRegex("?:**/*.T??", true, true);

        assert.equal(regex.source, "^([^\\\\\\/]{1}):(.*[\\\\\\/])*([^\\\\\\/]*)\\.T([^\\\\\\/]{1})([^\\\\\\/]{1})$", dumpObj(regex));
        _checkResult(regex, "Hello", false, null);
        _checkResult(regex, "ug.txt", false, null);
        _checkResult(regex, "C:\\temp\\ug.txt", true, ["C:\\temp\\ug.txt", "C", "\\temp\\", "ug", "x", "t"]);
        _checkResult(regex, " c:\\temp\\ug.txt ", false, null);
        _checkResult(regex, " c:\\ug.txt ", false, null);
        _checkResult(regex, "/var/log/ug.txt", false, null);
    });

    it("Escaping tokens", () => {
        let regex = makeGlobRegex("**[-+|^$#.?{}()]**\\\\/\"\'*");
        assert.equal(regex.source, "(.*)\\[\\-\\+\\|\\^\\$\\#\\.([^\\\\\\/]{1})\\{\\}\\(\\)\\](.*[\\\\\\/])*[\\\\\\/]{1}[\\\\\\/]{1}\\\"\\'([^\\\\\\/]*)");
    
        regex = makeGlobRegex("**[-+|^$#.?{}()]**\\\\/\"\'*", true);
        assert.equal(regex.source, "(.*)\\[\\-\\+\\|\\^\\$\\#\\.([^\\\\\\/]{1})\\{\\}\\(\\)\\](.*[\\\\\\/])*[\\\\\\/]{1}[\\\\\\/]{1}\\\"\\'([^\\\\\\/]*)");
    
        regex = makeGlobRegex("**[-+|^$#.?{}()]**\\\\/\"\'*", true, true);
        assert.equal(regex.source, "^(.*)\\[\\-\\+\\|\\^\\$\\#\\.([^\\\\\\/]{1})\\{\\}\\(\\)\\](.*[\\\\\\/])*[\\\\\\/]{1}[\\\\\\/]{1}\\\"\\'([^\\\\\\/]*)$");
    });
});