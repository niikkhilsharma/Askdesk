import Link from "next/link"

import { FOOTER_COLUMNS, FOOTER_TAGLINE } from "@/components/landing/content"
import { LandingLogo } from "@/components/landing/landing-logo"
import { LandingThemeToggle } from "@/components/landing/landing-theme-toggle"

/** Site footer with section links and the theme control. */
export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-3">
          <LandingLogo />
          <p className="max-w-prose text-sm text-muted-foreground">
            {FOOTER_TAGLINE}
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <p className="text-sm font-medium">{column.title}</p>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="rounded-md text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 border-t pt-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AskDesk
          </p>
          <LandingThemeToggle />
        </div>
      </div>
    </footer>
  )
}
