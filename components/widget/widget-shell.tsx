import { WidgetDummyConversation } from "@/components/widget/widget-dummy-conversation"
import WidgetHeader from "@/components/widget/widget-header"

/**
 * Shows the bot shell.
 * WidgetDummyConversation is a temporary snapshot stand-in. See that file for how to remove it.
 */
export function WidgetShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <WidgetHeader />
      <WidgetDummyConversation />
    </div>
  )
}
