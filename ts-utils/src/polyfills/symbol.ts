/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isNullOrUndefined } from "../helpers/base";
import { getGlobal } from "../helpers/environment";
import { WellKnownSymbols, _wellKnownSymbolMap } from "../symbol/well_known";
import { throwTypeError } from "../helpers/throw";
import { SYMBOL } from "../internal/constants";
import { objHasOwnProperty } from "../object/has_own_prop";

const POLY_GLOBAL_REGISTORT = "__polySymbols$ts_utils";
let _polySymbols: {
    k: { [key: string ]: symbol },
    s: { [sym: symbol ]: string },
};

function _globalSymbolRegistry() {
    if (!_polySymbols) {
        let gbl = getGlobal();
        _polySymbols = gbl[POLY_GLOBAL_REGISTORT] = gbl[POLY_GLOBAL_REGISTORT] || { k: {}, s:{} };
    }

    return _polySymbols;
}

let _wellKnownSymbolCache: { [key in keyof typeof WellKnownSymbols ]: symbol } = {} as any;

export function polyNewSymbol(description?: string | number): symbol {
    return {
        description: "" + description,
        toString: () => SYMBOL + "(" + description + ")"
    } as symbol;
}

/**
 * Returns a Symbol object from the global symbol registry matching the given key if found.
 * Otherwise, returns a new symbol with this key.
 * @param key key to search for.
 */
export function polySymbolFor(key: string): symbol {
    let registry = _globalSymbolRegistry();
    if (!objHasOwnProperty(registry, key)) {
        let newSymbol = polyNewSymbol(key);
        registry.k[key] = newSymbol;
        registry.s[newSymbol] = "" + key;
    }

    return registry.k[key];
}

/**
 * Returns a key from the global symbol registry matching the given Symbol if found.
 * Otherwise, returns a undefined.
 * @param sym Symbol to find the key for.
 */
export function polySymbolKeyFor(sym: symbol): string | undefined {
    if (isNullOrUndefined(sym) || (sym as any) == "" + null) {
        throwTypeError((sym as any) + " is not a symbol");
    }

    return _globalSymbolRegistry().s[sym];
}

/**
 * Returns the polyfill version of a well-known global symbol, this will only return
 * known values.
 * @example
 * ```ts
 * // Always returns the polyfill version, even if Symbols are supported in the runtime
 * polyGetKnownSymbol("toStringTag") === polyGetKnownSymbol("toStringTag");                // true
 * polyGetKnownSymbol(WellKnownSymbols.toStringTag) === polyGetKnownSymbol("toStringTag"); // true
 * polyGetKnownSymbol("toStringTag") !== Symbol.toStringTag;                // true
 * polyGetKnownSymbol(WellKnownSymbols.toStringTag) !== Symbol.toStringTag; // true
 * polyGetKnownSymbol("toStringTag") !== polySymbolFor("toStringTag");      // true
 * polyGetKnownSymbol(WellKnownSymbols.toStringTag) !== polySymbolFor("toStringTag"); // true
 * polyGetKnownSymbol("toStringTag") !== polyNewSymbol("toStringTag");      // true
 * polyGetKnownSymbol(WellKnownSymbols.toStringTag) !== polyNewSymbol("toStringTag"); // true
 * ```
 * @param name - The property name to return (if it exists) for Symbol
 * @returns The value of the property if present
 */
export function polyGetKnownSymbol(name: string | WellKnownSymbols): symbol {
    let result: symbol;
    let knownName = _wellKnownSymbolMap[name];
    if (knownName) {
        result = _wellKnownSymbolCache[knownName] = _wellKnownSymbolCache[knownName] || polyNewSymbol(SYMBOL + "." + knownName);
    }

    return result
}
