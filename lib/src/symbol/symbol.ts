/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { SYMBOL, UNDEF_VALUE } from "../internal/constants";
import { polyGetKnownSymbol, polyNewSymbol, polySymbolFor, polySymbolKeyFor } from "../polyfills/symbol";
import { WellKnownSymbols, _wellKnownSymbolMap } from "./well_known";
import { isDefined, _createIs } from "../helpers/base";
import { getInst } from "../helpers/environment";
import { ILazyValue } from "../helpers/lazy";
import { _lazySafeGet } from "../internal/lazy_safe_check";

let _symbol: ILazyValue<Symbol>;
let _symbolFor: ILazyValue<(key: string) => symbol>;
let _symbolKeyFor: ILazyValue<(sym: symbol) => string | undefined>;

/**
 * Checks if the type of value is a symbol.
 * @group Symbol
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a symbol, false otherwise.
 */
export const isSymbol: (value: any) => value is symbol = _createIs<symbol>("symbol");

/**
 * Helper to identify whether the runtime support the Symbols either via native or an installed polyfill
 * @group Symbol
 * @param useCached - [Optional] used for testing to bypass the cached lookup, when `true` this will
 * cause the cached global to be reset, which is also useful if a polyfill is loaded after this library
 * @returns true if Symbol's are support otherwise false
 */
export function hasSymbol(useCached?: boolean): boolean {
    return !!getSymbol(useCached);
}

/**
 * If Symbols are supported then attempt to return the named Symbol
 * @group Symbol
 * @returns The value of the named Symbol (if available)
 */
export function getSymbol(useCached?: boolean): Symbol {
    let resetCache = useCached === false;
    (!_symbol || resetCache) && (_symbol = _lazySafeGet(() => isDefined(Symbol) ? getInst<Symbol>(SYMBOL, useCached) : UNDEF_VALUE, UNDEF_VALUE));
    (!_symbolFor || resetCache) && (_symbolFor = _lazySafeGet(() => _symbol.v ? _symbol["for"] : UNDEF_VALUE, UNDEF_VALUE));
    (!_symbolKeyFor || resetCache) && (_symbolKeyFor = _lazySafeGet(() => _symbol.v ? _symbol["keyFor"] : UNDEF_VALUE, UNDEF_VALUE));
    
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
export function getKnownSymbol<T = symbol>(name: string | WellKnownSymbols, noPoly?: boolean): T {
    let knownName = _wellKnownSymbolMap[name];
    // Cause lazy symbol to get initialized
    !_symbol && getSymbol();

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
export function newSymbol(description?: string | number, noPoly?: boolean): symbol {
    // Cause lazy _symbol to get initialized
    !_symbol && getSymbol();

    return _symbol.v ? Symbol(description) : (!noPoly ? polyNewSymbol(description) : null);
}

/**
 * Returns a Symbol object from the global symbol registry matching the given key if found.
 * Otherwise, returns a new symbol with this key. This will always return a polyfill if symbols
 * are not supported.
 * @group Symbol
 * @param key key to search for.
 */
export function symbolFor(key: string): symbol {
    // Cause lazy symbol to get initialized
    !_symbolFor && getSymbol();

    return (_symbolFor.v || polySymbolFor)(key);
}

/**
 * Returns a key from the global symbol registry matching the given Symbol if found.
 * Otherwise, returns a undefined. This will always attempt to lookup the polyfill
 * implementation if symbols are not supported
 * @group Symbol
 * @param sym Symbol to find the key for.
 */
export function symbolKeyFor(sym: symbol): string | undefined {
    // Cause lazy symbol to get initialized
    !_symbolKeyFor && getSymbol();

    return (_symbolKeyFor.v || polySymbolKeyFor)(sym);
}
