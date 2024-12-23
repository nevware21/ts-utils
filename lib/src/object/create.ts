/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { FUNCTION, ObjClass, OBJECT, PROTOTYPE } from "../internal/constants";
import { dumpObj } from "../helpers/diagnostics";
import { throwTypeError } from "../helpers/throw";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";

/**
 * Creates an object that has the specified prototype, and that optionally contains specified properties. This helper exists to avoid adding a polyfil
 * for older browsers that do not define Object.create eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
 * Note: For consistency this will not use the Object.create implementation if it exists as this would cause a testing requirement to test with and without the implementations
 * @group Object
 * @param obj - Object to use as a prototype. May be null
 */
export const objCreate: (obj: any) => any = (/* #__PURE__*/_pureAssign((/* #__PURE__*/_pureRef<typeof Object.create>(ObjClass as any, "create")), polyObjCreate));

/**
 * Creates an object that has the specified prototype, and that optionally contains specified properties. This helper exists to avoid adding a polyfil
 * for older browsers that do not define Object.create eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
 * Note: For consistency this will not use the Object.create implementation if it exists as this would cause a testing requirement to test with and without the implementations
 * @group Polyfill
 * @group Object
 * @param obj - Object to use as a prototype. May be null
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyObjCreate(obj: any): any {
    if (!obj) {
        return {};
    }

    let type = typeof obj;
    if (type !== OBJECT && type !== FUNCTION) {
        throwTypeError("Prototype must be an Object or function: " + dumpObj(obj));
    }

    function tempFunc() {}
    tempFunc[PROTOTYPE] = obj;

    return new (tempFunc as any)();
}
