/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ObjClass } from "../internal/constants";
import { isFunction, isStrictUndefined } from "../helpers/base";
import { objForEachKey } from "./for_each_key";
import { ILazyValue } from "../helpers/lazy";
import { objGetOwnPropertyDescriptor } from "./get_own_prop_desc";
import { _pureRef } from "../internal/treeshake_helpers";

/**
 * Definition of the Property Descriptor mappings for the objDefine functions.
 * If a descriptor has neither of value, writable, get and set keys, it is treated as a data descriptor.
 * If a descriptor has both [value or writable] and [get or set] keys, an exception is thrown.
 * Bear in mind that these attributes are not necessarily the descriptor's own properties. Inherited
 * properties will be considered as well. In order to ensure these defaults are preserved, you might
 * freeze existing objects in the descriptor object's prototype chain upfront, specify all options
 * explicitly, or point to null with {@link objCreate}(null).
 * @since 0.6.0
 * @group Object
 */
export interface ObjDefinePropDescriptor<V = any> {
    /**
     * Identifies if this property should be configurable (true) when this value is set to false,
     * - the type of this property cannot be changed between data property and accessor property, and
     * - the property may not be deleted, and
     * - other attributes of its descriptor cannot be changed (however, if it's a data descriptor with writable: true,
     * the value can be changed, and writable can be changed to false).
     * Defaults to true.
     */
    c?: boolean;

    /**
     * Identifies if this property will be visible during enumeration of the properties on the corresponding object.
     * Defaults to true.
     */
    e?: boolean;

    /**
     * __data descriptor__
     * The value associated with the property. Can be any valid JavaScript value (number, object, function, etc.).
     * Defaults to undefined.
     */
    v?: V;

    /**
     * A Lazy value instance which will be used to return the value, this will be wrapped in a getter function.
     * @since 0.9.4
     */
    l?: ILazyValue<V>;

    /**
     * true if the value associated with the property may be changed with an assignment operator. Defaults to false.
     */
    w?: boolean;

    /**
     * A function which serves as a getter for the property, or undefined if there is no getter. When the property
     * is accessed, this function is called without arguments and with this set to the object through which the
     * property is accessed (this may not be the object on which the property is defined due to inheritance). The
     * return value will be used as the value of the property. Defaults to undefined.
     */
    g?(): V;

    /**
     * A function which serves as a setter for the property, or undefined if there is no setter. When the property
     * is assigned, this function is called with one argument (the value being assigned to the property) and with
     * this set to the object through which the property is assigned. Defaults to undefined.
     * @param value - The value to set the property to.
     */
    s?(value: V): void;
}

/**
 * An object whose keys represent the names of properties to be defined or modified and whose values are objects
 * describing those properties. Each value in props must be either a data descriptor or an accessor descriptor;
 * it cannot be both (see {@link ObjDefinePropDescriptor} for more details).
 * @since 0.6.0
 * @group Object
 */
export type ObjDefinePropDescriptorMap = {
    [key: PropertyKey]: ObjDefinePropDescriptor
};

/**
 * @internal
 * @ignore
 * Mapping from ObjDefinePropDescriptor key to PropertyDescriptor key
 */
const propMap: { [key in keyof ObjDefinePropDescriptor]: keyof PropertyDescriptor } = {
    e: "enumerable",
    c: "configurable",
    v: "value",
    w: "writable",
    g: "get",
    s: "set"
};

/**
 * @internal
 * @ignore
 * Helper to convert ObjDefinePropDescriptor into PropertyDescriptor
 * @param value - The prop descriptor to convert
 * @returns
 */
/*#__NO_SIDE_EFFECTS__*/
function _createProp(value: ObjDefinePropDescriptor): PropertyDescriptor {
    let prop: PropertyDescriptor = {};
    prop[propMap["c"]] = true;
    prop[propMap["e"]] = true;

    if (value.l) {
        // Asign a getter function to return the value when requested
        prop.get = () => value.l.v;

        // If it has a setter then expose it as well
        let desc = objGetOwnPropertyDescriptor(value.l, "v");
        if (desc && desc.set) {
            prop.set = (newValue: any) => {
                value.l.v = newValue;
            };
        }
    }

    objForEachKey(value, (key: keyof ObjDefinePropDescriptor, value) => {
        prop[propMap[key]] = isStrictUndefined(value) ? prop[propMap[key]] : value;
    });

    return prop;
}

/**
 * Defines a new property directly on an object, or modifies an existing property on an object, and returns the object.
 * This is a wrapper for [Object.defineProperty](https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/object/defineproperty)
 *
 * This method allows a precise addition to or modification of a property on an object. Normal property addition through
 * assignment creates properties which show up during property enumeration (for...in loop or objKeys method), whose
 * values may be changed, and which may be deleted. This method allows these extra details to be changed from their
 * defaults. By default, properties added using objDefineProp() are not writable, not enumerable, and not configurable.
 *
 * Property descriptors present in objects come in two main flavors: data descriptors and accessor descriptors. A data
 * descriptor is a property that has a value, which may or may not be writable. An accessor descriptor is a property
 * described by a getter-setter pair of functions. A descriptor must be one of these two flavors; it cannot be both.
 *
 * This is an alias for Object.defineProperty
 * @group Object
 * @param target - The object on which to define the property.
 * @param key - The name or Symbol of the property to be defined or modified.
 * @param descriptor - The descriptor for the property being defined or modified.
 * @returns The object that was passed to the function with the new or updated property.
 */
export const objDefineProp: <T>(target: T, key: PropertyKey, descriptor: PropertyDescriptor & ThisType<any>) => T = (/*#__PURE__*/_pureRef<typeof Object.defineProperty>(ObjClass as any, "defineProperty"));

/**
 * The objDefineProperties() method defines new or modifies existing properties directly on an object, returning the object.
 * This is a wrapper for [Object.defineProperties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)
 * @since 0.6.0
 * @group Object
 * @param target - The object on which to define or modify properties.
 * @param props - An object whose keys represent the names of properties to be defined or modified and whose values are
 * objects describing those properties. Each value in props must be either a data descriptor or an accessor descriptor;
 * it cannot be both (see {@link ObjDefinePropDescriptorMap} for more details).
 * @returns
 */
export const objDefineProperties: <T>(target: T, props: PropertyDescriptorMap & ThisType<any>) => T = (/*#__PURE__*/_pureRef<typeof Object.defineProperties>(ObjClass as any, "defineProperties"));

/**
 * Try to define a get object property accessor for the target object, if a function is past as the value this will
 * be assumed to be a getter function and NOT the value.
 * @deprecated It is recommended that you use {@link objDefine} instead {@link objDefineGet} or {@link objDefineAccessors}
 * as it provides a deterministic way for identifying whether the value is a value or a function rather than wrapping any
 * function value in another function.
 * @group Object
 * @param target - The object on which to define the property.
 * @param key - The name of the property to be defined or modified
 * @param value - The value or a function that returns the value
 * @param configurable - Can the value be changed, defaults to true.
 * @param enumerable - Should this get property be enumerable, defaults to true.
 * @returns The object that was passed to the function
 */
export function objDefineGet<T, V = any>(target: T, key: PropertyKey, value: (() => V) | V, configurable?: boolean, enumerable?: boolean): T {
    return objDefineProp(target, key, _createProp({
        e: enumerable,
        c: configurable,
        [isFunction(value) ? "g" : "v"]: value
    }));
}

/**
 * Try to define get/set object property accessors for the target object/prototype, this will provide compatibility with
 * existing API definition when run within an ES5+ container that supports accessors but still enable the code to be loaded
 * and executed in an ES3 container, providing basic IE8 compatibility.
 * @deprecated It is recommended that you use {@link objDefine} instead {@link objDefineAccessors} as this internally creates
 * the {@link ObjDefinePropDescriptor} definition based on your provided arguments. And only using a minimum set of functions
 * reduces your overall bundle size.
 * @group Object
 * @param target - The object on which to define the property.
 * @param prop - The name of the property to be defined or modified.
 * @param getProp - The getter function to wire against the getter.
 * @param setProp - The setter function to wire against the setter.
 * @param configurable - Can the value be changed, defaults to true
 * @param enumerable - Should this get property be enumerable, defaults to true.
 * @returns The object that was passed to the function
 */
export function objDefineAccessors<T, V = any>(target: T, prop: PropertyKey, getProp?: (() => V) | null, setProp?: ((v: V) => void) | null, configurable?: boolean, enumerable?: boolean): T {
    let desc: ObjDefinePropDescriptor = {
        e: enumerable,
        c: configurable
    };

    if (getProp) {
        desc.g = getProp;
    }

    if (setProp) {
        desc.s = setProp;
    }
    
    return objDefineProp(target, prop, _createProp(desc));
}

/**
 * The objDefine() method defines a new or modifies an existing single property accessors for the target object based
 * on the configuration defined for the propDesc argument of type {@link ObjDefinePropDescriptor}. This will call
 * {@link objDefineProp} after creating the required PropertyDescriptor populating defaults for the propDesc values.
 * Note, the default values (true) for `configurable` and `enumerable` are different from the defaults provided by objDefineProp.
 * @since 0.6.0
 * @group Object
 * @param target - The object on which to define the property.
 * @param key - The name of the property to be defined or modified
 * @param propDesc - An object which defines the Property Descriptor mappings for the mapping.
 * @returns The target object.
 */
export function objDefine<T>(target: T, key: keyof T, propDesc: ObjDefinePropDescriptor): T {
    return objDefineProp(target, key, _createProp(propDesc));
}

/**
 * The objDefineProps() method defines new or modifies existing properties directly for the target object using the keys
 * and configuration from the propDescMap argument. This will call {@link objDefineProperties} after creating the required
 * PropertyDescriptorMap from the propDescMap values.
 * Note, the default values (true) for `configurable` and `enumerable` are different from the defaults provided by objDefineProperties.
 * @since 0.6.0
 * @group Object
 * @param target - The object on which to define or modify properties.
 * @param propDescMap - An object whose keys represent the names of properties to be defined or modified and whose values are
 * objects describing those properties. Each value in props must be either a data descriptor or an accessor descriptor;
 * it cannot be both (see {@link ObjDefinePropDescriptorMap} for more details).
 * @returns The target object.
 */
export function objDefineProps<T>(target: T, propDescMap: ObjDefinePropDescriptorMap) {
    let props: PropertyDescriptorMap = {};

    objForEachKey(propDescMap, (key, value: ObjDefinePropDescriptor) => {
        props[key] = _createProp(value);
    });

    return objDefineProperties(target, props);
}
