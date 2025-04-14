/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

declare let Element: any;

/**
 * Checks if a value is a DOM Element.
 * Only available in browser environments.
 * @group Type Identity
 * @group DOM
 * @param value - The value to check
 * @returns True if the value is a DOM Element, false otherwise
 * @example
 * ```ts
 * isElement(document.createElement('div'));    // true
 * isElement(document.body);                   // true
 *
 * isElement(document);                        // false
 * isElement({});                              // false
 * isElement(null);                            // false
 * isElement(undefined);                       // false
 * ```
 */
export function isElement(value: any): value is Element {
    return !!value && value.nodeType === 1 &&
           !!value.nodeName &&
           !!(typeof Element !== "undefined" && value instanceof Element);
}
