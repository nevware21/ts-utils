/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2024 Nevware21
 * Licensed under the MIT license.
 */

/**
 * @internal
 * @ignore
 * Internal tree shaking helper to return the first available function from the two provided.
 * This is required to ensure that tree-shaking can remove any unused functions as this ensures
 * that the alias assignments are not considered side-effects and are tagged correctly as pure.
 * @param func1 - The system function to use if available
 * @param func2 - The polyfill function to use if the static function is not available
 * @returns The first available function from the two provided
 */
/*#__NO_SIDE_EFFECTS__*/
export function _pureAssign<F>(func1: F, func2?: F): F {
    return func1 || func2;
}

/**
 * @internal
 * @ignore
 * Internal tree shaking helper to return the value of the named property from the provided object.
 * By using this helper, we can explicitly tell the tree-shaking tool that this function is pure and
 * has no side effects. As some tree-shaking tools may not be able to determine this automatically.
 * @param value - The object to get the property value from
 * @param name - The name of the property to get the value of
 * @returns The value of the named property from the provided object
 */
/*#__NO_SIDE_EFFECTS__*/
export function _pureRef<R extends T[keyof T], T = any>(value: T, name: keyof T): R {
    return value[name] as R;
}