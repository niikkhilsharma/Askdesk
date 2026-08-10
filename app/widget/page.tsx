"use client"

import UserMessageBubble from "@/components/widget/user-message-bubble"
import AssistantMessageBubble from "@/components/widget/assistant-message-bubble"
import WidgetHeader from "@/components/widget/widget-header"
import { useChat } from "@ai-sdk/react"
import WidgetInput from "@/components/widget/widget-input"

export default function WidgetPage() {
  const { messages, sendMessage } = useChat()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <WidgetHeader />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-background px-2 py-4">
        <h6 className="text-center text-sm text-muted-foreground">
          Today, 2:24pm
        </h6>

        <div className="my-2">
          {messages.map((message) => (
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
          ))}
        </div>
      </div>

      {/* Input */}
      <WidgetInput sendMessage={sendMessage} />
    </div>
  )
}
