/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnApply } from "../funcs/funcs";
import { ArrSlice, CALL, CONSTRUCTOR, NAME, NULL_VALUE, PROTOTYPE } from "../internal/constants";
import { objCreate } from "../object/create";
import { objDefine } from "../object/define";
import { objGetPrototypeOf } from "../object/object";
import { objSetPrototypeOf } from "../object/set_proto";
import { safe } from "./safe";

/**
 * Defines the definition of the custom error constructor
 * Used by: {@link createCustomError}
 * @group Error
 */
export interface CustomErrorConstructor<T extends Error = Error> extends ErrorConstructor {
    new(message?: string): T;
    (message?: string): T;
    readonly prototype: T;
}

/**
 * @internal
 * @ignore
 */
/*#__NO_SIDE_EFFECTS__*/
function _createCustomError<T>(name: string, d: any, b: any): T {
    safe(objDefine, [ d, NAME, { v: name, c: true, e: false }]);
    d = objSetPrototypeOf(d, b);
    function __() {
        this[CONSTRUCTOR] = d;
        safe(objDefine, [this, NAME, { v: name, c: true, e: false }]);
    }

    d[PROTOTYPE] = b === NULL_VALUE ? objCreate(b) : ((__ as any)[PROTOTYPE] = b[PROTOTYPE], new (__ as any)());

    return d;
}

function  _setName(baseClass: any, name: string) {
    name && (baseClass[NAME] = name);
    //name && (baseClass[PROTOTYPE][NAME] = name);
}

/**
 * Create a Custom Error class which may be used to throw custom errors.
 * @group Error
 * @param name - The name of the Custom Error
 * @param constructCb - [Optional] An optional callback function to call when a
 * new Customer Error instance is being created.
 * @param errorBase - [Optional] (since v0.9.6) The error class to extend for this class, defaults to Error.
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
 * interface MyCriticalErrorConstructor extends CustomErrorConstructor {
 *     new(message: string, file: string, line: number, col: number): MyCriticalError;
 *     (message: string, file: string, line: number, col: number): MyCriticalError;
 * }
 *
 * interface MyCriticalError extends Error {
 *     readonly errorId: number;
 *     readonly args: any[];        // Holds all of the arguments passed during construction
 * }
 *
 * let _totalErrors = 0;
 * let myCustomError = createCustomError<MyCriticalErrorConstructor>("CriticalError", (self, args) => {
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
 *
 * // ----------------------------------------------------------
 * // Extending another custom error class
 * // ----------------------------------------------------------
 *
 * let AppError = createCustomError("ApplicationError");
 * let theAppError = new appError();
 *
 * isError(theAppError);                    // true
 * theAppError instanceof Error;            // true
 * theAppError instanceof AppError;         // true
 *
 * let StartupError = createCustomError("StartupError", null, AppError);
 * let theStartupError = new StartupError();
 *
 * isError(theStartupError);                // true
 * theStartupError instanceof Error;        // true
 * theStartupError instanceof AppError;     // true
 * theStartupError instanceof StartupError; // true
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function createCustomError<T extends ErrorConstructor = CustomErrorConstructor, B extends ErrorConstructor = ErrorConstructor>(
    name: string,
    constructCb?: ((self: any, args: IArguments) => void) | null,
    errorBase?: B): T {

    let theBaseClass = errorBase || Error;
    let orgName = theBaseClass[PROTOTYPE][NAME];
    let captureFn = Error.captureStackTrace;
    return _createCustomError<T>(name, function (this: any) {
        let _this = this;
        let theArgs = arguments;
        try {
            safe(_setName, [theBaseClass, name]);
            let _self = fnApply(theBaseClass, _this, ArrSlice[CALL](theArgs)) || _this;
            if (_self !== _this) {
                // Looks like runtime error constructor reset the prototype chain, so restore it
                let orgProto = objGetPrototypeOf(_this);
                if (orgProto !== objGetPrototypeOf(_self)) {
                    objSetPrototypeOf(_self, orgProto);
                }
            }

            // Make sure we only capture our stack details
            captureFn && captureFn(_self, _this[CONSTRUCTOR]);
    
            // Run the provided construction function
            constructCb && constructCb(_self, theArgs);
    
            return _self;
        } finally {
            safe(_setName, [theBaseClass, orgName]);
        }
    }, theBaseClass);
}

/**
 * @internal
 * @ignore
 */
let _unsupportedError: CustomErrorConstructor;

/**
 * Throw a custom `UnsupportedError` Error instance with the given message.
 * @group Error
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
    if (!_unsupportedError) {
        // Lazily create the class
        _unsupportedError = createCustomError("UnsupportedError");
    }

    throw new _unsupportedError(message);
}
