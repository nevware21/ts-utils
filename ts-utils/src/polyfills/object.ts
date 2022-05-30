import { arrForEach } from "../helpers/array";
import { isFunction, isObject } from "../helpers/base";
import { objHasOwnProperty } from "../helpers/object";

/**
 * Returns the names of the enumerable string properties and methods of an object. This helper exists to avoid adding a polyfil for older browsers
 * that do not define Object.keys eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
 * Note: For consistency this will not use the Object.keys implementation if it exists as this would cause a testing requirement to test with and without the implementations
 * @param obj Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
 */
export function _polyObjKeys(obj: any): string[] {
    // eslint-disable-next-line no-prototype-builtins
    const hasDontEnumBug = !({ toString: null }).propertyIsEnumerable("toString");

    if (!isFunction(obj) && (!isObject(obj) || obj === null)) {
        throw new TypeError("objKeys called on non-object");
    }

    const result: string[] = [];
    for (const prop in obj) {
        if (objHasOwnProperty(obj, prop)) {
            result.push(prop);
        }
    }

    if (hasDontEnumBug) {
        const dontEnums: string[] = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ];

        arrForEach(dontEnums, (value) => {
            if (objHasOwnProperty(obj, value)) {
                result.push(value);
            }
        });
    }

    return result;
}

