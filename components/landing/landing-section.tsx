import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Wraps a landing section with shared vertical spacing and content width. */
export function LandingSection({
  children,
  className,
  id,
  labelledBy,
}: {
  children: ReactNode
  className?: string
  id?: string
  labelledBy?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("scroll-mt-24 py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  )
}

/** Heading and supporting line for a landing section. */
export function LandingSectionIntro({
  id,
  title,
  children,
  align = "center",
}: {
  id: string
  title: string
  children: ReactNode
  align?: "center" | "start"
}) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-3",
        align === "center" ? "mx-auto text-center" : "text-start"
      )}
    >
      <h2
        id={id}
        className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl"
      >
        {title}
      </h2>
      <p className="text-lg leading-relaxed text-balance text-muted-foreground">
        {children}
      </p>
    </div>
  )
}
