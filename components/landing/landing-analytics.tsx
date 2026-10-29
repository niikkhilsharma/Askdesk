import {
  ANALYTICS_POINTS,
  PLACEHOLDER_ANALYTICS,
} from "@/components/landing/content"
import {
  LandingHeading,
  LandingSection,
} from "@/components/landing/landing-section"
import { Badge } from "@/components/ui/badge"

/** Sample analytics card and the reports owners can export. */
export function LandingAnalytics() {
  const maxBar = Math.max(...PLACEHOLDER_ANALYTICS.bars)

  return (
    <LandingSection muted titleId="analytics-title">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <LandingHeading
            id="analytics-title"
            align="start"
            title="See what your customers really want to know"
            subtitle="Track conversations, resolution, leads and satisfaction, and spot the questions your bot couldn’t answer so you can fill the gaps."
          />
          <ul className="flex flex-col gap-2">
            {ANALYTICS_POINTS.map((point) => (
              <li key={point} className="text-sm leading-relaxed">
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="font-heading text-lg font-semibold">This week</p>
            <Badge variant="outline">Sample data</Badge>
          </div>
          <ul className="grid grid-cols-3 gap-2">
            {PLACEHOLDER_ANALYTICS.kpis.map((kpi) => (
              <li key={kpi.label} className="rounded-xl bg-muted px-3 py-3">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="font-heading text-2xl font-semibold">
                  {kpi.value}
                </p>
              </li>
            ))}
          </ul>
          <svg
            viewBox="0 0 280 88"
            className="h-24 w-full text-chart-2"
            role="img"
            aria-label="Sample chart of conversations across seven days"
          >
            {PLACEHOLDER_ANALYTICS.bars.map((value, index) => {
              const height = Math.round((value / maxBar) * 72)
              return (
                <rect
                  key={index}
                  x={index * 40 + 6}
                  y={80 - height}
                  width="22"
                  height={height}
                  rx="6"
                  className="fill-current"
                />
              )
            })}
          </svg>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Top unanswered questions</p>
            <ol className="flex flex-col gap-2">
              {PLACEHOLDER_ANALYTICS.unanswered.map((item, index) => (
                <li
                  key={item.question}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="min-w-0 truncate">
                    {index + 1}. {item.question}
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {item.count}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </LandingSection>
  )
}
