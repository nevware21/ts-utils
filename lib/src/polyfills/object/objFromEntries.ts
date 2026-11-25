/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArray, isPrimitive, isStrictNullOrUndefined } from "../../helpers/base";
import { fnCall } from "../../funcs/funcs";
import { LENGTH } from "../../internal/constants";
import { _throwIfNullOrUndefined, _throwTypeOf } from "../../internal/throwIf";
import { _getEmulatedStrValues, _getMapSetValues, _iterForOf } from "../../iterator/forOf";
import { _getIterKey, _hasNativeIterator } from "../../iterator/iterator";
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
 * - The value's iterator (`[Symbol.iterator]`, read once) is used, including an array's own one. On a runtime without
 * `Symbol` (eg. IE, which has no iterators) an array is read by its indexes, a string by its code points (like the
 * String iterator) and (since 0.20.0) a `Map` or `Set` by its entries / values (read as its `forEach()` returns them).
 * Where there is `Symbol` (like the native function) a value which isn't iterable, eg. an array, `Map` or `Set` whose
 * own `[Symbol.iterator]` is `null` or `undefined`, throws a `TypeError` (unlike {@link iterForOf} and the iterator
 * helpers, which process such an array by its indexes and a `Map` or `Set` by its entries / values).
 * - A `null` or `undefined` value, a value which is not iterable or an entry which is not an object (including an
 * empty slot of a sparse array) throws a `TypeError`.
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
            _throwTypeOf(entry, " is not an entry object");
        }

        // Like the native function the key is converted once (to a symbol or a string, an object using its
        // Symbol.toPrimitive("string") or its toString() / valueOf()) and it is added as an own (enumerable, configurable
        // and writable) property, so an inherited setter or read-only property (eg. "__proto__", or one added to
        // Object.prototype) doesn't stop it being added or change the prototype of the result
        _setOwnValue(result, entry[0], entry[1]);
    }

    _throwIfNullOrUndefined(entries);

    // Like Object.fromEntries() the iterator function is read once, from every value (including an array, so its own or
    // a replaced Array.prototype one is used), and only a null or undefined one is ignored (any other value which isn't
    // a function throws a TypeError, the runtime's own, from calling it)
    let iterFn: any = (entries as any)[_getIterKey()];
    if (!isStrictNullOrUndefined(iterFn)) {
        _iterForOf(fnCall(iterFn, entries), addEntry);
    } else {
        // On a runtime without Symbol (which has no iterator functions, eg. IE) the native iterators are emulated: an
        // array (like the array iterator every index is visited, an empty slot is undefined which throws) or a string
        // or String object (converted like the String iterator, whose characters are not entries, so only an empty
        // string doesn't throw) is read by its code points, and the entries / values of a Map or Set which isn't iterable
        // (eg. IE 11) are added as they are read (live, like its iterator). Otherwise (and on a runtime with Symbol,
        // unlike iterForOf and the iterator helpers) the value isn't iterable (and like the native function it isn't
        // read for the error)
        let values: any = _getEmulatedStrValues(entries) || (!_hasNativeIterator.v && (isArray(entries) ? entries : _getMapSetValues(entries, addEntry)));
        if (!values) {
            _throwTypeOf(entries, " is not iterable");
        }

        for (let idx = 0; idx < values[LENGTH]; idx++) {
            addEntry(values[idx]);
        }
    }

    return result as T;
}
