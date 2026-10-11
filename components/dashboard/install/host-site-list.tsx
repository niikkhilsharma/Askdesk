import { removeHostSiteAction } from "@/app/actions/install"
import { Button } from "@/components/ui/button"
import type { HostSite } from "@/db/schema"

type HostSiteListProps = {
  hostSites: HostSite[]
}

/** Lists the sites where the bot may run, and removes one at a time. */
export function HostSiteList({ hostSites }: HostSiteListProps) {
  if (hostSites.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        The bot runs nowhere until you add a site.
      </p>
    )
  }

  return (
    <ul className="divide-y rounded-xl border">
      {hostSites.map((hostSite) => (
        <li
          key={hostSite.id}
          className="flex items-center justify-between gap-3 px-4 py-3"
        >
          <a
            href={hostSite.origin}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 truncate font-mono text-sm text-primary underline-offset-4 hover:underline"
          >
            {hostSite.origin}
          </a>
          <form action={removeHostSiteAction}>
            <input type="hidden" name="hostSiteId" value={hostSite.id} />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              aria-label={`Remove ${hostSite.origin}`}
            >
              Remove
            </Button>
          </form>
        </li>
      ))}
    </ul>
  )
}
