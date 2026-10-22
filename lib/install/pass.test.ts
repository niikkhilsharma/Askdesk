import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  checkVisitorPass,
  readVisitorPass,
  signVisitorPass,
} from "@/lib/install/pass"

const BOT = "bot_abc"
const ORIGIN = "https://www.oakclinic.com"
const NOW = 1_700_000_000_000
const HOUR_MS = 60 * 60 * 1000
const SECRET = "test-visitor-pass-secret"

/** Signs an arbitrary payload with the test secret, the same way a pass is signed. */
async function signRawPayload(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  )

  return `${payload}.${Buffer.from(signature).toString("base64url")}`
}

describe("visitor pass", () => {
  beforeEach(() => {
    vi.stubEnv("VISITOR_PASS_SECRET", SECRET)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("names the bot, the host site, and an expiry one hour out", async () => {
    const pass = await signVisitorPass(BOT, ORIGIN, NOW)

    await expect(readVisitorPass(pass, NOW)).resolves.toEqual({
      botId: BOT,
      origin: ORIGIN,
      exp: NOW + HOUR_MS,
    })
    await expect(
      checkVisitorPass(pass, BOT, ORIGIN, NOW + HOUR_MS - 1)
    ).resolves.toEqual({
      botId: BOT,
      origin: ORIGIN,
      exp: NOW + HOUR_MS,
    })
  })

  it("rejects a pass with a bad signature", async () => {
    const pass = await signVisitorPass(BOT, ORIGIN, NOW)
    const [payload, signature] = pass.split(".")
    const tampered = Buffer.from(signature, "base64url")
    tampered[0] ^= 0xff

    await expect(
      checkVisitorPass(
        `${payload}.${tampered.toString("base64url")}`,
        BOT,
        ORIGIN,
        NOW
      )
    ).resolves.toBeNull()

    const forged = Buffer.from(
      JSON.stringify({
        botId: "bot_other",
        origin: ORIGIN,
        exp: NOW + HOUR_MS,
      })
    ).toString("base64url")

    await expect(
      checkVisitorPass(`${forged}.${signature}`, "bot_other", ORIGIN, NOW)
    ).resolves.toBeNull()

    vi.stubEnv("VISITOR_PASS_SECRET", "other-secret")
    await expect(checkVisitorPass(pass, BOT, ORIGIN, NOW)).resolves.toBeNull()
  })

  it("rejects an expired pass", async () => {
    const pass = await signVisitorPass(BOT, ORIGIN, NOW)

    await expect(readVisitorPass(pass, NOW + HOUR_MS)).resolves.toBeNull()
    await expect(
      checkVisitorPass(pass, BOT, ORIGIN, NOW + HOUR_MS)
    ).resolves.toBeNull()
  })

  it("rejects a pass for a different bot or host site", async () => {
    const pass = await signVisitorPass(BOT, ORIGIN, NOW)

    await expect(readVisitorPass(pass, NOW)).resolves.toMatchObject({
      botId: BOT,
      origin: ORIGIN,
    })
    await expect(
      checkVisitorPass(pass, "bot_other", ORIGIN, NOW)
    ).resolves.toBeNull()
    await expect(
      checkVisitorPass(pass, BOT, "https://other.example", NOW)
    ).resolves.toBeNull()
  })

  it("rejects a malformed pass", async () => {
    await expect(checkVisitorPass("", BOT, ORIGIN, NOW)).resolves.toBeNull()
    await expect(
      checkVisitorPass("not-a-pass", BOT, ORIGIN, NOW)
    ).resolves.toBeNull()
    await expect(
      checkVisitorPass("a.b.c", BOT, ORIGIN, NOW)
    ).resolves.toBeNull()
    await expect(
      checkVisitorPass("@@@.@@@", BOT, ORIGIN, NOW)
    ).resolves.toBeNull()
    await expect(
      checkVisitorPass(".signature", BOT, ORIGIN, NOW)
    ).resolves.toBeNull()
  })

  it("rejects a signed payload that is not a visitor pass", async () => {
    const emptyObject = Buffer.from("{}").toString("base64url")
    const notJson = Buffer.from("not-json").toString("base64url")
    const stringExpiry = Buffer.from(
      JSON.stringify({ botId: BOT, origin: ORIGIN, exp: "soon" })
    ).toString("base64url")

    await expect(
      checkVisitorPass(await signRawPayload(emptyObject), BOT, ORIGIN, NOW)
    ).resolves.toBeNull()
    await expect(
      checkVisitorPass(await signRawPayload(notJson), BOT, ORIGIN, NOW)
    ).resolves.toBeNull()
    await expect(
      checkVisitorPass(await signRawPayload(stringExpiry), BOT, ORIGIN, NOW)
    ).resolves.toBeNull()
    await expect(
      checkVisitorPass(await signRawPayload("@@@"), BOT, ORIGIN, NOW)
    ).resolves.toBeNull()
    await expect(
      checkVisitorPass(
        await signRawPayload(Buffer.from("null").toString("base64url")),
        BOT,
        ORIGIN,
        NOW
      )
    ).resolves.toBeNull()
  })

  it("does not sign a pass without a bot, host site, or server secret", async () => {
    await expect(signVisitorPass("", ORIGIN, NOW)).rejects.toThrow(
      "A visitor pass needs a bot and a host site"
    )
    await expect(signVisitorPass(BOT, "", NOW)).rejects.toThrow(
      "A visitor pass needs a bot and a host site"
    )

    const pass = await signVisitorPass(BOT, ORIGIN, NOW)
    vi.stubEnv("VISITOR_PASS_SECRET", "")

    await expect(signVisitorPass(BOT, ORIGIN, NOW)).rejects.toThrow(
      "Missing VISITOR_PASS_SECRET"
    )
    await expect(checkVisitorPass(pass, BOT, ORIGIN, NOW)).rejects.toThrow(
      "Missing VISITOR_PASS_SECRET"
    )
  })
})
