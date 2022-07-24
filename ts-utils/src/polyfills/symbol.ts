/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isNullOrUndefined } from "../helpers/base";
import { getGlobal } from "../helpers/environment";
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