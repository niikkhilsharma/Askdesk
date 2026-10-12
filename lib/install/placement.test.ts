import { beforeEach, describe, expect, it, vi } from "vitest"

const { steps, take } = vi.hoisted(() => {
  const steps: Array<unknown[] | Error> = []

  function thenable(rows: unknown[] | Error) {
    const builder: Record<string, unknown> = {}
    const pass = () => builder

    for (const method of ["from", "where", "limit", "innerJoin"]) {
      builder[method] = pass
    }

    builder.then = (
      onFulfilled?: (value: unknown) => unknown,
      onRejected?: (reason: unknown) => unknown
    ) => {
      const promise =
        rows instanceof Error ? Promise.reject(rows) : Promise.resolve(rows)
      return promise.then(onFulfilled, onRejected)
    }

    return builder
  }

  return {
    steps,
    take() {
      const next = steps.shift() ?? []
      return thenable(next)
    },
  }
})

vi.mock("@/db/db", () => ({
  default: {
    select: () => take(),
  },
}))

import { isBotAllowedOnOrigin } from "@/lib/install/placement"

describe("isBotAllowedOnOrigin", () => {
  beforeEach(() => {
    steps.length = 0
  })

  it("denies a missing, empty, or oversized public id without querying", async () => {
    await expect(
      isBotAllowedOnOrigin("", "https://www.oakclinic.com")
    ).resolves.toBe(false)
    await expect(
      isBotAllowedOnOrigin("bot_" + "a".repeat(64), "https://www.oakclinic.com")
    ).resolves.toBe(false)
    await expect(isBotAllowedOnOrigin("bot_abc", "")).resolves.toBe(false)
    expect(steps).toEqual([])
  })

  it("allows only an exact listed origin", async () => {
    steps.push([{ id: 1 }])
    await expect(
      isBotAllowedOnOrigin("bot_abc", "https://www.oakclinic.com")
    ).resolves.toBe(true)

    steps.push([])
    await expect(
      isBotAllowedOnOrigin("bot_abc", "https://other.example")
    ).resolves.toBe(false)
  })
})
