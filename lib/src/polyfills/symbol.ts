/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { WellKnownSymbols, _wellKnownSymbolMap } from "../symbol/well_known";
import { throwTypeError } from "../helpers/throw";
import { EMPTY, LENGTH, SYMBOL, SYMBOL_TYPE, TO_STRING, UNDEF_VALUE } from "../internal/constants";
import { _throwTypeOf } from "../internal/throwIf";
import { objHasOwn } from "../object/has_own";
import { asString } from "../string/as_string";
import { _GlobalPolySymbols, _getGlobalConfig } from "../internal/global";
import { objKeys } from "../object/object";
import { _setOwnValue, objDefine } from "../object/define";
import { POLYFILL_TAG, POLYFILL_TYPE_NAME } from "../internal/poly_helpers";
import { isObject } from "../helpers/base";
import { _objCreateNull, _objGetOwnPropertyDescriptor } from "../internal/own_props";
import { _uniqueInstanceId } from "../internal/instance";

const UNIQUE_REGISTRY_ID = "_urid";
const POLY_SYM = "$nw21sym";
let _polySymbols: _GlobalPolySymbols;

let _polyId = 0;

/*#__NO_SIDE_EFFECTS__*/
function _globalSymbolRegistry(): _GlobalPolySymbols {
    if (!_polySymbols) {
        let gblCfg = _getGlobalConfig();
        // The keys have no prototype, so a key which is an Object.prototype name (eg. "__proto__" or "valueOf") is
        // its own key (a registry created by an earlier version is a {}, which _setOwnValue() also handles)
        _polySymbols = gblCfg.gblSym = gblCfg.gblSym || { k: _objCreateNull(), s: {} };
    }

    return _polySymbols;
}

let _wellKnownSymbolCache: { [key in keyof typeof WellKnownSymbols ]: symbol };

/**
 * Identifies a polyfill symbol (of any instance or version of ts-utils) by its own polyfill type, which is read as an
 * own data property, so no getter is called and a value which inherits the type (eg. from Object.prototype) or has it as
 * an accessor isn't a symbol. A polyfill symbol is an object (not a function). Unlike the native functions the value's
 * own property is read (eg. a Proxy's getOwnPropertyDescriptor trap is called), as every runtime with a Proxy has a
 * native Symbol, so it is only seen when a polyfill function is called directly.
 */
function _isPolySymbol(value: any): boolean {
    // Only an own data property, as the descriptor of an accessor has no value (so desc.value would read an inherited
    // Object.prototype.value)
    let desc = isObject(value) ? _objGetOwnPropertyDescriptor(value, POLYFILL_TYPE_NAME) : UNDEF_VALUE;

    return !!desc && objHasOwn(desc, "value") && desc.value === SYMBOL_TYPE;
}

/**
 * Like the native ToString() (used by Symbol() and Symbol.for()), a symbol (a native or a polyfill one) can't be
 * converted to a string
 */
function _throwIfSymbol(value: any): void {
    if (typeof value === SYMBOL_TYPE || _isPolySymbol(value)) {
        throwTypeError("Cannot convert a Symbol value to a string");
    }
}

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
    // Like the native Symbol() the description is converted to a string once (so an object's toString() is used, and a
    // symbol throws a TypeError), and an undefined description is undefined (and empty in the symbol's string)
    _throwIfSymbol(description);

    return _createPolySymbol(description === UNDEF_VALUE ? UNDEF_VALUE : asString(description));
}

/**
 * @internal
 * @ignore
 * Creates a new polyfill symbol with the description, which has already been converted (to a string, or is undefined)
 * by the caller (polyNewSymbol, polySymbolFor or polyGetKnownSymbol)
 * @param desc - The description
 * @returns The new polyfill symbol
 */
/*#__NO_SIDE_EFFECTS__*/
function _createPolySymbol(desc: string): symbol {
    // Create a unique identifier for this symbol instance
    const uniqueId = "_" + _polyId++ + "_" + _uniqueInstanceId.v;
    const symString = SYMBOL + "(" + (desc === UNDEF_VALUE ? EMPTY : desc) + ")";

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

    // Tagged as a polyfill symbol (see _isPolySymbol())
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
    // Like the native function the key is converted to a string once (a symbol throws a TypeError)
    _throwIfSymbol(key);
    key = asString(key);

    let registry = _globalSymbolRegistry();
    if (!objHasOwn(registry.k, key)) {
        // The key has been converted (and checked), so it isn't checked again
        let newSymbol: any = _createPolySymbol(key);

        // The registry id (and the registry's s) is only used by the polySymbolKeyFor() of an earlier version, which
        // shares the global registry
        let regId = objKeys(registry.s)[LENGTH];
        newSymbol[UNIQUE_REGISTRY_ID] = () => regId + "_" + newSymbol[TO_STRING]();
        _setOwnValue(registry.k, key, newSymbol);
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
    // Like the native function a value which isn't a symbol throws a TypeError (without converting it), and a native
    // symbol uses the native registry
    if (typeof sym === SYMBOL_TYPE) {
        return (Symbol as any).keyFor(sym);
    }

    // Like the native registry the key is found by the symbol's identity, so nothing is read from the value (eg. its
    // description, which can be redefined)
    let keys = _globalSymbolRegistry().k;
    for (let key in keys) {
        if (objHasOwn(keys, key) && keys[key] === sym) {
            return key;
        }
    }

    if (!_isPolySymbol(sym)) {
        _throwTypeOf(sym, " is not a symbol");
    }

    return UNDEF_VALUE;
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
        result = (_wellKnownSymbolCache as any)[knownName] = _wellKnownSymbolCache[knownName] || _createPolySymbol(SYMBOL + "." + knownName);
    }

    return result
}
