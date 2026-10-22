import { beforeEach, describe, expect, it, vi } from "vitest"

const { steps, take } = vi.hoisted(() => {
  const steps: Array<unknown[] | Error> = []

  function thenable(rows: unknown[] | Error) {
    const builder: Record<string, unknown> = {}
    const pass = () => builder

    for (const method of [
      "from",
      "where",
      "limit",
      "orderBy",
      "values",
      "returning",
    ]) {
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
    insert: () => take(),
  },
}))

import {
  backfillBots,
  ensureBotForUser,
  getAccountIdForBot,
  getInstallState,
} from "@/lib/install/bots"

const bot = {
  id: 7,
  userId: 4,
  publicId: "bot_existing",
  createdAt: new Date("2026-10-11T00:00:00Z"),
}

function uniqueViolation() {
  return Object.assign(new Error("duplicate"), { code: "23505" })
}

describe("ensureBotForUser", () => {
  beforeEach(() => {
    steps.length = 0
  })

  it("returns the bot the account already has", async () => {
    steps.push([bot])

    await expect(ensureBotForUser(4)).resolves.toEqual(bot)
  })

  it("creates a bot when the account has none", async () => {
    const created = { ...bot, publicId: "bot_new" }
    steps.push([], [created])

    await expect(ensureBotForUser(4)).resolves.toEqual(created)
  })

  it("returns the bot created by a concurrent insert", async () => {
    steps.push([], uniqueViolation(), [bot])

    await expect(ensureBotForUser(4)).resolves.toEqual(bot)
  })

  it("rethrows a database error that is not a unique violation", async () => {
    const failure = Object.assign(new Error("missing user"), { code: "23503" })
    steps.push([], failure)

    await expect(ensureBotForUser(4)).rejects.toBe(failure)
  })

  it("gives up after repeated unique violations with no stored bot", async () => {
    steps.push([])
    for (let attempt = 0; attempt < 5; attempt += 1) {
      steps.push(uniqueViolation(), [])
    }

    await expect(ensureBotForUser(4)).rejects.toThrow("Could not create a bot")
  })
})

describe("getInstallState", () => {
  beforeEach(() => {
    steps.length = 0
  })

  it("returns the bot and its host sites", async () => {
    const hostSite = {
      id: 3,
      botId: bot.id,
      origin: "https://www.oakclinic.com",
      createdAt: new Date("2026-10-11T00:00:00Z"),
    }
    steps.push([bot], [hostSite])

    await expect(getInstallState(4)).resolves.toEqual({
      bot,
      hostSites: [hostSite],
    })
  })
})

describe("getAccountIdForBot", () => {
  beforeEach(() => {
    steps.length = 0
  })

  it("returns the account that owns the bot", async () => {
    steps.push([{ userId: 4 }])

    await expect(getAccountIdForBot("bot_existing")).resolves.toBe(4)
  })

  it("returns null when the bot does not exist", async () => {
    steps.push([])

    await expect(getAccountIdForBot("bot_missing")).resolves.toBeNull()
  })

  it("returns null for a missing or oversized public id without reading a row", async () => {
    steps.push([{ userId: 4 }])

    await expect(getAccountIdForBot("")).resolves.toBeNull()
    await expect(getAccountIdForBot("b".repeat(65))).resolves.toBeNull()
    await expect(getAccountIdForBot("bot_existing")).resolves.toBe(4)
  })
})

describe("backfillBots", () => {
  beforeEach(() => {
    steps.length = 0
  })

  it("creates a bot only for accounts that do not have one", async () => {
    const created = { ...bot, id: 8, userId: 2, publicId: "bot_created" }
    steps.push([{ id: 1 }, { id: 2 }], [{ userId: 1 }], [], [created])

    await expect(backfillBots()).resolves.toEqual({ accounts: 2, created: 1 })
  })
})
