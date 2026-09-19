import { FileText, Globe, MessageCircle } from "lucide-react"

import { LandingSection } from "@/components/landing/landing-section"

const STEPS = [
  {
    number: "1",
    title: "Add the chatbot to your site",
    icon: Globe,
  },
  {
    number: "2",
    title: "Train it with your files",
    icon: FileText,
  },
  {
    number: "3",
    title: "Your customers get answers",
    icon: MessageCircle,
  },
]

/** Three-step overview of how Emerald AI is added and used. */
export function LandingSteps() {
  return (
    <LandingSection className="bg-muted/40">
      <h2 className="text-center font-heading text-3xl font-semibold tracking-tight">
        How it works
      </h2>
      <ol className="mt-12 grid gap-8 md:grid-cols-3">
        {STEPS.map((step) => {
          const Icon = step.icon
          return (
            <li
              key={step.number}
              className="flex flex-row items-start gap-4 md:flex-col"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="size-5" aria-hidden />
              </div>
              <div className="flex min-w-0 flex-col gap-1 md:gap-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Step {step.number}
                </p>
                <h3 className="font-heading text-xl font-semibold">
                  {step.title}
                </h3>
              </div>
            </li>
          )
        })}
      </ol>
    </LandingSection>
  )
}
