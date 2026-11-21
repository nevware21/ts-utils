/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { isRegExp } from "../helpers/base";
import { throwTypeError } from "../helpers/throw";
import { _toString } from "../string/as_string";
import { EMPTY, FUNCTION, NULL_VALUE, OBJECT, UNDEF_VALUE } from "./constants";
import { _getNativeSymbol } from "./native_symbol";
import { _objGetOwnPropertyDescriptor } from "./own_props";
import { _throwIfNullOrUndefined } from "./throwIf";

/**
 * The RegExp.prototype "source" getter (null when there isn't one, eg. ES5 where it is an own property of each RegExp),
 * read when it is first used
 */
let _sourceGetter: Function | null;

/**
 * @internal
 * @ignore
 * Identifies whether the value is a RegExp (it has the [[RegExpMatcher]] internal slot), without reading any of its
 * properties (so, unlike `isRegExp()`, its `Symbol.toStringTag` isn't used and a Proxy's traps are not called). Where
 * RegExp.prototype has a "source" getter (ES2015+) it is called with the value (it throws for any value which isn't a
 * RegExp, except RegExp.prototype itself), otherwise (ES5, which has no Symbol.toStringTag) its `Object.prototype.toString()`
 * is used.
 * @param value - The value to check
 * @returns true when the value is a RegExp
 */
export function _isRegExpObj(value: any): boolean {
    if (_sourceGetter === UNDEF_VALUE) {
        let desc = _objGetOwnPropertyDescriptor(RegExp.prototype, "source");
        _sourceGetter = (desc && desc.get) || NULL_VALUE;
    }

    if (_sourceGetter) {
        try {
            fnCall(_sourceGetter as any, value);
            return value !== RegExp.prototype;
        } catch (e) {
            return false;
        }
    }

    return isRegExp(value);
}

/**
 * @internal
 * @ignore
 * Like the native IsRegExp() (used by eg. String.prototype.startsWith(), includes(), replaceAll() and matchAll()), an
 * object is a regular expression when its `Symbol.match` (read once, and only on a runtime with a native Symbol.match)
 * is truthy, or (when it is undefined) when it is a RegExp.
 * @param value - The value to check
 * @returns true when the value is treated as a regular expression
 */
export function _isRegExp(value: any): boolean {
    let theType = typeof value;
    if (value && (theType === OBJECT || theType === FUNCTION)) {
        let matchSym = _getNativeSymbol("match");
        let matcher = matchSym ? value[matchSym] : UNDEF_VALUE;

        return matcher !== UNDEF_VALUE ? !!matcher : _isRegExpObj(value);
    }

    return false;
}

/**
 * @internal
 * @ignore
 * Like the native String.prototype.replaceAll() and matchAll(), a regular expression's `flags` (read once, or where
 * RegExp.prototype has no flags, eg. ES5, its `global`) must include "g", a null or undefined `flags` throws a TypeError
 * @param regExp - The regular expression
 * @param name - The name of the argument (for the error message)
 */
export function _throwIfNotGlobal(regExp: any, name: string): void {
    let flags = "flags" in RegExp.prototype ? regExp.flags : (regExp.global ? "g" : EMPTY);
    _throwIfNullOrUndefined(flags);
    if (_toString(flags).indexOf("g") === -1) {
        throwTypeError(name + " must be a global regular expression");
    }
}
