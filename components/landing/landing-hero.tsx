import { HERO } from "@/components/landing/content"
import { LandingMockChat } from "@/components/landing/landing-mock-chat"
import { LandingPrimaryCta } from "@/components/landing/landing-primary-cta"
import { LandingSection } from "@/components/landing/landing-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/** Hero with the product promise and a scripted site preview. */
export function LandingHero({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <LandingSection
      titleId="hero-title"
      className="relative overflow-hidden pt-12 md:pt-20"
    >
      <div
        aria-hidden
        className="landing-hero-wash pointer-events-none absolute inset-0"
      />
      <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <Badge
            variant="secondary"
            className="h-auto w-fit py-1 whitespace-normal"
          >
            {HERO.eyebrow}
          </Badge>
          <h1
            id="hero-title"
            className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            {HERO.title}
          </h1>
          <p className="max-w-prose text-lg leading-relaxed text-pretty text-muted-foreground">
            {HERO.subtitle}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <LandingPrimaryCta
              isAuthenticated={isAuthenticated}
              size="lg"
              loggedOutLabel={HERO.primary}
            />
            <Button variant="outline" size="lg" asChild>
              <a href="#demo">{HERO.secondary}</a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{HERO.micro}</p>
        </div>
        <div id="demo" className="min-w-0 scroll-mt-24">
          <LandingMockChat />
        </div>
      </div>
    </LandingSection>
  )
}
