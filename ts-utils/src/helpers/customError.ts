/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { PROTOTYPE } from "../internal/constants";
import { objSetPrototypeOf } from "../object/set_proto";

/**
 * Defines the definition of the custom error constructor
 *
 * Used by: {@link createCustomError}
 */
export interface CustomErrorConstructor extends Error {
    new(message?: string): Error;
    (message?: string): Error;
    readonly prototype: Error;
}

/**
 * @internal
 * @ignore
 */
function _createCustomError(name: string, d: any, b: any) {
    objSetPrototypeOf(d, b);
    function __() {
        this.constructor = d;
    }
    __[PROTOTYPE] = b[PROTOTYPE];
    __[PROTOTYPE].name = name;
    d[PROTOTYPE] = new (__ as any)();

    return d;
}

/**
 * Create a Custom Error class which may be used to throw custom errors.
 * @param name - The name of the Custom Error
 * @param constructCb - [Optional] An optional callback function to call when a
 * new Customer Error instance is being created.
 * @returns A new Error `class`
 * @example
 * ```ts
 * import { createCustomError, isError } from "@nevware21/ts-utils";
 *
 * // For an error that just contains a message
 * let myCustomErrorError = createCustomError("MessageError");
 *
 * try {
 *     throw new myCustomErrorError("Error Message!");
 * } catch(e) {
 *      // e.name === MessageError
 *      // isError(e) === true;
 *      // Object.prototype.toString.call(e) === "[object Error]";
 * }
 *
 * // Or a more complex error object
 * interface MyCriticalError extends CustomErrorConstructor {
 *     new(message: string, file: string, line: number, col: number): Error;
 *     (message: string, file: string, line: number, col: number): Error;
 *
 *     readonly errorId: number;
 *     readonly args: any[];        // Holds all of the arguments passed during construction
 * }
 *
 * let _totalErrors = 0;
 * let myCustomError = createCustomError<MyCriticalError>("CriticalError", (self, args) => {
 *     _totalErrors++;
 *     self.errorId = _totalErrors;
 *     self.args = args;
 * });
 *
 * try {
 *     throw new myCustomError("Not Again!");
 * } catch(e) {
 *      // e.name === CriticalError
 *      // isError(e) === true;
 *      // Object.prototype.toString.call(e) === "[object Error]";
 * }
 * ```
 */
export function createCustomError<T extends CustomErrorConstructor = CustomErrorConstructor>(name: string, constructCb?: (self: any, args: IArguments) => void): T {
    let baseClass = Error;

    let customError = _createCustomError(name, function (this: any) {
        let _this = this;
        _this = baseClass.apply(_this, arguments) || _this;
        constructCb && constructCb(_this, arguments);

        return _this;
    }, baseClass);

    return customError as T;
}

/**
 * @internal
 * @ignore
 */
const _unsupportedError = createCustomError("UnsupportedError");

/**
 * Throw a custom `UnsupportedError` Error instance with the given message.
 * @param message - The message to include in the exception
 * @example
 * ```ts
 * import { throwUnsupported } from "@nevware21/ts-utils";
 *
 * if (!window) {
 *     throwUnsupported("A window is needed for this operation");
 * }
 * ```
 */
export function throwUnsupported(message?: string): never {
    throw new _unsupportedError(message);
}