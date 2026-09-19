import { LandingLogo } from "@/components/landing/landing-logo"

/** Simple marketing footer with the Emerald AI wordmark. */
export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <LandingLogo />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Emerald AI
        </p>
      </div>
    </footer>
  )
}
