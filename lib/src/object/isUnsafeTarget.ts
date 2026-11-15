/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { arrIndexOf } from "../array/indexOf";
import { createCachedValue, ICachedValue } from "../helpers/cache";
import { getInst } from "../helpers/environment";
import { safe } from "../helpers/safe";
import { ArrProto, BooleanProto, DateProto, ErrorProto, FuncProto, NumberProto, ObjProto, PROTOTYPE, RegExpProto, StrProto } from "../internal/constants";

let _unsafeTargets: ICachedValue<Array<any>>;

/**
 * The global classes whose prototype (where the class is defined) is also an unsafe target, as one string rather than a call
 * for each as that is smaller.
 */
const UNSAFE_CLASSES = "TypeError,RangeError,SyntaxError,ReferenceError,EvalError,URIError,Map,Set,WeakMap,WeakSet,Promise,Symbol," +
    "ArrayBuffer,SharedArrayBuffer,DataView,Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array," +
    "Float32Array,Float64Array,BigInt64Array,BigUint64Array,WeakRef,FinalizationRegistry";

/**
 * @ignore
 * Returns the built-in prototypes. Nothing that adds to the list may be annotated as having no side effects
 * (`#__NO_SIDE_EFFECTS__`): a bundler removes every call to such a function whose result is unused, which removed every
 * prototype added that way from the bundles (and from a consumer's esbuild bundle) from v0.14.0 until v0.20.0.
 */
function _getUnsafeTargets(): any[] {
    let targets: any[] = [ObjProto, StrProto, ArrProto, NumberProto, FuncProto, DateProto, RegExpProto, BooleanProto, ErrorProto];

    arrForEach(UNSAFE_CLASSES.split(","), (name) => {
        let theClass = safe(getInst as any, [name]).v;
        let proto = theClass && theClass[PROTOTYPE];
        if (proto) {
            targets.push(proto);
        }
    });

    return targets;
}

/**
 * Checks whether the supplied target is a built-in prototype object.
 *
 * This helper can be used as an additional guard when assigning properties,
 * to avoid mutating native prototype objects and reduce prototype pollution risk.
 * @since 0.14.0
 * @group Object
 * @param target - The target object to validate.
 * @returns `true` when the target is a built-in prototype object; otherwise `false`.
 * @example
 * ```ts
 * isUnsafeTarget(Object.prototype);   // true
 * isUnsafeTarget({});                 // false
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function isUnsafeTarget(target: any): boolean {
    if (!_unsafeTargets) {
        _unsafeTargets = createCachedValue(_getUnsafeTargets());
    }

    return arrIndexOf(_unsafeTargets.v, target) >= 0;
}
