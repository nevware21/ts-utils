/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ICachedValue, createCachedValue } from "../helpers/cache";
import { ObjClass, __PROTO__ } from "../internal/constants";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";
import { objForEachKey } from "./for_each_key";

let _isProtoArray: ICachedValue<boolean>;

/**
 * The objSetPrototypeOf() method sets the prototype (i.e., the internal [Prototype] property) of a specified
 * object to another object or null.
 * 
 * @function
 * @group Object
 * @param obj - The object which is to have it's prototype set.
 * @param proto - The object's new prototype (an object or null)
 * @returns The specified object.
 */
export const objSetPrototypeOf: (obj: any, proto: object) => any = (/* #__PURE__*/_pureAssign((/* #__PURE__ */_pureRef<typeof Object.setPrototypeOf>(ObjClass, "setPrototypeOf")), _polyObjSetPrototypeOf));

export function _polyObjSetPrototypeOf(obj: any, proto: object) {
    !_isProtoArray && (_isProtoArray = createCachedValue({ [__PROTO__]: [] } instanceof Array));
    _isProtoArray.v ? obj[__PROTO__] = proto : objForEachKey(proto, (key: any, value: any) => obj[key] = value );
    
    return obj;
}
