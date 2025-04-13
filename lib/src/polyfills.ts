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
import { polyObjKeys } from "./polyfills/object/objKeys";
import { polyObjEntries } from "./polyfills/object/objEntries";
import { polyObjValues } from "./polyfills/object/objValues";
import { polyStrStartsWith } from "./string/starts_with";
import { polyStrEndsWith } from "./string/ends_with";
import { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "./polyfills/trim";
import { polyStrPadEnd, polyStrPadStart } from "./string/pad";
import { makePolyFn } from "./internal/poly_helpers";
import { polyStrSubstr } from "./string/substring";
import { polyStrIncludes } from "./string/includes";
import { polyObjFromEntries } from "./polyfills/object/objFromEntries";
import { polyObjGetOwnPropertyDescriptor } from "./polyfills/object/objGetOwnPropertyDescriptor";
import { polyObjGetOwnPropertyDescriptors, polyObjGetOwnPropertySymbols } from "./polyfills/object/objGetOwnPropertyDescriptors";
import { polyObjGetOwnPropertyNames } from "./polyfills/object/objGetOwnPropertyNames";
import { polyObjHasOwn } from "./polyfills/object/objHasOwn";
import { polyObjPreventExtensions } from "./polyfills/object/objPreventExtensions";
import { polyObjIsExtensible } from "./polyfills/object/objIsExtensible";
import { polyObjIsFrozen } from "./polyfills/object/objIsFrozen";
import { polyObjIsSealed } from "./polyfills/object/objIsSealed";

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
        "getOwnPropertyDescriptor": polyObjGetOwnPropertyDescriptor,
        "getOwnPropertyDescriptors": polyObjGetOwnPropertyDescriptors,
        "getOwnPropertyNames": polyObjGetOwnPropertyNames,
        "getOwnPropertySymbols": polyObjGetOwnPropertySymbols,
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
