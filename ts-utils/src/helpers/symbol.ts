/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { SYMBOL } from "../internal/constants";
import { polyNewSymbol, polySymbolFor, polySymbolKeyFor } from "../polyfills/symbol";
import { isDefined, _createIs } from "./base";
import { getInst, _safeCheck } from "./environment";

const _hasSymbol = _safeCheck(() => isDefined(Symbol), false);
let _symbol: Symbol = getInst<Symbol>(SYMBOL);
let _symbolFor: (key: string) => symbol = _symbol && _safeCheck(() => _symbol["for"], null);
let _symbolKeyFor: (sym: symbol) => string | undefined = _symbol && _safeCheck(() => _symbol["keyFor"], null);

/**
 * Checks if the type of value is a symbol.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a symbol, false otherwise.
 */
export const isSymbol = _createIs<symbol>("symbol");

/**
 * Helper to identify whether the runtime support the Symbols either via native or an installed polyfill
 * @param useCached - [Optional] used for testing to bypass the cached lookup, when `true` this will
 * cause the cached global to be reset, which is also useful if a polyfill is loaded after this library
 * @returns true if Symbol's are support otherwise false
 */
export function hasSymbol(useCached?: boolean): boolean {
    return !!getSymbol(useCached);
}

/**
 * If Symbols are supported then attempt to return the named Symbol
 * @returns The value of the named Symbol (if available)
 */
export function getSymbol(useCached?: boolean): Symbol {
    _symbol = useCached === false ? getInst<Symbol>(SYMBOL, useCached) : _symbol;

    return _hasSymbol && _symbol;
}

/**
 * If Symbols are supported then get the property of the global Symbol, if Symbol's are
 * not supported then it returns undefined. Used to access the well known symbols.
 * @param name - The property name to return (if it exists) for Symbol
 * @returns The value of the property if present
 */
export function getSymbolInst<T>(name: string): T {
    return _symbol && _symbol[name];
}

/**
 * Returns a new unique Symbol value.
 * @param  description Description of the new Symbol object.
 * @returns The new symbol
 */
export function newSymbol(description?: string | number): symbol {
    return _hasSymbol ? Symbol(description) : polyNewSymbol(description);
}

/**
 * Returns a Symbol object from the global symbol registry matching the given key if found.
 * Otherwise, returns a new symbol with this key.
 * @param key key to search for.
 */
export let symbolFor = _symbolFor || polySymbolFor;

/**
 * Returns a key from the global symbol registry matching the given Symbol if found.
 * Otherwise, returns a undefined.
 * @param sym Symbol to find the key for.
 */
export let symbolKeyFor = _symbolKeyFor || polySymbolKeyFor;
