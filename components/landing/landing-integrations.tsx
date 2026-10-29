import {
  Braces,
  Code,
  Hash,
  Users,
  Webhook,
  type LucideIcon,
} from "lucide-react"
import {
  siCaldotcom,
  siCalendly,
  siDiscord,
  siFramer,
  siGooglecalendar,
  siGooglesheets,
  siHubspot,
  siInstagram,
  siMake,
  siMessenger,
  siShopify,
  siSquarespace,
  siStripe,
  siTelegram,
  siWebflow,
  siWhatsapp,
  siWix,
  siWordpress,
  siZapier,
  siZendesk,
  type SimpleIcon,
} from "simple-icons"

import {
  INTEGRATION_FOOTNOTE,
  INTEGRATION_GROUPS,
} from "@/components/landing/content"
import { LandingBrandMark } from "@/components/landing/landing-brand-mark"
import {
  LandingHeading,
  LandingSection,
} from "@/components/landing/landing-section"
import { Badge } from "@/components/ui/badge"

const BRANDS: Record<string, SimpleIcon> = {
  WordPress: siWordpress,
  Shopify: siShopify,
  Webflow: siWebflow,
  Wix: siWix,
  Squarespace: siSquarespace,
  Framer: siFramer,
  WhatsApp: siWhatsapp,
  Messenger: siMessenger,
  Instagram: siInstagram,
  Telegram: siTelegram,
  Discord: siDiscord,
  Zapier: siZapier,
  Make: siMake,
  HubSpot: siHubspot,
  Zendesk: siZendesk,
  Calendly: siCalendly,
  "Cal.com": siCaldotcom,
  "Google Calendar": siGooglecalendar,
  Stripe: siStripe,
  "Google Sheets": siGooglesheets,
}

const FALLBACK_ICONS: Record<string, LucideIcon> = {
  "Any HTML site": Code,
  Slack: Hash,
  "Microsoft Teams": Users,
  Salesforce: Users,
  "REST API": Braces,
  Webhooks: Webhook,
  "JavaScript SDK": Code,
}

/** Grouped marks for sites, messaging apps, and business tools. */
export function LandingIntegrations() {
  return (
    <LandingSection id="integrations" titleId="integrations-title">
      <LandingHeading
        id="integrations-title"
        title="Works where your customers already are"
        subtitle="Embed on any site, answer on messaging apps, and push data into the tools your team uses."
      />
      <div className="mt-12 flex flex-col gap-10">
        {INTEGRATION_GROUPS.map((group) => (
          <div key={group.id} className="flex flex-col gap-4">
            <h3 className="font-heading text-lg font-semibold">
              {group.title}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => {
                const brand = BRANDS[item]
                const Fallback = FALLBACK_ICONS[item]
                return (
                  <li key={item}>
                    <span className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-chart-2">
                      {brand ? (
                        <LandingBrandMark icon={brand} />
                      ) : Fallback ? (
                        <Fallback className="size-4 shrink-0" aria-hidden />
                      ) : null}
                      {item}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      <Badge variant="outline" className="mt-8">
        {INTEGRATION_FOOTNOTE}
      </Badge>
    </LandingSection>
  )
}
