/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction } from "../../helpers/base";
import { createCachedValue, ICachedValue } from "../../helpers/cache";
import { getInst, isNode } from "../../helpers/environment";
import { _globalLazyTestHooks, _initTestHooks } from "../../helpers/lazy";
import { ScheduleMicrotaskFn } from "../../helpers/types";
import { UNDEF_VALUE } from "../../internal/constants";
import { _runMicroTask } from "./runMicrotask";

interface IProcessLike {
    nextTick?: (callback: () => void) => void;
}

let _nextTickFn: ICachedValue<ScheduleMicrotaskFn | undefined>;

/**
 * @internal
 * @since 0.15.0
 */
function _nextTickScheduleFn(processInst: IProcessLike): ScheduleMicrotaskFn {
    return function(callback: () => void): void {
        processInst.nextTick(() => {
            _runMicroTask(callback);
        });
    };
}

/**
 * @internal
 * Resolves the process.nextTick-based scheduler from the current global state without caching.
 * @since 0.15.0
 */
function _resolveProcessNextTickFn(): ScheduleMicrotaskFn | undefined {
    let processInst = getInst<IProcessLike>("process");
    return (isNode() && processInst && isFunction(processInst.nextTick)) ? _nextTickScheduleFn(processInst) : UNDEF_VALUE as any;
}

/**
 * @internal
 * Returns the process.nextTick-based scheduler, re-resolving globals when lazy bypass is active (e.g. tests).
 * @since 0.15.0
 */
export function _getProcessNextTickFn(): ScheduleMicrotaskFn | undefined {
    !_globalLazyTestHooks && _initTestHooks();
    if (!_nextTickFn || _globalLazyTestHooks.lzy) {
        _nextTickFn = createCachedValue(_resolveProcessNextTickFn());
    }

    return _nextTickFn.v;
}
