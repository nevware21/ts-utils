/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { __PROTO__, FUNCTION, ObjClass, OBJECT, PROTOTYPE } from "../internal/constants";
import { dumpObj } from "../helpers/diagnostics";
import { throwTypeError } from "../helpers/throw";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";
import { objDefineProperties } from "./define";
import { safe } from "../helpers/safe";
import { _polyObjSetPrototypeOf } from "./set_proto";
import { isStrictNullOrUndefined } from "../helpers/base";

/**
 * Creates an object that has the specified prototype, and that optionally contains specified properties. This helper exists to avoid adding a polyfil
 * for older browsers that do not define Object.create eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
 * Note: For consistency this will not use the Object.create implementation if it exists as this would cause a testing requirement to test with and without the implementations
 * @group Object
 * @param obj - Object to use as a prototype. May be null
 * @param properties - JavaScript object that contains one or more property descriptors.
 */
export const objCreate: (obj: any, properties?: PropertyDescriptorMap & ThisType<any>) => any = (/* #__PURE__*/_pureAssign((/* #__PURE__*/_pureRef<typeof Object.create>(ObjClass as any, "create")), polyObjCreate));

/**
 * Creates an object that has the specified prototype, and that optionally contains specified properties. This helper exists to avoid adding a polyfil
 * for older browsers that do not define Object.create eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
 * Note: For consistency this will not use the Object.create implementation if it exists as this would cause a testing requirement to test with and without the implementations
 * @group Polyfill
 * @group Object
 * @param obj - Object to use as a prototype. May be null
 * @param properties - JavaScript object that contains one or more property descriptors.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyObjCreate(obj: any, properties?: PropertyDescriptorMap & ThisType<any>): any {
    let newObj: any;
    function tempFunc() {}

    if (!isStrictNullOrUndefined(obj)) {
        let type = typeof obj;
        if (type !== OBJECT && type !== FUNCTION) {
            throwTypeError("Prototype must be an Object or function: " + dumpObj(obj));
        }
        tempFunc[PROTOTYPE] = obj;
        safe(() => {
            (tempFunc as any)[__PROTO__] = obj;
        });
        newObj = new (tempFunc as any)();
    } else {
        newObj = {};
    }

    safe(_polyObjSetPrototypeOf, [newObj, obj]);

    // Apply property descriptors if provided
    if (properties) {
        safe(objDefineProperties, [newObj, properties]);
    }
    
    return newObj;
}
