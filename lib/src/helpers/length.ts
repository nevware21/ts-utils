/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { LENGTH } from "../internal/constants";
import { _unwrapProp } from "../internal/unwrapFunction";

/**
 * Interface to identify that an object contains the length property used as a type
 * constraint for {@link getLength}
 *
 * @since 0.4.2
 * @group String
 * @group Array
 * @group Object
 */
export interface IGetLength {

    /**
     * Identifies the property that returns the length of the instance
     */
    length: unknown;
}

/**
 * Helper to return the length value of an object, this will return the value
 * of the "length" property. Generally used to return the length of a string or array.
 *
 * @since 0.4.2
 * @group Array
 * @group String
 * @group String
 * @group Array
 * @group Object
 * @param value - The value to return the length property from, must contain a `length` property
 * @example
 * ```ts
 * getLength("");               // returns 0
 * getLength("Hello World");    // returns 11
 * getLength([]);               // returns 0;
 * getLength([0, 1, 2, 3]);     // returns 4;
 * getLength({ length: 42});    // returns 42
 * getLength({ length: () => 53; }); // returns the function that if called would return 53
 * ```
 */
export const getLength: <T extends IGetLength>(value: T) => T["length"] = (/*#__PURE__*/_unwrapProp<IGetLength>(LENGTH));
