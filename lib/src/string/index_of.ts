/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { StrProto } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";

/**
 * The `strIndexOf()` method, given two arguments: the string and a substring to search for, searches
 * the entire calling string, and returns the index of the first occurrence of the specified substring.
 * Given a thrid argument: a number, the method returns the first occurrence of the specified substring
 * at an index greater than or equal to the specified number.
 * @group String
 * @param value - The value to be checked for the seeach string
 * @param searchString - The substring to search for in the value
 * @param position - The starting position to search from
 * @example
 * ```ts
 * strIndexOf('hello world', '') // returns 0
 * strIndexOf('hello world', '', 0) // returns 0
 * strIndexOf('hello world', '', 3) // returns 3
 * strIndexOf('hello world', '', 8) // returns 8
 *
 * // However, if the thrid argument is greater than the length of the string
 * strIndexOf('hello world', '', 11) // returns 11
 * strIndexOf('hello world', '', 13) // returns 11
 * strIndexOf('hello world', '', 22) // returns 11
 *
 * strIndexOf('Blue Whale', 'Blue')      // returns  0
 * strIndexOf('Blue Whale', 'Blute')     // returns -1
 * strIndexOf('Blue Whale', 'Whale', 0)  // returns  5
 * strIndexOf('Blue Whale', 'Whale', 5)  // returns  5
 * strIndexOf('Blue Whale', 'Whale', 7)  // returns -1
 * strIndexOf('Blue Whale', '')          // returns  0
 * strIndexOf('Blue Whale', '', 9)       // returns  9
 * strIndexOf('Blue Whale', '', 10)      // returns 10
 * strIndexOf('Blue Whale', '', 11)      // returns 10
 * ```
 */
export const strIndexOf: (value: string, searchString: string, position?: number) => number = (/*#__PURE__*/_unwrapFunction("indexOf", StrProto));

/**
 * The `strLastIndexOf()` method, given two arguments: the string and a substring to search for, searches
 * the entire calling string, and returns the index of the last occurrence of the specified substring.
 * Given a third argument: a number, the method returns the last occurrence of the specified substring
 * at an index less than or equal to the specified number.
 * @group String
 * @param value - The value to be checked for the seeach string
 * @param searchString - The substring to search for in the value
 * @param position - The starting position to search from
 * @example
 * ```ts
 * strLastIndexOf('canal', 'a');     // returns 3
 * strLastIndexOf('canal', 'a', 2);  // returns 1
 * strLastIndexOf('canal', 'a', 0);  // returns -1
 * strLastIndexOf('canal', 'x');     // returns -1
 * strLastIndexOf('canal', 'c', -5); // returns 0
 * strLastIndexOf('canal', 'c', 0);  // returns 0
 * strLastIndexOf('canal', '');      // returns 5
 * strLastIndexOf('canal', '', 2);   // returns 2
 * ```
 */
export const strLastIndexOf: (value: string, searchString: string, position?: number) => number = (/*#__PURE__*/_unwrapFunction("lastIndexOf", StrProto));
