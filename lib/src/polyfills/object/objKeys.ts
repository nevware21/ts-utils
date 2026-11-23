/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../../funcs/funcs";
import { LENGTH, ObjProto } from "../../internal/constants";
import { _objGetOwnPropertyNames } from "../../internal/own_props";
import { _toObject } from "../../internal/throwIf";
import { _pureRef } from "../../internal/treeshake_helpers";
import { _pushOwnValue } from "../../object/define";
import { _polyObjGetOwnPropertyNames } from "./objGetOwnProperty";

// The intrinsic Object.prototype.propertyIsEnumerable (defined by every supported runtime, ES5), which (like the native
// functions) gets the key's own property descriptor once
const _objPropIsEnum: (this: any, key: PropertyKey) => boolean = (/*#__PURE__*/_pureRef<typeof Object.prototype.propertyIsEnumerable>(ObjProto, "propertyIsEnumerable"));

/**
 * Iterates the own enumerable string keys of the object, passing only the key to the mapper. This intentionally
 * does not use objForEachKey (which reads every value and swallows getter exceptions) so that, like the native
 * implementations, polyObjKeys never invokes getters and polyObjEntries / polyObjValues invoke each getter once
 * and propagate any exception it throws.
 * Like the native implementations the value is converted into an object, so a null or undefined value throws, the keys
 * of a string are the indexes of its characters and any other primitive value has no keys. Its own keys are read once
 * (eg. a Proxy's ownKeys trap is only called once), and each one (in the same order, integer keys first) is included
 * when it is still an own enumerable property, which is checked (once) as it is reached, so a property which a getter
 * has removed or made non-enumerable is skipped, and (for polyObjEntries / polyObjValues) its value is then read once.
 */
function _objIterateEntries<R>(obj: any, mapper: (theObj: any, key: string) => R): R[] {
    const result: R[] = [];

    const theObj = _toObject(obj);
    // Without the ES5 Object.getOwnPropertyNames (eg. ES3) its polyfill is used, which (like v0.16.0) returns the own
    // enumerable keys
    const keys = (_objGetOwnPropertyNames || _polyObjGetOwnPropertyNames)(theObj);
    for (let idx = 0; idx < keys[LENGTH]; idx++) {
        let key = keys[idx];
        if (fnCall(_objPropIsEnum, theObj, key)) {
            _pushOwnValue(result, mapper(theObj, key));
        }
    }

    return result;
}

/**
 * Returns the names of the enumerable string properties and methods of an object. This helper exists to avoid adding a polyfil for older browsers
 * that do not define Object.keys eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
 * Note: For consistency this will not use the Object.keys implementation if it exists as this would cause a testing requirement to test with and without the implementations
 * @group Polyfill
 * @group Object
 * @param obj - Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyObjKeys(obj: any): string[] {
    // Like the native function (ES2015+) only null or undefined throws a TypeError, any other value (eg. a function, or
    // a primitive such as a string, whose keys are its character indexes) is converted to an object
    return _objIterateEntries<string>(obj, (_theObj, k) => k);
}

/**
 * Returns an array of key/values of the enumerable properties of an object
 * @since 0.9.7
 * @group Polyfill
 * @group Object
 * @group ArrayLike
 * @param value - Object that contains the properties and methods.
 * @example
 * ```ts
 * polyObjEntries({ Hello: "Darkness", my: "old", friend: "." });
 * // [ [ "Hello", "Darkness" ], [ "my", "old"], [ "friend", "." ] ]
 *
 * // Array-like object
 * polyObjEntries({ 0: "a", 1: "b", 2: "c" });
 * // [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ]
 *
 * // Array-like object with random key ordering
 * polyObjEntries({ 100: "a", 2: "b", 7: "c" });
 * // [ ['2', 'b'], ['7', 'c'], ['100', 'a'] ]*
 *
 * // Like Object.entries() a string returns its characters and null or undefined throws a TypeError
 * polyObjEntries("ab");
 * // [ ['0', 'a'], ['1', 'b'] ]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyObjEntries<T = any>(value: {} | { [s: string]: T } | ArrayLike<T>): [string, T][] {
    return _objIterateEntries<[string, T]>(value, (theObj, k) => [k, theObj[k]]);
}

/**
 * Returns an array of key/values of the enumerable properties of an object
 * @since 0.9.7
 * @group Polyfill
 * @group Object
 * @group ArrayLike
 * @param value - Object that contains the properties and methods.
 * @example
 * ```ts
 * polyObjValues({ Hello: "Darkness", my: "old", friend: "." });
 * // [ "Darkness", "old", "." ]
 *
 * // Array-like object
 * polyObjValues({ 0: "a", 1: "b", 2: "c" });
 * // [ 'a', 'b', 'c']
 *
 * // Array-like object with random key ordering
 * polyObjValues({ 100: "a", 2: "b", 7: "c" });
 * // [ 'b', 'c', 'a']
 *
 * // Like Object.values() a string returns its characters and null or undefined throws a TypeError
 * polyObjValues("ab");
 * // [ 'a', 'b' ]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyObjValues<T = any>(value: {} | { [s: string]: T } | ArrayLike<T>): T[] {
    return _objIterateEntries<T>(value, (theObj, k) => theObj[k]);
}
