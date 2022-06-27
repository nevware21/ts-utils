[@nevware21/ts-utils](../README.md) / polyfills/object

# Module: polyfills/object

## Table of contents

### Functions

- [polyObjKeys](polyfills_object.md#polyobjkeys)

## Functions

### polyObjKeys

▸ **polyObjKeys**(`obj`): `string`[]

Returns the names of the enumerable string properties and methods of an object. This helper exists to avoid adding a polyfil for older browsers
that do not define Object.keys eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
Note: For consistency this will not use the Object.keys implementation if it exists as this would cause a testing requirement to test with and without the implementations

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `any` | Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object. |

#### Returns

`string`[]

#### Defined in

[polyfills/object.ts:18](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/polyfills/object.ts#L18)
