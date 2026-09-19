export type ClinicPreset = {
  id: string
  question: string
  reply: string
  keywords: string[]
}

export const CLINIC_PRESETS: ClinicPreset[] = [
  {
    id: "hours",
    question: "What are your hours?",
    reply:
      "We're open Monday–Friday 8am–6pm, and Saturday 9am–1pm. Closed Sundays.",
    keywords: [
      "hour",
      "open",
      "closed",
      "opening",
      "what time",
      "when do you close",
      "closing time",
    ],
  },
  {
    id: "walkins",
    question: "Do you take walk-ins?",
    reply:
      "Yes, we take walk-ins most days. If you'd rather skip the wait, call the front desk to book ahead.",
    keywords: ["walk in", "walkin", "walk ins", "without an appointment"],
  },
  {
    id: "insurance",
    question: "Do you accept insurance?",
    reply:
      "We accept most major insurance plans. Bring your card to your visit and we'll verify coverage at check-in.",
    keywords: ["insurance", "insured", "coverage", "copay"],
  },
]

export const DEMO_FALLBACK =
  "This preview is a demo — add the chatbot to your site to answer your customers."

export const CLINIC_WELCOME =
  "Hi — welcome to Riverside Clinic. How can we help today?"

/** Lowercases text and strips punctuation so question matching stays simple. */
function normalizeQuestion(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Returns true when the question contains the keyword as its own phrase. */
function hasKeyword(normalized: string, keyword: string) {
  const escaped = keyword
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s+/g, "\\s+")
  return new RegExp(`(?:^|\\s)${escaped}`).test(normalized)
}

/** Picks the closest canned clinic reply, or the demo fallback if nothing matches. */
export function matchClinicReply(text: string) {
  const normalized = normalizeQuestion(text)
  if (!normalized) return DEMO_FALLBACK

  const exact = CLINIC_PRESETS.find(
    (preset) => normalizeQuestion(preset.question) === normalized
  )
  if (exact) return exact.reply

  let bestScore = 0
  let bestReply = DEMO_FALLBACK

  for (const preset of CLINIC_PRESETS) {
    let score = 0
    for (const keyword of preset.keywords) {
      if (hasKeyword(normalized, keyword)) score += 1
    }
    if (score > bestScore) {
      bestScore = score
      bestReply = preset.reply
    }
  }

  return bestReply
}
