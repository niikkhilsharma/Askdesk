"use client"

import { USE_CASES } from "@/components/landing/content"
import {
  LandingHeading,
  LandingSection,
} from "@/components/landing/landing-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/** Tabs of sample businesses and the questions their customers ask. */
export function LandingAudiences() {
  return (
    <LandingSection muted id="use-cases" titleId="use-cases-title">
      <LandingHeading
        id="use-cases-title"
        title="Built for businesses that get asked a lot"
      />
      <Tabs defaultValue={USE_CASES[0].id} className="mt-12 min-w-0">
        <div className="max-w-full overflow-x-auto">
          <TabsList className="w-max">
            {USE_CASES.map((useCase) => (
              <TabsTrigger key={useCase.id} value={useCase.id}>
                {useCase.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {USE_CASES.map((useCase) => (
          <TabsContent key={useCase.id} value={useCase.id} className="mt-6">
            <div className="grid items-start gap-6 lg:grid-cols-2">
              <div className="flex flex-col gap-4">
                <h3 className="font-heading text-xl font-semibold">
                  {useCase.title}
                </h3>
                <p className="max-w-prose text-sm leading-relaxed text-pretty text-muted-foreground">
                  {useCase.description}
                </p>
                <ul className="flex flex-col gap-2">
                  {useCase.questions.map((question) => (
                    <li
                      key={question}
                      className="rounded-full border bg-card px-3 py-1.5 text-sm"
                    >
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm">
                <p className="text-sm font-medium">{useCase.title}</p>
                <div className="flex justify-end">
                  <p className="max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                    {useCase.questions[0]}
                  </p>
                </div>
                <p className="max-w-[90%] rounded-lg bg-muted px-3 py-2 text-sm leading-relaxed">
                  {useCase.reply}
                </p>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </LandingSection>
  )
}
