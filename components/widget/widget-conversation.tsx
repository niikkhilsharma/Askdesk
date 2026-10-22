"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"

import AssistantMessageBubble from "@/components/widget/assistant-message-bubble"
import AssistantReplyLoader from "@/components/widget/assistant-reply-loader"
import UserMessageBubble from "@/components/widget/user-message-bubble"
import WidgetInput from "@/components/widget/widget-input"
import {
  acceptVisitorPass,
  deliverVisitorQuestion,
  readVisitorMessages,
  stopVisitorAnswering,
  writeVisitorMessages,
  type VisitorRefresh,
} from "@/lib/chat/visitor-thread"
import { originFromReferer } from "@/lib/install/origin"

type VisitorSession = {
  pass: string | null
  answering: boolean
  messages: UIMessage[]
  waiters: Array<(refresh: VisitorRefresh) => void>
  setAnswering: (answering: boolean) => void
}

const sessions = new WeakMap<object, VisitorSession>()

/** Returns the pass and refresh waiters for one mounted thread. */
function sessionFor(key: object) {
  const existing = sessions.get(key)

  if (existing) {
    return existing
  }

  const session: VisitorSession = {
    pass: null,
    answering: true,
    messages: [],
    waiters: [],
    setAnswering: () => {},
  }

  sessions.set(key, session)
  return session
}

/** Returns the host page origin the widget posts to. */
function hostPageTargetOrigin() {
  if (!document.referrer) {
    return "*"
  }

  try {
    return new URL(document.referrer).origin
  } catch {
    return "*"
  }
}

/** Reads the host page's reply to a pass refresh. */
function refreshFromMessage(data: unknown): VisitorRefresh | null {
  if (typeof data !== "object" || data === null) {
    return null
  }

  const message = data as { type?: unknown; pass?: unknown }

  if (message.type === "askdesk:pass") {
    if (typeof message.pass !== "string" || message.pass.length === 0) {
      return null
    }

    return { outcome: "pass", pass: message.pass }
  }

  if (message.type === "askdesk:denied") {
    return { outcome: "denied" }
  }

  if (message.type === "askdesk:unreachable") {
    return { outcome: "unreachable" }
  }

  return null
}

/** Returns a part's text when a visitor can read it. */
function visiblePartText(part: UIMessage["parts"][number]) {
  if (part.type !== "text" || typeof part.text !== "string") {
    return null
  }

  return part.text.trim().length > 0 ? part.text : null
}

/** Reports whether this assistant message already has reply text. */
function assistantReplyVisible(message: UIMessage) {
  return message.parts.some((part) => visiblePartText(part) !== null)
}

/** Live visitor thread for one bot, kept in this browser. */
export function WidgetConversation({ botId }: { botId: string }) {
  const [sessionKey] = useState(() => ({}))
  const [answering, setAnswering] = useState(true)
  const threadRef = useRef<HTMLDivElement>(null)
  const [initialMessages] = useState(() => {
    if (typeof window === "undefined") {
      return []
    }

    const hostOrigin = originFromReferer(document.referrer)

    if (!hostOrigin) {
      return []
    }

    return readVisitorMessages(window.localStorage, botId, hostOrigin)
  })

  /** Asks the install snippet for a new visitor pass and waits for its reply. */
  const askParentForPass = useCallback(() => {
    if (window.parent === window) {
      return Promise.resolve({ outcome: "unreachable" } as const)
    }

    const waiters = sessionFor(sessionKey).waiters

    return new Promise<VisitorRefresh>((resolve) => {
      waiters.push(resolve)
      window.parent.postMessage(
        { type: "askdesk:refresh" },
        hostPageTargetOrigin()
      )
    })
  }, [sessionKey])

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/widget/chat",
        body: () => ({
          botId,
          pass: sessionFor(sessionKey).pass ?? "",
        }),
        fetch: async (input, init) => {
          const session = sessionFor(sessionKey)
          const result = await deliverVisitorQuestion(
            input,
            init,
            session.pass ?? "",
            askParentForPass
          )
          const next = result.answering
            ? {
                messages: session.messages,
                pass: result.pass,
                answering: session.answering,
              }
            : stopVisitorAnswering({
                messages: session.messages,
                pass: result.pass,
                answering: session.answering,
              })

          session.pass = next.pass
          session.answering = next.answering

          if (!next.answering) {
            session.setAnswering(false)
          }

          return result.response
        },
      }),
    [askParentForPass, botId, sessionKey]
  )

  const { messages, sendMessage, setMessages, status } = useChat({
    id: botId,
    messages: initialMessages,
    transport,
  })

  useEffect(() => {
    const session = sessionFor(sessionKey)
    session.setAnswering = setAnswering
    session.messages = messages
    const hostOrigin = originFromReferer(document.referrer)

    if (hostOrigin) {
      writeVisitorMessages(window.localStorage, botId, hostOrigin, messages)
    }
  }, [botId, messages, sessionKey])

  useEffect(() => {
    const session = sessionFor(sessionKey)
    const waiters = session.waiters

    /** Stores a host-page reply without clearing the thread. */
    function onMessage(event: MessageEvent) {
      if (event.source !== window.parent || window.parent === window) {
        return
      }

      const targetOrigin = hostPageTargetOrigin()

      if (targetOrigin !== "*" && event.origin !== targetOrigin) {
        return
      }

      const refresh = refreshFromMessage(event.data)

      if (!refresh) {
        return
      }

      if (refresh.outcome === "pass") {
        const next = acceptVisitorPass(
          {
            messages: session.messages,
            pass: refresh.pass,
            answering: session.answering,
          },
          refresh.pass
        )

        session.pass = next.pass

        if (next.messages !== session.messages) {
          setMessages(next.messages)
        }

        if (!session.answering) {
          session.answering = true
          session.setAnswering(true)
        }
      }

      const pending = waiters.splice(0)

      for (const waiter of pending) {
        waiter(refresh)
      }
    }

    window.addEventListener("message", onMessage)

    if (window.parent !== window) {
      window.parent.postMessage(
        { type: "askdesk:ready" },
        hostPageTargetOrigin()
      )
    }

    return () => {
      window.removeEventListener("message", onMessage)

      const pending = waiters.splice(0)

      for (const waiter of pending) {
        waiter({ outcome: "unreachable" })
      }
    }
  }, [sessionKey, setMessages])

  const busy = status === "submitted" || status === "streaming"
  const lastMessage = messages.at(-1)
  const awaitingReply =
    answering &&
    busy &&
    (lastMessage?.role !== "assistant" || !assistantReplyVisible(lastMessage))

  useEffect(() => {
    const thread = threadRef.current

    if (!thread) {
      return
    }

    thread.scrollTop = thread.scrollHeight
  }, [messages, awaitingReply])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={threadRef} className="min-h-0 flex-1 overflow-y-auto px-2 py-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Send a message to start chatting.
          </p>
        ) : (
          messages.map((message) => (
            <div key={message.id}>
              {message.role === "user"
                ? message.parts.map((part, index) => {
                    const text = visiblePartText(part)

                    return text ? (
                      <UserMessageBubble
                        key={`${message.id}-${index}`}
                        message={text}
                      />
                    ) : null
                  })
                : message.parts.map((part, index) => {
                    const text = visiblePartText(part)

                    return text ? (
                      <AssistantMessageBubble
                        key={`${message.id}-${index}`}
                        message={text}
                      />
                    ) : null
                  })}
            </div>
          ))
        )}
        {awaitingReply ? <AssistantReplyLoader /> : null}
      </div>

      {!answering ? (
        <p className="shrink-0 px-2 text-center text-sm text-muted-foreground">
          Answering has stopped.
        </p>
      ) : null}

      <WidgetInput
        sendMessage={sendMessage}
        disabled={!answering || busy}
        className="shrink-0"
      />
    </div>
  )
}
