import Link from "next/link"

import { LandingLogo } from "@/components/landing/landing-logo"
import { LandingPrimaryCta } from "@/components/landing/landing-primary-cta"
import { Button } from "@/components/ui/button"

/** Sticky marketing header with login and get-started or dashboard actions. */
export function LandingHeader({
  isAuthenticated,
}: {
  isAuthenticated: boolean
}) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <LandingLogo />
        <nav aria-label="Main" className="flex items-center gap-2">
          {isAuthenticated ? (
            <LandingPrimaryCta isAuthenticated />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <LandingPrimaryCta isAuthenticated={false} />
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
