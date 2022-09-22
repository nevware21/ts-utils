/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { isArray, isNullOrUndefined, isObject } from "../helpers/base";

interface _DeepCopyContext {
    handler: ObjDeepCopyHandlerHandler;
    src: any;
    path?: Array<string | number | symbol>;
}

interface _RecursiveVisitMap {
    k: any;
    v: any;
}

function _getSetVisited<T>(visitMap: _RecursiveVisitMap[], source: any, target: T, ctx: _DeepCopyContext, newPath: Array<string | number | symbol>, cb: (target: T, ctx?: _DeepCopyContext) => any) {
    let result: _RecursiveVisitMap;
    arrForEach(visitMap, (entry) => {
        if (entry.k === source) {
            result = entry;
            return -1;
        }
    });

    if (!result) {
        // Add the target to the visit map so that deep nested objects refer to the single instance
        // Even if we have not finished processing it yet.
        result = { k: source, v: target }
        visitMap.push(result);

        let newCtx: _DeepCopyContext;
        if (ctx && ctx.handler) {
            newCtx = {
                handler: ctx.handler,
                src: ctx.src,
                path: newPath
            }
        }

        // Now call the copy callback so that it populates the target
        cb(target, newCtx);
    }

    return result.v;
}

function _deepCopy<T>(visitMap: _RecursiveVisitMap[], value: T, ctx?: _DeepCopyContext, key?: string | number | symbol): T {
    let newPath: Array<string | number | symbol>;
    if (ctx && ctx.handler) {
        newPath = ctx.path ? ctx.path.concat(key) : [];
        let details = {
            value: value,
            path: newPath,
            origin: ctx.src
        };

        if(ctx.handler(details)) {
            return details.value;
        }
    }

    if (isArray(value)) {
        return _getSetVisited(visitMap, value, [], ctx, newPath, (result, newCtx) => {
            
            arrForEach(value, (theValue, idx) => {
                result[idx] = _deepCopy(visitMap, theValue, newCtx, idx);
            });
    
            return <any>result;
        });
    }

    if (isObject(value)) {
        return _getSetVisited(visitMap, value, {} as T, ctx, newPath, (target, newCtx) => {
            return _copyProps<T>(visitMap, target, value, newCtx);
        });
    }

    return value;
}

function _copyProps<T>(visitMap: _RecursiveVisitMap[], target: T, source: T, ctx?: _DeepCopyContext) {
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
 * Context details passed to the deep copy handler to allow it parse the current value based on the original source
 * and path to reach the current value. The provided value should be updated with the value to by copied into the
 * new deep copy and will be used when the handler returns true.
 * @since 0.4.4
 * @group Object
 */
export interface IObjDeepCopyHandlerDetails {
    /**
     * The current value to be processed, replace this value with the new deep copied value to use when returning
     * true from the handler. Ignored when the handler returns false.
     */
    value: any;

    /**
     * A array of keys from the orginal source (origin) object which lead to the current value
     */
    path: Array<string | number | symbol>;

    /**
     * The original source object passed into the `objDeepCopy()` or `objCopyProps()` functions.
     */
    origin?: any;
}

/**
 * An optional deep copy handler that lets you provide your own logic for deep copying objects, will
 * only be called once per object/property combination, so if an object is recursively included it
 * will only get called for the first instance.
 * @since 0.4.4
 * @group Object
 * @return true if handled and the value in details should be used otherwise false to continue with the default handling
 */
export type ObjDeepCopyHandlerHandler = (details: IObjDeepCopyHandlerDetails) => boolean;

/**
 * Performs a deep copy of the source object, this is designed to work with base objects, arrays and primitives
 * if the source object contains class objects they should be considered non-operational after performing a deep
 * copy. ie. This is performing a deep copy of the objects properties so that altering the copy will not mutate
 * the source object hierarchy. Automatic handling of recursive properties was added in v0.4.4.
 * @group Object
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
export function objDeepCopy<T>(source: T, handler?: ObjDeepCopyHandlerHandler): T {
    let ctx: _DeepCopyContext;
    if (handler) {
        ctx = {
            handler: handler,
            src: source
        }
    }

    return _deepCopy([], source, ctx);
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
export function objCopyProps<T>(target: T, source: any, handler?: ObjDeepCopyHandlerHandler) {
    let ctx: _DeepCopyContext;
    if (handler) {
        ctx = {
            handler: handler,
            src: source,
            path: []
        }
    }

    return _copyProps([], target, source, ctx);
}
