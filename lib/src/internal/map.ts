/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { objDefineProp } from "../object/define";
import { objForEachKey } from "../object/for_each_key";

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
 * @param completeFn - The function to call to complete the map (used to freeze the instance)
 * @param writable - Flag to indicate if the map should be writable
 * @returns
 */
/*#__NO_SIDE_EFFECTS__*/
export function _createKeyValueMap(values: any, keyType: eMapValues, valueType: eMapValues, completeFn?: <T>(value: T) => T, writable?: boolean) {
    let theMap: any = {};
    objForEachKey(values, (key, value) => {
        _assignMapValue(theMap, key, keyType ? value : key, writable);
        _assignMapValue(theMap, value, valueType ? value : key, writable);
    });

    return completeFn ? completeFn(theMap) : theMap;
}

/**
 * @internal
 * @ignore
 * Internal Helper function to assign a key and value to the map
 * @param theMap - The map to assign the key and value to
 * @param key - The key to assign
 * @param value - The value to assign
 * @param writable - Flag to indicate if the map should be writable
 */
export function _assignMapValue(theMap: any, key: any, value: any, writable?: boolean) {
    objDefineProp(theMap, key, {
        value: value,
        enumerable: true,
        writable: !!writable
    });
}