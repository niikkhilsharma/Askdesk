import WidgetHeader from "@/components/widget/widget-header"

/** Shows the bot shell and says visitor answers are not live yet. */
export function WidgetShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <WidgetHeader />
      <div className="flex flex-1 items-center justify-center px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Answers are not live yet.
        </p>
      </div>
    </div>
  )
}
