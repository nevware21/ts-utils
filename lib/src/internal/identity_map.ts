/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrIndexOf } from "../array/indexOf";
import { UNDEFINED, UNDEF_VALUE } from "./constants";

/**
 * @internal
 * @ignore
 * A minimal map which compares its keys by identity (objects, functions and symbols).
 */
export interface _IdentityMap<V> {
    /**
     * Returns the value for the key, or undefined if the key has not been added
     */
    g: (key: any) => V | undefined;

    /**
     * Sets the value for the key, replacing any existing value
     */
    s: (key: any, value: V) => void;
}

/**
 * @internal
 * @ignore
 * Creates the fallback for runtimes without a native Map, which has to search the keys
 */
/*#__NO_SIDE_EFFECTS__*/
function _createArrayMap<V>() {
    const keys: any[] = [];
    const values: V[] = [];

    return {
        get: (key: any) => {
            const idx = arrIndexOf(keys, key);
            return idx === -1 ? UNDEF_VALUE : values[idx];
        },
        set: (key: any, value: V) => {
            const idx = arrIndexOf(keys, key);

            if (idx === -1) {
                keys.push(key);
                values.push(value);
            } else {
                values[idx] = value;
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
    let theMap: { get: (key: any) => V | undefined, set: (key: any, value: V) => any };

    return {
        g: (key: any) => theMap ? theMap.get(key) : UNDEF_VALUE,
        s: (key: any, value: V) => {
            !theMap && (theMap = typeof Map !== UNDEFINED ? new Map<any, V>() : _createArrayMap<V>());
            theMap.set(key, value);
        }
    };
}
