/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { _pushOwnValue, objDefine } from "../object/define";
import { fnApply, fnCall } from "../funcs/funcs";
import { safe } from "../helpers/safe";
import { ArrCls, ArrProto, GET_OWN_PROPERTY_NAMES, LENGTH, ObjClass, StrProto } from "./constants";
import { polyIsArray, polyArrIncludes, polyArrFind, polyArrFindIndex, polyArrFindLastIndex, polyArrFindLast, polyArrFrom } from "../polyfills/array";
import { polyObjIs } from "../polyfills/object/objIs";
import { polyObjKeys, polyObjEntries, polyObjValues } from "../polyfills/object/objKeys";
import { polyStrStartsWith } from "../string/starts_with";
import { polyStrEndsWith } from "../string/ends_with";
import { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "../polyfills/trim";
import { polyStrPadEnd, polyStrPadStart } from "../string/pad";
import { polyStrSubstr } from "../string/substring";
import { polyStrIncludes } from "../string/includes";
import { polyStrReplaceAll } from "../string/replace_all";
import { polyObjFromEntries } from "../polyfills/object/objFromEntries";
import { polyObjGetOwnPropertyDescriptors, _polyObjGetOwnPropertyNames } from "../polyfills/object/objGetOwnProperty";
import { polyObjPreventExtensions } from "../polyfills/object/objPreventExtensions";
import { polyObjIsExtensible } from "../polyfills/object/objIsExtensible";
import { polyObjIsFrozen } from "../polyfills/object/objIsFrozen";
import { polyObjIsSealed } from "../polyfills/object/objIsSealed";
import { polyObjHasOwn } from "../object/has_own";
import { polyArrAt } from "../array/at";
import { polyArrFill } from "../array/fill";
import { polyArrFlatMap } from "../array/flatMap";
import { polyArrWith } from "../array/with";
import { polyStrAt } from "../string/at";
import { polyStrMatchAll } from "../string/match_all";

/**
 * @internal
 * @ignore
 * Creates the function which is installed for a polyfill, a prototype polyfill (eg. String.prototype.startsWith) is
 * passed the instance (this) as its first argument (and as its this) followed by the first 3 arguments (no prototype
 * polyfill takes more after the instance, an omitted argument is undefined, which they all treat as omitted, and none
 * reads its arguments object, so the arguments aren't copied), while a static one (eg. Array.from) is called with its
 * arguments (and this) as-is. Unlike the native functions it is a constructor (with a prototype), as an ES5 function can't be
 * created without them and identifying a call with new would read the prototype of the instance (eg. a Proxy's
 * getPrototypeOf trap would be called), which the native functions don't.
 * @param poly - The polyfill function
 * @param isStatic - The polyfill is a static (class) function
 * @returns The function to install
 */
/*#__NO_SIDE_EFFECTS__*/
export function makePolyFn<T extends Function>(poly: T, isStatic?: boolean): T {
    return (isStatic ? function(this: any) {
        return fnApply(poly as any, this, arguments);
    } : function(this: any, a: any, b: any, c: any) {
        return fnCall(poly as any, this, this, a, b, c);
    }) as any;
}

function _addPolyfills(target: any, polyfills: any, isProto?: boolean) {
    let installed: { p: Function, f: Function }[] = [];
    let keys = polyObjKeys(polyfills);

    // A native function is used for a missing alias (another trim key with the same polyfill). Each entry is added as an
    // own value, so an Array.prototype index setter (which doesn't add the value to the array) doesn't lose it
    arrForEach(keys, (key) => {
        if (target[key]) {
            _pushOwnValue(installed, { p: polyfills[key], f: target[key] });
        }
    });

    arrForEach(keys, (key) => {
        if (!target[key]) {
            let poly = polyfills[key];
            let isTrim = key.indexOf("trim") === 0;
            let theFn: Function = null;

            // Like the native functions, an alias (trimLeft for trimStart and trimRight for trimEnd) is the same
            // function. Only the trim functions have aliases, other keys can share a polyfill (eg. isFrozen and
            // isSealed) but are different native functions, so they don't use each other's function
            isTrim && arrForEach(installed, (entry) => {
                if (entry.p === poly) {
                    theFn = entry.f;
                }
            });

            if (!theFn) {
                // A prototype polyfill passes the instance (this) as the first argument, while a static (class)
                // function like Object.entries() or Array.from() is called with its arguments as-is. Like the native
                // functions it has the native function's name and length (where they can be changed, ES2015+, so not on
                // IE), the trim functions have no arguments and a few have 2, every other one has 1 argument. They are
                // defined with objDefine (configurable, not enumerable and not writable, like a native function's), whose
                // descriptor has no prototype, so a get or set added to Object.prototype doesn't stop them being defined
                theFn = makePolyFn(poly, !isProto);
                safe(objDefine, [theFn, "name", { v: key, e: false }]);
                safe(objDefine, [theFn, LENGTH, { v: isTrim ? 0 : (/^(substr|replaceAll|with|hasOwn|is)$/.test(key) ? 2 : 1), e: false }]);
                _pushOwnValue(installed, { p: poly, f: theFn });
            }

            // It is defined (writable and configurable but not enumerable) like the native functions, so for-in over an
            // array, a string object or the classes doesn't include it (Object.defineProperty is defined by every
            // supported ES5 runtime)
            objDefine(target, key, {
                v: theFn,
                w: true,
                e: false
            });
        }
    });
}

/**
 * @internal
 * @ignore
 * Adds the polyfills for any of the native functions which are not defined, called when the polyfills entry
 * (`polyfills.ts`) is loaded. It is in a module of its own, rather than exported from that entry, so the polyfills
 * bundle doesn't export it (and its minifier can inline it), while the tests can still call it.
 */
export function _installPolyfills() {
    const objectPolyfills = {
        "keys": polyObjKeys,
        "hasOwn": polyObjHasOwn,
        "is": polyObjIs,
        "isExtensible": polyObjIsExtensible,
        "isFrozen": polyObjIsFrozen,
        "isSealed": polyObjIsSealed,
        "fromEntries": polyObjFromEntries,
        "entries": polyObjEntries,
        "values": polyObjValues,
        "getOwnPropertyDescriptors": polyObjGetOwnPropertyDescriptors,
        [GET_OWN_PROPERTY_NAMES]: _polyObjGetOwnPropertyNames,
        // getOwnPropertySymbols is not installed, it is only missing on a runtime without Symbol, where a polyfill
        // symbol key is a string key, so it is also returned by Object.keys() (and for...in) and code which combines
        // the two (eg. forEachOwnKey or an object rest helper) would process the key twice
        "preventExtensions": polyObjPreventExtensions
    };

    const stringPolyfills = {
        "startsWith" : polyStrStartsWith,
        "endsWith": polyStrEndsWith,
        "padStart": polyStrPadStart,
        "padEnd": polyStrPadEnd,
        "trim": polyStrTrim,
        "trimStart": polyStrTrimStart,
        "trimLeft": polyStrTrimStart,
        "trimEnd": polyStrTrimEnd,
        "trimRight": polyStrTrimEnd,
        "substr": polyStrSubstr,
        "includes": polyStrIncludes,
        "replaceAll": polyStrReplaceAll,
        "at": polyStrAt,
        "matchAll": polyStrMatchAll
    };

    const arrayClsPolyfills = {
        "isArray": polyIsArray,
        "from": polyArrFrom
    };

    const arrayPolyfills = {
        "at": polyArrAt,
        "fill": polyArrFill,
        "includes": polyArrIncludes,
        "find": polyArrFind,
        "findIndex": polyArrFindIndex,
        "findLast": polyArrFindLast,
        "findLastIndex": polyArrFindLastIndex,
        "flatMap": polyArrFlatMap,
        "with": polyArrWith
    };

    _addPolyfills(ObjClass, objectPolyfills);
    _addPolyfills(ArrCls, arrayClsPolyfills);
    _addPolyfills(ArrProto, arrayPolyfills, true);
    _addPolyfills(StrProto, stringPolyfills, true);
}
