/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ArrProto } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";

/**
 * The arrIndexOf() method returns the first index at which a given element can be found in the array,
 * or -1 if it is not present.
 * `arrIndexOf()` compares searchElement to elements of the Array using strict equality (the same
 * method used by the === or triple-equals operator).
 * @function
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array or array like object of elements to be searched.
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
 *
 * // Array Like
 * let arrayLike = {
 *   length: 3,
 *   0: "potato",
 *   1: "tomato",
 *   2: "chillies",
 *   3: "green-pepper"  // Not checked as index is > length
 * };
 *
 * arrIndexOf(arrayLike, "potato"); // 0
 * arrIndexOf(arrayLike, "tomato"); // 1
 * arrIndexOf(arrayLike, "chillies"); 2
 * arrIndexOf(arrayLike, "green-pepper"); // -1
 * ```
 */
export const arrIndexOf: <T>(theArray: ArrayLike<T>, searchElement: T, fromIndex?: number) => number = (/*#__PURE__*/_unwrapFunction("indexOf", ArrProto));

/**
 * The arrLastIndexOf() method returns the last index at which a given element can be found in the array,
 * or -1 if it is not present.
 * `arrLastIndexOf()` compares searchElement to elements of the Array using strict equality (the same
 * method used by the === or triple-equals operator). [NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)
 * values are never compared as equal, so arrLastIndexOf() always returns -1 when searchElement is NaN.
 *
 * The arrLastIndexOf() method skips empty slots in sparse arrays.
 *
 * The arrLastIndexOf() method is generic. It only expects the this value to have a length property and integer-keyed properties.
 *
 * @function
 * @since 0.8.0
 * @group Array
 * @group ArrayLike
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array or array like object of elements to be searched.
 * @param searchElement - The element to locate in the array.
 * @param fromIndex - Zero-based index at which to start searching backwards, converted to an integer.
 * - Negative index counts back from the end of the array — if fromIndex \< 0, fromIndex + array.length is used.
 * - If fromIndex \< -array.length, the array is not searched and -1 is returned. You can think of it conceptually
 * as starting at a nonexistent position before the beginning of the array and going backwards from there. There
 * are no array elements on the way, so searchElement is never found.
 * - If fromIndex \>= array.length or fromIndex is omitted, array.length - 1 is used, causing the entire array to
 * be searched. You can think of it conceptually as starting at a nonexistent position beyond the end of the array and going backwards from there. It eventually reaches the real end position of the array, at which point it starts searching backwards through the actual array elements.
 * @return The first index of the element in the array; -1 if not found.
 * @example
 * ```ts
 * const numbers = [2, 5, 9, 2];
 * arrLastIndexOf(numbers, 2); // 3
 * arrLastIndexOf(numbers, 7); // -1
 * arrLastIndexOf(numbers, 2, 3); // 3
 * arrLastIndexOf(numbers, 2, 2); // 0
 * arrLastIndexOf(numbers, 2, -2); // 0
 * arrLastIndexOf(numbers, 2, -1); // 3
 *
 * let indices: number[] = [];
 * const array = ["a", "b", "a", "c", "a", "d"];
 * const element = "a";
 * let idx = arrLastIndexOf(array, element);
 * while (idx !== -1) {
 *   indices.push(idx);
 *   idx = arrLastIndexOf(array, element, idx ? idx - 1 : -(array.length + 1));
 * }
 * console.log(indices);
 * // [4, 2, 0]
 *
 * function updateVegetablesCollection (veggies, veggie) {
 *     if (arrLastIndexOf(veggies, veggie) === -1) {
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
 *
 * // Array Like
 * let arrayLike = {
 *   length: 3,
 *   0: "potato",
 *   1: "tomato",
 *   2: "chillies",
 *   3: "green-pepper"  // Not checked as index is > length
 * };
 *
 * arrLastIndexOf(arrayLike, "potato"); // 0
 * arrLastIndexOf(arrayLike, "tomato"); // 1
 * arrLastIndexOf(arrayLike, "chillies"); 2
 * arrLastIndexOf(arrayLike, "green-pepper"); // -1
 * ```
 */
export const arrLastIndexOf: <T>(theArray: ArrayLike<T>, searchElement: T, fromIndex?: number) => number = (/*#__PURE__*/_unwrapFunction("lastIndexOf", ArrProto));