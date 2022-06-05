[@nevware21/ts-utils](../README.md) / helpers/base

# Module: helpers/base

## Table of contents

### Variables

- [ObjClass](helpers_base.md#objclass)
- [ObjProto](helpers_base.md#objproto)

### Functions

- [isArray](helpers_base.md#isarray)
- [isArrayBuffer](helpers_base.md#isarraybuffer)
- [isBlob](helpers_base.md#isblob)
- [isBoolean](helpers_base.md#isboolean)
- [isDate](helpers_base.md#isdate)
- [isDefined](helpers_base.md#isdefined)
- [isError](helpers_base.md#iserror)
- [isFile](helpers_base.md#isfile)
- [isFormData](helpers_base.md#isformdata)
- [isFunction](helpers_base.md#isfunction)
- [isNotTruthy](helpers_base.md#isnottruthy)
- [isNullOrUndefined](helpers_base.md#isnullorundefined)
- [isNumber](helpers_base.md#isnumber)
- [isObject](helpers_base.md#isobject)
- [isPromise](helpers_base.md#ispromise)
- [isPromiseLike](helpers_base.md#ispromiselike)
- [isRegExp](helpers_base.md#isregexp)
- [isString](helpers_base.md#isstring)
- [isTruthy](helpers_base.md#istruthy)
- [isTypeof](helpers_base.md#istypeof)
- [isUndefined](helpers_base.md#isundefined)
- [objToString](helpers_base.md#objtostring)

## Variables

### ObjClass

• `Const` **ObjClass**: `ObjectConstructor` = `Object`

#### Defined in

[helpers/base.ts:11](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L11)

___

### ObjProto

• `Const` **ObjProto**: `Object`

#### Defined in

[helpers/base.ts:12](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L12)

## Functions

### isArray

▸ **isArray**(`arg`): arg is any[]

Checks if the type of value is an Array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | `any` |

#### Returns

arg is any[]

True if the value is a Array, false otherwise.

#### Defined in

[helpers/base.ts:99](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L99)

___

### isArrayBuffer

▸ **isArrayBuffer**(`value`): value is ArrayBuffer

Checks if the type of value is a ArrayBuffer object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Value to be checked. |

#### Returns

value is ArrayBuffer

True if the value is a ArrayBuffer, false otherwise.

#### Defined in

[helpers/base.ts:153](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L153)

___

### isBlob

▸ **isBlob**(`value`): value is Blob

Checks if the type of value is a Blob object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Value to be checked. |

#### Returns

value is Blob

True if the value is a Blob, false otherwise.

#### Defined in

[helpers/base.ts:146](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L146)

___

### isBoolean

▸ **isBoolean**(`value`): value is boolean

Checks if the type of value is a boolean.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Value to be checked. |

#### Returns

value is boolean

True if the value is a boolean, false otherwise.

#### Defined in

[helpers/base.ts:118](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L118)

___

### isDate

▸ **isDate**(`value`): value is Date

Check if an object is of type Date

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

value is Date

#### Defined in

[helpers/base.ts:104](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L104)

___

### isDefined

▸ **isDefined**(`arg`): arg is undefined

Checks if the passed value is defined, which means it has any value and is not undefined.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arg` | `any` | The value to check |

#### Returns

arg is undefined

#### Defined in

[helpers/base.ts:63](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L63)

___

### isError

▸ **isError**(`value`): value is ArrayBuffer

Checks if the type of value is a Error object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Value to be checked. |

#### Returns

value is ArrayBuffer

True if the value is a Error, false otherwise.

#### Defined in

[helpers/base.ts:160](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L160)

___

### isFile

▸ **isFile**(`value`): value is File

Checks if the type of value is a File object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Value to be checked. |

#### Returns

value is File

True if the value is a File, false otherwise.

#### Defined in

[helpers/base.ts:132](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L132)

___

### isFormData

▸ **isFormData**(`value`): value is FormData

Checks if the type of value is a FormData object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Value to be checked. |

#### Returns

value is FormData

True if the value is a FormData, false otherwise.

#### Defined in

[helpers/base.ts:139](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L139)

___

### isFunction

▸ **isFunction**(`value`): value is Function

Checks to see if the past value is a function value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | The value to check |

#### Returns

value is Function

#### Defined in

[helpers/base.ts:79](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L79)

___

### isNotTruthy

▸ **isNotTruthy**(`value`): `boolean`

Checks if the type of value does not evaluate to true value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Value to be checked. |

#### Returns

`boolean`

True if the value is not truthy, false otherwise.

#### Defined in

[helpers/base.ts:185](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L185)

___

### isNullOrUndefined

▸ **isNullOrUndefined**(`value`): `boolean`

Checks if the provided value is null or undefined

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | The value to check |

#### Returns

`boolean`

#### Defined in

[helpers/base.ts:54](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L54)

___

### isNumber

▸ **isNumber**(`value`): value is number

Checks if the type of value is a number.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Value to be checked. |

#### Returns

value is number

True if the value is a number, false otherwise.

#### Defined in

[helpers/base.ts:111](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L111)

___

### isObject

▸ **isObject**(`value`): value is object

Checks to see if the past value is an object value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | The value to check |

#### Returns

value is object

#### Defined in

[helpers/base.ts:86](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L86)

___

### isPromise

▸ **isPromise**<`T`\>(`value`): value is Promise<T\>

Checks if the type of value is a Promise instance (contains then and catch functions).

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Value to be checked. |

#### Returns

value is Promise<T\>

True if the value is a Promise, false otherwise.

#### Defined in

[helpers/base.ts:176](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L176)

___

### isPromiseLike

▸ **isPromiseLike**<`T`\>(`value`): value is PromiseLike<T\>

Checks if the type of value is a PromiseLike instance (contains a then function).

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Value to be checked. |

#### Returns

value is PromiseLike<T\>

True if the value is a PromiseLike, false otherwise.

#### Defined in

[helpers/base.ts:167](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L167)

___

### isRegExp

▸ **isRegExp**(`value`): value is RegExp

Determines if a value is a regular expression object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Reference to check. |

#### Returns

value is RegExp

True if `value` is a `RegExp`.

#### Defined in

[helpers/base.ts:125](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L125)

___

### isString

▸ **isString**(`value`): value is string

Checks to see if the past value is a string value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | The value to check |

#### Returns

value is string

#### Defined in

[helpers/base.ts:72](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L72)

___

### isTruthy

▸ **isTruthy**(`value`): `boolean`

Checks if the type of value evaluates to true value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Value to be checked. |

#### Returns

`boolean`

True if the value is not truthy, false otherwise.

#### Defined in

[helpers/base.ts:194](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L194)

___

### isTypeof

▸ **isTypeof**(`value`, `theType`): `boolean`

Validate if the provided value object is of the expected type

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | The value to check |
| `theType` | `string` | The expected type name as a string |

#### Returns

`boolean`

#### Defined in

[helpers/base.ts:36](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L36)

___

### isUndefined

▸ **isUndefined**(`value`): `boolean`

Checks if the provided value is undefined

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | The value to check |

#### Returns

`boolean`

#### Defined in

[helpers/base.ts:45](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L45)

___

### objToString

▸ **objToString**(`value`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`string`

#### Defined in

[helpers/base.ts:26](https://github.com/nevware21/ts-utils/blob/2a92815/ts-utils/src/helpers/base.ts#L26)
