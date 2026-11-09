/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * Represents a recursive partial type where all nested properties are optional.
 * @since 0.14.0
 * @group Helpers
 * @typeParam T - The type to transform.
 * @example
 * ```ts
 * interface User {
 *     name: string;
 *     address: {
 *         street: string;
 *         city: string;
 *     };
 * }
 *
 * // All nested properties become optional
 * function updateUser(id: number, patch: DeepPartial<User>) { }
 *
 * updateUser(1, { address: { city: "Seattle" } }); // OK — street is not required
 * ```
 */
export type DeepPartial<T> = T extends Function ? T :
    T extends ReadonlyArray<infer U> ? DeepPartialArray<U> :
    T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

/**
 * The readonly array produced by {@link DeepPartial} for an array of `T`, this is the same as
 * `ReadonlyArray<DeepPartial<T>>`. It is an interface as an interface defers resolving its base type,
 * while TypeScript v3.6 and earlier cannot resolve a type alias which directly references itself as a type argument.
 * @since 0.20.0
 * @group Helpers
 * @typeParam T - The element type of the original array
 */
export interface DeepPartialArray<T> extends ReadonlyArray<DeepPartial<T>> {
}

/**
 * Represents a recursive readonly type where all nested properties are readonly.
 * @since 0.14.0
 * @group Helpers
 * @typeParam T - The type to transform.
 * @example
 * ```ts
 * interface Config {
 *     server: {
 *         host: string;
 *         port: number;
 *     };
 * }
 *
 * const cfg: DeepReadonly<Config> = { server: { host: "localhost", port: 8080 } };
 *
 * // cfg.server.host = "example.com";  // Error: cannot assign to a read-only property
 * ```
 */
export type DeepReadonly<T> = T extends Function ? T :
    T extends ReadonlyArray<infer U> ? DeepReadonlyArray<U> :
    T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]> } : T;

/**
 * The readonly array produced by {@link DeepReadonly} for an array of `T`, this is the same as
 * `ReadonlyArray<DeepReadonly<T>>`. It is an interface as an interface defers resolving its base type,
 * while TypeScript v3.6 and earlier cannot resolve a type alias which directly references itself as a type argument.
 * @since 0.20.0
 * @group Helpers
 * @typeParam T - The element type of the original array
 */
export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {
}

/**
 * Represents a recursive required type where all nested properties are required.
 * @since 0.14.0
 * @group Helpers
 * @typeParam T - The type to transform.
 * @example
 * ```ts
 * interface Options {
 *     timeout?: number;
 *     retry?: {
 *         count?: number;
 *         delay?: number;
 *     };
 * }
 *
 * // After applying defaults every field is guaranteed to be present
 * function withDefaults(opts: Options): DeepRequired<Options> {
 *     return {
 *         timeout: opts.timeout ?? 5000,
 *         retry: {
 *             count: opts.retry?.count ?? 3,
 *             delay: opts.retry?.delay ?? 1000
 *         }
 *     };
 * }
 * ```
 */
export type DeepRequired<T> = T extends Function ? T :
    T extends ReadonlyArray<infer U> ? DeepRequiredArray<U> :
    T extends object ? { [P in keyof T]-?: DeepRequired<NonNullable<T[P]>> } : NonNullable<T>;

/**
 * The readonly array produced by {@link DeepRequired} for an array of `T`, this is the same as
 * `ReadonlyArray<DeepRequired<NonNullable<T>>>`. It is an interface as an interface defers resolving its base type,
 * while TypeScript v3.6 and earlier cannot resolve a type alias which directly references itself as a type argument.
 * @since 0.20.0
 * @group Helpers
 * @typeParam T - The element type of the original array
 */
export interface DeepRequiredArray<T> extends ReadonlyArray<DeepRequired<NonNullable<T>>> {
}
