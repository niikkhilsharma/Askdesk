import { LandingSection } from "@/components/landing/landing-section"

const CONTRAST_NOTS = [
  "Not a generic ChatGPT tab.",
  "Not a 6-week custom build.",
  "Not a heavy support suite.",
]

/** Positions Emerald AI against generic chat, custom builds, and heavy suites. */
export function LandingContrast() {
  return (
    <LandingSection className="bg-muted/40">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">
          Built for your site, not a chat tab
        </h2>
        <ul className="mt-8 space-y-3 text-lg text-muted-foreground">
          {CONTRAST_NOTS.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-8 text-xl font-medium">
          A chatbot on <em>their</em> site, for <em>their</em> customers.
        </p>
      </div>
    </LandingSection>
  )
}
