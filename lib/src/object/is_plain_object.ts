/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { getWindow, hasWindow } from "../helpers/environment";
import { CALL, CONSTRUCTOR, FUNCTION, ObjClass, OBJECT, PROTOTYPE, TO_STRING } from "../internal/constants";
import { objHasOwnProperty } from "./has_own_prop";
import { objGetPrototypeOf } from "./object";

// Use to cache the result of Object.cont
let _fnToString: () => string;
let _objCtrFnString: string;
let _gblWindow: Window;

/**
 * Checks to see if the past value is a plain object (not a class/array) value.
 * Object are considered to be "plain" if they are created with no prototype `Object.create(null)`
 * or by using the Object global (native) function, all other "objects" ar
 * @since 0.4.4
 * @group Type Identity
 * @group Object
 * @param value - The value to check
 * @returns true if `value` is a normal plain object
 * @example
 * ```ts
 * console.log(isPlainObject({ 0: 'a', 1: 'b', 2: 'c' }));      // true
 * console.log(isPlainObject({ 100: 'a', 2: 'b', 7: 'c' }));    // true
 * console.log(isPlainObject(objCreate(null)));                 // true
 *
 * const myObj = objCreate({}, {
 *   getFoo: {
 *     value() { return this.foo; }
 *   }
 * });
 * myObj.foo = 1;
 * console.log(isPlainObject(myObj));                   // true
 *
 * console.log(isPlainObject(['a', 'b', 'c']));         // false
 * console.log(isPlainObject(new Date()));              // false
 * console.log(isPlainObject(new Error("An Error")));   // false
 * console.log(isPlainObject(null));                    // false
 * console.log(isPlainObject(undefined));               // false
 * console.log(isPlainObject("null"));                  // false
 * console.log(isPlainObject("undefined"));             // false
 * console.log(isPlainObject("1"));                     // false
 * console.log(isPlainObject("aa"));                    // false
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function isPlainObject(value: any): value is object {
    if (!value || typeof value !== OBJECT) {
        return false;
    }

    if (!_gblWindow) {
        // Lazily cache the current global window value and default it to "true" (so we bypass this check in the future)
        _gblWindow = hasWindow() ? getWindow() : (true as any);
    }

    let result = false;
    if (value !== _gblWindow) {

        if (!_objCtrFnString) {
            // Lazily caching what the runtime reports as the object function constructor (as a string)
            // Using an current function lookup to find what this runtime calls a "native" function
            _fnToString = Function[PROTOTYPE][TO_STRING];
            _objCtrFnString = _fnToString[CALL](ObjClass);
        }

        try {
            let proto = objGetPrototypeOf(value);

            // No prototype so looks like an object created with Object.create(null)
            result = !proto;
            if (!result) {
                if (objHasOwnProperty(proto, CONSTRUCTOR)) {
                    proto = proto[CONSTRUCTOR]
                }
            
                result = proto && typeof proto === FUNCTION && _fnToString[CALL](proto) === _objCtrFnString;
            }
        } catch (ex) {
            // Something went wrong, so it's not an object we are playing with
        }
    }

    return result;
}
