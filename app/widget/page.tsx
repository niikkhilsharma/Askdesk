import { WidgetShell } from "@/components/widget/widget-shell"
import { isBotAllowedOnOrigin } from "@/lib/install/placement"
import { originFromReferer } from "@/lib/install/origin"
import { headers } from "next/headers"

type WidgetPageProps = {
  searchParams: Promise<{ botId?: string | string[] }>
}

/** Serves the bot shell only when the parent page is an allowed host site. */
export default async function WidgetPage({ searchParams }: WidgetPageProps) {
  const [params, headerList] = await Promise.all([searchParams, headers()])
  const botIdParam = params.botId
  const botId = Array.isArray(botIdParam) ? botIdParam[0] : botIdParam
  const origin = originFromReferer(headerList.get("referer"))
  const allowed =
    Boolean(botId) &&
    origin !== null &&
    (await isBotAllowedOnOrigin(botId ?? "", origin))

  if (!allowed || !botId) {
    return null
  }

  return <WidgetShell botId={botId} />
}
