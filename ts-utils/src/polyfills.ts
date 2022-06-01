/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { arrForEach } from "./helpers/array";
import { objDefineProp } from "./helpers/object";
import { polyIsArray } from "./polyfills/array";
import { polyObjKeys } from "./polyfills/object";

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
})();
