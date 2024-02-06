/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { NULL_VALUE, SYMBOL, UNDEF_VALUE } from "../internal/constants";
import { polyGetKnownSymbol, polyNewSymbol, polySymbolFor, polySymbolKeyFor } from "../polyfills/symbol";
import { WellKnownSymbols, _wellKnownSymbolMap } from "./well_known";
import { _createIs } from "../helpers/base";
import { ILazyValue, _globalLazyTestHooks, _initTestHooks } from "../helpers/lazy";
import { safeGetLazy } from "../helpers/safe_lazy";
import { lazySafeGetInst } from "../helpers/environment";

let _symbol: ILazyValue<Symbol>;
let _symbolFor: ILazyValue<(key: string) => symbol>;
let _symbolKeyFor: ILazyValue<(sym: symbol) => string | undefined>;

export function _initSymbol() {
    if (!_symbol || !_symbol.b) {
        _symbol = lazySafeGetInst<Symbol>(SYMBOL);
        _symbolFor = safeGetLazy<typeof Symbol.for>(() => (_symbol.v ? _symbol.v["for"] : UNDEF_VALUE), UNDEF_VALUE);
        _symbolKeyFor = safeGetLazy<typeof Symbol.keyFor>(() => (_symbol.v ? _symbol.v["keyFor"] : UNDEF_VALUE), UNDEF_VALUE);
    }
}

/**
 * Checks if the type of value is a symbol.
 * @group Symbol
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a symbol, false otherwise.
 */
export const isSymbol: (value: any) => value is symbol = (/*#__PURE__*/_createIs<symbol>("symbol"));

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
    !_globalLazyTestHooks && _initTestHooks();
    (!_symbol || _globalLazyTestHooks.lzy) && _initSymbol();
    
    return _symbol.v;
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
    let knownName = _wellKnownSymbolMap[name];
    !_globalLazyTestHooks && _initTestHooks();
    // Cause lazy symbol to get initialized
    (!_symbol || _globalLazyTestHooks.lzy) && _initSymbol();

    return _symbol.v ? _symbol.v[knownName || name] : (!noPoly ? polyGetKnownSymbol(name) : UNDEF_VALUE);
}

/**
 * Returns a new unique Symbol value. If noPoly is true and symbols are not supported
 * then this will return null.
 * @group Symbol
 * @param description Description of the new Symbol object.
 * @param noPoly - Flag indicating whether to return a polyfil if symbols are not supported.
 * @returns The new symbol
 */
/*#__NO_SIDE_EFFECTS__*/
export function newSymbol(description?: string | number, noPoly?: boolean): symbol {
    !_globalLazyTestHooks && _initTestHooks();
    // Cause lazy _symbol to get initialized
    (!_symbol || _globalLazyTestHooks.lzy) && _initSymbol();

    return _symbol.v ? (_symbol.v as any)(description) : (!noPoly ? polyNewSymbol(description) : NULL_VALUE);
}

/**
 * Returns a Symbol object from the global symbol registry matching the given key if found.
 * Otherwise, returns a new symbol with this key. This will always return a polyfill if symbols
 * are not supported.
 * @group Symbol
 * @param key key to search for.
 */
/*#__NO_SIDE_EFFECTS__*/
export function symbolFor(key: string): symbol {
    !_globalLazyTestHooks && _initTestHooks();
    // Cause lazy symbol to get initialized
    (!_symbolFor || !_symbol || _globalLazyTestHooks.lzy) && _initSymbol();

    return (_symbolFor.v || polySymbolFor)(key);
}

/**
 * Returns a key from the global symbol registry matching the given Symbol if found.
 * Otherwise, returns a undefined. This will always attempt to lookup the polyfill
 * implementation if symbols are not supported
 * @group Symbol
 * @param sym Symbol to find the key for.
 */
/*#__NO_SIDE_EFFECTS__*/
export function symbolKeyFor(sym: symbol): string | undefined {
    !_globalLazyTestHooks && _initTestHooks();
    // Cause lazy symbol to get initialized
    (!_symbolKeyFor || !_symbol || _globalLazyTestHooks.lzy) && _initSymbol();

    return (_symbolKeyFor.v || polySymbolKeyFor)(sym);
}
