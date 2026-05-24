/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction } from "../../helpers/base";
import { createCachedValue, ICachedValue } from "../../helpers/cache";
import { getInst } from "../../helpers/environment";
import { _globalLazyTestHooks, _initTestHooks } from "../../helpers/lazy";
import { UNDEF_VALUE } from "../../internal/constants";
import { ScheduleMicrotaskFn } from "../microtask";
import { _runMicroTask } from "./runMicrotask";

let _promiseFn: ICachedValue<ScheduleMicrotaskFn | undefined>;

/**
 * @internal
 * @since 0.15.0
 */
function _promiseScheduleFn(promiseCls: PromiseConstructor): ScheduleMicrotaskFn {
    return function(callback: () => void): void {
        promiseCls.resolve().then(() => {
            _runMicroTask(callback);
        });
    };
}

/**
 * @internal
 * Resolves the Promise-based scheduler from the current global state without caching.
 * @since 0.15.0
 */
function _resolvePromiseFn(): ScheduleMicrotaskFn | undefined {
    let promiseCls = getInst<PromiseConstructor>("Promise");
    return (promiseCls && isFunction(promiseCls.resolve)) ? _promiseScheduleFn(promiseCls) : UNDEF_VALUE as any;
}

/**
 * @internal
 * Returns the Promise-based microtask scheduler, re-resolving the global Promise when the lazy
 * bypass flag is active (e.g. during tests) so that changes to the global Promise are reflected.
 * @since 0.15.0
 */
export function _getPromiseMicrotaskFn(): ScheduleMicrotaskFn | null {
    !_globalLazyTestHooks && _initTestHooks();
    if (!_promiseFn || _globalLazyTestHooks.lzy) {
        _promiseFn = createCachedValue(_resolvePromiseFn());
    }

    return _promiseFn.v || null;
}