import { describe, expect, it } from "vitest"

import {
  FAQ_ITEMS,
  PRICING_PLANS,
  faqJsonLd,
  planPrice,
  softwareJsonLd,
} from "@/components/landing/content"

describe("planPrice", () => {
  /** Finds one of the published plans by its id. */
  function plan(id: (typeof PRICING_PLANS)[number]["id"]) {
    return PRICING_PLANS.find((item) => item.id === id)!
  }

  it("keeps a custom plan as a quote on either billing period", () => {
    expect(planPrice(plan("business"), false)).toEqual({
      amount: "Custom",
      period: "",
    })
    expect(planPrice(plan("business"), true)).toEqual({
      amount: "Custom",
      period: "",
    })
  })

  it("shows the monthly price, and keeps the free plan at zero for a year", () => {
    expect(planPrice(plan("standard"), false)).toEqual({
      amount: "$20",
      period: "/month",
    })
    expect(planPrice(plan("free"), true)).toEqual({
      amount: "$0",
      period: "/year",
    })
  })

  it("charges a paid yearly plan for ten months", () => {
    expect(planPrice(plan("standard"), true)).toEqual({
      amount: "$200",
      period: "/year",
    })
  })
})

describe("landing structured data", () => {
  it("describes the app and the priced plans", () => {
    expect(softwareJsonLd("https://askdesk.example")).toMatchObject({
      "@type": "SoftwareApplication",
      name: "AskDesk",
      url: "https://askdesk.example",
      offers: { lowPrice: "0", highPrice: "49", offerCount: "3" },
    })
  })

  it("lists every landing question", () => {
    const data = faqJsonLd()

    expect(data["@type"]).toBe("FAQPage")
    expect(data.mainEntity).toHaveLength(FAQ_ITEMS.length)
    expect(data.mainEntity[0]).toMatchObject({
      name: FAQ_ITEMS[0].question,
      acceptedAnswer: { text: FAQ_ITEMS[0].answer },
    })
  })
})
