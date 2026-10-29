import { describe, expect, it } from "vitest"

import { LANDING_LINKS } from "@/components/landing/landing-links"

describe("LANDING_LINKS", () => {
  it("keeps unique in-page anchors and a shorter header set", () => {
    const hrefs = LANDING_LINKS.map((link) => link.href)

    expect(new Set(hrefs).size).toBe(hrefs.length)
    expect(hrefs.every((href) => href.startsWith("#"))).toBe(true)
    expect(
      LANDING_LINKS.filter((link) => link.header).map((link) => link.label)
    ).toEqual(["How it works", "Features", "Sources", "FAQ"])
  })
})
