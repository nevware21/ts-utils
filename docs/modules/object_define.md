[@nevware21/ts-utils](../README.md) / object/define

# Module: object/define

## Table of contents

### Functions

- [objDefineAccessors](object_define.md#objdefineaccessors)
- [objDefineGet](object_define.md#objdefineget)
- [objDefineProp](object_define.md#objdefineprop)

## Functions

### objDefineAccessors

▸ **objDefineAccessors**<`T`, `V`\>(`target`, `prop`, `getProp?`, `setProp?`, `configurable?`): `T`

Try to define get/set object property accessors for the target object/prototype, this will provide compatibility with
existing API definition when run within an ES5+ container that supports accessors but still enable the code to be loaded
and executed in an ES3 container, providing basic IE8 compatibility.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `V` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `T` | The object on which to define the property. |
| `prop` | `PropertyKey` | The name of the property to be defined or modified. |
| `getProp?` | () => `V` | The getter function to wire against the getter. |
| `setProp?` | (`v`: `V`) => `void` | The setter function to wire against the setter. |
| `configurable?` | `boolean` | Can the value be changed, defaults to true |

#### Returns

`T`

The object that was passed to the function

#### Defined in

[object/define.ts:66](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/object/define.ts#L66)

___

### objDefineGet

▸ **objDefineGet**<`T`, `V`\>(`target`, `key`, `value`, `configurable?`): `T`

Try to define a get object property accessor for the target object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `V` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `T` | The object on which to define the property. |
| `key` | `PropertyKey` | The name of the property to be defined or modified |
| `value` | `V` \| () => `V` | The value or a function that returns the value |
| `configurable?` | `boolean` | Can the value be changed, defaults to true |

#### Returns

`T`

The object that was passed to the function

#### Defined in

[object/define.ts:40](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/object/define.ts#L40)

___

### objDefineProp

▸ **objDefineProp**<`T`\>(`target`, `key`, `descriptor`): `T`

Defines a new property directly on an object, or modifies an existing property on an object, and returns the object.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `T` | The object on which to define the property. |
| `key` | `PropertyKey` | The name or Symbol of the property to be defined or modified. |
| `descriptor` | `PropertyDescriptor` & `ThisType`<`any`\> | The descriptor for the property being defined or modified. |

#### Returns

`T`

#### Defined in

[object/define.ts:22](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/object/define.ts#L22)
