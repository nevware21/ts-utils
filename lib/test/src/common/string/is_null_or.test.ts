/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import {
    strIsNullOrEmpty,
    strIsNullOrWhiteSpace
} from "../../../../src/string/is_null_or";

describe("string helpers", () => {
    describe("isNullOrWhiteSpace", () => {
        it("True values", () => {
            assert.ok(strIsNullOrWhiteSpace(undefined as any), "Checking undefined");
            assert.ok(strIsNullOrWhiteSpace(null as any), "Checking null");
            assert.ok(strIsNullOrWhiteSpace("" as any), "Checking ''");
            assert.ok(strIsNullOrWhiteSpace(" " as any), "Checking ' '");
            assert.ok(strIsNullOrWhiteSpace("  " as any), "Checking '  '");
            assert.ok(strIsNullOrWhiteSpace("   " as any), "Checking '   '");
            assert.ok(strIsNullOrWhiteSpace("\t" as any), "Checking '\\t'");
            assert.ok(strIsNullOrWhiteSpace(" \t" as any), "Checking ' \\t'");
            assert.ok(strIsNullOrWhiteSpace(" \t " as any), "Checking ' \\t '");
            assert.ok(strIsNullOrWhiteSpace("\r" as any), "Checking '\\r'");
            assert.ok(strIsNullOrWhiteSpace(" \r" as any), "Checking ' \\r'");
            assert.ok(strIsNullOrWhiteSpace(" \r " as any), "Checking ' \\r '");
            assert.ok(strIsNullOrWhiteSpace("\n" as any), "Checking '\\n'");
            assert.ok(strIsNullOrWhiteSpace(" \n" as any), "Checking ' \\n'");
            assert.ok(strIsNullOrWhiteSpace(" \n " as any), "Checking ' \\n '");
            assert.ok(strIsNullOrWhiteSpace("\f" as any), "Checking '\\f'");
            assert.ok(strIsNullOrWhiteSpace(" \f" as any), "Checking ' \\f'");
            assert.ok(strIsNullOrWhiteSpace(" \f " as any), "Checking ' \\f '");
            assert.ok(strIsNullOrWhiteSpace("\v" as any), "Checking '\\v'");
            assert.ok(strIsNullOrWhiteSpace(" \v" as any), "Checking ' \\v'");
            assert.ok(strIsNullOrWhiteSpace(" \v " as any), "Checking ' \\v '");
            assert.ok(strIsNullOrWhiteSpace(" \v \t \r \n \f" as any), "Checking ' \\v \\t \\r \\n \\f '");
        });

        it("False string values", () => {
            assert.ok(!strIsNullOrWhiteSpace("." as any), "Checking ' '");
            assert.ok(!strIsNullOrWhiteSpace("  . " as any), "Checking '   '");
            assert.ok(!strIsNullOrWhiteSpace(" \t." as any), "Checking ' \\t'");
            assert.ok(!strIsNullOrWhiteSpace(" \t. " as any), "Checking ' \\t '");
            assert.ok(!strIsNullOrWhiteSpace(" \s." as any), "Checking ' \\s'");
            assert.ok(!strIsNullOrWhiteSpace(" \s. " as any), "Checking ' \\s '");
            assert.ok(!strIsNullOrWhiteSpace(" \r." as any), "Checking ' \\r'");
            assert.ok(!strIsNullOrWhiteSpace(" \r. " as any), "Checking ' \\r '");
            assert.ok(!strIsNullOrWhiteSpace(" \n." as any), "Checking ' \\n'");
            assert.ok(!strIsNullOrWhiteSpace(" \n. " as any), "Checking ' \\n '");
            assert.ok(!strIsNullOrWhiteSpace(" \f." as any), "Checking ' \\f'");
            assert.ok(!strIsNullOrWhiteSpace(" \f. " as any), "Checking ' \\f '");
            assert.ok(!strIsNullOrWhiteSpace(" \v \t.\r \n \f" as any), "Checking ' \\v \\t.\\r \\n \\f '");
        });

        it("Non string values", () => {
            assert.ok(!strIsNullOrWhiteSpace({} as any), "Checking '{}'");
            assert.ok(!strIsNullOrWhiteSpace(new Date() as any), "Checking new Date()");
        });
    });

    describe("strIsNullOrEmpty", () => {
        it("True values", () => {
            assert.ok(strIsNullOrEmpty(undefined as any), "Checking undefined");
            assert.ok(strIsNullOrEmpty(null as any), "Checking null");
            assert.ok(strIsNullOrEmpty("" as any), "Checking ''");
        });

        it("False string values", () => {
            assert.ok(!strIsNullOrEmpty(" " as any), "Checking ' '");
            assert.ok(!strIsNullOrEmpty("   " as any), "Checking '   '");
            assert.ok(!strIsNullOrEmpty("\t" as any), "Checking '\\t'");
            assert.ok(!strIsNullOrEmpty(" \t" as any), "Checking ' \\t'");
            assert.ok(!strIsNullOrEmpty(" \t " as any), "Checking ' \\t '");
            assert.ok(!strIsNullOrEmpty("\s" as any), "Checking '\\s'");
            assert.ok(!strIsNullOrEmpty(" \s" as any), "Checking ' \\s'");
            assert.ok(!strIsNullOrEmpty(" \s " as any), "Checking ' \\s '");
            assert.ok(!strIsNullOrEmpty("\r" as any), "Checking '\\r'");
            assert.ok(!strIsNullOrEmpty(" \r" as any), "Checking ' \\r'");
            assert.ok(!strIsNullOrEmpty(" \r " as any), "Checking ' \\r '");
            assert.ok(!strIsNullOrEmpty("\n" as any), "Checking '\\n'");
            assert.ok(!strIsNullOrEmpty(" \n" as any), "Checking ' \\n'");
            assert.ok(!strIsNullOrEmpty(" \n " as any), "Checking ' \\n '");
            assert.ok(!strIsNullOrEmpty("\f" as any), "Checking '\\f'");
            assert.ok(!strIsNullOrEmpty(" \f" as any), "Checking ' \\f'");
            assert.ok(!strIsNullOrEmpty(" \f " as any), "Checking ' \\f '");
            assert.ok(!strIsNullOrEmpty("\v" as any), "Checking '\\v'");
            assert.ok(!strIsNullOrEmpty(" \v" as any), "Checking ' \\v'");
            assert.ok(!strIsNullOrEmpty(" \v " as any), "Checking ' \\v '");
        });

        it("Non string values", () => {
            assert.ok(!strIsNullOrEmpty({} as any), "Checking '{}'");
            assert.ok(!strIsNullOrEmpty(new Date() as any), "Checking new Date()");
        });
    });
});
