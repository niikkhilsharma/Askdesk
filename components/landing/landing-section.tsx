import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Wraps a landing section with shared vertical spacing and content width. */
export function LandingSection({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  )
}
