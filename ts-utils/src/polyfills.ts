/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { arrForEach } from "./helpers/array";
import { objDefineProp } from "./object/define";
import { PROTOTYPE } from "./internal/constants";
import { polyIsArray } from "./polyfills/array";
import { polyObjKeys } from "./polyfills/object";
import { polyStrEndsWith, polyStrStartsWith } from "./polyfills/string";

(function () {
    const objectPolyfills = {
        "keys": polyObjKeys,
        "defineProperty": objDefineProp
    };

    // Add Object polyfills
    const ObjClass = Object;
    arrForEach(polyObjKeys(objectPolyfills), (key) => {
        if (!ObjClass[key]) {
            ObjClass[key] = objectPolyfills[key];
        }
    });
    
    if (!Array.isArray) {
        Array.isArray = polyIsArray;
    }

    const StrProto = String[PROTOTYPE];
    if (!StrProto.startsWith) {
        StrProto.startsWith = (searchString: string, position?: number) => {
            return polyStrStartsWith(this, searchString, position);
        }

        StrProto.endsWith = (searchString: string, position?: number) => {
            return polyStrEndsWith(this, searchString, position);
        }
    }
})();
