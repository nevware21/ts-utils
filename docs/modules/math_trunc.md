[@nevware21/ts-utils](../README.md) / math/trunc

# Module: math/trunc

## Table of contents

### Functions

- [mathTrunc](math_trunc.md#mathtrunc)
- [polyMathTrunc](math_trunc.md#polymathtrunc)

## Functions

### mathTrunc

▸ **mathTrunc**(`x`): `number`

The `mathTrunc()` function returns the integer part of a number by removing any fractional digits.
Unlike the other three Math methods: Math.floor(), Math.ceil() and Math.round(), the way `mathTrunc()`
works is very simple. It truncates (cuts off) the dot and the digits to the right of it, no matter
whether the argument is a positive or negative number.
The argument passed to this method will be converted to number type implicitly.

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |

#### Returns

`number`

The integer path of the given number

#### Defined in

[math/trunc.ts:23](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/math/trunc.ts#L23)

___

### polyMathTrunc

▸ **polyMathTrunc**(`value`): `number`

The `mathTrunc()` function returns the integer part of a number by removing any fractional digits.
Unlike the other three Math methods: Math.floor(), Math.ceil() and Math.round(), the way `mathTrunc()`
works is very simple. It truncates (cuts off) the dot and the digits to the right of it, no matter
whether the argument is a positive or negative number.
The argument passed to this method will be converted to number type implicitly.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | The value to be truncated |

#### Returns

`number`

The integer path of the given number

#### Defined in

[math/trunc.ts:34](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/math/trunc.ts#L34)
