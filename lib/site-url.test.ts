import { afterEach, describe, expect, it, vi } from "vitest"

import { siteUrl } from "@/lib/site-url"

describe("siteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("uses the production host when Vercel provides one", () => {
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "askdesk.example")
    vi.stubEnv("VERCEL_URL", "preview.example")

    expect(siteUrl()).toBe("https://askdesk.example")
  })

  it("uses the preview host when there is no production host", () => {
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "")
    vi.stubEnv("VERCEL_URL", "preview.example")

    expect(siteUrl()).toBe("https://preview.example")
  })

  it("falls back to localhost outside Vercel", () => {
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "")
    vi.stubEnv("VERCEL_URL", "")

    expect(siteUrl()).toBe("http://localhost:3000")
  })
})
