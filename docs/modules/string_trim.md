[@nevware21/ts-utils](../README.md) / string/trim

# Module: string/trim

## Table of contents

### Functions

- [strTrim](string_trim.md#strtrim)
- [strTrimEnd](string_trim.md#strtrimend)
- [strTrimLeft](string_trim.md#strtrimleft)
- [strTrimRight](string_trim.md#strtrimright)
- [strTrimStart](string_trim.md#strtrimstart)

## Functions

### strTrim

▸ **strTrim**(`value`): `string`

The trim() method removes whitespace from both ends of a string and returns a new string,
without modifying the original string. Whitespace in this context is all the whitespace
characters (space, tab, no-break space, etc.) and all the line terminator characters
(LF, CR, etc.).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string value to be trimmed. |

#### Returns

`string`

A new string representing str stripped of whitespace from both its beginning and end.
If neither the beginning or end of str has any whitespace, a new string is still returned (essentially
a copy of str), with no exception being thrown.
To return a new string with whitespace trimmed from just one end, use `strTrimStart()` or `strTrimEnd()`.

#### Defined in

[string/trim.ts:27](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/string/trim.ts#L27)

___

### strTrimEnd

▸ **strTrimEnd**(`value`): `string`

The `strTrimEnd()` method removes whitespace from the end of a string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be trimmed. |

#### Returns

`string`

A new string representing str stripped of whitespace from its end (right side).
If the end of str has no whitespace, a new string is still returned (essentially a copy of str),
with no exception being thrown.

#### Defined in

[string/trim.ts:58](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/string/trim.ts#L58)

___

### strTrimLeft

▸ **strTrimLeft**(`value`): `string`

Alias for `strTrimStart()` method removes whitespace from the beginning of a string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be trimmed. |

#### Returns

`string`

A new string representing str stripped of whitespace from its beginning (left side).
If the beginning of str has no whitespace, a new string is still returned (essentially a copy of str),
with no exception being thrown.

#### Defined in

[string/trim.ts:49](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/string/trim.ts#L49)

___

### strTrimRight

▸ **strTrimRight**(`value`): `string`

Alias for `strTrimEnd()` method removes whitespace from the end of a string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be trimmed. |

#### Returns

`string`

A new string representing str stripped of whitespace from its end (right side).
If the end of str has no whitespace, a new string is still returned (essentially a copy of str),
with no exception being thrown.

#### Defined in

[string/trim.ts:69](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/string/trim.ts#L69)

___

### strTrimStart

▸ **strTrimStart**(`value`): `string`

The `strTrimStart()` method removes whitespace from the beginning of a string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be trimmed. |

#### Returns

`string`

A new string representing str stripped of whitespace from its beginning (left side).
If the beginning of str has no whitespace, a new string is still returned (essentially a copy of str),
with no exception being thrown.

#### Defined in

[string/trim.ts:38](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/string/trim.ts#L38)
