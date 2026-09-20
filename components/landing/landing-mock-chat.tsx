"use client"

import { useEffect, useRef, useState } from "react"

import {
  CLINIC_PRESETS,
  CLINIC_WELCOME,
  matchClinicReply,
  type ClinicPreset,
} from "@/components/landing/mock-chat-script"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import AssistantMessageBubble from "@/components/widget/assistant-message-bubble"
import UserMessageBubble from "@/components/widget/user-message-bubble"
import WidgetInput from "@/components/widget/widget-input"

const TYPING_DELAY_MS = 700
const AUTOPLAY_START_DELAY_MS = 1400
const AUTOPLAY_GAP_MS = 1800
const AUTOPLAY_LOOP_DELAY_MS = 2400
const AUTOPLAY_RESUME_IDLE_MS = 8000

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  text: string
}

type TimeoutHandle = ReturnType<typeof setTimeout>

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    text: CLINIC_WELCOME,
  },
]

/** Cancels a stored timeout if one is pending. */
function clearStoredTimeout(ref: { current: TimeoutHandle | null }) {
  if (ref.current !== null) {
    clearTimeout(ref.current)
    ref.current = null
  }
}

/** Runs a callback after a delay and keeps the timeout handle on the ref. */
function scheduleTimeout(
  ref: { current: TimeoutHandle | null },
  delayMs: number,
  callback: () => void
) {
  clearStoredTimeout(ref)
  ref.current = setTimeout(() => {
    ref.current = null
    callback()
  }, delayMs)
}

/** Shows a short fake-typing indicator while the canned reply is delayed. */
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 rounded-lg p-2">
      <Avatar className="mt-1">
        <AvatarFallback>RC</AvatarFallback>
      </Avatar>
      <div className="rounded-lg bg-muted p-2">
        <p className="text-muted-foreground">Typing…</p>
      </div>
    </div>
  )
}

/** Scripted clinic-site preview chat with canned replies and no network calls. */
export function LandingMockChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [isTyping, setIsTyping] = useState(false)
  const isTypingRef = useRef(false)
  const pausedRef = useRef(false)
  const messageIdRef = useRef(1)
  const typingTimeoutRef = useRef<TimeoutHandle | null>(null)
  const autoplayTimeoutRef = useRef<TimeoutHandle | null>(null)
  const resumeTimeoutRef = useRef<TimeoutHandle | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  /** Appends a user bubble, then a delayed assistant reply. */
  function appendExchange(userText: string, reply: string) {
    isTypingRef.current = true
    setIsTyping(true)
    setMessages((prev) => [
      ...prev,
      {
        id: String(messageIdRef.current++),
        role: "user",
        text: userText,
      },
    ])

    scheduleTimeout(typingTimeoutRef, TYPING_DELAY_MS, () => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(messageIdRef.current++),
          role: "assistant",
          text: reply,
        },
      ])
      isTypingRef.current = false
      setIsTyping(false)
    })
  }

  /** Adds a scripted visitor question and its delayed canned clinic reply. */
  function playPresetExchange(preset: ClinicPreset) {
    appendExchange(preset.question, preset.reply)
  }

  /** Restarts the preview thread at the clinic welcome message. */
  function resetThread() {
    clearStoredTimeout(typingTimeoutRef)
    isTypingRef.current = false
    setIsTyping(false)
    messageIdRef.current = 1
    setMessages(INITIAL_MESSAGES)
  }

  /** Plays one scripted question, then queues the next turn or a loop reset. */
  function playAutoplayTurn(stepIndex: number) {
    if (pausedRef.current) return

    if (stepIndex >= CLINIC_PRESETS.length) {
      resetThread()
      scheduleTimeout(autoplayTimeoutRef, AUTOPLAY_START_DELAY_MS, () => {
        playAutoplayTurn(0)
      })
      return
    }

    playPresetExchange(CLINIC_PRESETS[stepIndex])
    const isLast = stepIndex === CLINIC_PRESETS.length - 1
    const nextDelay =
      TYPING_DELAY_MS + (isLast ? AUTOPLAY_LOOP_DELAY_MS : AUTOPLAY_GAP_MS)
    scheduleTimeout(autoplayTimeoutRef, nextDelay, () => {
      playAutoplayTurn(stepIndex + 1)
    })
  }

  /** Stops the scripted loop and restarts it after the visitor goes idle. */
  function pauseAutoplay() {
    pausedRef.current = true
    clearStoredTimeout(autoplayTimeoutRef)
    scheduleTimeout(resumeTimeoutRef, AUTOPLAY_RESUME_IDLE_MS, () => {
      pausedRef.current = false
      resetThread()
      scheduleTimeout(autoplayTimeoutRef, AUTOPLAY_START_DELAY_MS, () => {
        playAutoplayTurn(0)
      })
    })
  }

  /** Shows a visitor message, replies with a canned clinic answer, and pauses autoplay. */
  function handleUserQuestion(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isTypingRef.current) return
    pauseAutoplay()
    appendExchange(trimmed, matchClinicReply(trimmed))
  }

  useEffect(() => {
    scheduleTimeout(autoplayTimeoutRef, AUTOPLAY_START_DELAY_MS, () => {
      playAutoplayTurn(0)
    })

    return () => {
      clearStoredTimeout(autoplayTimeoutRef)
      clearStoredTimeout(resumeTimeoutRef)
      clearStoredTimeout(typingTimeoutRef)
    }
    // The sequencer is ref-driven and should start once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return
    container.scrollTop = container.scrollHeight
  }, [messages, isTyping])

  return (
    <div className="w-full max-w-md">
      <p className="mb-2 text-sm text-muted-foreground">Clinic site preview</p>
      <div
        className="flex h-[28rem] flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
        role="region"
        aria-label="Clinic site preview chatbot"
      >
        <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          <span>riversideclinic.com</span>
        </div>
        <div className="sticky top-0 z-10 border-b bg-card">
          <div className="flex items-center gap-2 px-2 py-4">
            <Avatar>
              <AvatarFallback>RC</AvatarFallback>
            </Avatar>
            <p className="font-medium text-card-foreground">Riverside Clinic</p>
          </div>
        </div>
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto bg-background px-2 py-4"
          aria-live="polite"
        >
          <p className="text-center text-sm text-muted-foreground">
            Today, 2:24pm
          </p>
          <div className="my-2">
            {messages.map((message) =>
              message.role === "user" ? (
                <UserMessageBubble key={message.id} message={message.text} />
              ) : (
                <AssistantMessageBubble
                  key={message.id}
                  message={message.text}
                />
              )
            )}
            {isTyping ? <TypingIndicator /> : null}
          </div>
        </div>
        <WidgetInput
          disabled={isTyping}
          sendMessage={({ text }) => handleUserQuestion(text)}
          className="shrink-0"
        />
      </div>
    </div>
  )
}
