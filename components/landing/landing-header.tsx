"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { NAV_LINKS } from "@/components/landing/content"
import { LandingLogo } from "@/components/landing/landing-logo"
import { LandingPrimaryCta } from "@/components/landing/landing-primary-cta"
import { LandingThemeToggle } from "@/components/landing/landing-theme-toggle"
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
import { cn } from "@/lib/utils"

/** Sticky marketing header with section links, theme, and account actions. */
export function LandingHeader({
  isAuthenticated,
}: {
  isAuthenticated: boolean
}) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    /** Shows the header border after the page has moved. */
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/80 backdrop-blur",
        scrolled ? "border-border" : "border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <LandingLogo />
        <nav aria-label="Page" className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <LandingThemeToggle />
          {isAuthenticated ? null : (
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          )}
          <LandingPrimaryCta isAuthenticated={isAuthenticated} />
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          <LandingThemeToggle />
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Jump to a section of this page.
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="Page" className="flex flex-col gap-1 px-6">
                {NAV_LINKS.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="rounded-lg px-3 py-2 text-base outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <SheetFooter>
                {isAuthenticated ? null : (
                  <Button variant="outline" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                )}
                <LandingPrimaryCta
                  isAuthenticated={isAuthenticated}
                  className="w-full"
                />
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
