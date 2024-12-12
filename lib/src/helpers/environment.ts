/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { NULL_VALUE, UNDEF_VALUE } from "../internal/constants";
import { _getGlobalValue } from "../internal/global";
import { ILazyValue, _globalLazyTestHooks, _initTestHooks, getLazy } from "./lazy";
import { ICachedValue, createCachedValue } from "./cache";
import { safe } from "./safe";

const WINDOW = "window";

declare let WorkerGlobalScope: any;
declare let self: any;

let _cachedGlobal: ICachedValue<Window>;

/**
 * @internal
 * @ignore
 * Returns a function which will return the named global object if available, will return `null` if the object is not available.
 * @param getFn - The function to use to get the global object
 * @param instName - The name of the global object to get, may be any valid PropertyKey (string, number or symbol)
 * @returns A function which will return the named global object if available, the funcion will return `null` if the object is not available.
 */
export function _getGlobalInstFn<T>(getFn: (...args: unknown[]) => T, theArgs?: unknown[]): () => T | null | undefined {
    let cachedValue: ICachedValue<T>;
    return function() {
        !_globalLazyTestHooks && _initTestHooks();
        if (!cachedValue || _globalLazyTestHooks.lzy) {
            cachedValue = createCachedValue(safe(getFn, theArgs).v);
        }
        
        return cachedValue.v;
    }
}

/**
 * Create and return an readonly {@link ILazyValue} instance which will cache and return the named global
 * value if available, will return `null` if the named global object is not available or if the runtime
 * throws an exception when attempting to access the global object.
 * Unlike {@link getInst} the value is cached after the first access, so if the global value changes after
 * the initial fetch the original cached value is still returned.
 * @since 0.9.5
 * @group Environment
 * @group Lazy
 * @group Safe
 * @param name - The name of the global object to get, may be any valid PropertyKey (string, number or symbol)
 * @returns A new readonly {@link ILazyValue} instance which will lazily attempt to return the globally
 * available named instance.
 * @example
 * ```ts
 * // This does not cause the evaluation to occur
 * window.myGlobal = "Hello";
 * let cachedValue = lazySafeGetInst("myGlobal");
 * // cachedValue.v === "Hello"
 *
 * window.myGlobal = "Darkness";
 * // cachedValue.v === "Hello"
 *
 * let promiseCls = lazySafeGetInst("Promise");
 * // null if Promise is not supported in the runtime
 * // otherwise the Promise class.
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function lazySafeGetInst<T>(name: string | number | symbol) : ILazyValue<T> {
    return getLazy(() => safe(getInst<T>, [name]).v || UNDEF_VALUE);
}

/**
 * Returns the current global scope object, for a normal web page this will be the current
 * window, for a Web Worker this will be current worker global scope via "self". The internal
 * implementation returns the first available instance object in the following order
 * - globalThis (New standard)
 * - self (Will return the current window instance for supported browsers)
 * - window (fallback for older browser implementations)
 * - global (NodeJS standard)
 * - <null> (When all else fails)
 * While the return type is a Window for the normal case, not all environments will support all
 * of the properties or functions. And this caches the lookup of the global as in some environments
 * this can be an expensive operation.
 * @group Environment
 * @param useCached - [Optional] used for testing to bypass the cached lookup, when `true` this will
 * cause the cached global to be reset.
 */
export function getGlobal(useCached?: boolean): Window {
    !_globalLazyTestHooks && _initTestHooks();
    if (!_cachedGlobal || useCached === false || _globalLazyTestHooks.lzy) {
        _cachedGlobal = createCachedValue(safe(_getGlobalValue).v || NULL_VALUE);
    }

    return _cachedGlobal.v;
}

/**
 * Return the named global object if available, will return null if the object is not available.
 * @group Environment
 * @param name - The globally named object, may be any valid property key (string, number or symbol)
 * @param useCached - [Optional] used for testing to bypass the cached lookup, when `true` this will
 * cause the cached global to be reset.
 * @example
 * ```ts
 * // This does not cause the evaluation to occur
 * window.myGlobal = "Hello";
 * let cachedValue = getInst("myGlobal");
 * // cachedValue === "Hello"
 *
 * window.myGlobal = "Darkness";
 * // getInst("myGlobal") === "Darkness"
 *
 * let promiseCls = getInst("Promise");
 * // May throw if the global is not supported by the runtime
 * // otherwise the Promise class.
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function getInst<T>(name: string | number | symbol, useCached?: boolean): T | null {
    let gbl: any;
    if (!_cachedGlobal || useCached === false) {
        gbl = getGlobal(useCached);
    } else {
        gbl = _cachedGlobal.v;
    }

    if (gbl && gbl[name]) {
        return gbl[name] as T;
    }

    // Test workaround, for environments where <global>.window (when global == window) doesn't return the base window
    if (name === WINDOW) {
        // tslint:disable-next-line: no-angle-bracket-type-assertion
        try {
            return window as T;
        } catch (e) {
            // Ignore
        }
    }

    return NULL_VALUE;
}

/**
 * Identify whether the runtime contains a `document` object
 * @group Environment
 * @returns - True if a `document` exists
 */
/*#__NO_SIDE_EFFECTS__*/
export function hasDocument(): boolean {
    return !!( /*#__PURE__*/getDocument());
}

/**
 * Return the global `document` instance.
 * @group Environment
 * @returns
 */
export const getDocument = (/*#__PURE__*/_getGlobalInstFn<Document>(getInst, ["document"]));

/**
 * Identify whether the runtime contains a `window` object
 * @group Environment
 * @returns
 */
/*#__NO_SIDE_EFFECTS__*/
export function hasWindow(): boolean {
    return !!( /*#__PURE__*/getWindow());
}

/**
 * Return the global `window` instance.
 * @group Environment
 * @returns
 */
export const getWindow = (/*#__PURE__*/_getGlobalInstFn<Window>(getInst, [WINDOW]));

/**
 * Identify whether the runtimne contains a `navigator` object
 * @group Environment
 * @returns
 */
/*#__NO_SIDE_EFFECTS__*/
export function hasNavigator(): boolean {
    return !!( /*#__PURE__*/getNavigator());
}

/**
 * Returns the global `navigator` instance
 * @group Environment
 * @returns
 */
export const getNavigator = (/*#__PURE__*/_getGlobalInstFn<Navigator>(getInst, ["navigator"]));

/**
 * Identifies whether the runtime contains a `history` object
 * @group Environment
 * @returns
 */
/*#__NO_SIDE_EFFECTS__*/
export function hasHistory(): boolean {
    return !!( /*#__PURE__*/getHistory());
}

/**
 * Returns the global `history` instance
 * @group Environment
 * @returns
 */
export const getHistory = (/*#__PURE__*/_getGlobalInstFn<History>(getInst, ["history"]));

/**
 * Simple method to determine if we are running in a node environment
 * @group Environment
 * @returns True if you are
 */
export const isNode = (/*#__PURE__*/_getGlobalInstFn<boolean>(() => {
    return !!( /*#__PURE__*/safe(() => (process && (process.versions||{}).node)).v);
}));

/**
 * Helper to identify if you are running as a Dedicated, Shared or Service worker
 * @group Environment
 * @returns True if the environment you are in looks like a Web Worker
 */
export const isWebWorker = (/*#__PURE__*/_getGlobalInstFn<boolean>(() => {
    return !!( /*#__PURE__*/safe(() => self && self instanceof WorkerGlobalScope).v);
}));
