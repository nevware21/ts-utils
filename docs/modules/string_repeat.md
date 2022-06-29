[@nevware21/ts-utils](../README.md) / string/repeat

# Module: string/repeat

## Table of contents

### Functions

- [polyStrRepeat](string_repeat.md#polystrrepeat)
- [strRepeat](string_repeat.md#strrepeat)

## Functions

### polyStrRepeat

▸ **polyStrRepeat**(`value`, `count`): `string`

The `strRepeat()` method constructs and returns a new string which contains the
specified number of copies of the string on which it was called, concatenated
together.

**`throws`** RangeError: repeat count must be non-negative.

**`throws`** RangeError: repeat count must be less than infinity and not overflow maximum string size.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be repeated |
| `count` | `number` | An integer between 0 and +Infinity, indicating the number of times to repeat the string. |

#### Returns

`string`

A new string containing the specified number of copies of the given string.

#### Defined in

[string/repeat.ts:41](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/string/repeat.ts#L41)

___

### strRepeat

▸ **strRepeat**(`value`, `count`): `string`

The `strRepeat()` method constructs and returns a new string which contains the
specified number of copies of the string on which it was called, concatenated
together.

**`throws`** RangeError: repeat count must be non-negative.

**`throws`** RangeError: repeat count must be less than infinity and not overflow maximum string size.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be repeated |
| `count` | `number` | An integer between 0 and +Infinity, indicating the number of times to repeat the string. |

#### Returns

`string`

A new string containing the specified number of copies of the given string.

#### Defined in

[string/repeat.ts:27](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/string/repeat.ts#L27)
