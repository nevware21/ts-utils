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
import { ScheduleMicrotaskFn } from "../microtask";
import { _addToQueue, _eTaskQueueType, _flushQueues } from "./taskQueue";

let _promiseCls: ICachedValue<PromiseConstructor | undefined>;
let _promisePending = false;
let _pendingPromiseCls: PromiseConstructor | undefined;
let _promiseQueueFns: { [key in _eTaskQueueType]?: ScheduleMicrotaskFn } | undefined;

function _ensurePromiseTask(promiseCls: PromiseConstructor): void {
    // If the Promise implementation has changed (e.g. lazy bypass tests), clear stale pending state
    // so a fresh Promise batch can be scheduled with the current implementation.
    if (_promisePending && _pendingPromiseCls !== promiseCls) {
        _promisePending = false;
    }

    if (!_promisePending) {
        _promisePending = true;
        _pendingPromiseCls = promiseCls;
        try {
            promiseCls.resolve().then(() => {
                _promisePending = false;
                _pendingPromiseCls = undefined;
                _flushQueues();
            });
        } catch (e) {
            _promisePending = false;
            _pendingPromiseCls = undefined;
            _flushQueues();
        }
    }
}

function _promiseScheduleFn(promiseCls: PromiseConstructor, queueType: _eTaskQueueType): ScheduleMicrotaskFn {
    return function(callback: () => void, maxQueuedTasks?: number): boolean {
        let added = _addToQueue(queueType, callback, maxQueuedTasks);
        if (added) {
            _ensurePromiseTask(promiseCls);
        }

        return added;
    };
}

/**
 * @internal
 * Returns the Promise-based microtask scheduler, re-resolving the global Promise when the lazy
 * bypass flag is active (e.g. during tests) so that changes to the global Promise are reflected.
 * @since 0.15.0
 */
export function _getPromiseQueueFn(queueType: _eTaskQueueType): ScheduleMicrotaskFn | undefined {
    !_globalLazyTestHooks && _initTestHooks();
    if (!_promiseCls || _globalLazyTestHooks.lzy) {
        let promClass = getInst<PromiseConstructor>("Promise");
        if (promClass && isFunction(promClass.resolve)) {
            _promiseCls = createCachedValue(promClass);
            _promiseQueueFns = undefined;
        } else {
            // Clear stale Promise cache when Promise is unavailable or invalid so callers can
            // reliably fall back to timer-backed scheduling.
            _promiseCls = undefined;
            _promiseQueueFns = undefined;
            _promisePending = false;
            _pendingPromiseCls = undefined;
        }
    }

    let result: ScheduleMicrotaskFn | undefined;
    if (_promiseCls && _promiseCls.v) {
        !_promiseQueueFns && (_promiseQueueFns = {});
        result = _promiseQueueFns[queueType];
        if (!result) {
            result = _promiseScheduleFn(_promiseCls.v, queueType);
            _promiseQueueFns[queueType] = result;
        }
    }

    return result;
}

