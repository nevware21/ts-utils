/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/grunt-plugins
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { UNDEFINED } from "../internal/constants";
import { isNullOrUndefined, isObject, isUndefined } from "./base";

const DOCUMENT = "document";
const HISTORY = "history";
const NAVIGATOR = "navigator";
const WINDOW = "window";

declare let WorkerGlobalScope: any;
declare let globalThis: Window;
declare let global: Window;
declare let self: any;

let _cachedGlobal: Window = null;

const _hasWindow = !!(typeof window !== UNDEFINED && window);
const _hasDocument = !!(typeof document !== UNDEFINED && document);
const _isWebWorker: boolean = _safeCheck(() => !!(self && self instanceof WorkerGlobalScope), false);
const _isNode: boolean = _safeCheck(() => !!(process && (process.versions||{}).node), false);

function _safeCheck(cb: () => boolean, defValue: boolean) {
    let result = defValue;
    try {
        result = cb();
    } catch (e) {
        // Do nothing
    }
    return result;
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
 */
export function getGlobal(useCached?: boolean): Window {
    if (!_cachedGlobal || useCached === false) {
        if (typeof globalThis != UNDEFINED && globalThis) {
            _cachedGlobal = globalThis;
        }
    
        if (typeof self !== UNDEFINED && self) {
            _cachedGlobal = self;
        }
    
        if (typeof window !== UNDEFINED && window) {
            _cachedGlobal = window;
        }
    
        if (typeof global !== UNDEFINED && global) {
            _cachedGlobal = global;
        }
    }

    return _cachedGlobal;
}

/**
 * Return the named global object if available, will return null if the object is not available.
 * @param name The globally named object
 */
export function getInst<T>(name: string): T {
    const gbl = getGlobal();
    if (gbl && gbl[name]) {
        return gbl[name] as T;
    }

    // Test workaround, for environments where <global>.window (when global == window) doesn't return the base window
    if (name === WINDOW && _hasWindow) {
        // tslint:disable-next-line: no-angle-bracket-type-assertion
        return <any>window as T;
    }

    return null;
}

/**
 * Identify whether the runtime contains a `document` object
 * @returns - True if a `document` exists
 */
export function hasDocument(): boolean {
    return !!getDocument();
}

/**
 * Return the global `document` instance.
 * @returns
 */
export function getDocument(): Document {
    return _hasDocument ? document : getInst(DOCUMENT);
}

/**
 * Identify whether the runtime contains a `window` object
 * @returns
 */
export function hasWindow(): boolean {
    return !!getWindow();
}

/**
 * Return the global `window` instance.
 * @returns
 */
export function getWindow(): Window {
    return _hasWindow ? window : getInst(WINDOW);
}

/**
 * Identify whether the runtimne contains a `navigator` object
 * @returns
 */
export function hasNavigator(): boolean {
    return !!getNavigator();
}

/**
 * Returns the global `navigator` instance
 * @returns
 */
export function getNavigator(): Navigator {
    return navigator || getInst(NAVIGATOR);
}

/**
 * Identifies whether the runtime contains a `history` object
 * @returns
 */
export function hasHistory(): boolean {
    return !!getHistory();
}

/**
 * Returns the global `history` instance
 * @returns
 */
export function getHistory(): History | null {
    return history || getInst(HISTORY);
}

/**
 * Simple method to determine if we are running in a node environment
 * @returns True if you are
 */
export function isNode(): boolean {
    return _isNode;
}

/**
 * Helper to identify if you are running as a Dedicated, Shared or Service worker
 * @returns True if the environment you are in looks like a Web Worker
 */
export function isWebWorker(): boolean {
    return _isWebWorker;
}