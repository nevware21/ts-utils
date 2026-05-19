/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrIndexOf } from "../array/indexOf";
import { createCachedValue, ICachedValue } from "../helpers/cache";
import { getInst } from "../helpers/environment";
import { safe } from "../helpers/safe";
import { ArrProto, BooleanProto, DateProto, ErrorProto, FuncProto, NumberProto, ObjProto, PROTOTYPE, RegExpProto, StrProto } from "../internal/constants";

let _unsafeTargets: ICachedValue<Array<any>>;

/*#__NO_SIDE_EFFECTS__*/
function _addTarget(targets: any[], target: any) {
    if (target) {
        targets.push(target);
    }
}

/*#__NO_SIDE_EFFECTS__*/
function _addTargetProto(targets: any[], ctor: any) {
    if (ctor) {
        _addTarget(targets, ctor[PROTOTYPE]);
    }
}

/**
 * @ignore
 */
/*#__NO_SIDE_EFFECTS__*/
function _getUnsafeTargets(): any[] {

    let targets = [
        ObjProto,
        StrProto,
        ArrProto,
        NumberProto,
        FuncProto,
        DateProto,
        RegExpProto,
        BooleanProto,
        ErrorProto
    ];

    _addTargetProto(targets, TypeError);
    _addTargetProto(targets, RangeError);
    _addTargetProto(targets, SyntaxError);
    _addTargetProto(targets, ReferenceError);
    _addTargetProto(targets, EvalError);
    _addTargetProto(targets, URIError);
    _addTargetProto(targets, safe(getInst as any, ["Map"]).v);
    _addTargetProto(targets, safe(getInst as any, ["Set"]).v);
    _addTargetProto(targets, safe(getInst as any, ["WeakMap"]).v);
    _addTargetProto(targets, safe(getInst as any, ["WeakSet"]).v);
    _addTargetProto(targets, safe(getInst as any, ["Promise"]).v);
    _addTargetProto(targets, safe(getInst as any, ["Symbol"]).v);
    _addTargetProto(targets, safe(getInst as any, ["ArrayBuffer"]).v);
    _addTargetProto(targets, safe(getInst as any, ["SharedArrayBuffer"]).v);
    _addTargetProto(targets, safe(getInst as any, ["DataView"]).v);
    _addTargetProto(targets, safe(getInst as any, ["Int8Array"]).v);
    _addTargetProto(targets, safe(getInst as any, ["Uint8Array"]).v);
    _addTargetProto(targets, safe(getInst as any, ["Uint8ClampedArray"]).v);
    _addTargetProto(targets, safe(getInst as any, ["Int16Array"]).v);
    _addTargetProto(targets, safe(getInst as any, ["Uint16Array"]).v);
    _addTargetProto(targets, safe(getInst as any, ["Int32Array"]).v);
    _addTargetProto(targets, safe(getInst as any, ["Uint32Array"]).v);
    _addTargetProto(targets, safe(getInst as any, ["Float32Array"]).v);
    _addTargetProto(targets, safe(getInst as any, ["Float64Array"]).v);
    _addTargetProto(targets, safe(getInst as any, ["BigInt64Array"]).v);
    _addTargetProto(targets, safe(getInst as any, ["BigUint64Array"]).v);
    _addTargetProto(targets, safe(getInst as any, ["WeakRef"]).v);
    _addTargetProto(targets, safe(getInst as any, ["FinalizationRegistry"]).v);

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
