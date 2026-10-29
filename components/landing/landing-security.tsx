import { FileSearch, GlobeLock, Lock, Trash2 } from "lucide-react"

import {
  LandingSection,
  LandingSectionIntro,
} from "@/components/landing/landing-section"

const POINTS = [
  {
    title: "Separate for each account",
    body: "Files, search, and chats stay with the account that added them. Another account does not search them.",
    icon: Lock,
  },
  {
    title: "Only the sites you name",
    body: "The install snippet names your bot. It runs after you add that host site. A different subdomain, or the same host over http, is a different site.",
    icon: GlobeLock,
  },
  {
    title: "A source on the answer",
    body: "When a reply uses a file, it names the file and the page. If the knowledge base does not contain the answer, the bot says it does not know.",
    icon: FileSearch,
  },
  {
    title: "Gone when you delete it",
    body: "Delete a document in the dashboard and it leaves the knowledge base, including the search index for that account.",
    icon: Trash2,
  },
]

/** Trust points grounded in account isolation, host sites, citations, and deletion. */
export function LandingSecurity() {
  return (
    <LandingSection
      id="security"
      labelledBy="security-title"
      className="bg-muted/40"
    >
      <LandingSectionIntro
        id="security-title"
        title="Your knowledge stays with your account"
      >
        The bot answers from what you added. You choose the sites it appears on,
        and you can take a document back out.
      </LandingSectionIntro>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {POINTS.map((point) => {
          const Icon = point.icon
          return (
            <li
              key={point.title}
              className="flex gap-4 rounded-2xl border bg-card p-6"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-5" aria-hidden />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-lg font-semibold">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {point.body}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </LandingSection>
  )
}
