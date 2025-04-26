/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ObjClass } from "../internal/constants";
import { _returnFalse } from "../internal/stubs";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";
import { _doNothing } from "./object";

/**
 * The Object.preventExtensions() method prevents new properties from ever being added to an object
 * (i.e. prevents future extensions to the object). It also prevents the object's prototype from
 * being re-assigned.
 * @function
 * @group Object
 * @param obj - The object which should be made non-extensible.
 * @returns The object being made non-extensible.
 */
export const objPreventExtensions: <T>(obj: T) => T = (/* #__PURE__*/_pureAssign((/* #__PURE__ */_pureRef<typeof Object.preventExtensions>(ObjClass, "preventExtensions")), _doNothing));

/**
 * The Object.isExtensible() method determines if an object is extensible (whether it can have new
 * properties added to it).
 * @function
 * @group Object
 * @param obj - The object which should be checked.
 * @returns A Boolean indicating whether or not the object is extensible.
 */
export const objIsExtensible: (obj: any) => boolean = (/* #__PURE__*/_pureAssign((/* #__PURE__ */_pureRef<typeof Object.isExtensible>(ObjClass, "isExtensible")), _returnFalse));
