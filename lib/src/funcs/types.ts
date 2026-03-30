/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * Extracts a union of all keys of `T` whose values are functions. This is
 * useful for constraining a parameter or property to only name a method that
 * actually exists on a given type.
 * @since 0.9.8
 * @group Funcs
 * @typeParam T - The object type to inspect.
 * @example
 * ```ts
 * interface MyApi {
 *     fetch(url: string): Promise<Response>;
 *     retry(url: string): Promise<Response>;
 *     baseUrl: string;
 * }
 *
 * type ApiMethods = TypeFuncNames<MyApi>;
 * // => "fetch" | "retry"    ("baseUrl" is excluded because it is not a function)
 * ```
 */
export type TypeFuncNames<T> = {
    [key in keyof T]: T[key] extends Function ? key : never
}[keyof T];

/**
 * Describes how a single function from a host object `H` should be proxied
 * onto a target object `T`. Used as an element of the `funcDefs` array passed
 * to {@link createProxyFuncs}.
 * @since 0.9.8
 * @group Funcs
 * @typeParam T - The target object type that will receive the proxied function.
 * @typeParam H - The host object type that owns the original function.
 * @example
 * ```ts
 * interface Host { greet(): string; farewell(): string; }
 * interface Target { hello?(): string; farewell?(): string; }
 *
 * const defs: ProxyFunctionDef<Target, Host>[] = [
 *     { n: "greet", as: "hello" },   // host.greet → target.hello
 *     { n: "farewell" },             // host.farewell → target.farewell
 * ];
 * ```
 */
export type ProxyFunctionDef<T, H> = {
    /**
     * Identifies the host function name to proxy.
     */
    n: TypeFuncNames<H>,

    /**
     * Use this name on the target for the proxied function. Defaults to the
     * same name as the host function when not defined.
     */
    as?: TypeFuncNames<T>,

    /**
     * When `false` (the default) an existing function on the target will
     * **not** be replaced. Set to `true` to always overwrite.
     */
    rp?: boolean
}
