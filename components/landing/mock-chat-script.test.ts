import { describe, expect, it } from "vitest"

import {
  CLINIC_PRESETS,
  DEMO_FALLBACK,
  matchClinicReply,
} from "@/components/landing/mock-chat-script"

describe("matchClinicReply", () => {
  it("returns the fallback for empty or punctuation-only input", () => {
    expect(matchClinicReply("")).toBe(DEMO_FALLBACK)
    expect(matchClinicReply("   ")).toBe(DEMO_FALLBACK)
    expect(matchClinicReply("???")).toBe(DEMO_FALLBACK)
  })

  it("matches a canned question even with extra punctuation and casing", () => {
    expect(matchClinicReply("What are your hours?")).toBe(
      CLINIC_PRESETS[0].reply
    )
    expect(matchClinicReply("WHAT ARE YOUR HOURS!!!")).toBe(
      CLINIC_PRESETS[0].reply
    )
  })

  it("matches walk-in and insurance questions by keyword", () => {
    expect(matchClinicReply("Can I walk in today?")).toBe(
      CLINIC_PRESETS[1].reply
    )
    expect(matchClinicReply("Do you take insurance?")).toBe(
      CLINIC_PRESETS[2].reply
    )
  })

  it("matches hours wording without treating unrelated close questions as clinic hours", () => {
    expect(matchClinicReply("hours")).toBe(CLINIC_PRESETS[0].reply)
    expect(matchClinicReply("When do you close?")).toBe(CLINIC_PRESETS[0].reply)
    expect(matchClinicReply("Can you close my account?")).toBe(DEMO_FALLBACK)
  })

  it("returns the fallback when nothing looks like a clinic question", () => {
    expect(matchClinicReply("Where is the nearest coffee shop?")).toBe(
      DEMO_FALLBACK
    )
  })
})
