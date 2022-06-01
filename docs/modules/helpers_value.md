[@nevware21/ts-utils](../README.md) / helpers/value

# Module: helpers/value

## Table of contents

### Functions

- [hasValue](helpers_value.md#hasvalue)

## Functions

### hasValue

▸ **hasValue**(`value`): `boolean`

Return whether the value appears to have any `value`, this helper return true for
- An array with a length >= 1
- A valid Date
- An object with at least 1 key of it's onw property (hasOwnProperty)
- Is truthy (not null, undefined, numeric zero, empty string)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`boolean`

#### Defined in

[helpers/value.ts:20](https://github.com/nevware21/ts-utils/blob/8ea7298/ts-utils/src/helpers/value.ts#L20)
