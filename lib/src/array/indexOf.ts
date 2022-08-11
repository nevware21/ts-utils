/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { INDEX_OF } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";

/**
 * The arrIndexOf() method returns the first index at which a given element can be found in the array,
 * or -1 if it is not present.
 * `arrIndexOf()` compares searchElement to elements of the Array using strict equality (the same
 * method used by the === or triple-equals operator).
 * @group Array
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array of elements to be searched
 * @param searchElement - The element to locate in the array.
 * @param fromIndex - The index to start the search at. If the index is greater than or equal to
 * the array's length, -1 is returned, which means the array will not be searched. If the provided
 * index value is a negative number, it is taken as the offset from the end of the array.
 * Note: if the provided index is negative, the array is still searched from front to back. If the
 * provided index is 0, then the whole array will be searched. Default: 0 (entire array is searched).
 * @return The first index of the element in the array; -1 if not found.
 * @example
 * ```ts
 * const array = [2, 9, 9];
 * arrIndexOf(array, 2);     // 0
 * arrIndexOf(array, 7);     // -1
 * arrIndexOf(array, 9, 2);  // 2
 * arrIndexOf(array, 2, -1); // -1
 * arrIndexOf(array, 2, -3); // 0
 *
 * let indices: number[] = [];
 * const array = ['a', 'b', 'a', 'c', 'a', 'd'];
 * const element = 'a';
 * let idx = arrIndexOf(array, element);
 * while (idx !== -1) {
 *   indices.push(idx);
 *   idx = arrIndexOf(array, element, idx + 1);
 * }
 * console.log(indices);
 * // [0, 2, 4]
 *
 * function updateVegetablesCollection (veggies, veggie) {
 *     if (arrIndexOf(veggies, veggie) === -1) {
 *         veggies.push(veggie);
 *         console.log('New veggies collection is : ' + veggies);
 *     } else {
 *         console.log(veggie + ' already exists in the veggies collection.');
 *     }
 * }
 *
 * let veggies = ['potato', 'tomato', 'chillies', 'green-pepper'];
 *
 * updateVegetablesCollection(veggies, 'spinach');
 * // New veggies collection is : potato,tomato,chillies,green-pepper,spinach
 * updateVegetablesCollection(veggies, 'spinach');
 * // spinach already exists in the veggies collection.
 * ```
 */
export const arrIndexOf: <T>(theArray: T[], searchElement: T, fromIndex?: number) => number = _unwrapFunction(INDEX_OF);
