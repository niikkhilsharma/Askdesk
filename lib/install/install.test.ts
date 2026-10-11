import { describe, expect, it } from "vitest"

import { createBotPublicId } from "@/lib/install/public-id"
import {
  originFromReferer,
  parentOriginFromFetchHeaders,
  parseHostSiteOrigin,
} from "@/lib/install/origin"
import {
  buildInstallSnippet,
  originFromRequestHeaders,
} from "@/lib/install/snippet"
import { botsTable, hostSitesTable } from "@/db/schema"

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

  it("rejects an origin longer than the stored column", () => {
    const host = `${"a".repeat(250)}.example`
    expect(parseHostSiteOrigin(`https://${host}/contact`)).toEqual({
      ok: false,
      message: "That site address is too long.",
    })
  })

  it("rejects an empty address, a broken URL, and embedded credentials", () => {
    expect(parseHostSiteOrigin("  ").ok).toBe(false)
    expect(parseHostSiteOrigin("http://").ok).toBe(false)
    expect(parseHostSiteOrigin("https://user:pass@www.oakclinic.com").ok).toBe(
      false
    )
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

  it("ignores the string null Origin", () => {
    expect(
      parentOriginFromFetchHeaders({
        get(name) {
          return name === "origin" ? "null" : null
        },
      })
    ).toBeNull()
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

  it("reads the app origin from forwarded headers", () => {
    expect(
      originFromRequestHeaders({
        get(name) {
          if (name === "x-forwarded-host") return "askdesk.example, proxy"
          if (name === "x-forwarded-proto") return "https"
          return null
        },
      })
    ).toBe("https://askdesk.example")
  })

  it("does not treat a public host that starts with localhost as local", () => {
    expect(
      originFromRequestHeaders({
        get(name) {
          return name === "host" ? "localhost.example.com" : null
        },
      })
    ).toBe("https://localhost.example.com")
  })

  it("uses https for a public host when no proto is forwarded", () => {
    expect(
      originFromRequestHeaders({
        get(name) {
          return name === "host" ? "askdesk.example" : null
        },
      })
    ).toBe("https://askdesk.example")
  })

  it("uses http for a loopback address when no proto is forwarded", () => {
    expect(
      originFromRequestHeaders({
        get(name) {
          return name === "host" ? "127.0.0.1:3000" : null
        },
      })
    ).toBe("http://127.0.0.1:3000")
  })

  it("uses http for localhost when no proto is forwarded", () => {
    expect(
      originFromRequestHeaders({
        get(name) {
          return name === "host" ? "localhost:3000" : null
        },
      })
    ).toBe("http://localhost:3000")
  })

  it("rejects a request with no host", () => {
    expect(() =>
      originFromRequestHeaders({
        get() {
          return null
        },
      })
    ).toThrow("Missing host")
  })

  it("creates an unguessable public id", () => {
    const publicId = createBotPublicId()

    expect(publicId).toMatch(/^bot_[A-Za-z0-9_-]{22}$/)
    expect(createBotPublicId()).not.toBe(publicId)
  })

  it("defines the bot and host-site tables", () => {
    expect(botsTable).toBeDefined()
    expect(hostSitesTable).toBeDefined()
  })
})
