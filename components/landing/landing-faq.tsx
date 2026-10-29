import { FAQ_ITEMS } from "@/components/landing/content"
import {
  LandingHeading,
  LandingSection,
} from "@/components/landing/landing-section"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

/** Answers to the questions buyers ask before they sign up. */
export function LandingFaq() {
  return (
    <LandingSection id="faq" titleId="faq-title">
      <LandingHeading id="faq-title" title="Questions, answered" />
      <Accordion type="single" collapsible className="mx-auto mt-12 max-w-3xl">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <p>{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </LandingSection>
  )
}
