import type { SimpleIcon } from "simple-icons"

/** Draws a brand glyph in the current text colour. */
export function LandingBrandMark({ icon }: { icon: SimpleIcon }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-4 shrink-0 fill-current"
    >
      <path d={icon.path} />
    </svg>
  )
}
