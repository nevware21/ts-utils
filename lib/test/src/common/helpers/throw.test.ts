/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isError, objToString } from "../../../../src/helpers/base";
import { createCustomError, CustomErrorConstructor, throwUnsupported } from "../../../../src/helpers/customError";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { throwError, throwTypeError } from "../../../../src/helpers/throw";


function _expectThrow<T extends Error = Error>(cb: () => never, message: string): T {
    try {
        cb();
    } catch (e) {
        assert.ok(true, "Checking [" + message + "] threw [" + dumpObj(e) + "]");
        return e;
    }

    assert.ok(false, "Expected an exception to be thrown");
    return null;
}
export interface TestError extends Error {
    readonly errorId: number;
    readonly args: any[];
}

export interface TestErrorConstructor extends CustomErrorConstructor<TestError> {

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
            let myCustomError = createCustomError<TestErrorConstructor>("CriticalErrorTest");

            assert.ok(isError(_expectThrow(() => {
                throw new myCustomError(null);
            }, "null")));
            assert.ok(isError(_expectThrow(() => {
                throw new myCustomError(undefined);
            }, "undefined")));
        });

        it("with message", () => {
            let totalErrors = 0;
            let myCustomError = createCustomError<TestErrorConstructor>("CriticalErrorMessageTest", (self, args) => {
                totalErrors++;
                self.errorId = totalErrors;
                self.args = args;
            });

            let error = _expectThrow<TestError>(() => {
                throw new myCustomError("Failed")
            }, "Failed");

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
            interface CriticalErrorConstructor extends CustomErrorConstructor<CriticalError> {
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
                let theError: MyCriticalError = e;
                assert.equal(e.name, "CriticalError");
                assert.ok(isError(e));
                assert.equal(theError.args[0] , "Not Again!");
                assert.equal(theError.args[1] , "thefile.txt");
                assert.equal(theError.args[2] , "42");
                assert.equal(theError.args[3] , "21");
                assert.equal(theError.errorId, 1);
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

    describe("createCustomError with superArgsFn", () => {
        it("reorders arguments before passing to base class", () => {
            interface HttpErrorConstructor extends CustomErrorConstructor<HttpError> {
                new(statusCode: number, message: string): HttpError;
                (statusCode: number, message: string): HttpError;
            }

            interface HttpError extends Error {
                readonly statusCode: number;
            }

            let MyHttpError = createCustomError<HttpErrorConstructor>("HttpError",
                (self, args) => {
                    self.statusCode = args[0];
                },
                Error,
                (args) => [ args[1] ]  // pass only the message to base Error constructor
            );

            let err = _expectThrow<HttpError>(() => {
                throw new MyHttpError(404, "Not Found");
            }, "Not Found");

            assert.ok(err instanceof Error, "The custom error is an Error");
            assert.ok(isError(err), "isError returns true");
            assert.equal(err.name, "HttpError", "Name is HttpError");
            assert.equal(err.message, "Not Found", "Message is set from second arg");
            assert.equal(err.statusCode, 404, "statusCode is set from first arg");
        });

        it("passes subset of arguments to base class", () => {
            interface DetailedErrorConstructor extends CustomErrorConstructor<DetailedError> {
                new(message: string, code: number, detail: string): DetailedError;
                (message: string, code: number, detail: string): DetailedError;
            }

            interface DetailedError extends Error {
                readonly code: number;
                readonly detail: string;
            }

            let MyDetailedError = createCustomError<DetailedErrorConstructor>("DetailedError",
                (self, args) => {
                    self.code = args[1];
                    self.detail = args[2];
                },
                Error,
                (args) => [ args[0] ]  // pass only message to base Error
            );

            let err = _expectThrow<DetailedError>(() => {
                throw new MyDetailedError("Something failed", 42, "extra detail");
            }, "Something failed");

            assert.ok(err instanceof Error, "The custom error is an Error");
            assert.ok(isError(err), "isError returns true");
            assert.equal(err.name, "DetailedError", "Name is DetailedError");
            assert.equal(err.message, "Something failed", "Message is set correctly");
            assert.equal(err.code, 42, "code is set correctly");
            assert.equal(err.detail, "extra detail", "detail is set correctly");
        });

        it("works with custom error base class", () => {
            interface AppErrorConstructor extends CustomErrorConstructor<AppError> {
                new(message: string): AppError;
                (message: string): AppError;
            }
            interface AppError extends Error {}

            interface ServiceErrorConstructor extends CustomErrorConstructor<ServiceError> {
                new(service: string, message: string): ServiceError;
                (service: string, message: string): ServiceError;
            }
            interface ServiceError extends AppError {
                readonly service: string;
            }

            let AppErrorCls = createCustomError<AppErrorConstructor>("AppError");
            let ServiceErrorCls = createCustomError<ServiceErrorConstructor>("ServiceError",
                (self, args) => {
                    self.service = args[0];
                },
                AppErrorCls,
                (args) => [ args[1] ]  // pass message to AppError base class
            );

            let err = _expectThrow<ServiceError>(() => {
                throw new ServiceErrorCls("auth-service", "Unauthorized");
            }, "Unauthorized");

            assert.ok(err instanceof Error, "is an Error");
            assert.ok(err instanceof AppErrorCls, "is an AppError");
            assert.ok(err instanceof ServiceErrorCls, "is a ServiceError");
            assert.ok(isError(err), "isError returns true");
            assert.equal(err.name, "ServiceError", "Name is ServiceError");
            assert.equal(err.message, "Unauthorized", "Message is set from second arg");
            assert.equal(err.service, "auth-service", "service is set from first arg");
        });

        it("null superArgsFn behaves like no superArgsFn (passes all args)", () => {
            interface MyErrorConstructor extends CustomErrorConstructor<MyError> {
                new(message: string): MyError;
                (message: string): MyError;
            }
            interface MyError extends Error {}

            let MyErrorCls = createCustomError<MyErrorConstructor>("MyNullSuperError", null, Error, null);

            let err = _expectThrow<MyError>(() => {
                throw new MyErrorCls("hello");
            }, "hello");

            assert.ok(isError(err), "isError returns true");
            assert.equal(err.message, "hello", "Message is set correctly");
        });
    });
});

