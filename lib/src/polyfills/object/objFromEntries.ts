/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isUndefined } from "../../helpers/base";
import { iterForOf } from "../../iterator/forOf";
import { isIterable } from "../../iterator/iterator";

/**
 * The polyObjFromEntries() method transforms a list of key-value pairs into an object.
 * This is a polyfill for environments that don't support Object.fromEntries.
 *
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param entries - An iterable object that contains key-value pairs (typically an array of [key, value] arrays)
 * @returns A new object whose properties are given by the entries
 */
export function polyObjFromEntries(entries: Iterable<readonly any[]>): any {
    const result: any = {};

    if (!isUndefined(entries) && isIterable(entries)) {
        iterForOf(entries, (entry) => {
            if (Array.isArray(entry) && entry.length >= 2) {
                result[entry[0]] = entry[1];
            }
        });
    }

    return result;
}