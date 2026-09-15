import { ChatPanel } from "@/components/dashboard/chat/chat-panel"

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100svh-2rem)] flex-col gap-4 overflow-hidden">
      <h1 className="shrink-0 text-2xl font-semibold">Chat</h1>
      <ChatPanel />
    </div>
  )
}
