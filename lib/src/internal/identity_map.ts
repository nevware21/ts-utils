/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrIndexOf } from "../array/indexOf";
import { FUNCTION, OBJECT, ObjClass, SYMBOL_TYPE, UNDEFINED, UNDEF_VALUE } from "./constants";

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

    return theType === SYMBOL_TYPE || theType === FUNCTION || (key && theType === OBJECT) ? UNDEF_VALUE : theType + "_" + key;
}

/**
 * @internal
 * @ignore
 * Creates an identity map using the native Map when available (so lookups don't get slower as it grows). The
 * underlying storage is only created when the first value is added, as most callers won't add any.
 */
/*#__NO_SIDE_EFFECTS__*/
export function _createIdentityMap<V>(): _IdentityMap<V> {
    let getOrAdd: _IdentityMap<V>;

    return (key: any, value: V) => {
        if (!getOrAdd) {
            if (typeof Map !== UNDEFINED) {
                const theMap = new Map<any, V>();

                getOrAdd = (key: any, value: V) => {
                    const result = theMap.get(key);
                    !result && theMap.set(key, value);

                    return result;
                };
            } else {
                // The fallback for runtimes without a native Map (IE 9 / 10). Primitives are stored in a dictionary so
                // they are found directly (NaN is equal to itself, as -0 and +0 have the same key), the other keys have
                // to be searched for. The dictionary has no prototype, so a key can't match an inherited property (eg.
                // one added to Object.prototype), and the key of a primitive is only created once for each value
                const prims: { [key: string]: V } = ObjClass.create(null);
                const keys: any[] = [];
                const values: V[] = [];

                getOrAdd = (key: any, value: V) => {
                    const primKey = _getPrimKey(key);
                    let result: V | undefined;

                    if (primKey) {
                        result = prims[primKey];
                        !result && (prims[primKey] = value);
                    } else {
                        // A key which is not found is added, rather than its index (-1) being used to read a value
                        const idx = arrIndexOf(keys, key);
                        if (idx < 0) {
                            keys.push(key);
                            values.push(value);
                        } else {
                            result = values[idx];
                        }
                    }

                    return result;
                };
            }
        }

        // The IE 11 Map treats -0 and +0 as different keys, so -0 is always added as +0
        return getOrAdd(key === 0 ? 0 : key, value);
    };
}
