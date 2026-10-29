import { INSTALL_SNIPPET, STEPS } from "@/components/landing/content"
import { LandingCopyButton } from "@/components/landing/landing-copy-button"
import {
  LandingHeading,
  LandingSection,
} from "@/components/landing/landing-section"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

/** Three setup steps, each with a small coded preview. */
export function LandingSteps() {
  return (
    <LandingSection muted titleId="steps-title">
      <LandingHeading
        id="steps-title"
        title="Live on your site in three steps"
      />
      <ol className="mt-12 grid gap-4 lg:grid-cols-3">
        {STEPS.map((step) => (
          <li
            key={step.id}
            className="landing-rise flex min-w-0 flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">
              Step {step.number}
            </p>
            <h3 className="font-heading text-xl font-semibold">{step.title}</h3>
            <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
              {step.body}
            </p>
            {step.id === "knowledge" ? <KnowledgeMock /> : null}
            {step.id === "brand" ? <BrandMock /> : null}
            {step.id === "snippet" ? <SnippetMock /> : null}
          </li>
        ))}
      </ol>
    </LandingSection>
  )
}

/** Static preview of a site URL being read. */
function KnowledgeMock() {
  return (
    <div className="mt-auto flex flex-col gap-3 rounded-xl border bg-background p-3">
      <label className="text-xs text-muted-foreground" htmlFor="sample-url">
        Website URL
      </label>
      <Input
        id="sample-url"
        readOnly
        value="https://northsidedental.example"
        aria-label="Sample website URL"
      />
      <Progress value={72} aria-label="Sample crawl, 72 percent" />
    </div>
  )
}

/** Static colour dots standing in for the theme picker. */
function BrandMock() {
  return (
    <div className="mt-auto flex items-center gap-3 rounded-xl border bg-background p-3">
      <span className="size-8 rounded-full bg-primary" aria-hidden />
      <span className="size-8 rounded-full bg-chart-2" aria-hidden />
      <span className="size-8 rounded-full bg-chart-4" aria-hidden />
      <span className="text-sm text-muted-foreground">Greeting and tone</span>
    </div>
  )
}

/** Install snippet with a button that copies it. */
function SnippetMock() {
  return (
    <div className="mt-auto flex flex-col gap-3">
      <pre className="overflow-x-auto rounded-xl bg-muted p-3 font-mono text-xs leading-relaxed text-foreground">
        <code>{INSTALL_SNIPPET}</code>
      </pre>
      <LandingCopyButton text={INSTALL_SNIPPET} />
    </div>
  )
}
