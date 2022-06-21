/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { ObjClass } from "../internal/constants";
import { objForEachKey } from "./for_each_key";

/**
 * The objSetPrototypeOf() method sets the prototype (i.e., the internal [[Prototype]] property) of a specified
 * object to another object or null.
 * @param obj - The object which is to have it's prototype set.
 * @param proto - The object's new prototype (an object or null)
 * @returns The specified object.
 */
export function objSetPrototypeOf(obj: any, proto: object) {
    let fn = ObjClass["setPrototypeOf"] ||
        // tslint:disable-next-line: only-arrow-functions
        ({ __proto__: [] } instanceof Array && function (d: any, b: any) {
            d.__proto__ = b;
        }) ||
        // tslint:disable-next-line: only-arrow-functions
        function (d: any, b: any) {
            objForEachKey(b, (key: any, value: any) => {
                d[key] = value;
            });
        };

    return fn(obj, proto);
}