import { beforeEach, describe, expect, it, vi } from "vitest"

const backfillBots = vi.hoisted(() => vi.fn())

vi.mock("@/lib/install/bots", () => ({
  backfillBots,
}))

import { backfillExistingAccounts } from "@/scripts/backfill-bots"

describe("backfillExistingAccounts", () => {
  beforeEach(() => {
    backfillBots.mockReset()
  })

  it("logs how many bots it created", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})
    backfillBots.mockResolvedValue({ accounts: 2, created: 1 })

    await backfillExistingAccounts()

    expect(log).toHaveBeenCalledWith("Bots ready. 1 created across 2 accounts.")
    log.mockRestore()
  })
})
