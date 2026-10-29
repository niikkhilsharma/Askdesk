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

const EXAMPLE_ROWS = [
  {
    question: "What are your hours?",
    outcome: "Answered",
    detail: "visitor-guide.pdf, page 1",
  },
  {
    question: "Do you accept insurance?",
    outcome: "Answered",
    detail: "billing.pdf, page 2",
  },
  {
    question: "Can I book Thursday morning?",
    outcome: "Booked",
    detail: "Front desk calendar",
  },
  {
    question: "Do you validate parking?",
    outcome: "Handed to the team",
    detail: "No matching page",
  },
]

/** Illustrative question list for the clinic preview, labeled as a sample. */
export function LandingAnalytics() {
  return (
    <LandingSection id="analytics" labelledBy="analytics-title">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <LandingSectionIntro
          id="analytics-title"
          title="See what visitors keep asking"
          align="start"
        >
          Topics, questions the bot could not answer, and the page someone was
          on. Use that to fix a policy or add a page, and the next reply can use
          it.
        </LandingSectionIntro>
        <Card>
          <CardHeader>
            <CardTitle>
              <h3 className="font-heading text-base font-semibold">
                Riverside Clinic
              </h3>
            </CardTitle>
            <CardDescription>
              Preview of a clinic account. Sample questions, for illustration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {EXAMPLE_ROWS.map((row) => (
                <li
                  key={row.question}
                  className="flex flex-col gap-2 rounded-xl bg-muted/60 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="text-sm font-medium">{row.question}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.detail}
                    </p>
                  </div>
                  <Badge variant="outline">{row.outcome}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </LandingSection>
  )
}
