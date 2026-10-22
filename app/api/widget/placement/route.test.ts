import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const isBotAllowedOnOrigin = vi.hoisted(() => vi.fn())

vi.mock("@/lib/install/placement", () => ({
  isBotAllowedOnOrigin,
}))

import { GET } from "@/app/api/widget/placement/route"
import { checkVisitorPass } from "@/lib/install/pass"

function request(url: string, headers?: Record<string, string>) {
  return new NextRequest(url, { headers })
}

describe("GET /api/widget/placement", () => {
  beforeEach(() => {
    isBotAllowedOnOrigin.mockReset()
    vi.stubEnv("VISITOR_PASS_SECRET", "test-visitor-pass-secret")
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("returns a visitor pass only when the host site is allowed", async () => {
    isBotAllowedOnOrigin.mockResolvedValue(true)

    const response = await GET(
      request("http://localhost:3000/api/widget/placement?botId=bot_abc", {
        origin: "https://www.oakclinic.com",
      })
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.allowed).toBe(true)
    expect(typeof body.pass).toBe("string")
    await expect(
      checkVisitorPass(body.pass, "bot_abc", "https://www.oakclinic.com")
    ).resolves.toMatchObject({
      botId: "bot_abc",
      origin: "https://www.oakclinic.com",
    })
    await expect(
      checkVisitorPass(body.pass, "bot_abc", "https://other.example")
    ).resolves.toBeNull()
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://www.oakclinic.com"
    )
    expect(response.headers.get("Vary")).toBe("Origin")
    expect(response.headers.get("Cache-Control")).toBe("no-store")
    expect(isBotAllowedOnOrigin).toHaveBeenCalledWith(
      "bot_abc",
      "https://www.oakclinic.com"
    )
  })

  it("returns an empty 404 when the origin is not listed", async () => {
    isBotAllowedOnOrigin.mockResolvedValue(false)

    const response = await GET(
      request("http://localhost:3000/api/widget/placement?botId=bot_abc", {
        origin: "https://other.example",
      })
    )

    expect(response.status).toBe(404)
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull()
    expect(response.headers.get("Cache-Control")).toBe("no-store")
    expect(await response.text()).toBe("")
  })

  it("returns an empty 404 when the bot id or origin is missing", async () => {
    const missingBot = await GET(
      request("http://localhost:3000/api/widget/placement", {
        origin: "https://www.oakclinic.com",
      })
    )
    const missingOrigin = await GET(
      request("http://localhost:3000/api/widget/placement?botId=bot_abc")
    )
    const blankBot = await GET(
      request("http://localhost:3000/api/widget/placement?botId=%20", {
        origin: "https://www.oakclinic.com",
      })
    )

    expect(missingBot.status).toBe(404)
    expect(missingOrigin.status).toBe(404)
    expect(blankBot.status).toBe(404)
    expect(await blankBot.text()).toBe("")
    expect(isBotAllowedOnOrigin).not.toHaveBeenCalled()
  })
})
