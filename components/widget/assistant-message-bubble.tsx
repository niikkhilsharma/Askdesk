import { Avatar, AvatarFallback } from "@/components/ui/avatar"

/** Renders an assistant chat bubble with the Askdesk avatar fallback. */
export default function AssistantMessageBubble({
  message,
}: {
  message: string
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg p-2">
      <Avatar className="mt-1">
        <AvatarFallback>A</AvatarFallback>
      </Avatar>

      <div className="flex max-w-[80%] flex-col gap-2 rounded-lg bg-muted p-2">
        <p className="text-foreground">{message}</p>
        <p className="text-sm text-muted-foreground">Today, 2:24pm</p>
      </div>
    </div>
  )
}
