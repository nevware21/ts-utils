/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { WellKnownSymbols, _wellKnownSymbolMap } from "../symbol/well_known";
import { throwTypeError } from "../helpers/throw";
import { POLYFILL_TAG, SYMBOL, TO_STRING } from "../internal/constants";
import { objHasOwn } from "../object/has_own";
import { asString } from "../string/as_string";
import { _GlobalPolySymbols, _getGlobalConfig } from "../internal/global";
import { strSubstring } from "../string/substring";
import { objKeys } from "../object/object";

const UNIQUE_REGISTRY_ID = "_urid";
let _polySymbols: _GlobalPolySymbols;

/*#__NO_SIDE_EFFECTS__*/
function _globalSymbolRegistry(): _GlobalPolySymbols {
    if (!_polySymbols) {
        let gblCfg = _getGlobalConfig();
        _polySymbols = gblCfg.gblSym = gblCfg.gblSym || { k: {}, s:{} };
    }

    return _polySymbols;
}

let _wellKnownSymbolCache: { [key in keyof typeof WellKnownSymbols ]: symbol };

/**
 * Returns a new (polyfill) Symbol object for the provided description that's guaranteed to be unique.
 * Symbols are often used to add unique property keys to an object that won't collide with keys any
 * other code might add to the object, and which are hidden from any mechanisms other code will
 * typically use to access the object. That enables a form of weak encapsulation, or a weak form of
 * information hiding.
 * @group Polyfill
 * @group Symbol
 * @param description - The description of the symbol
 * @returns A new polyfill version of a Symbol object
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyNewSymbol(description?: string | number): symbol {
    let theSymbol: symbol = {
        description: asString(description),
        toString: () => SYMBOL + "(" + description + ")"
    } as symbol;
    
    // Tag the symbol so we know it a polyfill
    theSymbol[POLYFILL_TAG] = true;

    return theSymbol;
}

/**
 * Returns a Symbol object from the global symbol registry matching the given key if found.
 * Otherwise, returns a new symbol with this key.
 * @group Polyfill
 * @group Symbol
 * @param key key to search for.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polySymbolFor(key: string): symbol {
    let registry = _globalSymbolRegistry();
    if (!objHasOwn(registry.k, key)) {
        let newSymbol = polyNewSymbol(key);
        let regId = objKeys(registry.s).length;
        newSymbol[UNIQUE_REGISTRY_ID] = () => regId + "_" + newSymbol[TO_STRING]();
        registry.k[key] = newSymbol;
        registry.s[newSymbol[UNIQUE_REGISTRY_ID]()] = asString(key);
    }

    return registry.k[key];
}

/**
 * Returns a key from the global symbol registry matching the given Symbol if found.
 * Otherwise, returns a undefined.
 * @group Polyfill
 * @group Symbol
 * @param sym Symbol to find the key for.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polySymbolKeyFor(sym: symbol): string | undefined {
    if (!sym || !sym[TO_STRING] || strSubstring(sym[TO_STRING](), 0, 6) != SYMBOL) {
        throwTypeError((sym as any) + " is not a symbol");
    }

    const regId = sym[POLYFILL_TAG] && sym[UNIQUE_REGISTRY_ID] && sym[UNIQUE_REGISTRY_ID]();

    return regId ? _globalSymbolRegistry().s[regId] : undefined;
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
 * @group Polyfill
 * @group Symbol
 * @param name - The property name to return (if it exists) for Symbol
 * @returns The value of the property if present
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyGetKnownSymbol(name: string | WellKnownSymbols): symbol {
    !_wellKnownSymbolCache && (_wellKnownSymbolCache = {} as any);
    let result: symbol;
    let knownName: WellKnownSymbols = _wellKnownSymbolMap[name];
    if (knownName) {
        result = _wellKnownSymbolCache[knownName] = _wellKnownSymbolCache[knownName] || polyNewSymbol(SYMBOL + "." + knownName);
    }

    return result
}
