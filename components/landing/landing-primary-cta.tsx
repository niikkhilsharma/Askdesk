import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Links to the dashboard when signed in, or signup when not. */
export function LandingPrimaryCta({
  isAuthenticated,
  size = "default",
  loggedOutLabel = "Get started",
  className,
}: {
  isAuthenticated: boolean
  size?: "default" | "lg"
  loggedOutLabel?: string
  className?: string
}) {
  return (
    <Button size={size} className={cn(className)} asChild>
      <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
        {isAuthenticated ? "Go to dashboard" : loggedOutLabel}
      </Link>
    </Button>
  )
}
