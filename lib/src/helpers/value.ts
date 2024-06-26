/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { isArray, isBoolean, isDate, isFunction, isNullOrUndefined, isObject, isTruthy } from "./base";
import { objKeys } from "../object/object";
import { LENGTH } from "../internal/constants";

/*#__NO_SIDE_EFFECTS__*/
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

/*#__NO_SIDE_EFFECTS__*/
function _hasValue(value: any, depth: number): boolean {
    let result = value === false || value === 0;

    if (!result && !isNullOrUndefined(value)) {
        if (isArray(value)) {
            result = value[LENGTH] > 0;
        } else if (isDate(value)) {
            result = !isNaN(value.getTime());
        } else if (isBoolean(value)) {
            return true;
        } else if (isObject(value)) {
            try {
                let chkValue = _checkLength(value, [ LENGTH, "byteLength", "size", "count"]);
                if (isBoolean(chkValue)) {
                    return chkValue;
                }
    
                if (isFunction((value as any).valueOf) && depth < 5) {
                    return _hasValue((value as any).valueOf(), ++depth);
                }
            } catch (e) {
                // Best effort to try calling functions and lookup properties
            }

            return !!objKeys(value)[LENGTH];
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
 * @param value - The value to be checked
 * @example
 * ```ts
 * // False
 * hasValue(null);                              // false
 * hasValue(undefined);                         // false
 * hasValue("undefined");                       // false (Special Case)
 * hasValue("");                                // false -- use: !strIsNullOrEmpty("")
 * hasValue([]);                                // false
 * hasValue(/[a-z]/g);                          // false
 * hasValue(new RegExp(""));                    // false
 * hasValue(new ArrayBuffer(0));                // false
 * hasValue(new Error("Test Error"));           // false
 * hasValue(new TypeError("Test TypeError"));   // false
 * hasValue(new TestError("Test TestError"));   // false
 * hasValue(Promise.reject());                  // false
 * hasValue(Promise.resolve());                 // false
 * hasValue(new Promise(() => {}));             // false
 * hasValue({});                                // false
 * hasValue(Object.create(null));               // false
 * hasValue(polyObjCreate(null));               // false
 *
 * // Objects with length / size property or function
 * hasValue({ length: 0 });                     // false
 * hasValue({ length: () => 0 });               // false
 * hasValue({ byteLength: 0 });                 // false
 * hasValue({ byteLength: () => 0 });           // false
 * hasValue({ size: 0 });                       // false
 * hasValue({ size: () => 0 });                 // false
 * hasValue({ count: 0 });                      // false
 * hasValue({ count: undefined as any });       // false
 * hasValue({ count: null as any });            // false
 * hasValue({ count: () => 0 });                // false
 * hasValue({ count: () => undefined as any }); // false
 * hasValue({ count: () => null as any });      // false
 * hasValue({ valueOf: () => undefined as any});// false
 * hasValue({ valueOf: () => null as any });    // false

 * // True
 * hasValue("null");                    // true
 * hasValue("0");                       // true
 * hasValue("1");                       // true
 * hasValue("aa");                      // true
 * hasValue(new Date());                // true
 * hasValue(0);                         // true
 * hasValue(1);                         // true
 * hasValue(_dummyFunction);            // true
 * hasValue(["A"]);                     // true
 * hasValue([0]);                       // true
 * hasValue([false]);                   // true
 * hasValue(new Array(1));              // true
 * hasValue(true);                      // true
 * hasValue(false);                     // true
 * hasValue("true");                    // true
 * hasValue("false");                   // true
 * hasValue((/[a-z]/g).exec("hello"));  // true
 * hasValue(new ArrayBuffer(1));        // true
 * hasValue(_dummyError());             // true
 * hasValue(_simplePromise());          // true
 * hasValue(_simplePromiseLike());      // true
 *
 * // Boolean objects
 * hasValue(new Boolean(true));         // true
 * hasValue(new Boolean(false));        // true
 * hasValue(new Boolean("true"));       // true
 * hasValue(new Boolean("false"));      // true
 * hasValue(new Boolean("0"));          // true
 * hasValue(new Boolean(0));            // true
 * hasValue(new Boolean("1"));          // true
 * hasValue(new Boolean(1));            // true
 *
 * // Boolean values
 * hasValue(Boolean(true));             // true
 * hasValue(Boolean(false));            // true
 * hasValue(Boolean("true"));           // true
 * hasValue(Boolean("false"));          // true
 * hasValue(Boolean("0"));              // true
 * hasValue(Boolean(0));                // true
 * hasValue(Boolean("1"));              // true
 * hasValue(Boolean(1));                // true

 * // Objects with length / size property or function
 * hasValue({ length: 1 });             // true
 * hasValue({ length: () => 1 });       // true
 * hasValue({ byteLength: 1 });         // true
 * hasValue({ byteLength: () => 1 });   // true
 * hasValue({ size: 1 });               // true
 * hasValue({ size: () => 1 });         // true
 * hasValue({ count: 1 });              // true
 * hasValue({ count: () => 1 });        // true
 * hasValue({ valueOf: () => 0 });      // true
 * hasValue({ valueOf: () => 1 });      // true
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function hasValue(value: any): boolean {
    return _hasValue(value, 0);
}
