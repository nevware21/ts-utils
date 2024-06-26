/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
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
            interface CriticalErrorConstructor extends CustomErrorConstructor {
                new(message: string, file: string, line: number, col: number): CriticalError;
                (message: string, file: string, line: number, col: number): CriticalError;
            }

            interface CriticalError extends Error {
                readonly errorId: number;
                readonly args: any[];
            }

            let myCustomError = createCustomError<CriticalErrorConstructor>("CriticalErrorMessageTest", (self, args) => {
                totalErrors++;
                self.errorId = totalErrors;
                self.args = args;
            });

            let error = _expectThrow<CriticalError>(() => {
                throw new myCustomError("Failed", "test.ts", 1, 32);
            }, "Failed");

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

            assert.ok(isError(new myCustomError1()), "Check that the error is an Error");
            assert.ok(isError(new myCustomError2()), "Check that the error is an Error");
            assert.ok(isError(new myCustomError3()), "Check that the error is an Error");

            assert.ok(new myCustomError1() instanceof Error, "Check that the error is an Error");
            assert.ok(new myCustomError2() instanceof Error, "Check that the error is an Error");
            assert.ok(new myCustomError3() instanceof Error, "Check that the error is an Error");
        });

        it("MyCriticalError example", () => {
            // Or a more complex error object
            interface MyCriticalErrorConstructor extends CustomErrorConstructor {
                new(message: string, file: string, line: number, col: number): MyCriticalError;
                (message: string, file: string, line: number, col: number): MyCriticalError;
            }
            
            interface MyCriticalError extends Error {
                readonly errorId: number;
                readonly args: any[];        // Holds all of the arguments passed during construction
            }
                        
            let _totalErrors = 0;
            let myCustomError = createCustomError<MyCriticalErrorConstructor>("CriticalError", (self, args) => {
                _totalErrors++;
                self.errorId = _totalErrors;
                self.args = args;
            });
            
            try {
                let theError = new myCustomError("Not Again!", "thefile.txt", 42, 21);
                assert.equal(theError.name, "CriticalError");
                assert.ok(isError(theError));
                assert.equal(theError.args[0] , "Not Again!");
                assert.equal(theError.args[1] , "thefile.txt");
                assert.equal(theError.args[2] , "42");
                assert.equal(theError.args[3] , "21");
                assert.equal(theError.errorId, 1);

                throw theError;
            } catch(e) {
                assert.equal(e.name, "CriticalError");
                assert.ok(isError(e));
                assert.equal(e.args[0] , "Not Again!");
                assert.equal(e.args[1] , "thefile.txt");
                assert.equal(e.args[2] , "42");
                assert.equal(e.args[3] , "21");
                assert.equal(e.errorId, 1);
            }
        });
    });

    describe("createCustomErrorWithBase", () => {
        it("simple heirarchy", () => {
            let ApplicationError = createCustomError("ApplicationError");
            let startupError = createCustomError("StartupError", null, ApplicationError);

            let theAppError = new ApplicationError();
            let theError = new startupError();

            assert.equal(theAppError.name, "ApplicationError", "Checking the appError name");
            assert.ok(isError(theAppError), "Check that the appError is an Error");
            assert.ok(theAppError instanceof Error, "Check that the appError is an Error");

            
            assert.equal(theError.name, "StartupError", "Checking the startupError name");
            assert.ok(isError(theError), "Check that the startupError is an Error");
            assert.ok(theError instanceof Error, "Check that the startupError is an Error");
            assert.ok(theError instanceof startupError, "Check that the startupError is an startupError");
            assert.ok(theError instanceof ApplicationError, "Check that the startupError is an ApplicationError");
        });
    });
});

