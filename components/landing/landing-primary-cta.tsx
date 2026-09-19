import Link from "next/link"

import { Button } from "@/components/ui/button"

/** Links to the dashboard when signed in, or signup when not. */
export function LandingPrimaryCta({
  isAuthenticated,
  size = "default",
}: {
  isAuthenticated: boolean
  size?: "default" | "lg"
}) {
  return (
    <Button size={size} asChild>
      <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
        {isAuthenticated ? "Dashboard" : "Get started"}
      </Link>
    </Button>
  )
}
