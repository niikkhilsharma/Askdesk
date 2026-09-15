"use client"

import AssistantMessageBubble from "@/components/widget/assistant-message-bubble"
import UserMessageBubble from "@/components/widget/user-message-bubble"
import WidgetInput from "@/components/widget/widget-input"
import { useChat } from "@ai-sdk/react"

/** Renders the dashboard chat UI wired to the shared /api/chat endpoint. */
export function ChatPanel() {
  const { messages, sendMessage } = useChat()

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-muted/30">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Send a message to start chatting.
          </p>
        ) : (
          messages.map((message) => (
            <div key={message.id}>
              {message.role === "user"
                ? message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <UserMessageBubble
                            key={`${message.id}-${i}`}
                            message={part.text}
                          />
                        )
                    }
                  })
                : message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <AssistantMessageBubble
                            key={`${message.id}-${i}`}
                            message={part.text}
                          />
                        )
                    }
                  })}
            </div>
          ))
        )}
      </div>

      <WidgetInput
        sendMessage={sendMessage}
        className="shrink-0 rounded-b-xl border-t-0"
      />
    </div>
  )
}
