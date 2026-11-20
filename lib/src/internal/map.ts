/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { objDefineProp } from "../object/define";
import { objForEachKey } from "../object/for_each_key";
import { objFreeze } from "../object/object";

/**
 * @internal
 * @ignore
 * Internal constant enum used to identify the mapping values for the _createMap function
 */
export const enum eMapValues {
    Key = 0,
    Value = 1
}

/**
 * @internal
 * @ignore
 * Internal Helper function to create a key and value mapped representation of the values
 * @param values - The source values
 * @param keyType - Identifies the value to populate against the key
 * @param valueType - Identifies the value to populate against the value
 * @returns The (frozen) map
 */
/*#__NO_SIDE_EFFECTS__*/
export function _createKeyValueMap(values: any, keyType: eMapValues, valueType: eMapValues) {
    let theMap: any = {};
    objForEachKey(values, (key, value) => {
        _assignMapValue(theMap, key, keyType ? value : key);
        _assignMapValue(theMap, value, valueType ? value : key);
    });

    return objFreeze(theMap);
}

/**
 * @internal
 * @ignore
 * Internal Helper function to assign a key and value to the map
 * @param theMap - The map to assign the key and value to
 * @param key - The key to assign
 * @param value - The value to assign
 */
export function _assignMapValue(theMap: any, key: any, value: any) {
    objDefineProp(theMap, key, {
        value: value,
        enumerable: true,
        writable: false
    });
}