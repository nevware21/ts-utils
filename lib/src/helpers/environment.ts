/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { UNDEFINED, UNDEF_VALUE } from "../internal/constants";
import { _lazySafeGet } from "../internal/safe_check";
import { ILazyValue } from "./lazy";

const DOCUMENT = "document";
const HISTORY = "history";
const NAVIGATOR = "navigator";
const WINDOW = "window";

declare let WorkerGlobalScope: any;
declare let globalThis: Window;
declare let global: Window;
declare let self: any;

let _cachedGlobal: ILazyValue<Window>;

let _cachedWindow: ILazyValue<Window>;
let _cachedDocument: ILazyValue<Document>;
let _cachedNavigator: ILazyValue<Navigator>;
let _cachedHistory: ILazyValue<History>;
let _isWebWorker: ILazyValue<boolean>;
let _isNode: ILazyValue<boolean>;

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
    (!_cachedGlobal || useCached === false) && (_cachedGlobal = _lazySafeGet(function () {
        let result: Window;
        if (typeof globalThis !== UNDEFINED) {
            result = globalThis;
        }
    
        if (!result && typeof self !== UNDEFINED) {
            result = self;
        }
    
        if (!result && typeof window !== UNDEFINED) {
            result = window;
        }
    
        if (!result && typeof global !== UNDEFINED) {
            result = global;
        }

        return result;
    }, null));

    return _cachedGlobal.v;
}

/**
 * Return the named global object if available, will return null if the object is not available.
 * @group Environment
 * @param name The globally named object
 * @param useCached - [Optional] used for testing to bypass the cached lookup, when `true` this will
 * cause the cached global to be reset.
*/
export function getInst<T>(name: string, useCached?: boolean): T {
    const gbl = getGlobal(useCached);
    if (gbl && gbl[name]) {
        return gbl[name] as T;
    }

    // Test workaround, for environments where <global>.window (when global == window) doesn't return the base window
    if (name === WINDOW && _cachedWindow) {
        // tslint:disable-next-line: no-angle-bracket-type-assertion
        return <any>_cachedWindow.v as T;
    }

    return null;
}

/**
 * Identify whether the runtime contains a `document` object
 * @group Environment
 * @returns - True if a `document` exists
 */
export function hasDocument(): boolean {
    return !!getDocument();
}

/**
 * Return the global `document` instance.
 * @group Environment
 * @returns
 */
export function getDocument(): Document {
    !_cachedDocument && (_cachedDocument = _lazySafeGet(() => document || getInst(DOCUMENT), UNDEF_VALUE));

    return _cachedDocument.v;
}

/**
 * Identify whether the runtime contains a `window` object
 * @group Environment
 * @returns
 */
export function hasWindow(): boolean {
    return !!getWindow();
}

/**
 * Return the global `window` instance.
 * @group Environment
 * @returns
 */
export function getWindow(): Window {
    !_cachedWindow && (_cachedWindow = _lazySafeGet(() => window || getInst(WINDOW), UNDEF_VALUE));

    return _cachedWindow.v;
}

/**
 * Identify whether the runtimne contains a `navigator` object
 * @group Environment
 * @returns
 */
export function hasNavigator(): boolean {
    return !!getNavigator();
}

/**
 * Returns the global `navigator` instance
 * @group Environment
 * @returns
 */
export function getNavigator(): Navigator {
    !_cachedNavigator && (_cachedNavigator = _lazySafeGet(() => navigator || getInst(NAVIGATOR), UNDEF_VALUE));

    return _cachedNavigator.v;
}

/**
 * Identifies whether the runtime contains a `history` object
 * @group Environment
 * @returns
 */
export function hasHistory(): boolean {
    return !!getHistory();
}

/**
 * Returns the global `history` instance
 * @group Environment
 * @returns
 */
export function getHistory(): History | null {
    !_cachedHistory && (_cachedHistory = _lazySafeGet(() => history || getInst(HISTORY), UNDEF_VALUE));

    return _cachedHistory.v;
}

/**
 * Simple method to determine if we are running in a node environment
 * @group Environment
 * @returns True if you are
 */
export function isNode(): boolean {
    !_isNode && (_isNode = _lazySafeGet(() => !!(process && (process.versions||{}).node), false))

    return _isNode.v;
}

/**
 * Helper to identify if you are running as a Dedicated, Shared or Service worker
 * @group Environment
 * @returns True if the environment you are in looks like a Web Worker
 */
export function isWebWorker(): boolean {
    !_isWebWorker && (_isWebWorker = _lazySafeGet(() => !!(self && self instanceof WorkerGlobalScope), false));

    return _isWebWorker.v;
}
