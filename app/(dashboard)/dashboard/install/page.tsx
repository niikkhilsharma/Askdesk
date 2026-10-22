import { auth } from "@/auth"
import { HostSiteForm } from "@/components/dashboard/install/host-site-form"
import { HostSiteList } from "@/components/dashboard/install/host-site-list"
import { InstallSnippet } from "@/components/dashboard/install/install-snippet"
import { getInstallState } from "@/lib/install/bots"
import {
  buildInstallSnippet,
  originFromRequestHeaders,
} from "@/lib/install/snippet"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

/** Shows the install snippet and the sites where the bot may run. */
export default async function InstallPage() {
  const [session, headerList] = await Promise.all([auth(), headers()])

  if (!session?.user) {
    redirect("/login")
  }
  const { bot, hostSites } = await getInstallState(Number(session.user.id))
  const snippet = buildInstallSnippet(
    originFromRequestHeaders(headerList),
    bot.publicId
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Install</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Add each site where this bot may run. The snippet names your bot. It
          runs only on the sites listed here, and visitors there can ask it
          questions.
        </p>
      </div>

      <section className="max-w-3xl space-y-4">
        <div>
          <h2 className="text-lg font-medium">Sites</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste a page address. Only the site itself is saved, so a different
            subdomain or <span className="font-mono">http</span> is a different
            site.
          </p>
        </div>
        <HostSiteForm
          key={hostSites.map((hostSite) => hostSite.id).join(",")}
        />
        <HostSiteList hostSites={hostSites} />
      </section>

      <section className="max-w-3xl space-y-4">
        <div>
          <h2 className="text-lg font-medium">Snippet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste this into the shared layout of each site, just before{" "}
            <span className="font-mono">&lt;/body&gt;</span>. The bot stays
            hidden until that site is listed above.
          </p>
        </div>
        <InstallSnippet snippet={snippet} />
      </section>
    </div>
  )
}
