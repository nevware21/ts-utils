[@nevware21/ts-utils](../README.md) / object/for\_each\_key

# Module: object/for\_each\_key

## Table of contents

### Functions

- [objForEachKey](object_for_each_key.md#objforeachkey)

## Functions

### objForEachKey

▸ **objForEachKey**(`theObject`, `callbackfn`, `thisArg?`): `void`

Calls the provided `callbackFn` function once for each key in an object. This is equivelent to `arrForEach(Object.keys(theObject), callbackFn)` or
if not using the array helper `Object.keys(theObject).forEach(callbackFn)` except that this helper avoid creating a temporary of the object
keys before iterating over them and like the `arrForEach` helper you CAN stop or break the iteration by returning -1 from the `callbackFn` function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `theObject` | `any` | - |
| `callbackfn` | (`key`: `string`, `value`: `any`) => `number` \| `void` | A function that accepts up to two arguments, the key name and the current value of the property represented by the key. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, null or undefined the object will be used as the this value. |

#### Returns

`void`

#### Defined in

object/for_each_key.ts:21
