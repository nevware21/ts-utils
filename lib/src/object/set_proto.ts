/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { ILazyValue, getLazy } from "../helpers/lazy";
import { ObjClass, __PROTO__ } from "../internal/constants";
import { objForEachKey } from "./for_each_key";

let _isProtoArray: ILazyValue<boolean>;

/**
 * The objSetPrototypeOf() method sets the prototype (i.e., the internal [Prototype] property) of a specified
 * object to another object or null.
 * @group Object
 * @param obj - The object which is to have it's prototype set.
 * @param proto - The object's new prototype (an object or null)
 * @returns The specified object.
 */
export function objSetPrototypeOf(obj: any, proto: object) {
    let fn = ObjClass["setPrototypeOf"] ||
        // tslint:disable-next-line: only-arrow-functions
        function (d: any, b: any) {
            !_isProtoArray && (_isProtoArray = getLazy(() => ({ [__PROTO__]: [] } instanceof Array)));
            _isProtoArray.v ? d[__PROTO__] = b : objForEachKey(b, (key: any, value: any) => d[key] = value );
        };

    return fn(obj, proto);
}