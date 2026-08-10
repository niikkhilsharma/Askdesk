export default function UserMessageBubble({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-end gap-2 rounded-lg p-2">
      <p className="text-sm text-muted-foreground">You</p>

      <div className="flex max-w-[80%] flex-col gap-2 rounded-lg bg-primary p-2 text-primary-foreground">
        <p>{message}</p>
        <p className="text-sm text-primary-foreground/70">Today, 2:24pm</p>
      </div>
    </div>
  )
}
