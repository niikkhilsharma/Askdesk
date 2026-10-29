// TODO: replace prices, limits, the sales address, logos, and sample analytics with live data.

export const SITE_NAME = "AskDesk"

export const SITE_TITLE =
  "AskDesk: AI chatbot for your website, trained on your content"

export const SITE_DESCRIPTION =
  "Train AskDesk on your website, docs, and files. It answers visitors around the clock, cites its sources, and hands tricky chats to your team."

export const PLACEHOLDER_SALES_EMAIL = "hello@example.com"

export const INSTALL_SNIPPET = `<script
  src="https://askdesk.example/widget.js"
  data-bot="your-bot"
></script>`

export const NAV_LINKS = [
  { href: "#features", label: "Product" },
  { href: "#integrations", label: "Integrations" },
  { href: "#use-cases", label: "Use cases" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const

export const HERO = {
  eyebrow: "AI support agent for your website",
  title: "A chatbot for your website. Your customers get answers.",
  subtitle:
    "Train AskDesk on your website, docs and files in minutes. It answers visitors around the clock, cites its sources, captures leads, and hands tricky chats to your team.",
  primary: "Build your chatbot free",
  secondary: "See it answer",
  micro: "No credit card · Live in minutes · Works on any website",
} as const

export const DEMO_SITE = {
  name: "Northside Dental",
  note: "Sample",
  host: "northsidedental.example",
} as const

export const SOCIAL_PROOF =
  "Small businesses and growing teams use AskDesk to answer the questions they used to email back."

export const PLACEHOLDER_LOGOS = [
  { id: "logo-1", label: "Your logo here" },
  { id: "logo-2", label: "Your logo here" },
  { id: "logo-3", label: "Your logo here" },
  { id: "logo-4", label: "Your logo here" },
  { id: "logo-5", label: "Your logo here" },
  { id: "logo-6", label: "Your logo here" },
] as const

export const CONTRAST = {
  title: "Stop answering the same email twice.",
  subtitle:
    "Hours, prices, policies, “do you take my insurance?” Your customers ask the same things every day. AskDesk answers them on your site, instantly, so your team can do the work only they can do.",
  without: {
    title: "Without AskDesk",
    items: [
      "The same questions sit in the inbox for hours.",
      "After-hours visitors leave without an answer.",
      "A generic bot invents hours, prices, and policies.",
    ],
  },
  with: {
    title: "With AskDesk",
    items: [
      "Visitors get an answer on your site, right away.",
      "Every reply points to the page or file it came from.",
      "Leads are collected while the office is closed.",
    ],
  },
} as const

export const STEPS = [
  {
    id: "knowledge",
    number: "1",
    title: "Add your knowledge",
    body: "Paste your website URL, upload PDFs and docs, or connect Notion and Google Drive. AskDesk reads it all and keeps it in sync.",
  },
  {
    id: "brand",
    number: "2",
    title: "Make it yours",
    body: "Pick colours, logo, greeting and tone. Test answers privately before anyone sees it.",
  },
  {
    id: "snippet",
    number: "3",
    title: "Paste one snippet",
    body: "Copy a single script tag into your site, or install it on WordPress, Shopify, Webflow or Wix. You’re live.",
  },
] as const

export const FEATURES = [
  {
    id: "sources",
    title: "Answers with sources",
    body: "Every reply cites the page or file it came from, and it says “I’m not sure” instead of guessing.",
    large: true,
  },
  {
    id: "handoff",
    title: "Human handoff and live chat",
    body: "One tap hands the chat to your team in a shared inbox, with the whole conversation attached.",
    large: true,
  },
  {
    id: "trained",
    title: "Trained on your content",
    body: "Website, PDFs, docs, FAQs and plain text, all in one knowledge base.",
    large: false,
  },
  {
    id: "sync",
    title: "Auto-sync",
    body: "Re-crawls your site on a schedule, so a changed price is never out of date.",
    large: false,
  },
  {
    id: "leads",
    title: "Lead capture",
    body: "Collect names, emails and phone numbers mid-conversation and send them to your CRM.",
    large: false,
  },
  {
    id: "actions",
    title: "Actions",
    body: "Book appointments, create support tickets, look up orders, and trigger webhooks or custom API calls.",
    large: false,
  },
  {
    id: "languages",
    title: "Multilingual",
    body: "Replies in your visitor’s language, in 95+ languages, from the same knowledge base.",
    large: false,
  },
  {
    id: "corrections",
    title: "Answer correction",
    body: "Fix a reply once and AskDesk remembers it everywhere.",
    large: false,
  },
  {
    id: "models",
    title: "Choice of AI models",
    body: "Pick from leading models from OpenAI, Anthropic, Google and more. Switch any time.",
    large: false,
  },
  {
    id: "suggestions",
    title: "Smart suggestions",
    body: "Starter questions and follow-up chips guide visitors to answers faster.",
    large: false,
  },
] as const

export const DATA_SOURCES = [
  "Website crawl",
  "Sitemap",
  "Single URLs",
  "PDF",
  "Word (DOCX)",
  "TXT / Markdown",
  "CSV",
  "Notion",
  "Google Drive",
  "Dropbox",
  "OneDrive",
  "Confluence",
  "YouTube transcripts",
  "Q&A pairs",
  "Plain text",
] as const

export const SOURCE_CALLOUT = "Upload once. Re-sync daily, weekly or on demand."

export const INTEGRATION_GROUPS = [
  {
    id: "sites",
    title: "Website platforms",
    items: [
      "WordPress",
      "Shopify",
      "Webflow",
      "Wix",
      "Squarespace",
      "Framer",
      "Any HTML site",
    ],
  },
  {
    id: "messaging",
    title: "Messaging",
    items: [
      "WhatsApp",
      "Messenger",
      "Instagram",
      "Telegram",
      "Slack",
      "Microsoft Teams",
      "Discord",
    ],
  },
  {
    id: "tools",
    title: "Business tools",
    items: [
      "Zapier",
      "Make",
      "HubSpot",
      "Salesforce",
      "Zendesk",
      "Calendly",
      "Cal.com",
      "Google Calendar",
      "Stripe",
      "Google Sheets",
    ],
  },
  {
    id: "developers",
    title: "Developers",
    items: ["REST API", "Webhooks", "JavaScript SDK"],
  },
] as const

export const INTEGRATION_FOOTNOTE = "Thousands more apps via Zapier and Make."

export const USE_CASES = [
  {
    id: "clinics",
    label: "Clinics",
    title: "Clinics and professional services",
    description:
      "Patients ask about hours, insurance, and booking before they ever call the front desk.",
    questions: [
      "What are your hours?",
      "Do you take my insurance?",
      "Can I book a cleaning?",
    ],
    reply:
      "We’re open Monday to Friday, 8am to 6pm. Most major plans are accepted, and you can book a cleaning from this chat.",
  },
  {
    id: "courses",
    label: "Courses",
    title: "Courses and coaching",
    description:
      "Students check fees, the schedule, and whether they qualify, without waiting on an email.",
    questions: [
      "What does the course cost?",
      "When does the next cohort start?",
      "Who is this for?",
    ],
    reply:
      "The next cohort starts on the first Monday of the month. Tuition and who it’s for are both on the course page, and I can point you to the exact section.",
  },
  {
    id: "hospitality",
    label: "Hospitality",
    title: "Hotels, gyms and spas",
    description:
      "Guests ask about rates, amenities, and house rules while they’re still deciding.",
    questions: [
      "What are tonight’s rates?",
      "Do you have a pool?",
      "What’s the cancellation policy?",
    ],
    reply:
      "Weeknight rates start at the figure on the rooms page. There’s a pool, and cancellations are free up to 48 hours before arrival.",
  },
  {
    id: "commerce",
    label: "E-commerce",
    title: "E-commerce",
    description:
      "Shoppers ask where an order is, how returns work, and which product fits.",
    questions: [
      "Where is my order?",
      "How do returns work?",
      "Which size should I pick?",
    ],
    reply:
      "Orders placed before 2pm ship the same weekday. Returns are accepted within 30 days, and the size guide is linked on the product page.",
  },
  {
    id: "saas",
    label: "SaaS",
    title: "SaaS",
    description:
      "Users ask how to set it up, what it costs, and what to try when something breaks.",
    questions: [
      "How do I install it?",
      "What’s the difference between plans?",
      "Why isn’t the widget showing?",
    ],
    reply:
      "Paste the script tag, allow your domain, and the widget loads on that site. Plan limits are on the pricing page, and a hidden widget usually means the domain isn’t on the allow-list.",
  },
  {
    id: "agencies",
    label: "Agencies",
    title: "Agencies",
    description:
      "Deploy white-labelled chatbots for every client from one account.",
    questions: [
      "Can each client have their own bot?",
      "Can we hide your branding?",
      "Do clients share one inbox?",
    ],
    reply:
      "Each client gets their own chatbot, knowledge base, and domain list. Branding can be removed, and your team can run them from one account.",
  },
] as const

export const BRANDING_POINTS = [
  "Custom instructions and persona",
  "Welcome message",
  "Suggested questions",
  "Placement on the page",
  "Custom CSS",
  "White-label",
] as const

export const BRANDING_SWATCHES = [
  { id: "ink", label: "Ink" },
  { id: "blue", label: "Blue" },
  { id: "deep", label: "Deep blue" },
  { id: "stone", label: "Stone" },
] as const

export const PLACEHOLDER_ANALYTICS = {
  kpis: [
    { label: "Conversations", value: "128" },
    { label: "Resolved", value: "96" },
    { label: "Leads", value: "14" },
  ],
  bars: [36, 52, 44, 70, 58, 84, 76],
  unanswered: [
    { question: "Do you offer payment plans?", count: 11 },
    { question: "Where do I park?", count: 7 },
    { question: "Can I reschedule online?", count: 4 },
  ],
} as const

export const ANALYTICS_POINTS = [
  "Conversation history and transcripts",
  "CSAT ratings",
  "Knowledge-gap report",
  "Weekly email digest",
  "CSV export",
] as const

export const SECURITY_POINTS = [
  {
    id: "iframe",
    title: "Isolated widget",
    body: "Runs in a sandboxed iframe that can’t touch your site’s code.",
  },
  {
    id: "domains",
    title: "Domain allow-list",
    body: "Only the sites you approve can load your bot.",
  },
  {
    id: "private",
    title: "Private by design",
    body: "Your content is kept in its own index and never used to train public models.",
  },
  {
    id: "encryption",
    title: "Encryption",
    body: "Encrypted in transit and at rest.",
  },
  {
    id: "limits",
    title: "Rate limits and usage caps",
    body: "Stop abuse and surprise bills.",
  },
  {
    id: "control",
    title: "Data control",
    body: "Export or delete conversations and sources any time. GDPR-friendly.",
  },
] as const

export type PricingPlanId = "free" | "standard" | "pro" | "business"

export type PricingPlan = {
  id: PricingPlanId
  name: string
  description: string
  /** USD per month. Null is a custom quote. */
  monthlyPrice: number | null
  highlighted: boolean
  cta: "signup" | "contact"
  features: string[]
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "For one site and a light volume of chats.",
    monthlyPrice: 0,
    highlighted: false,
    cta: "signup",
    features: [
      "1 chatbot",
      "100 messages / month",
      "Website and PDF training",
      "Embed on 1 site",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    description: "For a busy site that wants the full chatbot.",
    monthlyPrice: 20,
    highlighted: true,
    cta: "signup",
    features: [
      "2,000 messages / month",
      "Unlimited sources",
      "Auto-sync weekly",
      "Custom colours and logo",
      "Lead capture",
      "Integrations",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For teams that answer, book, and follow up.",
    monthlyPrice: 49,
    highlighted: false,
    cta: "signup",
    features: [
      "3 chatbots",
      "10,000 messages / month",
      "Human handoff and live inbox",
      "Actions, including booking and tickets",
      "Analytics and knowledge gaps",
      "Remove AskDesk branding",
      "Daily sync",
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "For agencies and companies with many sites.",
    monthlyPrice: null,
    highlighted: false,
    cta: "contact",
    features: [
      "Unlimited chatbots",
      "API and webhooks",
      "White-label for agencies",
      "SSO",
      "Priority support",
    ],
  },
]

export const COMPARISON_ROWS: {
  label: string
  values: Record<PricingPlanId, string>
}[] = [
  {
    label: "Chatbots",
    values: { free: "1", standard: "1", pro: "3", business: "Unlimited" },
  },
  {
    label: "Messages / month",
    values: {
      free: "100",
      standard: "2,000",
      pro: "10,000",
      business: "Custom",
    },
  },
  {
    label: "Training",
    values: {
      free: "Website and PDF",
      standard: "Unlimited sources",
      pro: "Unlimited sources",
      business: "Unlimited sources",
    },
  },
  {
    label: "Auto-sync",
    values: {
      free: "No",
      standard: "Weekly",
      pro: "Daily",
      business: "On demand",
    },
  },
  {
    label: "Lead capture",
    values: { free: "No", standard: "Yes", pro: "Yes", business: "Yes" },
  },
  {
    label: "Integrations",
    values: { free: "No", standard: "Yes", pro: "Yes", business: "Yes" },
  },
  {
    label: "Human handoff",
    values: { free: "No", standard: "No", pro: "Yes", business: "Yes" },
  },
  {
    label: "Actions",
    values: { free: "No", standard: "No", pro: "Yes", business: "Yes" },
  },
  {
    label: "Analytics",
    values: { free: "No", standard: "No", pro: "Yes", business: "Yes" },
  },
  {
    label: "Remove branding",
    values: { free: "No", standard: "No", pro: "Yes", business: "Yes" },
  },
  {
    label: "API and webhooks",
    values: { free: "No", standard: "No", pro: "No", business: "Yes" },
  },
  {
    label: "White-label",
    values: { free: "No", standard: "No", pro: "No", business: "Yes" },
  },
  {
    label: "SSO",
    values: { free: "No", standard: "No", pro: "No", business: "Yes" },
  },
]

export const FAQ_ITEMS = [
  {
    id: "install",
    question: "How do I add AskDesk to my website?",
    answer:
      "Copy one script tag into your site, or install it on WordPress, Shopify, Webflow, or Wix. You choose which domains may load the widget, so it only appears where you allow it. Most sites are answering visitors the same day.",
  },
  {
    id: "train",
    question: "What can I train it on?",
    answer:
      "Your website, sitemap, and individual pages, plus PDFs, Word documents, text, spreadsheets, and Q&A pairs. You can also connect Notion, Google Drive, Dropbox, OneDrive, Confluence, and YouTube transcripts. AskDesk keeps that material in one knowledge base for your account.",
  },
  {
    id: "fresh",
    question:
      "How long does training take, and does it stay up to date when my site changes?",
    answer:
      "A typical site and a handful of files are ready in minutes. AskDesk re-crawls on a schedule you pick — daily, weekly, or whenever you ask — so a changed price or policy is not left behind. You can also re-sync on demand from the dashboard.",
  },
  {
    id: "unknown",
    question: "What happens when the bot doesn’t know an answer?",
    answer:
      "It says it isn’t sure, instead of guessing, and it cites the page or file when it does know. Those unanswered questions show up in your knowledge-gap report. Add the missing source, or correct the reply once, and AskDesk uses that correction from then on.",
  },
  {
    id: "handoff",
    question: "Can a real person take over a conversation?",
    answer:
      "Yes. A visitor can ask to talk to a person, and the chat moves to your shared inbox with the full thread attached. Your team replies from there, and the visitor stays in the same window on your site.",
  },
  {
    id: "languages",
    question: "Does it work in other languages?",
    answer:
      "AskDesk replies in the visitor’s language, across 95+ languages, from the same knowledge base. You don’t keep a separate bot for each language. The citation still points at your original source.",
  },
  {
    id: "brand",
    question: "Can I customise how it looks and sounds?",
    answer:
      "You set colours, logo, launcher, greeting, suggested questions, and tone of voice. Custom instructions shape the persona. You can remove AskDesk branding or run the widget on your own domain.",
  },
  {
    id: "data",
    question: "Is my data safe, and is it used to train AI models?",
    answer:
      "Your content stays in its own index and is not used to train public models. The widget runs in a sandboxed iframe, and traffic is encrypted in transit and at rest. You can export or delete conversations and sources whenever you want.",
  },
  {
    id: "models",
    question: "Which AI models does AskDesk use?",
    answer:
      "You pick from leading models from OpenAI, Anthropic, Google, and more, and you can switch whenever you like. Answers stay grounded in your knowledge base no matter which model you choose. The citation is part of the reply either way.",
  },
  {
    id: "agencies",
    question: "Do you offer plans for agencies or white-label?",
    answer:
      "The Business plan covers unlimited chatbots, the API and webhooks, white-label for client sites, SSO, and priority support. Agencies run a separate bot for each client from one account. Write to us and we’ll match the plan to your client list.",
  },
] as const

export const FINAL_CTA = {
  title: "Give your customers answers tonight.",
  subtitle: "Set up AskDesk in minutes. Free to start, no credit card.",
} as const

export const FOOTER_TAGLINE =
  "A chatbot for your website. Your customers get answers."

export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Integrations", href: "#integrations" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#changelog" },
    ],
  },
  {
    title: "Use cases",
    links: [
      { label: "Clinics", href: "#use-cases" },
      { label: "Courses", href: "#use-cases" },
      { label: "Hospitality", href: "#use-cases" },
      { label: "Agencies", href: "#use-cases" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#docs" },
      { label: "Help center", href: "#help" },
      { label: "API", href: "#api" },
      { label: "Blog", href: "#blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
    ],
  },
] as const

/** Returns the amount and period for a plan on monthly or yearly billing. */
export function planPrice(plan: PricingPlan, yearly: boolean) {
  if (plan.monthlyPrice === null) {
    return { amount: "Custom", period: "" }
  }

  if (!yearly || plan.monthlyPrice === 0) {
    return {
      amount: `$${plan.monthlyPrice}`,
      period: yearly ? "/year" : "/month",
    }
  }

  return { amount: `$${plan.monthlyPrice * 10}`, period: "/year" }
}

/** Builds SoftwareApplication structured data, including the priced plans. */
export function softwareJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: SITE_DESCRIPTION,
    url: siteUrl,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "0",
      highPrice: "49",
      priceCurrency: "USD",
      offerCount: "3",
    },
  }
}

/** Builds FAQPage structured data from the landing questions. */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}
