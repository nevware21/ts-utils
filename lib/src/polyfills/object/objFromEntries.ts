/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArray, isPrimitive } from "../../helpers/base";
import { dumpObj } from "../../helpers/diagnostics";
import { throwTypeError } from "../../helpers/throw";
import { DUMP_ERR_MAX_LENGTH, LENGTH, NULL_VALUE } from "../../internal/constants";
import { _throwIfNullOrUndefined } from "../../internal/throwIf";
import { _getMapSetValues, iterForOf } from "../../iterator/forOf";
import { isIterable } from "../../iterator/iterator";
import { _setOwnValue } from "../../object/define";

/**
 * Creates a new object from an array of [key, value] pairs.
 * Supports both native symbols and polyfilled symbols.
 *
 * Like the native `Object.fromEntries()`:
 * - Each entry must be an object, its `0` property is the key and its `1` property is the value (so an entry
 * with only a key has an `undefined` value).
 * - Each key is converted once (a symbol is used as-is, an object by its `Symbol.toPrimitive` or `toString()`) and
 * is defined as an own property (rather than assigned), so a `__proto__` key does not change the prototype of the new
 * object, and a setter or read-only property of the same name on `Object.prototype` doesn't stop the key being added.
 * - A `null` or `undefined` value, a value which is not iterable (an array is always supported, as is (since 0.20.0) a
 * `Map` or `Set` which has no iterator function, eg. on IE 11) or an entry which is not an object (including an empty
 * slot of a sparse array) throws a `TypeError`.
 *
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param entries - An iterable object that contains [key, value] pairs
 * @returns A new object whose properties are given by the entries
 */
export function polyObjFromEntries<T = any>(entries: Iterable<readonly [PropertyKey, T]>): { [k: string]: T };
export function polyObjFromEntries(entries: Iterable<readonly any[]>): any;
export function polyObjFromEntries<T = any>(entries: any): T {
    const result = {} as any;

    function addEntry(entry: any) {
        if (isPrimitive(entry)) {
            throwTypeError(dumpObj(entry, 0, DUMP_ERR_MAX_LENGTH) + " is not an entry object");
        }

        // Like the native function the key is converted once (to a symbol or a string, an object using its
        // Symbol.toPrimitive("string") or its toString() / valueOf()) and it is added as an own (enumerable, configurable
        // and writable) property, so an inherited setter or read-only property (eg. "__proto__", or one added to
        // Object.prototype) doesn't stop it being added or change the prototype of the result
        _setOwnValue(result, entry[0], entry[1]);
    }

    _throwIfNullOrUndefined(entries);

    // A Map or Set which isn't iterable (eg. IE 11, which has no iterator functions) uses a copy of its entries / values
    let values: ArrayLike<any> = isArray(entries) ? entries : (isIterable(entries) ? NULL_VALUE : _getMapSetValues(entries));
    if (values) {
        // Like the array iterator every index is visited (an empty slot is undefined, which throws)
        for (let idx = 0; idx < values[LENGTH]; idx++) {
            addEntry(values[idx]);
        }
    } else if (isIterable(entries)) {
        iterForOf(entries, addEntry);
    } else {
        throwTypeError(dumpObj(entries, 0, DUMP_ERR_MAX_LENGTH) + " is not iterable");
    }

    return result as T;
}
