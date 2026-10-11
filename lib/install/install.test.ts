import { describe, expect, it } from "vitest"

import { createBotPublicId } from "@/lib/install/public-id"
import {
  originFromReferer,
  parentOriginFromFetchHeaders,
  parseHostSiteOrigin,
} from "@/lib/install/origin"
import { buildInstallSnippet } from "@/lib/install/snippet"

describe("parseHostSiteOrigin", () => {
  it("stores the origin and drops the path", () => {
    expect(parseHostSiteOrigin("https://www.oakclinic.com/contact")).toEqual({
      ok: true,
      origin: "https://www.oakclinic.com",
    })
  })

  it("lowercases the host and omits the default port", () => {
    expect(parseHostSiteOrigin("https://WWW.OakClinic.com:443/hours")).toEqual({
      ok: true,
      origin: "https://www.oakclinic.com",
    })
  })

  it("keeps a non-default port", () => {
    expect(parseHostSiteOrigin("http://localhost:5500/test-site.html")).toEqual(
      {
        ok: true,
        origin: "http://localhost:5500",
      }
    )
  })

  it("rejects a missing scheme", () => {
    expect(parseHostSiteOrigin("www.oakclinic.com")).toEqual({
      ok: false,
      message: "Include https:// so the site address is exact.",
    })
  })

  it("rejects a non-http scheme", () => {
    expect(parseHostSiteOrigin("javascript:alert(1)").ok).toBe(false)
    expect(parseHostSiteOrigin("ftp://files.oakclinic.com").ok).toBe(false)
  })
})

describe("originFromReferer", () => {
  it("reads the parent origin from a referer", () => {
    expect(originFromReferer("https://www.oakclinic.com/contact")).toBe(
      "https://www.oakclinic.com"
    )
  })

  it("returns null when the referer is missing or invalid", () => {
    expect(originFromReferer(null)).toBeNull()
    expect(originFromReferer("not a url")).toBeNull()
  })
})

describe("parentOriginFromFetchHeaders", () => {
  it("uses the Origin header the browser sends", () => {
    expect(
      parentOriginFromFetchHeaders({
        get(name) {
          return name === "origin" ? "https://www.oakclinic.com" : null
        },
      })
    ).toBe("https://www.oakclinic.com")
  })

  it("uses the referer only for a same-origin request with no Origin", () => {
    expect(
      parentOriginFromFetchHeaders({
        get(name) {
          if (name === "sec-fetch-site") return "same-origin"
          if (name === "referer") return "http://localhost:3000/test-site.html"
          return null
        },
      })
    ).toBe("http://localhost:3000")
  })

  it("ignores a missing Origin on a cross-site request", () => {
    expect(
      parentOriginFromFetchHeaders({
        get(name) {
          if (name === "sec-fetch-site") return "cross-site"
          if (name === "referer") return "https://evil.example/"
          return null
        },
      })
    ).toBeNull()
  })
})

describe("install snippet", () => {
  it("names the bot with data-bot-id", () => {
    expect(buildInstallSnippet("http://localhost:3000", "bot_abc"))
      .toBe(`<script
  async
  src="http://localhost:3000/widget.js"
  data-bot-id="bot_abc"
></script>`)
  })

  it("creates an unguessable public id", () => {
    const publicId = createBotPublicId()

    expect(publicId).toMatch(/^bot_[A-Za-z0-9_-]{22}$/)
    expect(createBotPublicId()).not.toBe(publicId)
  })
})
