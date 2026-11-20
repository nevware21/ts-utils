/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { objDefine } from "../object/define";
import { ArrCls, ArrProto, GET_OWN_PROPERTY_NAMES, ObjClass, StrProto } from "./constants";
import { polyIsArray, polyArrIncludes, polyArrFind, polyArrFindIndex, polyArrFindLastIndex, polyArrFindLast, polyArrFrom } from "../polyfills/array";
import { polyObjIs } from "../polyfills/object/objIs";
import { polyObjKeys, polyObjEntries, polyObjValues } from "../polyfills/object/objKeys";
import { polyStrStartsWith } from "../string/starts_with";
import { polyStrEndsWith } from "../string/ends_with";
import { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "../polyfills/trim";
import { polyStrPadEnd, polyStrPadStart } from "../string/pad";
import { makePolyFn } from "./poly_helpers";
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

function _addPolyfills(target: any, polyfills: any, isProto?: boolean) {
    arrForEach(polyObjKeys(polyfills), (key) => {
        if (!target[key]) {
            // A prototype polyfill passes the instance (this) as the first argument, while a static (class) function
            // like Object.entries() or Array.from() is called with its arguments as-is. It is defined (writable and
            // configurable but not enumerable) like the native functions, so for-in over an array, a string object
            // or the classes doesn't include it (Object.defineProperty is defined by every supported ES5 runtime)
            objDefine(target, key, {
                v: isProto ? makePolyFn(polyfills[key]) : polyfills[key],
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
