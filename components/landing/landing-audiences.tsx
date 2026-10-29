import { Building2, GraduationCap, HeartPulse, Laptop } from "lucide-react"

import {
  LandingSection,
  LandingSectionIntro,
} from "@/components/landing/landing-section"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const AUDIENCES = [
  {
    title: "Clinics and professional services",
    customerAsks:
      "Hours, insurance, and which services you offer. The bot answers from the visitor guide, and books a time or hands the thread to the front desk.",
    icon: HeartPulse,
  },
  {
    title: "Courses and coaching",
    customerAsks:
      "Fees, the schedule, and who can join. Visitors ask on the site, and the bot can take a name when someone wants a spot.",
    icon: GraduationCap,
  },
  {
    title: "Hotels, gyms, and spas",
    customerAsks:
      "Rates, amenities, and house rules. The same answers are there at night, with the policy page named under the reply.",
    icon: Building2,
  },
  {
    title: "Small software teams",
    customerAsks:
      "Setup, pricing, and the error someone hit. The bot answers from your docs, and opens a ticket when the docs do not cover it.",
    icon: Laptop,
  },
]

/** Use-case cards framed around what each visitor tends to ask. */
export function LandingAudiences() {
  return (
    <LandingSection id="use-cases" labelledBy="use-cases-title">
      <LandingSectionIntro
        id="use-cases-title"
        title="The questions visitors already send"
      >
        If people email you the same few things, they can ask the bot on your
        site and get the answer you already wrote down.
      </LandingSectionIntro>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {AUDIENCES.map((audience) => {
          const Icon = audience.icon
          return (
            <li key={audience.title}>
              <Card className="h-full" size="sm">
                <CardHeader>
                  <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <CardTitle>
                    <h3 className="font-heading text-lg font-semibold">
                      {audience.title}
                    </h3>
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {audience.customerAsks}
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
          )
        })}
      </ul>
    </LandingSection>
  )
}
