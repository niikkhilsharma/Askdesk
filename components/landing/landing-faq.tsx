import {
  LandingSection,
  LandingSectionIntro,
} from "@/components/landing/landing-section"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ = [
  {
    question: "How do I put Askdesk on my site?",
    answer:
      "Create an account, add the knowledge you want it to use, and copy the install snippet into the shared layout of each site, just before the closing body tag. Then name that host site. The launcher appears there.",
  },
  {
    question: "What can the bot answer from?",
    answer:
      "Your website, PDFs, Notion, Google Drive, text you paste, and question-and-answer pairs you write. That is one knowledge base for the account. When a reply uses a file, it names the file and the page.",
  },
  {
    question: "What if it does not know the answer?",
    answer:
      "It says so. You can hand the thread to a person on your team, or the bot can ask the visitor for a name and email so you can follow up.",
  },
  {
    question: "Can visitors ask in another language?",
    answer:
      "Yes. The bot replies in the language the visitor wrote in, using the same knowledge base.",
  },
  {
    question: "Do I need a developer?",
    answer:
      "A normal site needs the install snippet and the host site named in the dashboard. If you want the bot inside your own app, use the API.",
  },
  {
    question: "Where will the bot show up?",
    answer:
      "On the host sites you have named, and in Slack, WhatsApp, Shopify, WordPress, and Zapier when you connect them. A copied snippet on an address you have not named does not run.",
  },
  {
    question: "Can I change how it looks?",
    answer:
      "Yes. Set the name, the colors, and the welcome line so the launcher and panel match the site.",
  },
  {
    question: "Who can see my files?",
    answer:
      "They stay with your account. Other accounts do not search them. Delete a document in the dashboard and it leaves the knowledge base.",
  },
  {
    question: "How do I start?",
    answer:
      "Create an account. It is free to start. You can ask the bot questions in the dashboard before it is on a host site.",
  },
]

/** Frequently asked questions about setup, sources, handoff, and privacy. */
export function LandingFaq() {
  return (
    <LandingSection id="faq" labelledBy="faq-title" className="bg-muted/40">
      <LandingSectionIntro id="faq-title" title="Questions people ask first">
        Setup, sources, languages, and what happens when the bot does not know.
      </LandingSectionIntro>
      <div className="mx-auto mt-12 max-w-3xl">
        <Accordion type="single" collapsible>
          {FAQ.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </LandingSection>
  )
}
