/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { isArray, isDate, isNullOrUndefined, isPrimitive } from "../helpers/base";
import { FUNCTION } from "../internal/constants";
import { objDefineAccessors } from "./define";
import { isPlainObject } from "./is_plain_object";

/**
 * @internal
 * @ignore
 * Provides the current context while performing a deep copy
 */
interface _DeepCopyContext {
    handler: ObjDeepCopyHandler;
    src: any;
    path?: Array<string | number | symbol>;
}

/**
 * @internal
 * @ignore
 * Defines the type used for tracking visited objects during deep copy to identify recursive
 * objects.
 */
interface _RecursiveVisitMap {
    k: any;
    v: any;
}

/**
 * @internal
 * @ignore
 * Generic Object deep copy handler which creates a new plain object and copies enumerable properties from
 * the source to the new target plain object. The source object does not have to be a plain object.
 * @param details - The details object for the current property being copied
 * @returns true if the handler processed the field.
 */
function _defaultDeepCopyHandler(details: IObjDeepCopyHandlerDetails): boolean {
    let target = details.result = {};
    details.copyTo(target, details.value);
    return true;
}

/**
 * @internal
 * @ignore
 * The ordered default deep copy handlers
 */
const defaultDeepCopyHandlers: ObjDeepCopyHandler[] = [
    arrayDeepCopyHandler,
    plainObjDeepCopyHandler,
    functionDeepCopyHandler,
    dateDeepCopyHandler
];

/**
 * @internal
 * @ignore
 * Helper function used for detecting and handling recursive properties
 * @param visitMap - The current map of objects that have been visited
 * @param source - The value (object) to be copied
 * @param newPath - The new access path from the origin to the current property
 * @param cb - The callback function to call if the current object has not already been processed.
 * @returns The new deep copied property, may be incomplete as the object is recursive and is still in the process of being copied
 */
function _getSetVisited(visitMap: _RecursiveVisitMap[], source: any, newPath: Array<string | number | symbol>, cb: (newEntry: _RecursiveVisitMap) => void) {
    let theEntry: _RecursiveVisitMap;
    arrForEach(visitMap, (entry) => {
        if (entry.k === source) {
            theEntry = entry;
            return -1;
        }
    });

    if (!theEntry) {
        // Add the target to the visit map so that deep nested objects refer to the single instance
        // Even if we have not finished processing it yet.
        theEntry = { k: source, v: source };
        visitMap.push(theEntry);

        // Now call the copy callback so that it populates the target
        cb(theEntry);
    }

    return theEntry.v;
}

/**
 * @internal
 * @ignore
 * Internal helper which performs the recursive deep copy
 * @param visitMap - The current map of objects that have been visited
 * @param value - The value being copied
 * @param ctx - The current copy context
 * @param key - [Optional] the current `key` for the value from the source object
 * @returns The new deep copied instance of the value.
 */
function _deepCopy<T>(visitMap: _RecursiveVisitMap[], value: T, ctx: _DeepCopyContext, key?: string | number | symbol): T {
    let userHandler = ctx.handler;
    let newPath = ctx.path ? (key ? ctx.path.concat(key) : ctx.path) : [];

    let newCtx: _DeepCopyContext = {
        handler: ctx.handler,
        src: ctx.src,
        path: newPath
    };

    let details: IObjDeepCopyHandlerDetails = {
        type: typeof value,
        isPrim: isPrimitive(value),
        value: value,
        result: value,
        path: newPath,
        origin: ctx.src,
        copy: <T>(source: T, newKey?: string | number | symbol): T => {
            return _deepCopy(visitMap, source, newKey ? newCtx : ctx, newKey);
        },
        copyTo: <T>(target: T, source: T): T => {
            return _copyProps(visitMap, target, source, newCtx);
        }
    };

    if (!details.isPrim) {
        return _getSetVisited(visitMap, value, newPath, (newEntry) => {

            // Use an accessor to set the new value onto the new entry
            objDefineAccessors(details, "result",
                function () {
                    return newEntry.v;
                },
                function (newValue: any) {
                    newEntry.v = newValue;
                },
                true);

            let idx = 0;
            let handler = userHandler;
            while (!(handler || (idx < defaultDeepCopyHandlers.length ? defaultDeepCopyHandlers[idx++] : _defaultDeepCopyHandler)).call(ctx, details)) {
                handler = null;
            }
        });
    }

    // Allow the user handler to override the provided value
    if (userHandler && userHandler.call(ctx, details)) {
        return details.result;
    }

    return value;
}

/**
 * @internal
 * @ignore
 * Internal helper to copy all of the enumerable properties from the source object to the new target object
 * @param visitMap - The current map of objects that have been visited
 * @param target - The target object to copy the properties to.
 * @param source - The source object to copy the properties from.
 * @param ctx - The current deep copy context
 * @returns The populated target object
 */
function _copyProps<T>(visitMap: _RecursiveVisitMap[], target: T, source: T, ctx: _DeepCopyContext) {
    if (!isNullOrUndefined(source)) {
        // Copy all properties (not just own properties)
        for (const key in source) {
            // Perform a deep copy of the object
            target[key] = _deepCopy(visitMap, source[key], ctx, key);
        }
    }

    return target;
}

/**
 * Object helper to copy all of the enumerable properties from the source object to the target, the
 * properties are copied via {@link objDeepCopy}. Automatic handling of recursive properties was added in v0.4.4
 * @group Object
 * @param target - The target object to populated
 * @param source - The source object to copy the properties from
 * @param handler - An optional callback that lets you provide / overide the deep cloning (Since 0.4.4)
 * @returns The target object
 * @example
 * ```ts
 * let a: any = { a: 1 };
 * let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
 * a.b = b;        // { a: 1, b: { b: 2} }
 * b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}
 *
 * function copyHandler(details: IObjDeepCopyHandlerDetails) {
 *     // details.origin === a
 *     // details.path[] is the path to the current value
 *     if (details.value && isDate(details.value)) {
 *         // So for the date path === [ "b", "d" ] which represents
 *         // details.origin["b"]["d"] === The Date
 *
 *         // Create a clone the Date object and set as the "newValue"
 *         details.value = new Date(details.value.getTime());
 *
 *         // Return true to indicate that we have "handled" the conversion
 *         // See objDeepCopy example for just reusing the original value (just don't replace details.value)
 *         return true;
 *     }
 *
 *     return false;
 * }
 *
 * let c: any = objCopyProps({}, a, copyHandler);
 *
 * assert.notEqual(a, c, "check a and c are not the same");
 * assert.ok(c !== c.b.a, "The root object won't be the same for the target reference as are are copying properties to our target");
 * assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
 * assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
 * assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
 * assert.ok(isDate(c.b.d), "The copied date is still real 'Date' instance");
 * assert.notEqual(c.b.d, a.b.d, "And the copied date is not the same as the original");
 * assert.equal(c.b.d.getTime(), a.b.d.getTime(), "But the dates are the same");
 *
 * assert.ok(isObject(c.b.d), "The copied date is now an object");
 * ```
 */
export function objCopyProps<T>(target: T, source: any, handler?: ObjDeepCopyHandler) {
    let ctx: _DeepCopyContext = {
        handler: handler,
        src: source,
        path: []
    };

    return _copyProps([], target, source, ctx);
}

/**
 * Context details passed to the deep copy handler to allow it parse the current value based on the original source
 * and path to reach the current value. The provided value should be updated with the value to by copied into the
 * new deep copy and will be used when the handler returns true.
 * @since 0.4.4
 * @group Object - Deep Copy
 */
export interface IObjDeepCopyHandlerDetails {
    /**
     * Identifies the type of the value as per `typeof value`, saves each check having to process this value.
     */
    type: string;

    /**
     * Identifies whether the type of the value is considered to be a primitive value
     */
    isPrim: boolean;

    /**
     * The current value to be processed, replace this value with the new deep copied value to use when returning
     * true from the handler. Ignored when the handler returns false.
     */
    readonly value: any;

    /**
     * Replace this value with the new deep copied value (defaults to the same as the value property) this value will be
     * used when returning true from the handler. Ignored when the handler returns false.
     */
    result: any;

    /**
     * A array of keys from the orginal source (origin) object which lead to the current value
     */
    path: Array<string | number | symbol>;

    /**
     * The original source object passed into the `objDeepCopy()` or `objCopyProps()` functions.
     */
    origin?: any;

    /**
     * Continue the deep copy with the current context and recursive checks, effectively calls {@link objDeepCopy}
     * but keeps the current context and recursive references.
     * @param source - The source object to be copied
     */
    copy<T>(source: T, key?: string | number | symbol): T;

    /**
     * Continue the deep copy with the current context and recursive checks by copying all of the properties
     * from the source to the target instance, effectively calls {@link objCopyProps} but keeps the current context
     * and recursive references.
     * @param target - The target object to populated
     * @param source - The source object to copy the properties from
     */
    copyTo<T>(target: T, source: T): T;
}

/**
 * An optional deep copy handler that lets you provide your own logic for deep copying objects, will
 * only be called once per object/property combination, so if an object is recursively included it
 * will only get called for the first instance.
 * Handlers SHOULD assign the "result" value with the new target instance BEFORE performing any additional deep copying,
 * so any recursive objects will get a reference to the new instance and not keep attempting to create new copies.
 * @since 0.4.4
 * @group Object - Deep Copy
 * @return true if handled and the value in details should be used otherwise false to continue with the default handling
 * The library includes several helpers which can be reused by any user provided handler
 * - {@link functionDeepCopyHandler} - Used to copy functions
 * - {@link arrayDeepCopyHandler} - Used to copy arrays
 * - {@link plainObjDeepCopyHandler} - Used to copy plain objects
 * - {@link dateDeepCopyHandler} - Used to copy date instances
 */
export type ObjDeepCopyHandler = (details: IObjDeepCopyHandlerDetails) => boolean;

/**
 * Performs a deep copy of the source object, this is designed to work with base objects, arrays and primitives
 * if the source object contains class objects they should be considered non-operational after performing a deep
 * copy. ie. This is performing a deep copy of the objects properties so that altering the copy will not mutate
 * the source object hierarchy. Automatic handling of recursive properties was added in v0.4.4.
 * @group Object
 * @group Object - Deep Copy
 * @param source - The source object to be copied
 * @param handler - An optional callback that lets you provide / overide the deep cloning (Since 0.4.4)
 * @return A new object which contains a deep copy of the source properties
 * @example
 * ```ts
 * let a: any = { a: 1 };
 * let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
 * a.b = b;        // { a: 1, b: { b: 2} }
 * b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}
 *
 * function copyHandler(details: IObjDeepCopyHandlerDetails) {
 *     // details.origin === a
 *     // details.path[] is the path to the current value
 *     if (details.value && isDate(details.value)) {
 *         // So for the date path === [ "b", "d" ] which represents
 *         // details.origin["b"]["d"] === The Date
 *
 *         // Return true to indicate that we have "handled" the conversion
 *         // Which in this case will reuse the existing instance (as we didn't replace details.value)
 *         // See objCopyProps example for replacing the Date instance
 *         return true;
 *     }
 *
 *     return false;
 * }
 *
 * let c: any = objDeepCopy(a, copyHandler);
 *
 * assert.notEqual(a, c, "check a and c are not the same");
 * assert.ok(c === c.b.a, "The root object won't be the same for the target reference");
 * assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
 * assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
 * assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
 * assert.ok(isDate(c.b.d), "The copied date is still real 'Date' instance");
 * assert.equal(c.b.d, a.b.d, "And the copied date is the original date");
 * assert.equal(c.b.d.getTime(), a.b.d.getTime(), "But the dates are the same");
 * assert.ok(isObject(c.b.d), "The copied date is now an object");
 * assert.ok(!isError(c.b.e), "The copied error is no longer a real 'Error' instance");
 * assert.ok(isObject(c.b.e), "The copied error is now an object");
 * assert.equal(42, c.b.e.value, "Expect that the local property was copied");
 * ```
 */
export function objDeepCopy<T>(source: T, handler?: ObjDeepCopyHandler): T {
    let ctx: _DeepCopyContext = {
        handler: handler,
        src: source
    };

    return _deepCopy([], source, ctx);
}

/**
 * Deep copy handler to identify and copy arrays.
 * @since 0.4.4
 * @group Object - Deep Copy
 * @param details - The details object for the current property being copied
 * @returns `true` if the current value is a function otherwise `false`
 */
export function arrayDeepCopyHandler(details: IObjDeepCopyHandlerDetails): boolean {
    let value = details.value;
    if (isArray(value)) {
        // Assign the "result" value before performing any additional deep Copying, so any recursive object get a reference to this instance
        let target: any[] = details.result = [];
        target.length = value.length;

        // Copying all properties as arrays can contain non-indexed based properties
        details.copyTo(target, value);
        return true;
    }

    return false;
}

/**
 * Deep copy handler to identify and copy Date instances.
 * @since 0.4.4
 * @group Object - Deep Copy
 * @param details - The details object for the current property being copied
 * @returns `true` if the current value is a function otherwise `false`
 */
export function dateDeepCopyHandler(details: IObjDeepCopyHandlerDetails) {
    let value = details.value;
    if (isDate(value)) {
        details.result = new Date(value.getTime());
        return true;
    }

    return false;
}

/**
 * Deep copy handler to identify and copy functions. This handler just returns the original
 * function so the original function will be assigned to any new deep copied instance.
 * @since 0.4.4
 * @group Object - Deep Copy
 * @param details - The details object for the current property being copied
 * @returns `true` if the current value is a function otherwise `false`
 */
export function functionDeepCopyHandler(details: IObjDeepCopyHandlerDetails): boolean {
    if (details.type === FUNCTION) {
        return true;
    }

    return false;
}

/**
 * Deep copy handler to identify and copy plain objects.
 * @since 0.4.4
 * @group Object - Deep Copy
 * @param details - The details object for the current property being copied
 * @returns `true` if the current value is a function otherwise `false`
 */
export function plainObjDeepCopyHandler(details: IObjDeepCopyHandlerDetails): boolean {
    let value = details.value;
    if (isPlainObject(value)) {
        // Assign the "result" value before performing any additional deep Copying, so any recursive object get a reference to this instance
        let target = details.result = {};
        details.copyTo(target, value);
        return true;
    }

    return false;
}
