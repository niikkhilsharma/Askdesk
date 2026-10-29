import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Wraps a landing section with shared spacing, width, and an anchor offset. */
export function LandingSection({
  id,
  titleId,
  muted = false,
  children,
  className,
}: {
  id?: string
  titleId?: string
  muted?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn(
        "scroll-mt-24 py-20 md:py-28",
        muted && "bg-muted/40",
        className
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  )
}

/** Centers a section heading and optional supporting line. */
export function LandingHeading({
  id,
  title,
  subtitle,
  align = "center",
}: {
  id: string
  title: string
  subtitle?: string
  align?: "center" | "start"
}) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-3",
        align === "center" && "mx-auto text-center"
      )}
    >
      <h2
        id={id}
        className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
