"use client"

import { Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import {
  COMPARISON_ROWS,
  PLACEHOLDER_SALES_EMAIL,
  PRICING_PLANS,
  planPrice,
  type PricingPlanId,
} from "@/components/landing/content"
import {
  LandingHeading,
  LandingSection,
} from "@/components/landing/landing-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Pricing cards, billing toggle, and a plan comparison. */
export function LandingPricing({
  isAuthenticated,
}: {
  isAuthenticated: boolean
}) {
  const [yearly, setYearly] = useState(false)

  return (
    <LandingSection muted id="pricing" titleId="pricing-title">
      <LandingHeading
        id="pricing-title"
        title="Simple pricing. Start free."
        subtitle="Every plan includes the full chatbot. Upgrade when you need more messages, seats or channels."
      />
      <div
        role="group"
        aria-label="Billing period"
        className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full bg-muted p-1"
      >
        <Button
          type="button"
          size="sm"
          variant={yearly ? "ghost" : "secondary"}
          aria-pressed={!yearly}
          onClick={() => setYearly(false)}
        >
          Monthly
        </Button>
        <Button
          type="button"
          size="sm"
          variant={yearly ? "secondary" : "ghost"}
          aria-pressed={yearly}
          onClick={() => setYearly(true)}
        >
          Yearly
        </Button>
        <Badge variant="outline">2 months free</Badge>
      </div>
      <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PRICING_PLANS.map((plan) => {
          const price = planPrice(plan, yearly)
          return (
            <li key={plan.id}>
              <article
                className={cn(
                  "flex h-full flex-col gap-6 rounded-2xl border bg-card p-6 shadow-sm",
                  plan.highlighted && "ring-2 ring-primary"
                )}
              >
                <div className="flex flex-col gap-2">
                  {plan.highlighted ? (
                    <Badge className="w-fit">Most popular</Badge>
                  ) : (
                    <span className="h-5" aria-hidden />
                  )}
                  <h3 className="font-heading text-xl font-semibold">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <p className="font-heading text-3xl font-semibold tracking-tight">
                    {price.amount}
                    {price.period ? (
                      <span className="text-base font-medium text-muted-foreground">
                        {price.period}
                      </span>
                    ) : null}
                  </p>
                </div>
                <ul className="flex flex-1 flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <PlanCta
                  kind={plan.cta}
                  highlighted={plan.highlighted}
                  isAuthenticated={isAuthenticated}
                />
              </article>
            </li>
          )
        })}
      </ul>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        No credit card for Free · Cancel any time
      </p>
      <details className="mt-10 rounded-2xl border bg-card p-4 md:hidden">
        <summary className="cursor-pointer rounded-md font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring">
          Compare plans
        </summary>
        <ComparisonTable />
      </details>
      <div className="mt-10 hidden md:block">
        <ComparisonTable />
      </div>
    </LandingSection>
  )
}

/** Signup, dashboard, or sales link for one plan. */
function PlanCta({
  kind,
  highlighted,
  isAuthenticated,
}: {
  kind: "signup" | "contact"
  highlighted: boolean
  isAuthenticated: boolean
}) {
  if (kind === "contact") {
    return (
      <Button variant="outline" className="w-full" asChild>
        <a href={`mailto:${PLACEHOLDER_SALES_EMAIL}`}>Talk to us</a>
      </Button>
    )
  }

  return (
    <Button
      variant={highlighted ? "default" : "outline"}
      className="w-full"
      asChild
    >
      <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
        {isAuthenticated ? "Go to dashboard" : "Get started"}
      </Link>
    </Button>
  )
}

/** Feature matrix for the four plans. */
function ComparisonTable() {
  const columns: { id: PricingPlanId; name: string }[] = PRICING_PLANS.map(
    (plan) => ({ id: plan.id, name: plan.name })
  )

  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <caption className="sr-only">Plan comparison</caption>
        <thead>
          <tr className="border-b text-start">
            <th scope="col" className="px-3 py-3 text-start font-medium">
              Feature
            </th>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className="px-3 py-3 text-start font-medium"
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row) => (
            <tr key={row.label} className="border-b">
              <th scope="row" className="px-3 py-3 text-start font-normal">
                {row.label}
              </th>
              {columns.map((column) => (
                <td key={column.id} className="px-3 py-3 text-muted-foreground">
                  {row.values[column.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
