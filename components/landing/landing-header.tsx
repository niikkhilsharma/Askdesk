import { Menu } from "lucide-react"
import Link from "next/link"

import { LANDING_LINKS } from "@/components/landing/landing-links"
import { LandingLogo } from "@/components/landing/landing-logo"
import { LandingPrimaryCta } from "@/components/landing/landing-primary-cta"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

/** Sticky marketing header with section links, login, and the primary action. */
export function LandingHeader({
  isAuthenticated,
}: {
  isAuthenticated: boolean
}) {
  const headerLinks = LANDING_LINKS.filter((link) => link.header)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <LandingLogo />
        <nav aria-label="On this page" className="hidden items-center lg:flex">
          {headerLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated ? null : (
            <Button variant="ghost" className="hidden sm:inline-flex" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          )}
          <LandingPrimaryCta isAuthenticated={isAuthenticated} />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Jump to a section, or open your account.
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="On this page" className="flex flex-col px-4">
                {LANDING_LINKS.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="rounded-lg px-2 py-3 text-base font-medium hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              {isAuthenticated ? null : (
                <SheetFooter>
                  <Button variant="outline" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
