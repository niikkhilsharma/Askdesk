import Link from "next/link"
import { Check } from "lucide-react"

import { LandingSection } from "@/components/landing/landing-section"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const FEATURES = [
  "Chatbot on your website",
  "Answers your customers around the clock",
  "Train it with your files",
  "One snippet to embed",
  "Works for clinics, courses, hospitality, and SaaS",
]

const TIERS = [
  {
    name: "Free",
    price: "Free for 1 month",
    highlighted: false,
    disabled: false,
  },
  {
    name: "Standard",
    price: "$20/month",
    highlighted: true,
    disabled: true,
  },
] as const

/** Two-tier landing pricing with the same chatbot features on Free and Standard. */
export function LandingPricing() {
  return (
    <LandingSection>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">
          Simple pricing.
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Same chatbot. Pick how you want to start.
        </p>
      </div>
      <ul className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        {TIERS.map((tier) => (
          <li key={tier.name}>
            <PricingCard
              name={tier.name}
              price={tier.price}
              highlighted={tier.highlighted}
              disabled={tier.disabled}
            />
          </li>
        ))}
      </ul>
    </LandingSection>
  )
}

/** Renders one pricing card with the shared feature list and a signup or coming-soon CTA. */
function PricingCard({
  name,
  price,
  highlighted,
  disabled,
}: {
  name: string
  price: string
  highlighted: boolean
  disabled: boolean
}) {
  return (
    <article
      aria-disabled={disabled}
      className={cn(
        "flex h-full flex-col gap-6 rounded-xl border bg-card p-6",
        highlighted && "border-primary shadow-sm",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <div className="flex flex-col gap-2">
        {disabled ? (
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Coming soon
          </p>
        ) : highlighted ? (
          <p className="text-xs font-medium tracking-wide text-primary uppercase">
            Recommended
          </p>
        ) : null}
        <h3 className="font-heading text-xl font-semibold">{name}</h3>
        <p className="text-2xl font-semibold tracking-tight">{price}</p>
      </div>
      <ul className="flex flex-1 flex-col gap-3">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed">
            <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {disabled ? (
        <Button size="lg" variant={highlighted ? "default" : "outline"} className="w-full" disabled>
          Coming soon
        </Button>
      ) : (
        <Button
          size="lg"
          variant={highlighted ? "default" : "outline"}
          className="w-full"
          asChild
        >
          <Link href="/signup">Get started</Link>
        </Button>
      )}
    </article>
  )
}
