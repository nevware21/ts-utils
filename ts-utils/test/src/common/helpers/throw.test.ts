import { assert } from "chai";
import { isError } from "../../../../src/helpers/base";
import { dumpObj } from "../../../../src/helpers/disgnostics";
import { throwError, throwTypeError } from "../../../../src/helpers/throw";


function _expectThrow(cb: () => never, message: string): Error {
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
});

