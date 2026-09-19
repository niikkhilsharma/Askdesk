import { Building2, GraduationCap, HeartPulse, Laptop } from "lucide-react"

import { LandingSection } from "@/components/landing/landing-section"

const AUDIENCES = [
  {
    title: "Clinics and professional services",
    customerAsks: "Their patients ask about hours, insurance, and services.",
    icon: HeartPulse,
  },
  {
    title: "Courses and coaching",
    customerAsks: "Their students ask about fees, schedule, and eligibility.",
    icon: GraduationCap,
  },
  {
    title: "Hotels, gyms, spas",
    customerAsks: "Their guests ask about rates, amenities, and house rules.",
    icon: Building2,
  },
  {
    title: "Small SaaS",
    customerAsks: "Their users ask about setup, pricing, and troubleshooting.",
    icon: Laptop,
  },
]

/** Audience cards framed around what each buyer's customers ask. */
export function LandingAudiences() {
  return (
    <LandingSection>
      <h2 className="text-center font-heading text-3xl font-semibold tracking-tight">
        Who it is for
      </h2>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCES.map((audience) => {
          const Icon = audience.icon
          return (
            <li
              key={audience.title}
              className="flex flex-col gap-4 rounded-xl border bg-card p-6"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="font-heading text-lg font-semibold">
                {audience.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {audience.customerAsks}
              </p>
            </li>
          )
        })}
      </ul>
    </LandingSection>
  )
}
