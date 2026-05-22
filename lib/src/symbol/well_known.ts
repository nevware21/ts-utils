/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */
import { createEnumKeyMap } from "../helpers/enum";

/**
 * Identifies the Symbol static properties which are symbols themselves as a constant
 * enum to aid in minification when fetching them from the global symbol implementation.
 *
 * See: [Well Known Symbols](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol#well-known_symbols)
 * @group Symbol
 */
export const enum WellKnownSymbols {
    /**
     * The Symbol.asyncIterator symbol is a builtin symbol that is used to access an
     * object's `Symbol.asyncIterator` method. In order for an object to be async iterable,
     * it must have a Symbol.asyncIterator key.
     *
     * See: [Symbol.asyncIterator](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator)
     */
    asyncIterator = 0,

    /**
     * The `Symbol.hasInstance` well-known symbol is used to determine if a constructor
     * object recognizes an object as its instance. The instanceof operator's behavior
     * can be customized by this symbol.
     *
     * See: [Symbol.hasInstance](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)
     */
    hasInstance = 1,

    /**
     * The `Symbol.isConcatSpreadable` symbol (Symbol.isConcatSpreadable) can be defined as an
     * own or inherited property and its value is a boolean. It can control behavior for
     * arrays and array-like objects:
     * - For array objects, the default behavior is to spread (flatten) elements.
     * Symbol.isConcatSpreadable can avoid flattening in these cases.
     * - For array-like objects, the default behavior is no spreading or flattening.
     * Symbol.isConcatSpreadable can force flattening in these cases.
     *
     * See: [Symbol.isConcatSpreadable](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/isConcatSpreadable)
     */
    isConcatSpreadable = 2,

    /**
     * Whenever an object needs to be iterated (such as at the beginning of a for..of loop),
     * its `Symbol.iterator` method is called with no arguments, and the returned iterator is used
     * to obtain the values to be iterated.
     *
     * See: [Symbol.iterator](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)
     */
    iterator = 3,

    /**
     * This function is also used to identify if objects have the behavior of regular expressions.
     * For example, the methods String.prototype.startsWith(), String.prototype.endsWith() and
     * String.prototype.includes(), check if their first argument is a regular expression and
     * will throw a TypeError if they are. Now, if the match symbol is set to false (or a Falsy
     * value), it indicates that the object is not intended to be used as a regular expression object.
     *
     * See: [Symbol.match](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/match)
     */
    match = 4,

    /**
     * The `Symbol.matchAll` well-known symbol returns an iterator, that yields matches of the regular
     * expression against a string. This function is called by the String.prototype.matchAll() method.
     *
     * See: [Symbol.matchAll](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/matchAll)
     */
    matchAll = 5,

    /**
     * The `Symbol.replace` well-known symbol specifies the method that replaces matched substrings
     * of a string. This function is called by the String.prototype.replace() method.
     *
     * For more information, [RegExp.prototype[Symbol.replace]](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp/\@\@replace)()
     * and [String.prototype.replace](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/replace)().
     *
     * See: [Symbol.replace](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/replace)
     */
    replace = 6,

    /**
     * The `Symbol.search` well-known symbol specifies the method that returns the index within a
     * string that matches the regular expression. This function is called by the
     * [String.prototype.search()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/search)
     * method.
     *
     * For more information, see [RegExp.prototype[\@\@search]](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp/\@\@search)()
     * and [String.prototype.search()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/search).
     *
     * See: [Symbol.species](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species)
     */
    search = 7,

    /**
     * The well-known symbol `Symbol.species` specifies a function-valued property that the constructor
     * function uses to create derived objects.
     * See: [Symbol.species](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species)
     */
    species = 8,

    /**
     * The `Symbol.split` well-known symbol specifies the method that splits a string at the indices
     * that match a regular expression. This function is called by the String.prototype.split() method.
     *
     * For more information, see [RegExp.prototype[\@\@split]](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp/\@\@split)()
     * and [String.prototype.split()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/split).
     * See: [Symbol.split](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/split)
     */
    split = 9,

    /**
     * With the help of the `Symbol.toPrimitive` property (used as a function value), an object can be
     * converted to a primitive value. The function is called with a string argument hint, which
     * specifies the preferred type of the result primitive value. The hint argument can be one of
     * "number", "string", and "default".
     *
     * See: [Symbol.toPrimitive](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)
     */
    toPrimitive = 10,

    /**
     * The `Symbol.toStringTag` well-known symbol is a string valued property that is used in the
     * creation of the default string description of an object. It is accessed internally by the
     * [Object.prototype.toString](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)()
     * method.
     *
     * See: [Symbol.toStringTag](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag)
     */
    toStringTag = 11,

    /**
     * The `Symbol.unscopables` well-known symbol is used to specify an object value of whose own
     * and inherited property names are excluded from the with environment bindings of the associated
     * object.
     *
     * See: [Symbol.unscopables](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/unscopables)
     */
    unscopables = 12
}

/**
 * @ignore
 * @internal
 */
export const _wellKnownSymbolMap = /*#__PURE__*/createEnumKeyMap<typeof WellKnownSymbols>({
    asyncIterator: WellKnownSymbols.asyncIterator,
    hasInstance: WellKnownSymbols.hasInstance,
    isConcatSpreadable: WellKnownSymbols.isConcatSpreadable,
    iterator: WellKnownSymbols.iterator,
    match: WellKnownSymbols.match,
    matchAll: WellKnownSymbols.matchAll,
    replace: WellKnownSymbols.replace,
    search: WellKnownSymbols.search,
    species: WellKnownSymbols.species,
    split: WellKnownSymbols.split,
    toPrimitive: WellKnownSymbols.toPrimitive,
    toStringTag: WellKnownSymbols.toStringTag,
    unscopables: WellKnownSymbols.unscopables
});

