[@nevware21/ts-utils](../README.md) / helpers/customError

# Module: helpers/customError

## Table of contents

### Interfaces

- [CustomErrorConstructor](../interfaces/helpers_customError.CustomErrorConstructor.md)

### Functions

- [createCustomError](helpers_customError.md#createcustomerror)
- [throwUnsupported](helpers_customError.md#throwunsupported)

## Functions

### createCustomError

▸ **createCustomError**(`name`, `constructCb?`): [`CustomErrorConstructor`](../interfaces/helpers_customError.CustomErrorConstructor.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `constructCb?` | (`self`: `any`, `args`: `IArguments`) => `void` |

#### Returns

[`CustomErrorConstructor`](../interfaces/helpers_customError.CustomErrorConstructor.md)

#### Defined in

helpers/customError.ts:30

___

### throwUnsupported

▸ **throwUnsupported**(`message?`): `never`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Returns

`never`

#### Defined in

helpers/customError.ts:46
