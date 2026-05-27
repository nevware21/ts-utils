/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrToMap } from "../../../../src/array/arrToMap";

describe("arrToMap", () => {
    it("creates stable key/value lookup", () => {
        let entries = [
            { id: "a", value: 10 },
            { id: "b", value: 20 },
            { id: "a", value: 99 }
        ];

        let mapped = arrToMap(entries, (value) => value.id, (value) => value.value);
        assert.equal(mapped.a, 99, "later duplicate keys overwrite earlier values");
        assert.equal(mapped.b, 20);

        let unsafeMapped = arrToMap([
            { key: "__proto__", value: 1 },
            { key: "constructor", value: 2 },
            { key: "ok", value: 3 }
        ], (value) => value.key, (value) => value.value);

        assert.equal((unsafeMapped as any).ok, 3);
        assert.equal((unsafeMapped as any).__proto__, Object.prototype);
        assert.equal((unsafeMapped as any).constructor, Object);
    });
});
