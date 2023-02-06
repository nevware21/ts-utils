/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

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
 * @returns
 */
export function _createKeyValueMap(values: any, keyType: eMapValues, valueType: eMapValues, completeFn: <T>(value: T) => T) {
    let theMap: any = {};
    objForEachKey(values, (key, value) => {
        theMap[key] = keyType ? value : key;
        theMap[value] = valueType ? value : key;
    });

    return completeFn(theMap);
}
