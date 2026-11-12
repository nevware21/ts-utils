/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrIndexOf } from "../array/indexOf";
import { FUNCTION, OBJECT, UNDEFINED, UNDEF_VALUE } from "./constants";

/**
 * @internal
 * @ignore
 * A minimal map which compares its keys like a native Map, so objects, functions and symbols by identity and
 * other primitives by value (NaN is equal to itself).
 */
export interface _IdentityMap<V> {
    /**
     * Returns the existing value for the key, otherwise adds the value for the key and returns undefined
     * @param key - The key to find
     * @param value - The value (which must be truthy) to add when the key is not found
     */
    (key: any, value: V): V | undefined;
}

/**
 * @internal
 * @ignore
 * Returns the dictionary key for a primitive, objects, functions and symbols are only equal to themselves (and a
 * symbol can't be converted to a string) so they don't have one.
 */
function _getPrimKey(key: any): string | undefined {
    const theType = typeof key;

    return theType === "symbol" || theType === FUNCTION || (key && theType === OBJECT) ? UNDEF_VALUE : theType + "_" + key;
}

/**
 * @internal
 * @ignore
 * Creates the fallback for runtimes without a native Map (IE 9 / 10). Primitives are stored in a dictionary so they
 * are found directly (NaN is equal to itself, as -0 and +0 have the same key), the other keys have to be searched for.
 */
/*#__NO_SIDE_EFFECTS__*/
function _createArrayMap<V>() {
    // A plain object is safe as every key starts with the type, so it can't match an inherited property
    const prims: { [key: string]: V } = {};
    const keys: any[] = [];
    const values: V[] = [];

    return {
        get: (key: any) => {
            const primKey = _getPrimKey(key);

            // A key which is not found has an index of -1, which is never a value
            return primKey ? prims[primKey] : values[arrIndexOf(keys, key)];
        },
        set: (key: any, value: V) => {
            const primKey = _getPrimKey(key);

            if (primKey) {
                prims[primKey] = value;
            } else {
                const idx = arrIndexOf(keys, key);
                values[idx < 0 ? keys.push(key) - 1 : idx] = value;
            }
        }
    };
}

/**
 * @internal
 * @ignore
 * Creates an identity map using the native Map when available (so lookups don't get slower as it grows). The
 * underlying storage is only created when the first value is added, as most callers won't add any.
 */
/*#__NO_SIDE_EFFECTS__*/
export function _createIdentityMap<V>(): _IdentityMap<V> {
    let theMap: any;

    return (key: any, value: V) => {
        !theMap && (theMap = typeof Map !== UNDEFINED ? new Map<any, V>() : _createArrayMap<V>());

        // The IE 11 Map treats -0 and +0 as different keys, so -0 is always added as +0
        const theKey = key === 0 ? 0 : key;
        const result: V = theMap.get(theKey);

        !result && theMap.set(theKey, value);

        return result;
    };
}
