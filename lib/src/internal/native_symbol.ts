/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { FUNCTION } from "./constants";

/**
 * @internal
 * @ignore
 * Returns a native well-known symbol (eg. "match", "replace", "matchAll" or "species"), or a falsy value when there is
 * no native Symbol (or it doesn't have the symbol). The native Symbol is read directly (rather than with
 * getKnownSymbol(), which would include the Symbol polyfill in every bundle which uses it).
 * @param name - The name of the well-known symbol
 * @returns The native symbol or a falsy value
 */
/*#__NO_SIDE_EFFECTS__*/
export function _getNativeSymbol(name: string): symbol {
    return typeof Symbol === FUNCTION && (Symbol as any)[name];
}
