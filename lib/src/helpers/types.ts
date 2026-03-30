/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * A readonly map-like object type alias.
 * @since 0.14.0
 * @group Helpers
 * @typeParam K - Identifies the key type.
 * @typeParam V - Identifies the value type.
 * @example
 * ```ts
 * const themes: ReadonlyRecord<string, string> = {
 *     light: "#ffffff",
 *     dark:  "#000000"
 * };
 *
 * // themes.light = "#ff0000";  // Error: cannot assign to a read-only property
 * ```
 */
export type ReadonlyRecord<K extends keyof any, V> = Readonly<Record<K, V>>;

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
    T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> :
    T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

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
    T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepReadonly<U>> :
    T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]> } : T;

/**
 * Represents a writable version of a type by removing readonly from top-level properties.
 * @since 0.14.0
 * @group Helpers
 * @typeParam T - The type to transform.
 * @example
 * ```ts
 * interface Point {
 *     readonly x: number;
 *     readonly y: number;
 * }
 *
 * function translate(p: Point, dx: number, dy: number): Point {
 *     const result = { ...p } as Mutable<Point>;
 *     result.x += dx; // OK — no longer readonly
 *     result.y += dy;
 *     return result;
 * }
 * ```
 */
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P]
};

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
    T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepRequired<NonNullable<U>>> :
    T extends object ? { [P in keyof T]-?: DeepRequired<NonNullable<T[P]>> } : NonNullable<T>;

/**
 * Creates a union of all property values of a type.
 * @since 0.14.0
 * @group Helpers
 * @typeParam T - The type to extract values from.
 * @example
 * ```ts
 * const Direction = {
 *     Up:    "up",
 *     Down:  "down",
 *     Left:  "left",
 *     Right: "right"
 * } as const;
 *
 * type DirectionValue = ValueOf<typeof Direction>; // "up" | "down" | "left" | "right"
 *
 * function move(dir: DirectionValue) { }
 *
 * move("up");    // OK
 * move("north"); // Error: not assignable
 * ```
 */
export type ValueOf<T> = T[keyof T];

/**
 * Represents an array that must contain at least one element.
 * @since 0.14.0
 * @group Helpers
 * @typeParam T - Element type.
 * @example
 * ```ts
 * function first<T>(arr: NonEmptyArray<T>): T {
 *     return arr[0]; // safe — at least one element is always present
 * }
 *
 * first([1, 2, 3]); // OK
 * first([]);        // Error: not assignable to NonEmptyArray
 * ```
 */
export type NonEmptyArray<T> = [T, ...T[]];
