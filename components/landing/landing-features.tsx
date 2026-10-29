import {
  BarChart3,
  CalendarCheck,
  GlobeLock,
  Headset,
  Languages,
  Palette,
  Quote,
  Unplug,
} from "lucide-react"

import {
  LandingSection,
  LandingSectionIntro,
} from "@/components/landing/landing-section"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const FEATURES = [
  {
    title: "Answers from your knowledge base",
    body: "Askdesk looks up the closest passages and answers from those. When it uses a file, it names the file and the page. When the knowledge base does not have it, the bot says so.",
    icon: Quote,
  },
  {
    title: "A launcher on the sites you choose",
    body: "One install snippet names your bot. You list each host site. A page that only contains the snippet, or a different subdomain, does not run it.",
    icon: GlobeLock,
  },
  {
    title: "A person can take the thread",
    body: "When a question needs a person, the visitor can ask for one. Your team gets the conversation so far and replies in the same panel.",
    icon: Headset,
  },
  {
    title: "Leads, bookings, and tickets",
    body: "The bot can ask for a name and email, book a time, or open a ticket, and keep the conversation attached to that request.",
    icon: CalendarCheck,
  },
  {
    title: "The visitor’s language",
    body: "A visitor can write in the language they use. The bot replies in that language, from the same knowledge base.",
    icon: Languages,
  },
  {
    title: "A record of what people ask",
    body: "See the questions that come up, the ones the bot could not answer, and which pages the conversations started on.",
    icon: BarChart3,
  },
  {
    title: "Your name and your colors",
    body: "The launcher and panel use your name, your mark, and your colors. The welcome line is the one you wrote.",
    icon: Palette,
  },
  {
    title: "An API for your own app",
    body: "Ask the same bot from your product, or connect Slack, Zapier, Shopify, and WordPress, and get the same grounded reply.",
    icon: Unplug,
  },
]

/** Feature grid covering answers, handoff, actions, and the surrounding tools. */
export function LandingFeatures() {
  return (
    <LandingSection id="features" labelledBy="features-title">
      <LandingSectionIntro
        id="features-title"
        title="What the bot does once it is live"
      >
        It answers from your knowledge base, keeps a record of what people ask,
        and hands the thread to a person when that is the right next step.
      </LandingSectionIntro>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => {
          const Icon = feature.icon
          return (
            <li key={feature.title}>
              <Card className="h-full" size="sm">
                <CardHeader>
                  <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <CardTitle>
                    <h3 className="font-heading text-lg font-semibold">
                      {feature.title}
                    </h3>
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.body}
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
          )
        })}
      </ul>
    </LandingSection>
  )
}
