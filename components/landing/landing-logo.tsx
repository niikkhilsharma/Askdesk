import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"

/** Renders the Askdesk wordmark linking back to the homepage. */
export function LandingLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-medium">
      <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <GalleryVerticalEnd className="size-4" />
      </div>
      <span className="font-heading">Askdesk</span>
    </Link>
  )
}
