import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AssistantMessageBubble({
  message,
}: {
  message: string
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg p-2">
      <Avatar className="mt-1">
        <AvatarImage src="https://askdesk.com/logo.png" />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>

      <div className="flex max-w-[80%] flex-col gap-2 rounded-lg bg-muted p-2">
        <p className="text-foreground">{message}</p>
        <p className="text-sm text-muted-foreground">Today, 2:24pm</p>
      </div>
    </div>
  )
}
