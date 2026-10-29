import {
  LandingSection,
  LandingSectionIntro,
} from "@/components/landing/landing-section"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const SOURCE_GROUPS = [
  {
    title: "What it reads",
    body: "One knowledge base for the account. Add a source, and the next reply can use it.",
    items: [
      "Your website",
      "PDFs",
      "Notion",
      "Google Drive",
      "Text you paste",
      "Question and answer pairs",
    ],
  },
  {
    title: "Where it answers",
    body: "The same bot, on the host sites you name and in the tools you connect.",
    items: [
      "Host sites you name",
      "Slack",
      "WhatsApp",
      "Shopify",
      "WordPress",
      "Zapier",
    ],
  },
]

/** Knowledge sources and the places the bot can answer. */
export function LandingSources() {
  return (
    <LandingSection
      id="sources"
      labelledBy="sources-title"
      className="bg-muted/40"
    >
      <LandingSectionIntro
        id="sources-title"
        title="One knowledge base, many places it can read"
      >
        Start with the website and the files you already send people. Connect
        the rest when those answers should show up somewhere else too.
      </LandingSectionIntro>
      <ul className="mt-12 grid gap-4 md:grid-cols-2">
        {SOURCE_GROUPS.map((group) => (
          <li key={group.title}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  <h3 className="font-heading text-xl font-semibold">
                    {group.title}
                  </h3>
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {group.body}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Badge variant="secondary">{item}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </LandingSection>
  )
}
