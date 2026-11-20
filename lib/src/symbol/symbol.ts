/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { NULL_VALUE, SYMBOL, SYMBOL_TYPE, UNDEF_VALUE } from "../internal/constants";
import { polyGetKnownSymbol, polyNewSymbol, polySymbolFor, polySymbolKeyFor } from "../polyfills/symbol";
import { WellKnownSymbols, _wellKnownSymbolMap } from "./well_known";
import { _createIsWithPoly } from "../helpers/base";
import { _initTestHooks } from "../helpers/lazy";
import { ICachedValue, createCachedValue } from "../helpers/cache";
import { safe } from "../helpers/safe";
import { getInst } from "../helpers/environment";

let _symbol: ICachedValue<Symbol>;
let _symbolFor: ICachedValue<(key: string) => symbol>;
let _symbolKeyFor: ICachedValue<(sym: symbol) => string | undefined>;

/*#__NO_SIDE_EFFECTS__*/
function _getSymbolValue(): ICachedValue<Symbol> {
    return (!_initTestHooks().lzy ? _symbol : 0) || (_symbol = (/*#__PURE__*/createCachedValue(safe(getInst<Symbol>, [SYMBOL]).v)));
}

function _getSymbolKey<R>(key: string) {
    let gblSym: any = _getSymbolValue();

    return (gblSym.v ? gblSym.v[key] : UNDEF_VALUE) as R;
}

/**
 * Checks if the type of value is a symbol.
 *
 * @function
 * @group Symbol
 * @param value - Value to be checked.
 * @return True if the value is a symbol, false otherwise.
 */
export const isSymbol: (value: any) => value is symbol = (/*#__PURE__*/_createIsWithPoly<symbol>(SYMBOL_TYPE));

/**
 * Helper to identify whether the runtime support the Symbols either via native or an installed polyfill
 * @group Symbol
 * @returns true if Symbol's are support otherwise false
 */
/*#__NO_SIDE_EFFECTS__*/
export function hasSymbol(): boolean {
    return !!getSymbol();
}

/**
 * If Symbols are supported then attempt to return the named Symbol
 * @group Symbol
 * @returns The value of the named Symbol (if available)
 */
/*#__NO_SIDE_EFFECTS__*/
export function getSymbol(): Symbol {
    // Get the current lazy symbol or cause it to get initialized
    return _getSymbolValue().v;
}

/**
 * If Symbols are supported then get the property of the global Symbol, if Symbol's are
 * not supported and noPoly is true it returns null. Used to access the well known symbols.
 * @group Symbol
 * @param name - The property name to return (if it exists) for Symbol
 * @param noPoly - Flag indicating whether to return a polyfill if symbols are not supported.
 * @returns The value of the property if present
 * @example
 * ```ts
 * // If Symbol is supported in the runtime
 * getKnownSymbol("toStringTag") === Symbol.toStringTag;                // true
 * getKnownSymbol(WellKnownSymbols.toStringTag) === Symbol.toStringTag; // true
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function getKnownSymbol<T = symbol>(name: string | WellKnownSymbols, noPoly?: boolean): T {
    let knownName = (_wellKnownSymbolMap as any)[name];

    // Get the current lazy symbol or cause it to get initialized
    let sym: any = _getSymbolValue();
    
    return sym.v ? sym.v[knownName || name] : (!noPoly ? polyGetKnownSymbol(name) as T : UNDEF_VALUE);
}

/**
 * Returns a new unique Symbol value. If noPoly is true and symbols are not supported
 * then this will return null.
 * @group Symbol
 * @param description - Description of the new Symbol object.
 * @param noPoly - Flag indicating whether to return a polyfil if symbols are not supported.
 * @returns The new symbol
 */
/*#__NO_SIDE_EFFECTS__*/
export function newSymbol(description?: string | number, noPoly?: boolean): symbol {
    // Get the current lazy symbol or cause it to get initialized
    let sym = _getSymbolValue();

    return sym.v ? (sym.v as any)(description) : (!noPoly ? polyNewSymbol(description) : NULL_VALUE);
}

/**
 * Returns a Symbol object from the global symbol registry matching the given key if found.
 * Otherwise, returns a new symbol with this key. This will always return a polyfill if symbols
 * are not supported.
 * @group Symbol
 * @param key - key to search for.
 */
/*#__NO_SIDE_EFFECTS__*/
export function symbolFor(key: string): symbol {
    // Cause lazy symbol to get initialized
    _symbolFor = ((!_initTestHooks().lzy ? _symbolFor : 0) || (/*#__PURE__*/createCachedValue(safe(_getSymbolKey<typeof Symbol.for>, ["for"]).v)));

    return (_symbolFor.v || polySymbolFor)(key);
}

/**
 * Returns a key from the global symbol registry matching the given Symbol if found.
 * Otherwise, returns a undefined. This will always attempt to lookup the polyfill
 * implementation if symbols are not supported
 * @group Symbol
 * @param sym - Symbol to find the key for.
 */
/*#__NO_SIDE_EFFECTS__*/
export function symbolKeyFor(sym: symbol): string | undefined {
    // Cause lazy symbol to get initialized
    _symbolKeyFor = ((!_initTestHooks().lzy ? _symbolKeyFor : 0) || (/*#__PURE__*/createCachedValue(safe(_getSymbolKey<typeof Symbol.keyFor>, ["keyFor"]).v)));

    return (_symbolKeyFor.v || polySymbolKeyFor)(sym);
}
