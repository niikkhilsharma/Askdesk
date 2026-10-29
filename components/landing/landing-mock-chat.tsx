"use client"

import { useEffect, useRef, useState } from "react"

import { DEMO_SITE } from "@/components/landing/content"
import {
  CLINIC_PRESETS,
  CLINIC_WELCOME,
  matchClinicReply,
  type ClinicPreset,
} from "@/components/landing/mock-chat-script"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AssistantMessageBubble from "@/components/widget/assistant-message-bubble"
import UserMessageBubble from "@/components/widget/user-message-bubble"
import WidgetInput from "@/components/widget/widget-input"

const TYPING_DELAY_MS = 700
const AUTOPLAY_START_DELAY_MS = 1400
const AUTOPLAY_GAP_MS = 2200
const AUTOPLAY_LOOP_DELAY_MS = 2800
const AUTOPLAY_RESUME_IDLE_MS = 8000
const AUTOPLAY_ORDER = [2, 0, 1] as const

const PRESET_CITATIONS: Record<string, string> = {
  hours: "hours.pdf · p.1",
  walkins: "visits.pdf · p.1",
  insurance: "pricing.pdf · p.2",
}

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  text: string
  citation?: string
  revealed?: number
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

/** Returns true when the visitor asked the system to reduce motion. */
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** Shows a short indicator while the canned reply is delayed. */
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 rounded-lg p-2">
      <Avatar className="mt-1">
        <AvatarFallback>ND</AvatarFallback>
      </Avatar>
      <div className="rounded-lg bg-muted p-2">
        <p className="text-muted-foreground">Typing…</p>
      </div>
    </div>
  )
}

/** Scripted sample-site preview with citations, chips, and a handoff. */
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
  function appendExchange(userText: string, reply: string, citation?: string) {
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
      const reduce = prefersReducedMotion()
      setMessages((prev) => [
        ...prev,
        {
          id: String(messageIdRef.current++),
          role: "assistant",
          text: reply,
          citation,
          revealed: reduce ? reply.length : 0,
        },
      ])
      isTypingRef.current = false
      setIsTyping(false)
    })
  }

  /** Adds a scripted visitor question and its delayed canned reply. */
  function playPresetExchange(preset: ClinicPreset) {
    appendExchange(preset.question, preset.reply, PRESET_CITATIONS[preset.id])
  }

  /** Restarts the preview thread at the welcome message. */
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

    if (stepIndex >= AUTOPLAY_ORDER.length) {
      resetThread()
      scheduleTimeout(autoplayTimeoutRef, AUTOPLAY_START_DELAY_MS, () => {
        playAutoplayTurn(0)
      })
      return
    }

    playPresetExchange(CLINIC_PRESETS[AUTOPLAY_ORDER[stepIndex]])
    const isLast = stepIndex === AUTOPLAY_ORDER.length - 1
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
    clearStoredTimeout(resumeTimeoutRef)
    if (prefersReducedMotion()) return

    scheduleTimeout(resumeTimeoutRef, AUTOPLAY_RESUME_IDLE_MS, () => {
      pausedRef.current = false
      resetThread()
      scheduleTimeout(autoplayTimeoutRef, AUTOPLAY_START_DELAY_MS, () => {
        playAutoplayTurn(0)
      })
    })
  }

  /** Shows a visitor message, replies with a canned answer, and pauses autoplay. */
  function handleUserQuestion(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isTypingRef.current) return
    pauseAutoplay()
    const preset = CLINIC_PRESETS.find((item) => item.question === trimmed)
    appendExchange(
      trimmed,
      matchClinicReply(trimmed),
      preset ? PRESET_CITATIONS[preset.id] : undefined
    )
  }

  /** Hands the sample chat to a person and pauses the script. */
  function handleHandoff() {
    if (isTypingRef.current) return
    pauseAutoplay()
    appendExchange(
      "Can I talk to a person?",
      "I’ve passed this chat to the front desk, with the full conversation attached. Someone from the team will join here."
    )
  }

  useEffect(() => {
    if (prefersReducedMotion()) {
      const preset = CLINIC_PRESETS[2]
      const timeout = window.setTimeout(() => {
        setMessages([
          ...INITIAL_MESSAGES,
          { id: "sample-user", role: "user", text: preset.question },
          {
            id: "sample-assistant",
            role: "assistant",
            text: preset.reply,
            citation: PRESET_CITATIONS[preset.id],
          },
        ])
      }, 0)
      return () => window.clearTimeout(timeout)
    }

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
    const pending = messages.find(
      (message) =>
        message.role === "assistant" &&
        message.revealed !== undefined &&
        message.revealed < message.text.length
    )
    if (!pending) return

    const timeout = window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === pending.id
            ? {
                ...message,
                revealed: Math.min(
                  message.text.length,
                  (message.revealed ?? 0) + 3
                ),
              }
            : message
        )
      )
    }, 24)

    return () => window.clearTimeout(timeout)
  }, [messages])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return
    container.scrollTop = container.scrollHeight
  }, [messages, isTyping])

  return (
    <div className="w-full min-w-0">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b bg-muted/50 px-3 py-2">
          <span
            className="size-2 rounded-full bg-muted-foreground/30"
            aria-hidden
          />
          <span
            className="size-2 rounded-full bg-muted-foreground/30"
            aria-hidden
          />
          <span
            className="size-2 rounded-full bg-muted-foreground/30"
            aria-hidden
          />
          <span className="truncate text-xs text-muted-foreground">
            {DEMO_SITE.host}
          </span>
        </div>
        <div className="relative flex flex-col gap-4 bg-muted/30 p-3 sm:block sm:min-h-[34rem] sm:p-4">
          <div className="flex max-w-xs flex-col gap-2 sm:max-w-[46%]">
            <p className="font-heading text-lg font-semibold">
              {DEMO_SITE.name}
            </p>
            <p className="text-xs text-muted-foreground">{DEMO_SITE.note}</p>
            <p className="text-sm text-muted-foreground">
              Cleanings, new-patient visits, and hours — ask the chat.
            </p>
            <ul className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
              <li className="rounded-lg bg-background/80 px-3 py-2">
                Hours · Mon–Fri 8am–6pm
              </li>
              <li className="rounded-lg bg-background/80 px-3 py-2">
                New patients welcome
              </li>
              <li className="rounded-lg bg-background/80 px-3 py-2">
                Most major insurance
              </li>
            </ul>
          </div>
          <div
            className="flex h-[28rem] w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm sm:absolute sm:right-3 sm:bottom-3 sm:w-[min(22rem,58%)]"
            role="region"
            aria-label="Northside Dental sample site with AskDesk chat"
          >
            <div className="flex items-center gap-2 border-b bg-card px-3 py-3">
              <Avatar>
                <AvatarFallback>ND</AvatarFallback>
              </Avatar>
              <p className="font-medium text-card-foreground">
                {DEMO_SITE.name}
              </p>
            </div>
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto bg-background px-1 py-2"
              aria-live="polite"
            >
              {messages.map((message) => {
                const visible =
                  message.revealed === undefined
                    ? message.text
                    : message.text.slice(0, message.revealed)
                const showCitation =
                  message.citation &&
                  (message.revealed === undefined ||
                    message.revealed >= message.text.length)

                return message.role === "user" ? (
                  <UserMessageBubble key={message.id} message={visible} />
                ) : (
                  <div key={message.id}>
                    <AssistantMessageBubble message={visible} />
                    {showCitation ? (
                      <div className="ps-12">
                        <Badge variant="outline">{message.citation}</Badge>
                      </div>
                    ) : null}
                  </div>
                )
              })}
              {isTyping ? <TypingIndicator /> : null}
            </div>
            <div className="flex flex-wrap gap-2 border-t px-3 py-2">
              {CLINIC_PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleUserQuestion(preset.question)}
                >
                  {preset.question}
                </Button>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleHandoff}
              >
                Talk to a person
              </Button>
            </div>
            <WidgetInput
              disabled={isTyping}
              sendMessage={({ text }) => handleUserQuestion(text)}
              className="shrink-0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
