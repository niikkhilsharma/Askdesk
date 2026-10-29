import { Library, Paintbrush, SquareCode } from "lucide-react"

import {
  LandingSection,
  LandingSectionIntro,
} from "@/components/landing/landing-section"

const STEPS = [
  {
    number: "01",
    title: "Add what you already know",
    body: "Upload PDFs, crawl your website, or connect Notion and Google Drive. Paste a page of text, or write the questions you want answered a certain way. That becomes the knowledge base for your account.",
    icon: Library,
  },
  {
    number: "02",
    title: "Make it sound like you",
    body: "Set the name, the colors, and the welcome line. Ask it questions in the dashboard until the replies are the ones you would send yourself.",
    icon: Paintbrush,
  },
  {
    number: "03",
    title: "Put it where visitors are",
    body: "Copy the install snippet and name each host site. The launcher shows up there. The same bot can also answer in Slack, WhatsApp, Shopify, WordPress, and Zapier.",
    icon: SquareCode,
  },
]

/** Three-step overview of adding knowledge, shaping the bot, and placing it. */
export function LandingSteps() {
  return (
    <LandingSection
      id="how-it-works"
      labelledBy="how-it-works-title"
      className="bg-muted/40"
    >
      <LandingSectionIntro id="how-it-works-title" title="How it works">
        Add your knowledge, shape the bot, then place it on the sites you name.
      </LandingSectionIntro>
      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        {STEPS.map((step) => {
          const Icon = step.icon
          return (
            <li
              key={step.number}
              className="flex flex-col gap-4 rounded-2xl border bg-card p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon className="size-5" aria-hidden />
                </div>
                <p className="font-heading text-sm font-medium text-muted-foreground">
                  Step {step.number}
                </p>
              </div>
              <h3 className="font-heading text-xl font-semibold">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          )
        })}
      </ol>
    </LandingSection>
  )
}
