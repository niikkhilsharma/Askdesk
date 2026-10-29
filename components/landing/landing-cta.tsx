import Link from "next/link"

import { LandingPrimaryCta } from "@/components/landing/landing-primary-cta"
import { LandingSection } from "@/components/landing/landing-section"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/** Closing call to create an account or open the dashboard. */
export function LandingCta({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <LandingSection>
      <Card className="px-6 py-14 text-center md:px-16 md:py-20">
        <CardHeader className="items-center">
          <CardTitle>
            <h2 className="mx-auto max-w-xl font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              Put the answers on your site.
            </h2>
          </CardTitle>
          <CardDescription className="mx-auto max-w-xl text-base leading-relaxed md:text-lg">
            Create an account, add what you already wrote, and try the bot
            before anyone else sees it.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center gap-2">
          <LandingPrimaryCta isAuthenticated={isAuthenticated} size="lg" />
          {isAuthenticated ? null : (
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </LandingSection>
  )
}
