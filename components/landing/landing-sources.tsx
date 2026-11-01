import {
  FileText,
  Globe,
  Link2,
  ListTree,
  MessageSquareText,
  Table,
  Type,
  Cloud,
  type LucideIcon,
} from "lucide-react"
import {
  siConfluence,
  siDropbox,
  siGoogledrive,
  siNotion,
  siYoutube,
  type SimpleIcon,
} from "simple-icons"

import { DATA_SOURCES, SOURCE_CALLOUT } from "@/components/landing/content"
import { LandingBrandMark } from "@/components/landing/landing-brand-mark"
import {
  LandingHeading,
  LandingSection,
} from "@/components/landing/landing-section"

const SOURCE_ICONS: Record<string, LucideIcon> = {
  "Website crawl": Globe,
  Sitemap: ListTree,
  "Single URLs": Link2,
  PDF: FileText,
  "Word (DOCX)": FileText,
  "TXT / Markdown": Type,
  CSV: Table,
  OneDrive: Cloud,
  "Q&A pairs": MessageSquareText,
  "Plain text": Type,
}

const SOURCE_BRANDS: Record<string, SimpleIcon> = {
  Notion: siNotion,
  "Google Drive": siGoogledrive,
  Dropbox: siDropbox,
  Confluence: siConfluence,
  "YouTube transcripts": siYoutube,
}

/** Grid of the content types AskDesk can learn from. */
export function LandingSources() {
  return (
    <LandingSection muted titleId="sources-title">
      <LandingHeading
        id="sources-title"
        title="Train it on what you already have"
        subtitle="No rewriting. AskDesk learns from the content you’ve already published."
      />
      <ul className="mt-12 flex flex-wrap gap-2">
        {DATA_SOURCES.map((source) => {
          const Brand = SOURCE_BRANDS[source]
          const Icon = SOURCE_ICONS[source]
          return (
            <li
              key={source}
              className="flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm"
            >
              {Brand ? (
                <LandingBrandMark icon={Brand} />
              ) : Icon ? (
                <Icon className="size-4 shrink-0" aria-hidden />
              ) : null}
              {source}
            </li>
          )
        })}
      </ul>
      <p className="mt-8 text-sm font-medium">{SOURCE_CALLOUT}</p>
    </LandingSection>
  )
}
