import { describe, expect, it } from "vitest"

import { getDatabaseErrorCode } from "@/lib/install/db-error"

describe("getDatabaseErrorCode", () => {
  it("reads a code on the error", () => {
    expect(getDatabaseErrorCode({ code: "23505" })).toBe("23505")
  })

  it("reads a code nested on the cause", () => {
    expect(getDatabaseErrorCode({ cause: { code: "23503" } })).toBe("23503")
  })

  it("returns undefined when there is no code", () => {
    expect(getDatabaseErrorCode(null)).toBeUndefined()
    expect(getDatabaseErrorCode("23505")).toBeUndefined()
    expect(getDatabaseErrorCode({ code: 23505 })).toBeUndefined()
    expect(getDatabaseErrorCode({ cause: {} })).toBeUndefined()
  })
})
