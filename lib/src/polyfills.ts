/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "./array/forEach";
import { ArrCls, ArrProto, ObjClass, StrProto } from "./internal/constants";
import { polyIsArray, polyArrIncludes, polyArrFind, polyArrFindIndex, polyArrFindLastIndex, polyArrFindLast, polyArrFrom } from "./polyfills/array";
import { polyObjIs, polyObjKeys } from "./polyfills/object";
import { polyStrStartsWith } from "./string/starts_with";
import { polyStrEndsWith } from "./string/ends_with";
import { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "./polyfills/trim";
import { polyStrPadEnd, polyStrPadStart } from "./string/pad";
import { makePolyFn } from "./internal/poly_helpers";
import { polyObjHasOwn } from "./object/has_own";
import { polyStrSubstr } from "./string/substring";
import { polyStrIncludes } from "./string/includes";

(function () {

    const objectPolyfills = {
        "keys": polyObjKeys,
        "hasOwn": polyObjHasOwn,
        "is": polyObjIs
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
        if (!ObjClass[key]) {
            ObjClass[key] = makePolyFn(objectPolyfills[key]);
        }
    });
    
    arrForEach(polyObjKeys(arrayClsPolyfills), (key) => {
        if (!ArrCls[key]) {
            ArrCls[key] = makePolyFn(arrayClsPolyfills[key]);
        }
    });

    // Add Array polyfills
    arrForEach(polyObjKeys(arrayPolyfills), (key) => {
        if (!ArrProto[key]) {
            ArrProto[key] = makePolyFn(arrayPolyfills[key]);
        }
    });

    arrForEach(polyObjKeys(stringPolyfills), (key) => {
        if (!StrProto[key]) {
            StrProto[key] = makePolyFn(stringPolyfills[key]);
        }
    });
})();
