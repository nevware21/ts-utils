[@nevware21/ts-utils](../README.md) / object/create

# Module: object/create

## Table of contents

### Functions

- [objCreate](object_create.md#objcreate)
- [polyObjCreate](object_create.md#polyobjcreate)

## Functions

### objCreate

▸ **objCreate**(`o`): `any`

Creates an object that has the specified prototype, and that optionally contains specified properties. This helper exists to avoid adding a polyfil
for older browsers that do not define Object.create eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
Note: For consistency this will not use the Object.create implementation if it exists as this would cause a testing requirement to test with and without the implementations

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `object` |

#### Returns

`any`

#### Defined in

[object/create.ts:20](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/object/create.ts#L20)

▸ **objCreate**(`o`, `properties`): `any`

Creates an object that has the specified prototype, and that optionally contains specified properties. This helper exists to avoid adding a polyfil
for older browsers that do not define Object.create eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
Note: For consistency this will not use the Object.create implementation if it exists as this would cause a testing requirement to test with and without the implementations

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `object` |
| `properties` | `PropertyDescriptorMap` & `ThisType`<`any`\> |

#### Returns

`any`

#### Defined in

[object/create.ts:20](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/object/create.ts#L20)

___

### polyObjCreate

▸ **polyObjCreate**(`obj`): `any`

Creates an object that has the specified prototype, and that optionally contains specified properties. This helper exists to avoid adding a polyfil
for older browsers that do not define Object.create eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
Note: For consistency this will not use the Object.create implementation if it exists as this would cause a testing requirement to test with and without the implementations

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `any` | Object to use as a prototype. May be null |

#### Returns

`any`

#### Defined in

[object/create.ts:28](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/object/create.ts#L28)
