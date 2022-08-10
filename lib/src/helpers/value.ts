/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { isArray, isBoolean, isDate, isFunction, isNullOrUndefined, isObject, isTruthy } from "./base";
import { objKeys } from "../object/object";

function _checkLength(value: any, props: string[]) {
    let result: any;

    arrForEach(props, (prop) => {
        if (prop in value) {
            let propValue = value[prop];
            result = (isFunction(propValue) ? propValue() : propValue) > 0;
            return -1;
        }
    });

    return result;
}

function _hasValue(value: any, depth: number): boolean {
    let result = value === false || value === 0;

    if (!result && !isNullOrUndefined(value)) {
        if (isArray(value)) {
            result = value.length > 0;
        } else if (isDate(value)) {
            result = !isNaN(value.getTime());
        } else if (isBoolean(value)) {
            return true;
        } else if (isObject(value)) {
            try {
                let chkValue = _checkLength(value, [ "length", "byteLength", "size", "count"]);
                if (isBoolean(chkValue)) {
                    return chkValue;
                }
    
                if (isFunction((value as any).valueOf) && depth < 5) {
                    return _hasValue((value as any).valueOf(), ++depth);
                }
            } catch (e) {
                // Best effort to try calling functions and lookup properties
            }

            return !!objKeys(value).length;
        } else {
            result = isTruthy(value);
        }
    }

    return result;
}


/**
 * Return whether the value appears to have any `value`, this helper returns true for
 * - value is not null, undefined or string value of "undefined"
 * - value === false
 * - value === 0
 * - An array with a length >= 1
 * - A valid Date
 * - If object has a `length` property or function and the returned value.length or value.length() !== 0
 * - If object has a `byteLength` property or function and the returned value.byteLength or value.byteLength() !== 0
 * - If object has a `size` property or function and the returned value.size or value.size() !== 0
 * - If object has a `valueOf` function then the returned value hasValue(value.valueOf()) to a maximum recursion of 5 levels
 * - If object with at least 1 key of it's own property (hasOwnProperty)
 * - else if isTruthy (empty string, etc)
 * @group Value Check
 * @param value
 */
export function hasValue(value: any): boolean {
    return _hasValue(value, 0);
}
