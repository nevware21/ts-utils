/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { PROTOTYPE } from "../internal/constants";
import { objSetPrototypeOf } from "../object/set_proto";

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

export interface CustomErrorConstructor {
    new(message?: string): Error;
    (message?: string): Error;
    readonly prototype: Error;
}

export function createCustomError(name: string, constructCb?: (self: any, args: IArguments) => void): CustomErrorConstructor {
    let baseClass = Error;

    let customError = _createCustomError(name, function (this: any) {
        let _this = this;
        _this = baseClass.apply(_this, arguments) || _this;
        constructCb && constructCb(_this, arguments);

        return _this;
    }, baseClass);

    return customError as CustomErrorConstructor;
}

const _unsupportedError = createCustomError("UnsupportedError");

export function throwUnsupported(message?: string): never {
    throw new _unsupportedError(message);
}