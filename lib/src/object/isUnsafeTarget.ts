/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { arrIndexOf } from "../array/indexOf";
import { getInst } from "../helpers/environment";
import { safe } from "../helpers/safe";
import { ArrProto, BooleanProto, DateProto, ErrorProto, FuncProto, LENGTH, NumberProto, ObjProto, PROTOTYPE, RegExpProto, StrProto } from "../internal/constants";
import { objHasOwnProperty } from "./has_own_prop";
import { objGetPrototypeOf } from "./object";

/**
 * The built-in prototypes found so far
 */
let _unsafeTargets: any[];

/**
 * The names of the global classes (from {@link UNSAFE_CLASSES}) which were not defined when last checked
 */
let _missingClasses: string[];

/**
 * The constructor of the class prototype which last caused the missing classes to be looked up again, so checking the
 * prototype of the same class repeatedly (eg. for each property copied to it) doesn't repeat the lookups
 */
let _lastCtor: any;

/**
 * The global classes whose prototype (where the class is defined) is also an unsafe target, as one string rather than a call
 * for each as that is smaller.
 */
const UNSAFE_CLASSES = "TypeError,RangeError,SyntaxError,ReferenceError,EvalError,URIError,AggregateError,Map,Set,WeakMap,WeakSet," +
    "Promise,Symbol,BigInt,Iterator,ArrayBuffer,SharedArrayBuffer,DataView,Int8Array,Uint8Array,Uint8ClampedArray,Int16Array," +
    "Uint16Array,Int32Array,Uint32Array,Float16Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array,WeakRef," +
    "FinalizationRegistry";

/**
 * @ignore
 * Adds the prototype of each of the named global classes which is defined, and the built-in prototype it inherits from
 * (eg. `%TypedArray%.prototype` for the typed arrays), to the unsafe targets and returns the names of the classes which
 * are not defined. Nothing that adds to the list may be annotated as having no side effects (`#__NO_SIDE_EFFECTS__`): a
 * bundler removes every call to such a function whose result is unused, which removed every prototype added that way
 * from the bundles (and from a consumer's esbuild bundle) from v0.14.0 until v0.20.0. The callers also always use the
 * result (the names of the missing classes), as Rollup removed a call which only updated the module variables.
 * @param names - The names of the global classes to add
 * @returns The names of the classes which are not defined
 */
function _addUnsafeClasses(names: string[]): string[] {
    let missing: string[] = [];

    arrForEach(names, (name) => {
        // The class and its prototype are both read inside safe(), so a class whose prototype can't be read (eg. a
        // revoked Proxy) is treated as not defined, rather than the lookup throwing before the missing classes are
        // saved (which left the remaining classes unchecked for every later call)
        let proto = safe(() => {
            let theClass = getInst<any>(name);
            return theClass && theClass[PROTOTYPE];
        }).v;

        if (proto) {
            arrForEach([proto, safe(objGetPrototypeOf, [proto]).v], (value) => {
                if (value && arrIndexOf(_unsafeTargets, value) === -1) {
                    _unsafeTargets.push(value);
                }
            });
        } else {
            missing.push(name);
        }
    });

    return missing;
}

/**
 * Checks whether the supplied target is a built-in prototype object.
 *
 * This helper can be used as an additional guard when assigning properties,
 * to avoid mutating native prototype objects and reduce prototype pollution risk.
 *
 * The built-in prototypes include those of the global classes which are defined by the runtime, and the built-in
 * prototypes they inherit from (eg. `%TypedArray%.prototype`). A class which is added after the first check (eg. by
 * a `Promise` or `Map` polyfill) is also identified, when its prototype (whose own `constructor` is the class) is
 * checked, so a polyfill whose prototype doesn't have its own `constructor` (eg. one replaced by an object literal) is
 * only identified once the prototype of another class is checked. The missing classes are only looked up again when
 * the class differs from the last class whose prototype caused them to be looked up, so a class prototype which was
 * checked before the polyfill was added is only identified once the prototype of a different class has been checked
 * in between. A target whose own `constructor` can't be read (eg. a revoked Proxy) is not identified (rather than
 * throwing), and a class whose prototype can't be read is treated as not defined.
 *
 * As the prototype of a polyfill's class is identified once the class is the global, the guards which use this (eg.
 * {@link objExtend}, {@link objDefaults} and {@link setValueByKey}) don't change it after that, so a polyfill should use
 * {@link objDefine} / {@link objDefineProps} to add to its prototype. Adding to it with one of the guards before the
 * global class is assigned makes it the last class looked up, so the global's prototype is then not identified until
 * the prototype of a different class has been checked.
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
        _unsafeTargets = [ObjProto, StrProto, ArrProto, NumberProto, FuncProto, DateProto, RegExpProto, BooleanProto, ErrorProto];
        _missingClasses = _addUnsafeClasses(UNSAFE_CLASSES.split(","));
    }

    let result = arrIndexOf(_unsafeTargets, target) >= 0;

    // A class prototype (the prototype of its own constructor) which isn't known may be from a class (eg. a polyfill)
    // added since the last check, so look for the classes which were missing again. Only a class prototype is
    // checked, so this isn't repeated for every other object, and only when its class isn't the last one that was
    // looked up for (as each missing class is looked up again, which is slow). A target which can't be checked (eg. a
    // revoked Proxy, or an own constructor getter which throws) is not a class prototype, rather than the check
    // throwing. While the classes are being looked up there are no missing classes (they are not defined during the
    // first call, and empty during a later one), so when reading a class (eg. a global getter) calls this again, that
    // call only uses the prototypes which have already been added rather than looking them up again (and again).
    if (!result && _missingClasses && _missingClasses[LENGTH]) {
        try {
            if (objHasOwnProperty(target, "constructor")) {
                let ctor = target.constructor;
                if (ctor && ctor[PROTOTYPE] === target && ctor !== _lastCtor) {
                    let missing = _missingClasses;

                    // There are no missing classes while they are looked up, so a call made while reading a class (eg.
                    // a global getter which creates a new class each time it is read) doesn't look them up again
                    _lastCtor = ctor;
                    _missingClasses = [];
                    _missingClasses = _addUnsafeClasses(missing);
                    result = arrIndexOf(_unsafeTargets, target) >= 0;
                }
            }
        } catch (e) {
            // Not a class prototype
        }
    }

    return result;
}
