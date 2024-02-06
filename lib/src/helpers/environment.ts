/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
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

let _cachedWindow: ICachedValue<Window>;
let _cachedDocument: ICachedValue<Document>;
let _cachedNavigator: ICachedValue<Navigator>;
let _cachedHistory: ICachedValue<History>;
let _isWebWorker: ICachedValue<boolean>;
let _isNode: ICachedValue<boolean>;

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
 * @param name The name of the global object to get, may be any valid PropertyKey (string, number or symbol)
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
/*#__NO_SIDE_EFFECTS__*/
export function getGlobal(useCached?: boolean): Window {
    !_globalLazyTestHooks && _initTestHooks();
    (!_cachedGlobal || useCached === false || _globalLazyTestHooks.lzy) && (_cachedGlobal = createCachedValue(safe(_getGlobalValue).v || NULL_VALUE));

    return _cachedGlobal.v;
}

/**
 * Return the named global object if available, will return null if the object is not available.
 * Unlike {@link safeGetInst} some environments may throw an exception if the global is not available.
 * @group Environment
 * @param name The globally named object, may be any valid property key (string, number or symbol)
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
    const gbl = (!_cachedGlobal || useCached === false) ? getGlobal(useCached) : _cachedGlobal.v;
    if (gbl && gbl[name]) {
        return gbl[name] as T;
    }

    // Test workaround, for environments where <global>.window (when global == window) doesn't return the base window
    if (name === WINDOW && _cachedWindow) {
        // tslint:disable-next-line: no-angle-bracket-type-assertion
        return <any>_cachedWindow.v as T;
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
    return !!getDocument();
}

/**
 * Return the global `document` instance.
 * @group Environment
 * @returns
 */
/*#__NO_SIDE_EFFECTS__*/
export function getDocument(): Document {
    !_globalLazyTestHooks && _initTestHooks();
    (!_cachedDocument || _globalLazyTestHooks.lzy) && (_cachedDocument = createCachedValue(safe(getInst<Document>, ["document"]).v));

    return _cachedDocument.v;
}

/**
 * Identify whether the runtime contains a `window` object
 * @group Environment
 * @returns
 */
/*#__NO_SIDE_EFFECTS__*/
export function hasWindow(): boolean {
    return !!getWindow();
}

/**
 * Return the global `window` instance.
 * @group Environment
 * @returns
 */
/*#__NO_SIDE_EFFECTS__*/
export function getWindow(): Window {
    !_globalLazyTestHooks && _initTestHooks();
    (!_cachedWindow || _globalLazyTestHooks.lzy) && (_cachedWindow = createCachedValue(safe(getInst<Window>, [WINDOW]).v));

    return _cachedWindow.v;
}

/**
 * Identify whether the runtimne contains a `navigator` object
 * @group Environment
 * @returns
 */
/*#__NO_SIDE_EFFECTS__*/
export function hasNavigator(): boolean {
    return !!getNavigator();
}

/**
 * Returns the global `navigator` instance
 * @group Environment
 * @returns
 */
/*#__NO_SIDE_EFFECTS__*/
export function getNavigator(): Navigator {
    !_globalLazyTestHooks && _initTestHooks();
    (!_cachedNavigator || _globalLazyTestHooks.lzy) && (_cachedNavigator = createCachedValue(safe(getInst<Navigator>, ["navigator"]).v));

    return _cachedNavigator.v;
}

/**
 * Identifies whether the runtime contains a `history` object
 * @group Environment
 * @returns
 */
/*#__NO_SIDE_EFFECTS__*/
export function hasHistory(): boolean {
    return !!getHistory();
}

/**
 * Returns the global `history` instance
 * @group Environment
 * @returns
 */
/*#__NO_SIDE_EFFECTS__*/
export function getHistory(): History | null {
    !_globalLazyTestHooks && _initTestHooks();
    (!_cachedHistory || _globalLazyTestHooks.lzy) && (_cachedHistory = createCachedValue(safe(getInst<History>, ["history"]).v));

    return _cachedHistory.v;
}

/**
 * Simple method to determine if we are running in a node environment
 * @group Environment
 * @returns True if you are
 */
export function isNode(): boolean {
    !_isNode && (_isNode = createCachedValue(!!safe(() => (process && (process.versions||{}).node)).v));

    return _isNode.v;
}

/**
 * Helper to identify if you are running as a Dedicated, Shared or Service worker
 * @group Environment
 * @returns True if the environment you are in looks like a Web Worker
 */
export function isWebWorker(): boolean {
    !_isWebWorker && (_isWebWorker = createCachedValue(!!safe(() => self && self instanceof WorkerGlobalScope).v));

    return _isWebWorker.v;
}
