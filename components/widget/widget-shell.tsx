"use client"

import dynamic from "next/dynamic"

import WidgetHeader from "@/components/widget/widget-header"

const WidgetConversation = dynamic(
  () =>
    import("@/components/widget/widget-conversation").then(
      (mod) => mod.WidgetConversation
    ),
  { ssr: false }
)

/** Shows the bot shell for a visitor on an allowed host site. */
export function WidgetShell({ botId }: { botId: string }) {
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background text-foreground">
      <WidgetHeader />
      <WidgetConversation key={botId} botId={botId} />
    </div>
  )
}
