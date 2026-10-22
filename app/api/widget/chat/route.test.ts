import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const streamAccountAnswer = vi.hoisted(() => vi.fn())
const getAccountIdForBot = vi.hoisted(() => vi.fn())
const isBotAllowedOnOrigin = vi.hoisted(() => vi.fn())

vi.mock("@/lib/chat/answer", () => ({
  streamAccountAnswer,
}))

vi.mock("@/lib/install/bots", () => ({
  getAccountIdForBot,
}))

vi.mock("@/lib/install/placement", () => ({
  isBotAllowedOnOrigin,
}))

import { POST } from "@/app/api/widget/chat/route"
import { signVisitorPass } from "@/lib/install/pass"

const BOT = "bot_abc"
const ORIGIN = "https://www.oakclinic.com"
const HOUR_MS = 60 * 60 * 1000
const SECRET = "test-visitor-pass-secret"

const messages = [
  {
    id: "question-1",
    role: "user" as const,
    parts: [{ type: "text" as const, text: "What are your hours?" }],
  },
]

/** Posts a visitor question to the widget chat route. */
function post(body: unknown) {
  return new NextRequest("http://localhost:3000/api/widget/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/widget/chat", () => {
  beforeEach(() => {
    streamAccountAnswer.mockReset()
    getAccountIdForBot.mockReset()
    isBotAllowedOnOrigin.mockReset()
    vi.stubEnv("VISITOR_PASS_SECRET", SECRET)
    streamAccountAnswer.mockResolvedValue(
      new Response("stream", { status: 200 })
    )
    getAccountIdForBot.mockResolvedValue(42)
    isBotAllowedOnOrigin.mockResolvedValue(true)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("answers as the bot's account when the pass is valid", async () => {
    const pass = await signVisitorPass(BOT, ORIGIN)

    const response = await POST(post({ pass, botId: BOT, messages }))

    expect(response.status).toBe(200)
    expect(await response.text()).toBe("stream")
    expect(isBotAllowedOnOrigin).toHaveBeenCalledWith(BOT, ORIGIN)
    expect(getAccountIdForBot).toHaveBeenCalledWith(BOT)
    expect(streamAccountAnswer).toHaveBeenCalledWith(42, messages)
  })

  it("refuses a missing, expired, or altered pass without calling the model", async () => {
    const missing = await POST(post({ botId: BOT, messages }))
    const expiredPass = await signVisitorPass(
      BOT,
      ORIGIN,
      Date.now() - HOUR_MS - 1000
    )
    const expired = await POST(
      post({ pass: expiredPass, botId: BOT, messages })
    )
    const validPass = await signVisitorPass(BOT, ORIGIN)
    const [payload, signature] = validPass.split(".")
    const tamperedBytes = Buffer.from(signature, "base64url")
    tamperedBytes[0] ^= 0xff
    const tampered = await POST(
      post({
        pass: `${payload}.${tamperedBytes.toString("base64url")}`,
        botId: BOT,
        messages,
      })
    )

    expect(missing.status).toBe(401)
    expect(expired.status).toBe(401)
    expect(tampered.status).toBe(401)
    expect(await missing.json()).toEqual({ message: "Visitor pass refused" })
    expect(await expired.json()).toEqual({ message: "Visitor pass refused" })
    expect(streamAccountAnswer).not.toHaveBeenCalled()
    expect(getAccountIdForBot).not.toHaveBeenCalled()
  })

  it("refuses a body that has no usable pass without calling the model", async () => {
    const responses = await Promise.all([
      POST(post(null)),
      POST(post("hello")),
      POST(post([])),
      POST(post({ pass: 1, botId: BOT, messages })),
    ])

    for (const response of responses) {
      expect(response.status).toBe(401)
      expect(await response.json()).toEqual({ message: "Visitor pass refused" })
    }

    expect(streamAccountAnswer).not.toHaveBeenCalled()
    expect(getAccountIdForBot).not.toHaveBeenCalled()
  })

  it("asks for a user message when the pass is valid but the messages are not a list", async () => {
    const pass = await signVisitorPass(BOT, ORIGIN)
    const response = await POST(post({ pass, botId: BOT }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      message: "A user message is required",
    })
    expect(getAccountIdForBot).toHaveBeenCalledWith(BOT)
    expect(streamAccountAnswer).not.toHaveBeenCalled()
  })

  it("refuses a pass for a different bot or a missing account without calling the model", async () => {
    const pass = await signVisitorPass(BOT, ORIGIN)
    const mismatch = await POST(post({ pass, botId: "bot_other", messages }))

    getAccountIdForBot.mockResolvedValue(null)
    const missingAccount = await POST(post({ pass, botId: BOT, messages }))

    expect(mismatch.status).toBe(401)
    expect(missingAccount.status).toBe(401)
    expect(streamAccountAnswer).not.toHaveBeenCalled()
    expect(getAccountIdForBot).toHaveBeenCalledTimes(1)
  })

  it("refuses a pass when the host site is no longer allowed", async () => {
    const pass = await signVisitorPass(BOT, ORIGIN)
    isBotAllowedOnOrigin.mockResolvedValue(false)

    const response = await POST(post({ pass, botId: BOT, messages }))

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({ message: "Visitor pass refused" })
    expect(isBotAllowedOnOrigin).toHaveBeenCalledWith(BOT, ORIGIN)
    expect(getAccountIdForBot).not.toHaveBeenCalled()
    expect(streamAccountAnswer).not.toHaveBeenCalled()
  })
})
