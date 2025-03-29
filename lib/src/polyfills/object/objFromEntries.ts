/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../../array/forEach";
import { isArray } from "../../helpers/base";
import { iterForOf } from "../../iterator/forOf";
import { isIterable } from "../../iterator/iterator";

/**
 * Creates a new object from an array of [key, value] pairs.
 * Supports both native symbols and polyfilled symbols.
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
        if (isArray(entry) && entry.length >= 2) {
            result[entry[0]] = entry[1];
        }
    }
    
    if (isArray(entries)) {
        arrForEach(entries, addEntry);
    } else if (isIterable(entries)) {
        iterForOf(entries, addEntry);
    }
    
    return result as T;
}
