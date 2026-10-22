"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useRef, useState } from "react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import WidgetHeader from "@/components/widget/widget-header"
import { cn } from "@/lib/utils"

const WidgetConversation = dynamic(
  () =>
    import("@/components/widget/widget-conversation").then(
      (mod) => mod.WidgetConversation
    ),
  { ssr: false }
)

/** Returns the host page origin this frame posts to. */
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

/** Posts one message from this frame to the host page. */
function postToHost(message: { type: string }) {
  if (window.parent === window) return

  window.parent.postMessage(message, hostPageTargetOrigin())
}

/** Reports whether a host message is the opened ack. */
function isOpenedMessage(data: unknown) {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    data.type === "askdesk:opened"
  )
}

/** Shows the Launcher, and the Panel after the visitor opens it. */
export function WidgetShell({ botId }: { botId: string }) {
  const [presence, setPresence] = useState<"launcher" | "panel">("launcher")
  const [shown, setShown] = useState(false)
  const [panelAlive, setPanelAlive] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const shownRef = useRef(false)
  const reduceRef = useRef(false)
  const closingRef = useRef(false)
  const closeTimer = useRef(0)
  const enterFrame = useRef(0)
  const returnFocusRef = useRef(false)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    shownRef.current = shown
  }, [shown])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")

    /** Keeps the reduced-motion choice current for open and close. */
    function sync() {
      reduceRef.current = media.matches
      setReduceMotion(media.matches)
    }

    sync()
    media.addEventListener("change", sync)

    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    /** Opens the Panel once the host page has grown this frame. */
    function onMessage(event: MessageEvent) {
      if (event.source !== window.parent || window.parent === window) return

      const targetOrigin = hostPageTargetOrigin()

      if (targetOrigin !== "*" && event.origin !== targetOrigin) return
      if (!isOpenedMessage(event.data)) return
      if (shownRef.current) return

      closingRef.current = false
      window.clearTimeout(closeTimer.current)
      setPanelAlive(true)
      setPresence("panel")

      if (reduceRef.current) {
        setShown(true)
        return
      }

      setShown(false)
      cancelAnimationFrame(enterFrame.current)
      enterFrame.current = requestAnimationFrame(() => {
        enterFrame.current = requestAnimationFrame(() => setShown(true))
      })
    }

    window.addEventListener("message", onMessage)

    return () => {
      cancelAnimationFrame(enterFrame.current)
      window.removeEventListener("message", onMessage)
    }
  }, [])

  useEffect(() => {
    if (!shown) return

    closeRef.current?.focus()
  }, [shown])

  /** Shrinks the frame back to the Launcher once the Panel has left. */
  const finishClose = useCallback(() => {
    if (closingRef.current) return

    closingRef.current = true
    returnFocusRef.current = true
    setShown(false)
    setPresence("launcher")
    postToHost({ type: "askdesk:close" })
  }, [])

  /** Shrinks the Panel back into the Launcher. */
  const requestClose = useCallback(() => {
    if (presence !== "panel") return

    cancelAnimationFrame(enterFrame.current)

    if (reduceRef.current || !shownRef.current) {
      finishClose()
      return
    }

    setShown(false)
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      if (!shownRef.current) finishClose()
    }, 280)
  }, [finishClose, presence])

  useEffect(() => {
    if (presence !== "panel") return

    /** Closes the Panel from the keyboard. */
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return

      requestClose()
    }

    window.addEventListener("keydown", onKey)

    return () => window.removeEventListener("keydown", onKey)
  }, [presence, requestClose])

  useEffect(() => {
    if (presence !== "launcher" || !returnFocusRef.current) return

    returnFocusRef.current = false
    launcherRef.current?.focus()
  }, [presence])

  /** Asks the host page to grow this frame, then shows the Panel. */
  function requestOpen() {
    if (presence === "panel") {
      cancelAnimationFrame(enterFrame.current)
      window.clearTimeout(closeTimer.current)
      closingRef.current = false
      setShown(true)
      return
    }

    postToHost({ type: "askdesk:open" })
  }

  /** Hides the Panel once it has faded, before the shrink reaches nothing. */
  function onPanelTransitionEnd(event: React.TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return
    if (event.propertyName !== "opacity") return

    if (shownRef.current) return

    finishClose()
  }

  return (
    <div className="askdesk-widget fixed inset-0">
      {panelAlive ? (
        <div
          hidden={presence === "launcher"}
          role="dialog"
          aria-label="Askdesk"
          onTransitionEnd={onPanelTransitionEnd}
          className={cn(
            "absolute top-12 right-12 z-20 flex h-[600px] w-[400px] origin-bottom-right flex-col overflow-hidden rounded-[16px] bg-background text-foreground shadow-[0_8px_30px_rgba(0,0,0,0.18)]",
            "transition-[scale,opacity] duration-[250ms] ease-[var(--ease-out)] motion-reduce:transition-none",
            shown
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-[0.14] opacity-0",
            reduceMotion && "scale-100 opacity-100"
          )}
        >
          <WidgetHeader onClose={requestClose} closeRef={closeRef} />
          <WidgetConversation key={botId} botId={botId} />
        </div>
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        aria-label="Open chat"
        aria-expanded={presence === "panel"}
        aria-hidden={shown}
        tabIndex={shown ? -1 : 0}
        onClick={requestOpen}
        className={cn(
          "absolute z-10 flex size-14 touch-manipulation items-center justify-center rounded-full select-none",
          presence === "panel" ? "right-12 bottom-12" : "right-0 bottom-0",
          "[-webkit-tap-highlight-color:transparent]",
          "transition-[scale] duration-[250ms] ease-[var(--ease-out)]",
          "active:scale-[0.97] active:duration-[160ms]",
          "focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
          "motion-reduce:transition-none",
          shown ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      >
        <Avatar className="size-14 overflow-hidden bg-muted shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
          <AvatarImage
            src="/launcher.png"
            alt=""
            className="object-contain p-1.5"
          />
        </Avatar>
      </button>
    </div>
  )
}
