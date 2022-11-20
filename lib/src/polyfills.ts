/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { arrForEach } from "./array/forEach";
import { ArrCls, ObjClass, StrProto } from "./internal/constants";
import { polyIsArray } from "./polyfills/array";
import { polyObjKeys } from "./polyfills/object";
import { polyStrStartsWith } from "./string/starts_with";
import { polyStrEndsWith } from "./string/ends_with";
import { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "./polyfills/trim";
import { polyStrPadEnd, polyStrPadStart } from "./string/pad";
import { makePolyFn } from "./internal/poly_helpers";
import { polyObjHasOwn } from "./object/has_own";
import { polyStrSubstr } from "./string/substring";

(function () {

    const objectPolyfills = {
        "keys": polyObjKeys,
        "hasOwn": polyObjHasOwn
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
        "substr": polyStrSubstr
    };

    // Add Object polyfills
    arrForEach(polyObjKeys(objectPolyfills), (key) => {
        if (!ObjClass[key]) {
            ObjClass[key] = makePolyFn(objectPolyfills[key]);
        }
    });
    
    if (!ArrCls.isArray) {
        ArrCls.isArray = makePolyFn(polyIsArray);
    }

    arrForEach(polyObjKeys(stringPolyfills), (key) => {
        if (!StrProto[key]) {
            StrProto[key] = makePolyFn(stringPolyfills[key]);
        }
    });
})();
