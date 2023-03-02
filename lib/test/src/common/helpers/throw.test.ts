/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { isError, objToString } from "../../../../src/helpers/base";
import { createCustomError, CustomErrorConstructor, throwUnsupported } from "../../../../src/helpers/customError";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { throwError, throwTypeError } from "../../../../src/helpers/throw";


function _expectThrow<T = Error>(cb: () => never, message: string): T {
    try {
        cb();
    } catch (e) {
        assert.ok(true, "Checking [" + message + "] threw [" + dumpObj(e) + "]");
        return e;
    }

    assert.ok(false, "Expected an exception to be thrown");
    return null;
}

describe("throw helpers", () => {

    describe("throwError", () => {
        it("null or undefined", () => {
            assert.ok(isError(_expectThrow(() => throwError(null), "null")));
            assert.ok(isError(_expectThrow(() => throwError(undefined), "undefined")));
        });

        it("with message", () => {
            let error = _expectThrow(() => throwError("Failed"), "Failed");
            assert.ok(isError(error), "Validating an error was returned");
            assert.ok(error.message.indexOf("Failed") !== -1, "Message contains Failed");
            error = _expectThrow(() => throwError("Crashed"), "Crashed");
            assert.ok(isError(error), "Crashed");
            assert.ok(error.message.indexOf("Crashed") !== -1, "Message contains Crashed");
        });
    });

    describe("throwTypeError", () => {
        it("null or undefined", () => {
            assert.ok(isError(_expectThrow(() => throwTypeError(null), "null")));
            assert.ok(isError(_expectThrow(() => throwTypeError(undefined), "undefined")));
        });

        it("with message", () => {
            let error = _expectThrow(() => throwTypeError("Failed"), "Failed");
            assert.ok(isError(error), "Validating an error was returned");
            assert.ok(error.message.indexOf("Failed") !== -1, "Message contains Failed");
            error = _expectThrow(() => throwTypeError("Crashed"), "Crashed");
            assert.ok(isError(error), "Crashed");
            assert.ok(error.message.indexOf("Crashed") !== -1, "Message contains Crashed");
        });
    });

    describe("throwUnsupported", () => {
        it("null or undefined", () => {
            assert.ok(isError(_expectThrow(() => throwUnsupported(null), "null")));
            assert.ok(isError(_expectThrow(() => throwUnsupported(undefined), "undefined")));
        });

        it("with message", () => {
            let error = _expectThrow(() => throwUnsupported("Failed"), "Failed");
            assert.ok(isError(error), "Validating an error was returned");
            assert.ok(error.message.indexOf("Failed") !== -1, "Message contains Failed");
            assert.ok(error.name.indexOf("UnsupportedError") !== -1, "Name contains type Unsupported");
            error = _expectThrow(() => throwUnsupported("Crashed"), "Crashed");
            assert.ok(isError(error), "Crashed");
            assert.ok(error.name.indexOf("UnsupportedError") !== -1, "Name contains type Unsupported");
            assert.ok(error.message.indexOf("Crashed") !== -1, "Message contains Crashed");
        });
    });

    describe("createCustomError", () => {
        it("null or undefined", () => {
            let myCustomError = createCustomError("CriticalErrorTest");

            assert.ok(isError(_expectThrow(() => {
                throw new myCustomError(null);
            }, "null")));
            assert.ok(isError(_expectThrow(() => {
                throw new myCustomError(undefined);
            }, "undefined")));
        });

        it("with message", () => {
            let totalErrors = 0;
            let myCustomError = createCustomError("CriticalErrorMessageTest", (self, args) => {
                totalErrors++;
                self.errorId = totalErrors;
                self.args = args;
            });

            let error = _expectThrow(() => {
                throw new myCustomError("Failed")
            }, "Failed") as any;

            assert.ok(error instanceof Error, "The custom error is an error");
            assert.ok(isError(error), "Validating an error was returned");
            assert.ok(error.message.indexOf("Failed") !== -1, "Message contains Failed");
            assert.ok(error.name.indexOf("CriticalErrorMessageTest") !== -1, "Name contains type CriticalErrorMessageTest");
            assert.equal(error.errorId, 1, "Expected this to be error #1");
            assert.equal(objToString(error), "[object Error]", "Expected the error to resolve as an error");

            error = _expectThrow(() => {
                throw new myCustomError("Crashed");
            }, "Crashed") as any;
            assert.ok(error instanceof Error, "The custom error is an error");
            assert.ok(isError(error), "Crashed");
            assert.ok(error.name.indexOf("CriticalErrorMessageTest") !== -1, "Name contains type CriticalErrorMessageTest");
            assert.ok(error.message.indexOf("Crashed") !== -1, "Message contains Crashed");
            assert.equal(error.errorId, 2, "Expected this to be error #2");
            assert.equal(objToString(error), "[object Error]", "Expected the error to resolve as an error");
        });

        it("custom type aith additional args", () => {
            let totalErrors = 0;
            interface CriticalError extends CustomErrorConstructor {
                new(message: string, file: string, line: number, col: number): Error;
                (message: string, file: string, line: number, col: number): Error;

                readonly errorId: number;
                readonly args: any[];
            }

            let myCustomError = createCustomError<CriticalError>("CriticalErrorMessageTest", (self, args) => {
                totalErrors++;
                self.errorId = totalErrors;
                self.args = args;
            });

            let error = _expectThrow(() => {
                throw new myCustomError("Failed", "test.ts", 1, 32);
            }, "Failed") as CriticalError;

            assert.ok(error instanceof Error, "The custom error is an error");
            assert.ok(isError(error), "Validating an error was returned");
            assert.ok(error.message.indexOf("Failed") !== -1, "Message contains Failed");
            assert.ok(error.name.indexOf("CriticalErrorMessageTest") !== -1, "Name contains type CriticalErrorMessageTest");
            assert.equal(error.errorId, 1, "Expected this to be error #1");
            assert.equal(error.args[0], "Failed");
            assert.equal(error.args[1], "test.ts");
            assert.equal(error.args[2], 1);
            assert.equal(error.args[3], 32);
            assert.equal(objToString(error), "[object Error]", "Expected the error to resolve as an error");

            error = _expectThrow(() => {
                throw new myCustomError("Crashed", "loader.ts", 42, 100);
            }, "Crashed") as CriticalError;
            assert.ok(error instanceof Error, "The custom error is an error");
            assert.ok(isError(error), "Crashed");
            assert.ok(error.name.indexOf("CriticalErrorMessageTest") !== -1, "Name contains type CriticalErrorMessageTest");
            assert.ok(error.message.indexOf("Crashed") !== -1, "Message contains Crashed");
            assert.equal(error.errorId, 2, "Expected this to be error #2");
            assert.equal(error.args[0], "Crashed");
            assert.equal(error.args[1], "loader.ts");
            assert.equal(error.args[2], 42);
            assert.equal(error.args[3], 100);
            assert.equal(objToString(error), "[object Error]", "Expected the error to resolve as an error");
        });

        it("multiple custom errors", () => {
            let totalErrors = 0;
            let myCustomError1 = createCustomError("myCustomError1");
            assert.equal(new myCustomError1().name, "myCustomError1", "Checking the error1 name");

            let myCustomError2 = createCustomError("myCustomError2");
            assert.equal(new myCustomError2().name, "myCustomError2", "Checking the error2 name");

            let myCustomError3 = createCustomError("myCustomError3");
            assert.equal(new myCustomError3().name, "myCustomError3", "Checking the error3 name");

            // Recheck the custom error names
            assert.equal(new Error().name, "Error", "Checking the base class Error name");
            assert.equal(new myCustomError1().name, "myCustomError1", "Checking the error1 name");
            assert.equal(new myCustomError2().name, "myCustomError2", "Checking the error2 name");
            assert.equal(new myCustomError3().name, "myCustomError3", "Checking the error3 name");
        });
    });
});

