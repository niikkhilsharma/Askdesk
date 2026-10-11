import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const isBotAllowedOnOrigin = vi.hoisted(() => vi.fn())

vi.mock("@/lib/install/placement", () => ({
  isBotAllowedOnOrigin,
}))

import { GET } from "@/app/api/widget/placement/route"

function request(url: string, headers?: Record<string, string>) {
  return new NextRequest(url, { headers })
}

describe("GET /api/widget/placement", () => {
  beforeEach(() => {
    isBotAllowedOnOrigin.mockReset()
  })

  it("allows a listed origin and echoes it for CORS", async () => {
    isBotAllowedOnOrigin.mockResolvedValue(true)

    const response = await GET(
      request("http://localhost:3000/api/widget/placement?botId=bot_abc", {
        origin: "https://www.oakclinic.com",
      })
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ allowed: true })
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

    expect(missingBot.status).toBe(404)
    expect(missingOrigin.status).toBe(404)
    expect(isBotAllowedOnOrigin).not.toHaveBeenCalled()
  })
})
