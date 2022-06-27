[@nevware21/ts-utils](../README.md) / helpers/value

# Module: helpers/value

## Table of contents

### Functions

- [hasValue](helpers_value.md#hasvalue)

## Functions

### hasValue

▸ **hasValue**(`value`): `boolean`

Return whether the value appears to have any `value`, this helper returns true for
- value is not null, undefined or string value of "undefined"
- value === false
- value === 0
- An array with a length >= 1
- A valid Date
- If object has a `length` property or function and the returned value.length or value.length() !== 0
- If object has a `byteLength` property or function and the returned value.byteLength or value.byteLength() !== 0
- If object has a `size` property or function and the returned value.size or value.size() !== 0
- If object has a `valueOf` function then the returned value hasValue(value.valueOf()) to a maximum recursion of 5 levels
- If object with at least 1 key of it's own property (hasOwnProperty)
- else if isTruthy (empty string, etc)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`boolean`

#### Defined in

[helpers/value.ts:76](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/helpers/value.ts#L76)
