import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"

/** Renders the AskDesk wordmark linking back to the homepage. */
export function LandingLogo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 font-medium">
      <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <GalleryVerticalEnd className="size-4" />
      </div>
      <span className="font-heading">AskDesk</span>
    </Link>
  )
}
