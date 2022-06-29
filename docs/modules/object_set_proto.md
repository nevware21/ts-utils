[@nevware21/ts-utils](../README.md) / object/set\_proto

# Module: object/set\_proto

## Table of contents

### Functions

- [objSetPrototypeOf](object_set_proto.md#objsetprototypeof)

## Functions

### objSetPrototypeOf

▸ **objSetPrototypeOf**(`obj`, `proto`): `any`

The objSetPrototypeOf() method sets the prototype (i.e., the internal [[Prototype]] property) of a specified
object to another object or null.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `any` | The object which is to have it's prototype set. |
| `proto` | `object` | The object's new prototype (an object or null) |

#### Returns

`any`

The specified object.

#### Defined in

[object/set_proto.ts:19](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/object/set_proto.ts#L19)
