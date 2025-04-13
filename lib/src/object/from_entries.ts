/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ObjClass } from "../internal/constants";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";
import { polyObjFromEntries } from "../polyfills/object/objFromEntries";

/**
 * The objFromEntries() method transforms a list of key-value pairs into an object.
 * This is the reverse of objEntries().
 *
 * @since 0.12.0
 * @group Object
 */
export type ObjFromEntriesFn = {
    /**
     * Creates an object from an iterable of key-value pairs
     * @since 0.12.0
     * @group Object
     * @typeParam T - The type of values in the resulting object
     * @param entries - An iterable of key-value pairs
     * @returns An object created from the key-value pairs
     */
    <T = any>(entries: Iterable<readonly [PropertyKey, T]>): { [k: string]: T };

    /**
     * Creates an object from an iterable of key-value pairs
     * @since 0.12.0
     * @group Object
     * @param entries - An iterable of key-value pairs
     * @returns An object created from the key-value pairs
     */
    (entries: Iterable<readonly any[]>): any;

    /**
     * Creates an object from an iterable of key-value pairs
     * @since 0.12.0
     * @group Object
     * @param entries - An iterable of key-value pairs
     * @returns An object created from the key-value pairs
     */
    <T = any>(entries: any): T;
}

/**
 * The objFromEntries() method transforms a list of key-value pairs into an object.
 * This is the reverse of objEntries().
 *
 * @function
 * @since 0.12.0
 * @group Object
 * @param entries - An iterable object that contains key-value pairs (typically an array of [key, value] arrays)
 * @returns A new object whose properties are given by the entries
 * @example
 * ```ts
 * // Convert an array of key-value pairs into an object
 * const entries = [['name', 'John'], ['age', 30]];
 * const obj = objFromEntries(entries);
 * // { name: "John", age: 30 }
 *
 * // Convert a Map to an object
 * const map = new Map([['name', 'John'], ['age', 30]]);
 * const obj = objFromEntries(map);
 * // { name: "John", age: 30 }
 *
 * // Transforming an object
 * const object = { a: 1, b: 2, c: 3 };
 * const newObject = objFromEntries(
 *   objEntries(object).map(([key, value]) => [key, value * 2])
 * );
 * // { a: 2, b: 4, c: 6 }
 * ```
 */
export const objFromEntries: ObjFromEntriesFn = (/* #__PURE__*/_pureAssign((/* #__PURE__*/_pureRef<typeof Object.fromEntries>(ObjClass, "fromEntries")), polyObjFromEntries));

