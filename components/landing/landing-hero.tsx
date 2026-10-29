import { ArrowDown, Check } from "lucide-react"
import Link from "next/link"

import { LandingMockChat } from "@/components/landing/landing-mock-chat"
import { LandingPrimaryCta } from "@/components/landing/landing-primary-cta"
import { LandingSection } from "@/components/landing/landing-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const HERO_POINTS = [
  "Cites the file and the page",
  "Runs only on the sites you name",
  "Try every reply before it goes live",
]

/** Hero with the value proposition and the scripted clinic-site mock chat. */
export function LandingHero({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <LandingSection className="pt-12 md:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="secondary">
            For the questions already in your inbox
          </Badge>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl">
            A bot for your website. Visitors get answers from your files.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Hours, prices, policies, how to get started. Askdesk reads what you
            already wrote and answers on the page. When a reply uses a file, it
            names the file and the page.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <LandingPrimaryCta isAuthenticated={isAuthenticated} size="lg" />
            <Button variant="outline" size="lg" asChild>
              <Link href="#how-it-works">
                See how it works
                <ArrowDown data-icon="inline-end" />
              </Link>
            </Button>
          </div>
          <ul className="flex flex-col gap-2">
            {HERO_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm">
                <Check className="size-4 shrink-0" aria-hidden />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center lg:justify-end">
          <LandingMockChat />
        </div>
      </div>
    </LandingSection>
  )
}
