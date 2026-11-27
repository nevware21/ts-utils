/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { FUNCTION, LENGTH, OBJECT, SYMBOL_TYPE, UNDEF_VALUE } from "./constants";
import { _objCreateNull } from "./own_props";

/**
 * @internal
 * @ignore
 * A minimal map which compares its keys like a native Map, so objects, functions and symbols by identity and
 * other primitives by value (NaN is equal to itself, and -0 to +0). Its only method is getOrAdd(), which returns the
 * value of a key and adds the value when the key isn't found (like the native Map.prototype.getOrInsert()).
 */
export interface _IdentityMap<V> {
    /**
     * Returns the value of the key, otherwise adds the value for the key and returns it
     * @param key - The key to find
     * @param value - The value to add when the key is not found, which must be truthy (as a falsy value is the same as
     * not being found)
     * @returns The existing value of the key, or the value which was added
     */
    getOrAdd(key: any, value: V): V;
}

/**
 * @internal
 * @ignore
 * A minimal set which compares its values like a native Set (SameValueZero), so objects, functions and symbols by
 * identity and other primitives by value (NaN is equal to itself, and -0 to +0). It only has has() and add(), so a
 * native Set which compares its values like this is used directly.
 */
export interface _SeenSet {
    /**
     * Returns whether the value has been added
     * @param value - The value to find
     * @returns true when the value has been added
     */
    has(value: any): boolean;

    /**
     * Adds the value. A native Set ignores a value it already has, while the map used without a usable Set adds an
     * object, function or symbol without searching for it first, so adding it again stores it again (has() is
     * unchanged); a caller can avoid this by only adding a value which has() doesn't find
     * @param value - The value to add
     */
    add(value: any): void;
}

/**
 * @internal
 * @ignore
 * Creates the map which the identity map uses without a native Map, and the seen set without a usable Set (eg. IE 9 /
 * 10, see _setIsUsable). A primitive is stored in a dictionary by its type and value, so it is found directly (NaN is
 * equal to itself, and -0 and +0 have the same key), while an object, function or symbol is searched for in a list of
 * keys. The dictionary has no prototype, so a key can't match an inherited property (eg. one added to
 * Object.prototype). It returns the value of the key, otherwise it adds the value (which must be truthy, a falsy value
 * only looks the key up) and returns it, so it is the getOrAdd() of the identity map. With noFind an object, function
 * or symbol is added without first searching for it (so it can be stored twice, which doesn't change the value which
 * is found).
 * @returns The function which returns the value of a key, adding a truthy value when the key isn't found
 */
/*#__NO_SIDE_EFFECTS__*/
function _createPolyMap<V>(): (key: any, value?: V, noFind?: boolean) => V | undefined {
    const prims: { [key: string]: V } = _objCreateNull();
    const keys: any[] = [];
    const values: V[] = [];

    return (key: any, value?: V, noFind?: boolean) => {
        // The dictionary key of a primitive, objects, functions and symbols are only equal to themselves (and a symbol
        // can't be converted to a string) so they don't have one
        const theType = typeof key;
        const primKey = theType === SYMBOL_TYPE || theType === FUNCTION || (key && theType === OBJECT) ? UNDEF_VALUE : theType + "_" + key;
        let result: V | undefined;

        if (primKey) {
            // A key which is only being looked up (a falsy value, eg. for has() of the seen set) isn't stored
            result = prims[primKey];
            !result && value && (prims[primKey] = value);
        } else {
            // The keys are searched with the indexOf() of the (internal) keys array, rather than arrIndexOf(), so its
            // wrapper isn't included with the set helpers. A key which is only being added (noFind) isn't searched for,
            // as one which is added again has the same value
            const idx = noFind ? -1 : keys.indexOf(key);

            if (idx < 0) {
                // A key which isn't found (idx is -1) is only added with a (truthy) value
                if (value) {
                    keys.push(key);
                    values.push(value);
                }
            } else {
                result = values[idx];
            }
        }

        return result || value;
    };
}

/**
 * @internal
 * @ignore
 * Creates an identity map, which uses the get() and set() of the native Map when available (so lookups don't get slower
 * as it grows, and -0 is converted for a Map like the IE 11 one), otherwise (eg. IE 9 / 10) the map used without a
 * native Map. The global Map is only checked, and the map created, when the first key is looked up (eg.
 * objCopyProps() of an object of primitives looks up none). The native getOrInsert() isn't used, as a polyfill of it
 * may not work with a native Map (eg. the es-shims one on IE 11) and a function added to Object.prototype would look
 * like one. The values must be truthy.
 * @returns The identity map
 */
/*#__NO_SIDE_EFFECTS__*/
export function _createIdentityMap<V>(): _IdentityMap<V> {
    let theGetOrAdd: (key: any, value: V) => V;

    return {
        getOrAdd: (key: any, value: V) => {
            if (!theGetOrAdd) {
                // A global Map which isn't a function (eg. an element with the id "Map" on IE 9 / 10) isn't used
                if (typeof Map === FUNCTION) {
                    const theMap = new Map<any, V>();

                    theGetOrAdd = (key: any, value: V) => theMap.get(key) || (theMap.set(key, value), value);
                } else {
                    theGetOrAdd = _createPolyMap<V>() as (key: any, value: V) => V;
                }
            }

            // Some Maps treat -0 and +0 as different keys (eg. IE 11), so -0 is always added (and found) as +0
            return theGetOrAdd(key === 0 ? 0 : key, value);
        }
    };
}

/**
 * @internal
 * @ignore
 * The global Set whose check last completed (it is cleared while a Set is checked), for whether it is used and whether
 * it compares -0 and +0 as the same value (it is checked again when the global Set is replaced or its check threw)
 */
let _setCls: any;

/**
 * @internal
 * @ignore
 * Whether the global Set (_setCls) is used. It isn't when it has a _values array (the es6-collections Set and every
 * polyfill-library / polyfill-service Set, which polyfill.io and its mirrors install as the Set of IE 9 / 10 and over
 * the native one of IE 11), as these search all of their values on each has() and add() (so filling one is quadratic),
 * or when it doesn't find NaN once NaN is added (eg. the Dojo one, which compares its values with indexOf()). The
 * identity map still uses their Map, and other Sets which search their values (eg. es6-set) are used
 */
let _setIsUsable: boolean;

/**
 * @internal
 * @ignore
 * Whether the global Set (_setCls) compares -0 and +0 as the same value, which some don't (eg. the IE 11 and early V8
 * Sets)
 */
let _setIsSameValueZero: boolean;

/**
 * @internal
 * @ignore
 * Creates a set which identifies the values which have already been added (eg. to remove the duplicates of an array).
 * With a usable global Set (see _setIsUsable) it is a new Set (so lookups don't get slower as it grows), wrapped to
 * convert -0 to +0 when the Set doesn't find -0 as +0 (eg. IE 11 or an early V8), otherwise (eg. IE 9 / 10) it is a
 * wrapper of the map used without a usable Set, where a primitive is found directly and an object, function or symbol
 * is searched for. Only has() and add() of a Set are used (its size was a function before Firefox 19).
 * @returns A new Set, or a wrapper with has() and add()
 */
/*#__NO_SIDE_EFFECTS__*/
export function _createSeenSet(): _SeenSet {
    // A global Set which isn't a function (eg. an element with the id "Set" on IE 9 / 10) isn't used
    if (typeof Set === FUNCTION) {
        if (_setCls !== Set) {
            // The last check is forgotten first, so a check which throws is made again by the next call (rather than
            // leaving the results of this Set cached for the previous one)
            _setCls = UNDEF_VALUE;

            // A Set compares -0 and +0 as the same value when one with +0 (and 5 other values) has -0. The IE 11 Set
            // treats them as different values, and an early V8 Set (about Chrome 42 and before) stores -0 as +0 but
            // doesn't find -0 once it has 5 or more values, which core-js checks the same way. The values are added
            // one at a time, as the IE 11 Set ignores the values it is created with (and so this doesn't iterate an
            // array)
            const probe: any = new Set<any>();
            let idx = 5;
            while (idx--) {
                probe.add(idx);
            }

            // A Set with a _values array, or which doesn't find NaN, isn't used (see _setIsUsable)
            probe.add(NaN);
            _setIsUsable = !probe._values && probe.has(NaN);
            _setIsSameValueZero = probe.has(-0);
            _setCls = Set;
        }

        if (_setIsUsable) {
            const theSet = new Set<any>();

            return _setIsSameValueZero ? theSet : {
                has: (value: any) => theSet.has(value === 0 ? 0 : value),
                add: (value: any) => theSet.add(value === 0 ? 0 : value)
            };
        }
    }

    // The dictionary key of -0 and +0 is the same, so -0 doesn't need to be converted, and has() only looks the value
    // up (it isn't stored)
    const seen = _createPolyMap<boolean>();

    return {
        has: (value: any) => !!seen(value),
        add: (value: any) => seen(value, true, true)
    };
}

/**
 * @internal
 * @ignore
 * Creates a function which returns whether a value is included in an array-like (compared like arrIncludes(),
 * SameValueZero), used by arrIntersection() and arrDifference() for each of their other arrays. The array-like is read
 * by index, in order, only until the value is found (where a search would stop), continuing from the last index read on
 * the next call, and each value read is added to a seen set, so each index is read at most once and a value which has
 * already been read is found in the sets (without reading the array-like again). The first set holds 5,000 values and
 * each new one twice as many as the last, up to 2^20 (1,048,576), so a large array-like is read into a few sets, which
 * are faster to fill than one large set and never reach the size limit of a runtime's Set (eg. 2^24 values in V8,
 * where adding another throws a RangeError). A lookup checks the current set and then the full ones, the newest (and
 * largest) first.
 * @param values - The array-like (an empty slot is undefined, and a string is read by its characters)
 * @param len - The length of the array-like (read and converted by the caller, so it isn't read here)
 * @returns The function which returns whether a value is included
 */
/*#__NO_SIDE_EFFECTS__*/
export function _createIncludes(values: ArrayLike<any>, len: number): (item: any) => boolean {
    let seen = _createSeenSet();
    const fullSets: _SeenSet[] = [];
    let size = 5000;
    let room = size;
    let idx = 0;

    return (item: any) => {
        let found = seen.has(item);
        for (let lp = fullSets[LENGTH]; !found && lp--;) {
            found = fullSets[lp].has(item);
        }

        while (!found && idx < len) {
            if (!room--) {
                // Once as many values have been added to the set as it holds, the next ones are added to a new set
                // which holds twice as many (up to 2^20, 0x100000), so the value read below is the first of the new set
                fullSets.push(seen);
                seen = _createSeenSet();
                size = size > 0x80000 ? 0x100000 : size * 2;
                room = size - 1;
            }

            // Each value which is read is added and compared to the item
            const value = values[idx++];
            seen.add(value);
            found = value === item || (value !== value && item !== item);
        }

        return found;
    };
}
