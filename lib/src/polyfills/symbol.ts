/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { WellKnownSymbols, _wellKnownSymbolMap } from "../symbol/well_known";
import { EMPTY, LENGTH, SYMBOL, SYMBOL_TYPE, TO_STRING, UNDEF_VALUE } from "../internal/constants";
import { _throwTypeOf } from "../internal/throwIf";
import { objHasOwn } from "../object/has_own";
import { asString } from "../string/as_string";
import { _GlobalPolySymbols, _getGlobalConfig } from "../internal/global";
import { objKeys } from "../object/object";
import { objDefine } from "../object/define";
import { POLYFILL_TAG, POLYFILL_TYPE_NAME, _isPolyfill } from "../internal/poly_helpers";
import { _objCreateNull } from "../internal/own_props";
import { _uniqueInstanceId } from "../internal/instance";

const UNIQUE_REGISTRY_ID = "_urid";
const POLY_SYM = "$nw21sym";
let _polySymbols: _GlobalPolySymbols;

let _polyId = 0;

/*#__NO_SIDE_EFFECTS__*/
function _globalSymbolRegistry(): _GlobalPolySymbols {
    if (!_polySymbols) {
        let gblCfg = _getGlobalConfig();
        // The keys have no prototype, so a key which is an Object.prototype name (eg. "__proto__") is its own key
        _polySymbols = gblCfg.gblSym = gblCfg.gblSym || { k: _objCreateNull(), s: {} };
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
    // Like the native Symbol() an undefined description is undefined (and empty in the symbol's string), and any other
    // description is converted to a string once (so an object's toString() is used)
    const desc = description === UNDEF_VALUE ? UNDEF_VALUE : asString(description);

    // Create a unique identifier for this symbol instance
    const uniqueId = "_" + _polyId++ + "_" + _uniqueInstanceId.v;
    const symString = SYMBOL + "(" + (desc || EMPTY) + ")";

    function _setProp(name: string, value: any) {
        objDefine(theSymbol as any, name, {
            v: value,
            e: false,
            w: false
        });
    }

    let theSymbol = _objCreateNull() as symbol;

    _setProp("description", desc);
    _setProp(TO_STRING, () => symString + POLY_SYM + uniqueId);
    _setProp("valueOf", () => theSymbol);
    _setProp("v", symString);
    _setProp("_uid", uniqueId);

    // Tagged as a polyfill symbol (see isSymbol() and polySymbolKeyFor())
    _setProp(POLYFILL_TAG, true);
    _setProp(POLYFILL_TYPE_NAME, SYMBOL_TYPE);

    return theSymbol;
}

/**
 * Returns a Symbol object from the global symbol registry matching the given key if found.
 * Otherwise, returns a new symbol with this key.
 * @group Polyfill
 * @group Symbol
 * @param key - key to search for.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polySymbolFor(key: string): symbol {
    // Like the native function the key is converted to a string once
    key = asString(key);

    let registry = _globalSymbolRegistry();
    if (!objHasOwn(registry.k, key)) {
        let newSymbol: any = polyNewSymbol(key);
        let regId = objKeys(registry.s)[LENGTH];
        newSymbol[UNIQUE_REGISTRY_ID] = () => regId + "_" + newSymbol[TO_STRING]();
        registry.k[key] = newSymbol;
        registry.s[newSymbol[UNIQUE_REGISTRY_ID]()] = key;
    }

    return registry.k[key];
}

/**
 * Returns a key from the global symbol registry matching the given Symbol if found.
 * Otherwise, returns a undefined.
 * @group Polyfill
 * @group Symbol
 * @param sym - Symbol to find the key for.
 */
/*#__NO_SIDE_EFFECTS__*/
export function polySymbolKeyFor(sym: symbol): string | undefined {
    // A polyfill symbol of every version has the polyfill tag (only v0.12.0 and later also have the polyfill type)
    let isPoly = _isPolyfill(sym);

    // Like the native function a value which isn't a symbol throws a TypeError without converting it (so the message
    // only includes its type), while a native symbol (eg. on a runtime without Symbol.keyFor) has no key, like v0.16.0
    if (!isPoly && typeof sym !== SYMBOL_TYPE) {
        _throwTypeOf(sym, " is not a symbol");
    }

    // Only a polyfill symbol registered by v0.10.1 or later has a registry id
    const regId = isPoly && (sym as any)[UNIQUE_REGISTRY_ID] && (sym as any)[UNIQUE_REGISTRY_ID]();

    return regId ? _globalSymbolRegistry().s[regId] : UNDEF_VALUE;
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
    // Only a name of the map itself (not an inherited one, eg. "toString")
    let knownName: WellKnownSymbols = objHasOwn(_wellKnownSymbolMap, name) ? (_wellKnownSymbolMap as any)[name] : UNDEF_VALUE;
    if (knownName) {
        result = (_wellKnownSymbolCache as any)[knownName] = _wellKnownSymbolCache[knownName] || polyNewSymbol(SYMBOL + "." + knownName);
    }

    return result
}
