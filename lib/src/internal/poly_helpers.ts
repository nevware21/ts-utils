/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { LENGTH } from "./constants";

export const POLYFILL_TAG = "_polyfill";
export const POLYFILL_TYPE_NAME = "__nw21$polytype__";

/*#__NO_SIDE_EFFECTS__*/
export function makePolyFn<T extends Function>(poly: T): T {
    return function(): T {
        let theArgs = [ this ];
        for (let lp = 0; lp < arguments[LENGTH]; lp++) {
            theArgs[lp + 1] = arguments[lp];
        }
        
        return poly.apply(this, theArgs);
    } as any;
}


/**
 * Checks if the target object is a polyfill.
 * @internal
 * @ignore
 * @group Polyfill
 * @param obj - The object to check.
 * @returns True if the object is a polyfill, false otherwise.
 */
export function _isPolyfill(obj: any): boolean {
    return !!(obj && obj[POLYFILL_TAG]);
}

/**
 * Checks if the target object is of a specific polyfill type.
 * @internal
 * @ignore
 * @group Polyfill
 * @param obj - The object to check.
 * @param polyfillTypeName - The type name of the polyfill.
 * @returns True if the object is of the specified polyfill type, false otherwise.
 */
export function _isPolyfillType(obj: any, polyfillTypeName: string): boolean {
    return !!(obj && obj[POLYFILL_TYPE_NAME] === polyfillTypeName);
}