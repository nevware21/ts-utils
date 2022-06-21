[@nevware21/ts-utils](../README.md) / helpers/array

# Module: helpers/array

## Table of contents

### Functions

- [arrAppend](helpers_array.md#arrappend)
- [arrForEach](helpers_array.md#arrforeach)

## Functions

### arrAppend

▸ **arrAppend**<`T`\>(`target`, `elms`): `T`[]

Appends the `elms` to the `target` where the elms may be an array or single object

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `T`[] | The target array |
| `elms` | `any` | The item or items to add to the target |

#### Returns

`T`[]

#### Defined in

[helpers/array.ts:41](https://github.com/nevware21/ts-utils/blob/65eb5b0/ts-utils/src/helpers/array.ts#L41)

___

### arrForEach

▸ **arrForEach**<`T`\>(`arr`, `callbackfn`, `thisArg?`): `void`

Calls the provided `callbackFn` function once for each element in an array in ascending index order. It is not invoked for index properties
that have been deleted or are uninitialized. And unlike the ES6 forEach() you CAN stop or break the iteration by returning -1 from the
`callbackFn` function.

The range (number of elements) processed by arrForEach() is set before the first call to the `callbackFn`. Any elements added beyond the range
or elements which as assigned to indexes already processed will not be visited by the `callbackFn`.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arr` | `T`[] | - |
| `callbackfn` | (`value`: `T`, `index?`: `number`, `array?`: `T`[]) => `number` \| `void` | A function that accepts up to three arguments. arrForEach calls the callbackfn function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, null or undefined the array will be used as the this value. |

#### Returns

`void`

#### Defined in

[helpers/array.ts:23](https://github.com/nevware21/ts-utils/blob/65eb5b0/ts-utils/src/helpers/array.ts#L23)
