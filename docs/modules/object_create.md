[@nevware21/ts-utils](../README.md) / object/create

# Module: object/create

## Table of contents

### Functions

- [objCreate](object_create.md#objcreate)

## Functions

### objCreate

▸ **objCreate**(`obj`): `any`

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

[object/create.ts:20](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/object/create.ts#L20)
