import Link from "next/link"

import { LANDING_LINKS } from "@/components/landing/landing-links"
import { LandingLogo } from "@/components/landing/landing-logo"
import { Separator } from "@/components/ui/separator"

/** Marketing footer with section links and account links. */
export function LandingFooter({
  isAuthenticated,
}: {
  isAuthenticated: boolean
}) {
  return (
    <footer className="border-t pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex max-w-xs flex-col gap-3">
            <LandingLogo />
            <p className="text-sm leading-relaxed text-muted-foreground">
              A bot for your website. Visitors ask on the page, and the answers
              come from your knowledge base.
            </p>
          </div>
          <nav aria-label="On this page" className="flex flex-col gap-3">
            <h2 className="text-sm font-medium">On this page</h2>
            <ul className="flex flex-col gap-2">
              {LANDING_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Account" className="flex flex-col gap-3">
            <h2 className="text-sm font-medium">Account</h2>
            <ul className="flex flex-col gap-2">
              {isAuthenticated ? (
                <li>
                  <Link
                    href="/dashboard"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      href="/signup"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Get started
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Log in
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
        <Separator />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Askdesk
        </p>
      </div>
    </footer>
  )
}
