/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "./array/forEach";
import { ArrCls, ArrProto, ObjClass, StrProto } from "./internal/constants";
import { polyIsArray, polyArrIncludes, polyArrFind, polyArrFindIndex, polyArrFindLastIndex, polyArrFindLast, polyArrFrom } from "./polyfills/array";
import { polyObjIs } from "./polyfills/object/objIs";
import { polyObjKeys, polyObjEntries, polyObjValues } from "./polyfills/object/objKeys";
import { polyStrStartsWith } from "./string/starts_with";
import { polyStrEndsWith } from "./string/ends_with";
import { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "./polyfills/trim";
import { polyStrPadEnd, polyStrPadStart } from "./string/pad";
import { makePolyFn } from "./internal/poly_helpers";
import { polyStrSubstr } from "./string/substring";
import { polyStrIncludes } from "./string/includes";
import { polyObjFromEntries } from "./polyfills/object/objFromEntries";
import { polyObjGetOwnPropertyDescriptors, _polyObjGetOwnPropertySymbols, _polyObjGetOwnPropertyNames } from "./polyfills/object/objGetOwnProperty";
import { polyObjPreventExtensions } from "./polyfills/object/objPreventExtensions";
import { polyObjIsExtensible } from "./polyfills/object/objIsExtensible";
import { polyObjIsFrozen } from "./polyfills/object/objIsFrozen";
import { polyObjIsSealed } from "./polyfills/object/objIsSealed";
import { polyObjHasOwn } from "./object/has_own";

(function () {

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
        GET_OWN_PROPERTY_NAMES: _polyObjGetOwnPropertyNames,
        GET_OWN_PROPERTY_SYMBOLS: _polyObjGetOwnPropertySymbols,
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
        "includes": polyStrIncludes
    };

    const arrayClsPolyfills = {
        "isArray": polyIsArray,
        "from": polyArrFrom
    };

    const arrayPolyfills = {
        "includes": polyArrIncludes,
        "find": polyArrFind,
        "findIndex": polyArrFindIndex,
        "findLast": polyArrFindLast,
        "findLastIndex": polyArrFindLastIndex
    };

    // Add Object polyfills
    arrForEach(polyObjKeys(objectPolyfills), (key) => {
        if (!(ObjClass as any)[key]) {
            (ObjClass as any)[key] = makePolyFn((objectPolyfills as any)[key]);
        }
    });
    
    arrForEach(polyObjKeys(arrayClsPolyfills), (key) => {
        if (!(ArrCls as any)[key]) {
            (ArrCls as any)[key] = makePolyFn((arrayClsPolyfills as any)[key]);
        }
    });

    // Add Array polyfills
    arrForEach(polyObjKeys(arrayPolyfills), (key) => {
        if (!(ArrProto as any)[key]) {
            (ArrProto as any)[key] = makePolyFn((arrayPolyfills as any)[key]);
        }
    });

    arrForEach(polyObjKeys(stringPolyfills), (key) => {
        if (!(StrProto as any)[key]) {
            (StrProto as any)[key] = makePolyFn((stringPolyfills as any)[key]);
        }
    });
})();
